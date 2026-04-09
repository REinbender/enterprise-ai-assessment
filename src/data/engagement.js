// ── Engagement data layer ──────────────────────────────────────────────────
// Handles: engagement CRUD, session management, composite scoring,
//          JSON export/import, role group assignment

import { computeDimensionScores, computeOverallScore, dimensions } from './questions'

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

export function saveEngagement(eng) {
  localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(eng))
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
export function buildSession({ respondentName, respondentRole, answers, notes }) {
  const dimScoresArr = computeDimensionScores(answers)
  const overallScore = computeOverallScore(dimScoresArr)
  const dimScores = dimScoresArr.reduce((acc, d) => ({ ...acc, [d.id]: d.score }), {})
  return {
    sessionId: uid(),
    respondentName,
    respondentRole,
    roleGroup: assignRoleGroup(respondentRole),
    answers,
    notes,
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
    const allScores = sessions.map(s => s.dimScores[dim.id]).filter(n => n != null)
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

    const execAvg  = byGroup.executive?.avg
    const practAvg = byGroup.practitioner?.avg
    const gapMagnitude = execAvg != null && practAvg != null ? Math.abs(execAvg - practAvg) : 0
    const perceptionGap = gapMagnitude >= PERCEPTION_GAP_THRESHOLD
    const gapDirection  = perceptionGap
      ? (execAvg > practAvg ? 'exec_higher' : 'practitioner_higher')
      : null

    // Per-question averages across all sessions
    const qAvgs = dim.questions.map((_, qi) => {
      const scores = sessions.map(s => s.answers?.[dim.id]?.[qi]).filter(n => n != null)
      return scores.length
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null
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
      qAvgs,
      respondentCount: allScores.length,
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
    // Shape for existing generateRecommendations()
    asDimScores: dimComposites.map(d => ({
      id: d.dimId, name: d.name, shortName: d.shortName, color: d.color, score: d.avg,
    })),
  }
}
