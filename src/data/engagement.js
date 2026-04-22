// ── Engagement data layer ──────────────────────────────────────────────────
// Handles: engagement CRUD, session management, composite scoring,
//          JSON export/import, role group assignment

import { computeDimensionScores, computeOverallScore, computeDimensionMeta, dimensions, DK } from './questions'
import {
  PERCEPTION_GAP_THRESHOLD,
  LOW_VISIBILITY_THRESHOLD,
  STORAGE_QUOTA_BYTES,
  STORAGE_WARN_RATIO,
  STORAGE_CRITICAL_RATIO,
} from '../constants/thresholds'

const ENGAGEMENT_KEY    = 'ai_readiness_engagement_v1'
const SESSION_DRAFT_KEY = 'ai_readiness_session_draft_v1'

// Gap severity tiers — exposed as gapSeverity on each composite dimension
export function getGapSeverity(magnitude) {
  if (magnitude >= 40) return { level: 'critical',    label: 'Critical Misalignment',  color: '#DC2626', bg: '#FEE2E2' }
  if (magnitude >= 25) return { level: 'severe',      label: 'Severe Misalignment',    color: '#EA580C', bg: '#FFEDD5' }
  if (magnitude >= 15) return { level: 'concerning',  label: 'Concerning Variance',    color: '#D97706', bg: '#FEF3C7' }
  return null
}

// ── Role group assignment ──────────────────────────────────────────────────
// Executive keywords — C-suite, VP-and-above leadership.
const EXEC_KW = [
  'ceo', 'cto', 'cio', 'cdo', 'ciso', 'coo', 'cfo', 'cpo', 'cdao', 'cmo',
  'chief', 'president', 'founder', 'owner', 'partner', 'managing director',
  'managing partner', 'executive director',
]
// Management keywords — managers, leads, directors, senior ICs with direct reports.
// Keep these conservative — when in doubt, Practitioner is the safer default and
// the consultant can override in the UI. "manager" is intentionally included as a
// standalone word so titles like "Product Manager", "Engineering Manager",
// "Operations Manager", "Project Manager" categorize correctly.
const MGMT_KW = [
  'vp ', 'vp,', 'vice president', 'vice-president',
  'director', 'head of', 'head,',
  'principal', 'senior manager', 'sr. manager', 'sr manager',
  'manager', 'mgr ', 'mgr,',
  'supervisor', 'team lead', 'tech lead', 'engineering lead', 'group lead',
  'architect',
]

export function assignRoleGroup(role) {
  if (!role) return 'practitioner'
  const lower = role.toLowerCase()
  if (EXEC_KW.some(k => lower.includes(k)))  return 'executive'
  if (MGMT_KW.some(k => lower.includes(k)))  return 'management'
  return 'practitioner'
}

export const ROLE_GROUP_META = {
  executive:    { label: 'Executive',    color: '#7C3AED', bg: '#EDE9FE' },
  management:   { label: 'Management',   color: '#2563EB', bg: '#DBEAFE' },
  practitioner: { label: 'Practitioner', color: '#059669', bg: '#D1FAE5' },
}

// ── UUID ───────────────────────────────────────────────────────────────────
function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    // Two independent Math.random() calls make millisecond collisions astronomically unlikely
    : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`
}

// ── Engagement CRUD ────────────────────────────────────────────────────────
export function createEngagement(company) {
  return {
    engagementId: uid(),
    company,
    createdAt: new Date().toISOString(),
    sessions: [],
  }
}

export function loadEngagement() {
  try {
    const r = localStorage.getItem(ENGAGEMENT_KEY)
    return r ? JSON.parse(r) : null
  } catch { return null }
}

// ── localStorage quota guard ───────────────────────────────────────────────
// Returns usage ratio 0–1, or 0 if estimation not supported
function storageUsageRatio() {
  try {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      total += (localStorage.getItem(key)?.length || 0) * 2 // UTF-16 = 2 bytes/char
    }
    return total / STORAGE_QUOTA_BYTES
  } catch { return 0 }
}

export function saveEngagement(eng) {
  // Serialize first so we can distinguish serialization errors from storage errors.
  // A TypeError here (e.g. circular reference from a data migration bug) should
  // surface as a save failure, not crash the app.
  let json
  try {
    json = JSON.stringify(eng)
  } catch (e) {
    console.error('saveEngagement: serialization failed', e)
    window.dispatchEvent(new CustomEvent('ai_storage_save_failed', {
      detail: { reason: 'serialize', message: e?.message || 'Unknown serialization error' }
    }))
    return { ok: false, reason: 'serialize', error: e }
  }

  try {
    localStorage.setItem(ENGAGEMENT_KEY, json)

    // Warn when storage is >70% full — after successful save so data isn't lost
    const ratio = storageUsageRatio()
    if (ratio > STORAGE_WARN_RATIO) {
      const pct = Math.round(ratio * 100)
      // Use setTimeout so the warning appears after the current render cycle
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('ai_storage_warning', {
          detail: { pct, critical: ratio > STORAGE_CRITICAL_RATIO }
        }))
      }, 0)
    }
    return { ok: true }
  } catch (e) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      // Storage full — notify the app so it can show a blocking error modal
      window.dispatchEvent(new CustomEvent('ai_storage_full'))
      return { ok: false, reason: 'quota', error: e }
    }
    console.error('saveEngagement: unexpected storage error', e)
    window.dispatchEvent(new CustomEvent('ai_storage_save_failed', {
      detail: { reason: 'unknown', message: e?.message || 'Unknown storage error' }
    }))
    return { ok: false, reason: 'unknown', error: e }
  }
}

export function clearEngagement() {
  localStorage.removeItem(ENGAGEMENT_KEY)
  clearSessionDraft()
}

// ── Session draft (in-progress interview) ─────────────────────────────────
export function saveSessionDraft(draft) {
  localStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(draft))
}

export function loadSessionDraft() {
  try {
    const r = localStorage.getItem(SESSION_DRAFT_KEY)
    return r ? JSON.parse(r) : null
  } catch { return null }
}

export function clearSessionDraft() {
  localStorage.removeItem(SESSION_DRAFT_KEY)
}

// ── Build a completed session from interview data ──────────────────────────
export function buildSession({ respondentName, respondentRole, roleGroupOverride, answers, notes, confidence = {} }) {
  // Guard: answers must be a non-null object. An absent or empty answers object
  // would produce all-null dimScores silently — surface it as an error instead.
  if (!answers || typeof answers !== 'object') {
    throw new Error('buildSession: answers must be a non-null object')
  }
  // Warn (not throw) if a dimension is entirely missing — could indicate a
  // mid-interview interruption. computeDimensionScores will treat it as all-DK.
  dimensions.forEach(d => {
    if (!answers[d.id] || typeof answers[d.id] !== 'object') {
      console.warn(`buildSession: answers for dimension ${d.id} (${d.shortName}) is missing or not an object — treated as all Don't Know`)
    }
  })

  const dimScoresArr = computeDimensionScores(answers)
  const overallScore = computeOverallScore(dimScoresArr)
  const dimScores    = dimScoresArr.reduce((acc, d) => ({ ...acc, [d.id]: d.score }), {})

  // Per-dimension visibility metadata (answered count, DK count)
  const dimMeta = dimensions.reduce((acc, d) => ({
    ...acc,
    [d.id]: computeDimensionMeta(answers[d.id], d.questions.length),
  }), {})

  return {
    sessionId: uid(),
    respondentName,
    respondentRole,
    roleGroup: roleGroupOverride ?? assignRoleGroup(respondentRole),
    answers,
    notes,
    confidence,   // { [dimId]: 'high' | 'medium' | 'low' | null }
    dimMeta,      // { [dimId]: { score, answered, dkCount, total } }
    completedAt: new Date().toISOString(),
    dimScores,
    overallScore,
  }
}

export const addSession    = (eng, s)   => ({ ...eng, sessions: [...eng.sessions, s] })
export const removeSession = (eng, id)  => ({ ...eng, sessions: eng.sessions.filter(s => s.sessionId !== id) })

// ── Schema version ─────────────────────────────────────────────────────────
// Bump SCHEMA_VERSION whenever session/engagement shape changes.
// Migration functions below handle reading older versions.
export const SCHEMA_VERSION = 2

// ── JSON Export ────────────────────────────────────────────────────────────
function slug(s) {
  return s?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown'
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

export function exportSession(eng, session) {
  const payload = {
    type: 'ai_readiness_session',
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    engagementId: eng.engagementId,
    company: eng.company,
    ...session,
  }
  const date = new Date(session.completedAt).toISOString().slice(0, 10)
  triggerDownload(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    `${slug(eng.company.name)}_${slug(session.respondentName)}_${slug(session.respondentRole)}_${date}.json`
  )
}

export function exportEngagement(eng) {
  const payload = {
    type: 'ai_readiness_engagement',
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    ...eng,
  }
  const date = new Date().toISOString().slice(0, 10)
  triggerDownload(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    `${slug(eng.company.name)}_full-engagement_${date}.json`
  )
}

// ── Schema migration ────────────────────────────────────────────────────────
// Each function takes a session object and returns it migrated to the next version.
const SESSION_MIGRATIONS = {
  // v1 → v2: added roleGroupOverride support; dimScores may have null values
  1: (s) => ({
    ...s,
    dimScores: s.dimScores
      ? Object.fromEntries(
          Object.entries(s.dimScores).map(([k, v]) => [k, typeof v === 'number' ? v : null])
        )
      : {},
    confidence: s.confidence || {},
    notes: s.notes || {},
    version: 2,
  }),
}

function migrateSession(s) {
  let session = { ...s }
  const fileVersion = typeof session.version === 'number' ? session.version : 1
  let v = fileVersion
  while (v < SCHEMA_VERSION) {
    if (SESSION_MIGRATIONS[v]) session = SESSION_MIGRATIONS[v](session)
    v++
  }
  return session
}

// ── Import validation ───────────────────────────────────────────────────────
const VALID_ROLE_GROUPS = new Set(['executive', 'management', 'practitioner'])
const VALID_DIM_IDS     = new Set([1, 2, 3, 4, 5])
const VALID_CONF_VALS   = new Set(['high', 'medium', 'low', null, undefined])

function validateSession(data, filename) {
  const errors = []

  if (!data.sessionId)      errors.push('missing sessionId')
  if (!data.respondentName?.trim()) errors.push('missing respondentName')
  if (!data.respondentRole?.trim()) errors.push('missing respondentRole')
  if (!VALID_ROLE_GROUPS.has(data.roleGroup)) errors.push(`invalid roleGroup "${data.roleGroup}" (must be executive/management/practitioner)`)
  if (!data.answers || typeof data.answers !== 'object') errors.push('missing or invalid answers')
  if (!data.dimScores || typeof data.dimScores !== 'object') errors.push('missing dimScores')
  if (!data.completedAt) errors.push('missing completedAt')
  else if (isNaN(Date.parse(data.completedAt))) errors.push('completedAt is not a valid date')

  // Validate dimScores range
  if (data.dimScores) {
    Object.entries(data.dimScores).forEach(([k, v]) => {
      if (!VALID_DIM_IDS.has(Number(k))) errors.push(`unknown dimension id ${k} in dimScores`)
      if (v !== null && (typeof v !== 'number' || !isFinite(v) || v < 0 || v > 100))
        errors.push(`dimScores[${k}] = ${v} is invalid (must be a finite number 0–100 or null)`)
    })
  }

  // Validate confidence values
  if (data.confidence) {
    Object.entries(data.confidence).forEach(([k, v]) => {
      if (!VALID_CONF_VALS.has(v)) errors.push(`confidence[${k}] = "${v}" is invalid`)
    })
  }

  // Validate answers: dimension ids, question indices in range, values (1–5 or DK)
  if (data.answers && typeof data.answers === 'object') {
    Object.entries(data.answers).forEach(([dimKey, qMap]) => {
      const dimId = Number(dimKey)
      if (!VALID_DIM_IDS.has(dimId)) {
        errors.push(`unknown dimension id ${dimKey} in answers`)
        return
      }
      if (!qMap || typeof qMap !== 'object') {
        errors.push(`answers[${dimKey}] must be an object`)
        return
      }
      const dim = dimensions.find(d => d.id === dimId)
      const nQ  = dim?.questions.length ?? 0
      Object.entries(qMap).forEach(([qKey, v]) => {
        const qIdx = Number(qKey)
        if (!Number.isInteger(qIdx) || qIdx < 0 || qIdx >= nQ) {
          errors.push(`answers[${dimKey}][${qKey}] — question index out of range (0–${nQ - 1})`)
        }
        const isValidScore = typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5
        const isDK         = v === DK
        if (!isValidScore && !isDK) {
          errors.push(`answers[${dimKey}][${qKey}] = ${JSON.stringify(v)} — must be an integer 1–5 or "${DK}"`)
        }
      })
    })
  }

  if (errors.length) {
    return { ok: false, error: `${filename}: ${errors.join('; ')}` }
  }
  return { ok: true }
}

// ── JSON Import ────────────────────────────────────────────────────────────
export function parseImportedFiles(files) {
  return Promise.all(
    Array.from(files).map(file =>
      new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => {
          try {
            const data = JSON.parse(e.target.result)

            if (data.type === 'ai_readiness_session') {
              const migrated = migrateSession(data)
              const check    = validateSession(migrated, file.name)
              if (!check.ok) return resolve({ ok: false, error: check.error })
              resolve({ ok: true, sessions: [migrated], filename: file.name })

            } else if (data.type === 'ai_readiness_engagement' && Array.isArray(data.sessions)) {
              const results  = []
              const errors   = []
              data.sessions.forEach((s, i) => {
                const migrated = migrateSession(s)
                const check    = validateSession(migrated, `${file.name} session[${i}]`)
                if (check.ok) results.push(migrated)
                else errors.push(check.error)
              })
              if (!results.length) {
                return resolve({ ok: false, error: `${file.name}: No valid sessions found. ${errors[0] || ''}` })
              }
              resolve({ ok: true, sessions: results, filename: file.name, warnings: errors })

            } else {
              resolve({
                ok: false,
                error: `${file.name}: Unrecognized file type "${data.type || '(none)'}". Expected ai_readiness_session or ai_readiness_engagement.`,
              })
            }
          } catch {
            resolve({ ok: false, error: `${file.name}: Could not parse JSON — file may be corrupted or not a JSON file` })
          }
        }
        reader.onerror = () => {
          const err = reader.error
          resolve({
            ok: false,
            error: `${file.name}: Could not read file${err?.name ? ` (${err.name})` : ''}. The file may be inaccessible or locked by another process.`,
          })
        }
        reader.onabort = () => {
          resolve({ ok: false, error: `${file.name}: File read was aborted.` })
        }
        reader.readAsText(file)
      })
    )
  )
}

// ── Composite scoring ──────────────────────────────────────────────────────
export function computeComposite(sessions) {
  if (!sessions?.length) return null

  const roleCounts = { executive: 0, management: 0, practitioner: 0 }
  sessions.forEach(s => { roleCounts[s.roleGroup] = (roleCounts[s.roleGroup] || 0) + 1 })

  // Cache role-group session lists once — avoids re-filtering for every dimension (Fix H)
  const sessionsByGroup = {
    executive:    sessions.filter(s => s.roleGroup === 'executive'),
    management:   sessions.filter(s => s.roleGroup === 'management'),
    practitioner: sessions.filter(s => s.roleGroup === 'practitioner'),
  }

  const dimComposites = dimensions.map(dim => {
    // Filter out null scores (all-DK sessions contribute no data to this dimension)
    const allScores = sessions.map(s => s.dimScores[dim.id]).filter(n => n != null && typeof n === 'number')
    // Always include the dimension even if no numeric scores — avg will be null
    const hasScores = allScores.length > 0
    const avg    = hasScores ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null
    // stdDev is only meaningful with 2+ scores — null with a single respondent
    const variance = allScores.length >= 2 ? allScores.reduce((acc, s) => acc + (s - avg) ** 2, 0) / allScores.length : null
    const stdDev   = variance !== null ? Math.round(Math.sqrt(variance)) : null

    const byGroup = {}
    ;['executive', 'management', 'practitioner'].forEach(g => {
      const gs = sessionsByGroup[g]  // use cached list (Fix H)
      if (gs.length) {
        const sc = gs.map(s => s.dimScores[dim.id]).filter(n => n != null && typeof n === 'number')
        byGroup[g] = {
          avg: sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : null,
          count: gs.length,
        }
      }
    })

    // Check all three pairwise gaps so management↔practitioner gaps aren't missed
    const pairs = [
      { a: 'executive',    b: 'practitioner', label: 'exec_vs_pract'  },
      { a: 'executive',    b: 'management',   label: 'exec_vs_mgmt'   },
      { a: 'management',   b: 'practitioner', label: 'mgmt_vs_pract'  },
    ]
    let gapMagnitude = 0
    let gapDirection = null
    let gapPair      = null
    pairs.forEach(({ a, b, label }) => {
      const aAvg = byGroup[a]?.avg
      const bAvg = byGroup[b]?.avg
      if (aAvg == null || bAvg == null) return
      const mag = Math.abs(aAvg - bAvg)
      if (mag > gapMagnitude) {
        gapMagnitude = mag
        gapPair      = label
        gapDirection = aAvg > bAvg ? `${a}_higher` : `${b}_higher`
      }
    })
    const perceptionGap = gapMagnitude >= PERCEPTION_GAP_THRESHOLD
    const gapSeverity   = perceptionGap ? getGapSeverity(gapMagnitude) : null
    if (!perceptionGap) { gapDirection = null; gapPair = null }

    // Per-question averages + DK rates across all sessions
    const qAvgs = dim.questions.map((_, qi) => {
      const vals   = sessions.map(s => s.answers?.[dim.id]?.[qi]).filter(v => v != null)
      const nums   = vals.filter(v => typeof v === 'number')
      const dkRate = vals.length ? Math.round((vals.filter(v => v === DK).length / vals.length) * 100) : 0
      return {
        avg:    nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : null,
        dkRate, // % of respondents who said don't know
        scored: nums.length,
        total:  vals.length,
      }
    })

    // Dimension-level DK and visibility
    const totalDkAcrossSessions = sessions.reduce((acc, s) => {
      const dimAnswers = s.answers?.[dim.id] || {}
      return acc + Object.values(dimAnswers).filter(v => v === DK).length
    }, 0)
    const totalPossibleAnswers = sessions.length * dim.questions.length
    const dkRate = totalPossibleAnswers
      ? Math.round((totalDkAcrossSessions / totalPossibleAnswers) * 100)
      : 0
    const lowVisibility = dkRate >= LOW_VISIBILITY_THRESHOLD

    // Confidence distribution across sessions
    const confidenceCounts = { high: 0, medium: 0, low: 0, null: 0 }
    sessions.forEach(s => {
      const c = s.confidence?.[dim.id] || null
      confidenceCounts[c ?? 'null'] = (confidenceCounts[c ?? 'null'] || 0) + 1
    })

    // Fix B — distinguish "all DK / no visibility" from "all low scores":
    //   allDK:       every respondent said Don't Know — no numeric data at all
    //   lowVisibility: high DK rate (≥30%) but may still have some numeric scores
    //   allAnsweredLow: all numeric scores are ≤25 (effectively all 1s on 1–5 scale)
    //                   → a capability problem, not a visibility problem
    const allDK = !hasScores && sessions.length > 0
    const allAnsweredLow = hasScores && allScores.every(s => s <= 25)

    return {
      dimId: dim.id,
      name: dim.name,
      shortName: dim.shortName,
      color: dim.color,
      bgColor: dim.bgColor,
      avg,
      // stdDev is null when fewer than 2 respondents scored this dimension —
      // render as "n=1" rather than "±0" to avoid implying false precision
      stdDev,
      min: hasScores ? Math.min(...allScores) : null,
      max: hasScores ? Math.max(...allScores) : null,
      byGroup,
      // roleGroupsCovered: number of distinct role groups that have at least one
      // numeric score in this dimension. Gap analysis requires >= 2.
      roleGroupsCovered: Object.keys(byGroup).filter(g => byGroup[g]?.avg != null).length,
      perceptionGap,
      gapDirection,
      gapMagnitude,
      gapSeverity,      // { level, label, color, bg } — null if no gap
      gapPair,          // which pair has the largest gap e.g. 'exec_vs_pract'
      qAvgs,
      // Fix C — scoredByCount: how many respondents contributed a numeric score.
      // Distinct from respondentCount (total sessions). Use to distinguish avg=0
      // (one person scored 1 on everything) from avg=null (no data at all).
      scoredByCount: allScores.length,
      respondentCount: allScores.length,  // kept for backward compat
      dkRate,
      lowVisibility,    // high DK rate (may still have some scores)
      allDK,            // zero numeric scores — no data at all for this dimension
      allAnsweredLow,   // all scores ≤25 — everyone who answered rated it very low
      confidenceCounts,
    }
  })

  // Only include dims with scores in the overall average calculation
  const scoredDims = dimComposites.filter(d => d.avg !== null)
  const overallAvg = scoredDims.length
    ? Math.round(scoredDims.reduce((acc, d) => acc + d.avg, 0) / scoredDims.length)
    : 0

  // How many distinct role groups participated across the whole engagement
  const engagementRoleGroupCount = Object.values(roleCounts).filter(n => n > 0).length

  return {
    dimensions: dimComposites,
    overallAvg,
    sessionCount: sessions.length,
    roleCounts,
    // True when only one role group participated — perception gap analysis is
    // not meaningful and a UI callout should explain this to the consultant.
    singleRoleGroup: engagementRoleGroupCount < 2,
    perceptionGapDimensions: dimComposites.filter(d => d.perceptionGap),
    lowVisibilityDimensions: dimComposites.filter(d => d.lowVisibility),
    // Shape for existing generateRecommendations() — only scored dims
    asDimScores: dimComposites.filter(d => d.avg !== null).map(d => ({
      id: d.dimId, name: d.name, shortName: d.shortName, color: d.color, score: d.avg,
    })),
  }
}
