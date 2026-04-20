// ── Engagement data layer ──────────────────────────────────────────────────
// Handles: engagement CRUD, session management, composite scoring,
//          JSON export/import, role group assignment

import { computeDimensionScores, computeOverallScore, computeDimensionMeta, dimensions, DK } from './questions'

const ENGAGEMENT_KEY    = 'ai_readiness_engagement_v1'
const SESSION_DRAFT_KEY = 'ai_readiness_session_draft_v1'
const PERCEPTION_GAP_THRESHOLD = 20

// ── Role group assignment ──────────────────────────────────────────────────
const EXEC_KW = [
  'ceo', 'cto', 'cio', 'cdo', 'ciso', 'coo', 'cfo', 'cpo', 'cdao', 'cmo',
  'chief', 'president', 'founder', 'owner', 'partner', 'managing director',
  'managing partner', 'executive director',
]
const MGMT_KW = [
  'vp ', 'vp,', 'vice president', 'vice-president',
  'director', 'head of', 'head,',
  'principal', 'senior manager', 'sr. manager', 'sr manager',
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
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
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
    // Browsers typically allow 5MB = 5_242_880 bytes
    return total / 5_242_880
  } catch { return 0 }
}

export function saveEngagement(eng) {
  try {
    const json = JSON.stringify(eng)
    localStorage.setItem(ENGAGEMENT_KEY, json)

    // Warn when storage is >70% full — after successful save so data isn't lost
    const ratio = storageUsageRatio()
    if (ratio > 0.7) {
      const pct = Math.round(ratio * 100)
      // Use setTimeout so the warning appears after the current render cycle
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('ai_storage_warning', {
          detail: { pct, critical: ratio > 0.9 }
        }))
      }, 0)
    }
  } catch (e) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      // Storage full — notify the app so it can show a blocking error modal
      window.dispatchEvent(new CustomEvent('ai_storage_full'))
    } else {
      throw e
    }
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
export function buildSession({ respondentName, respondentRole, answers, notes, confidence = {} }) {
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
    roleGroup: assignRoleGroup(respondentRole),
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
    version: '1',
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
  const payload = { type: 'ai_readiness_engagement', version: '1', ...eng }
  const date = new Date().toISOString().slice(0, 10)
  triggerDownload(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    `${slug(eng.company.name)}_full-engagement_${date}.json`
  )
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
            if (data.type === 'ai_readiness_session' && data.answers && data.dimScores) {
              resolve({ ok: true, sessions: [data], filename: file.name })
            } else if (data.type === 'ai_readiness_engagement' && Array.isArray(data.sessions)) {
              // Full engagement export — extract all sessions
              resolve({ ok: true, sessions: data.sessions, filename: file.name })
            } else {
              resolve({ ok: false, error: `${file.name}: Not a valid session or engagement file` })
            }
          } catch {
            resolve({ ok: false, error: `${file.name}: Could not parse JSON` })
          }
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

  const dimComposites = dimensions.map(dim => {
    // Filter out null scores (all-DK sessions contribute no data to this dimension)
    const allScores = sessions.map(s => s.dimScores[dim.id]).filter(n => n != null && typeof n === 'number')
    if (!allScores.length) return null

    const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    const variance = allScores.reduce((acc, s) => acc + (s - avg) ** 2, 0) / allScores.length
    const stdDev = Math.round(Math.sqrt(variance))

    const byGroup = {}
    ;['executive', 'management', 'practitioner'].forEach(g => {
      const gs = sessions.filter(s => s.roleGroup === g)
      if (gs.length) {
        const sc = gs.map(s => s.dimScores[dim.id])
        byGroup[g] = {
          avg: Math.round(sc.reduce((a, b) => a + b, 0) / sc.length),
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
    const lowVisibility = dkRate >= 30 // flag if 30%+ of answers are DK across respondents

    // Confidence distribution across sessions
    const confidenceCounts = { high: 0, medium: 0, low: 0, null: 0 }
    sessions.forEach(s => {
      const c = s.confidence?.[dim.id] || null
      confidenceCounts[c ?? 'null'] = (confidenceCounts[c ?? 'null'] || 0) + 1
    })

    return {
      dimId: dim.id,
      name: dim.name,
      shortName: dim.shortName,
      color: dim.color,
      bgColor: dim.bgColor,
      avg,
      stdDev,
      min: Math.min(...allScores),
      max: Math.max(...allScores),
      byGroup,
      perceptionGap,
      gapDirection,
      gapMagnitude,
      gapPair,          // which pair has the largest gap e.g. 'exec_vs_pract'
      qAvgs,
      respondentCount: allScores.length,
      dkRate,
      lowVisibility,
      confidenceCounts,
    }
  }).filter(Boolean)

  const overallAvg = Math.round(
    dimComposites.reduce((acc, d) => acc + d.avg, 0) / dimComposites.length
  )

  return {
    dimensions: dimComposites,
    overallAvg,
    sessionCount: sessions.length,
    roleCounts,
    perceptionGapDimensions: dimComposites.filter(d => d.perceptionGap),
    lowVisibilityDimensions: dimComposites.filter(d => d.lowVisibility),
    // Shape for existing generateRecommendations()
    asDimScores: dimComposites.map(d => ({
      id: d.dimId, name: d.name, shortName: d.shortName, color: d.color, score: d.avg,
    })),
  }
}
