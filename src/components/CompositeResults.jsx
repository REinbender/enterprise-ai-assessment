import { useRef } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { getMaturityLevel, dimensions } from '../data/questions'
import { generateRecommendations } from '../data/recommendations'
import { computeComposite, ROLE_GROUP_META, exportEngagement } from '../data/engagement'
import CompositePDFExportButton from './CompositePDFExport'

const dimIcons = { 1: '🎯', 2: '🗄️', 3: '⚖️', 4: '👥', 5: '⚙️' }

// ── Score colour helper (for question heatmap cells) ──────────────────────
function qColor(avg) {
  if (avg === null) return { bg: '#F1F5F9', text: '#94A3B8' }
  if (avg >= 4)   return { bg: '#D1FAE5', text: '#065F46' }
  if (avg >= 3)   return { bg: '#FEF9C3', text: '#713F12' }
  return { bg: '#FEE2E2', text: '#991B1B' }
}

// ── Low visibility callout ─────────────────────────────────────────────────
function LowVisibilityCallout({ dims }) {
  if (!dims.length) return null
  return (
    <div className="low-visibility-section">
      <div className="low-visibility-header">
        <span className="low-visibility-icon">👁</span>
        <div>
          <div className="low-visibility-title">Low Organizational Visibility</div>
          <div className="low-visibility-sub">
            These dimensions had a high rate of "Don't Know" responses across respondents.
            Low visibility may indicate the org lacks awareness of its own capabilities in
            these areas — which is itself a maturity finding, independent of the score.
          </div>
        </div>
      </div>
      <div className="low-visibility-dims">
        {dims.map(d => (
          <div key={d.dimId} className="low-visibility-dim-chip" style={{ borderColor: d.color }}>
            <span style={{ color: d.color }}>{dimIcons[d.dimId]}</span>
            <span style={{ fontWeight: 600, color: d.color }}>{d.shortName}</span>
            <span className="low-visibility-pct">{d.dkRate}% don't know</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Role group score bar ───────────────────────────────────────────────────
function GroupBar({ group, data, baseline }) {
  if (!data) return null
  const m = ROLE_GROUP_META[group]
  const pct = (data.avg / 100) * 100
  return (
    <div className="group-bar-row">
      <div className="group-bar-label" style={{ color: m.color }}>{m.label}</div>
      <div className="group-bar-track">
        <div className="group-bar-fill" style={{ width: `${pct}%`, background: m.color }} />
        {baseline != null && (
          <div
            className="group-bar-baseline"
            style={{ left: `${baseline}%` }}
            title={`Composite avg: ${baseline}`}
          />
        )}
      </div>
      <div className="group-bar-score" style={{ color: m.color }}>{data.avg}</div>
      <div className="group-bar-count">n={data.count}</div>
    </div>
  )
}

// ── Perception gap callout ─────────────────────────────────────────────────
function PerceptionGapCallout({ gaps }) {
  if (!gaps.length) return null
  return (
    <div className="perception-gap-section">
      <div className="perception-gap-header">
        <span className="perception-gap-icon">⚠</span>
        <div>
          <div className="perception-gap-title">Perception Gap Detected</div>
          <div className="perception-gap-sub">
            These dimensions show a 20+ point gap between Executive and Practitioner ratings —
            a finding in itself. It indicates leadership and frontline teams have meaningfully
            different views of AI maturity in this area.
          </div>
        </div>
      </div>
      {gaps.map(d => (
        <div key={d.dimId} className="perception-gap-item">
          <div className="perception-gap-dim">
            <span>{dimIcons[d.dimId]}</span>
            <span style={{ color: d.color, fontWeight: 600 }}>{d.name}</span>
            <span className="perception-gap-magnitude">{d.gapMagnitude} pt gap</span>
          </div>
          <div className="perception-gap-bars">
            <div className="perception-gap-bar-row">
              <span style={{ color: ROLE_GROUP_META.executive.color, fontSize: 12, width: 88 }}>Executive</span>
              <div className="pgap-bar-track">
                <div className="pgap-bar-fill" style={{
                  width: `${d.byGroup.executive?.avg ?? 0}%`,
                  background: ROLE_GROUP_META.executive.color,
                }} />
              </div>
              <span style={{ color: ROLE_GROUP_META.executive.color, fontSize: 13, fontWeight: 700, minWidth: 28 }}>
                {d.byGroup.executive?.avg ?? '—'}
              </span>
            </div>
            <div className="perception-gap-bar-row">
              <span style={{ color: ROLE_GROUP_META.practitioner.color, fontSize: 12, width: 88 }}>Practitioner</span>
              <div className="pgap-bar-track">
                <div className="pgap-bar-fill" style={{
                  width: `${d.byGroup.practitioner?.avg ?? 0}%`,
                  background: ROLE_GROUP_META.practitioner.color,
                }} />
              </div>
              <span style={{ color: ROLE_GROUP_META.practitioner.color, fontSize: 13, fontWeight: 700, minWidth: 28 }}>
                {d.byGroup.practitioner?.avg ?? '—'}
              </span>
            </div>
          </div>
          <div className="perception-gap-insight">
            {d.gapDirection === 'exec_higher'
              ? `Leadership rates this dimension ${d.gapMagnitude} points higher than practitioners. This may indicate an optimism gap — leadership believes AI capabilities are stronger than those doing the work experience them to be.`
              : `Practitioners rate this dimension ${d.gapMagnitude} points higher than leadership. This may indicate undervalued grassroots capabilities or a communication gap around existing strengths.`}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Per-question heatmap ───────────────────────────────────────────────────
function QuestionHeatmap({ composite }) {
  return (
    <div className="heatmap-section card">
      <div className="chart-title">Question-Level Heatmap</div>
      <div className="chart-subtitle">
        Average score per question across all {composite.sessionCount} respondents (1–5 scale).
        Red = gap area · Yellow = developing · Green = strength · Grey % = "don't know" rate.
      </div>
      {composite.dimensions.map(dim => (
        <div key={dim.dimId} className="heatmap-dim-block">
          <div className="heatmap-dim-label" style={{ color: dim.color }}>
            {dimIcons[dim.dimId]} {dim.name}
            {dim.dkRate > 0 && (
              <span className="heatmap-dk-rate">{dim.dkRate}% DK overall</span>
            )}
          </div>
          <div className="heatmap-questions">
            {dimensions.find(d => d.id === dim.dimId)?.questions.map((q, qi) => {
              const qData = dim.qAvgs[qi]
              // Support both old format (number) and new format (object)
              const avg    = typeof qData === 'object' ? qData.avg    : qData
              const dkRate = typeof qData === 'object' ? qData.dkRate : 0
              const { bg, text } = qColor(avg)
              return (
                <div key={qi} className="heatmap-q-row">
                  <div className="heatmap-q-num" style={{ color: dim.color }}>Q{qi + 1}</div>
                  <div className="heatmap-q-text">{q.text}</div>
                  {dkRate >= 30 && (
                    <div className="heatmap-q-dk" title={`${dkRate}% of respondents said Don't Know`}>
                      {dkRate}% DK
                    </div>
                  )}
                  <div className="heatmap-q-score" style={{ background: bg, color: text }}>
                    {avg !== null ? avg.toFixed(1) : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Confidence distribution per dimension ────────────────────────────────
const CONF_META = {
  high:   { label: 'High',   color: '#059669', bg: '#D1FAE5' },
  medium: { label: 'Medium', color: '#D97706', bg: '#FEF3C7' },
  low:    { label: 'Low',    color: '#E74C3C', bg: '#FEE2E2' },
  null:   { label: 'Not set', color: '#94A3B8', bg: '#F1F5F9' },
}

function ConfidenceDistribution({ composite }) {
  const hasSomeConf = composite.dimensions.some(d =>
    (d.confidenceCounts.high + d.confidenceCounts.medium + d.confidenceCounts.low) > 0
  )
  if (!hasSomeConf) return null

  return (
    <div className="card" style={{ marginBottom: 24, padding: 24 }}>
      <div className="chart-title">Consultant Confidence Distribution</div>
      <div className="chart-subtitle">
        How confident consultants were in each dimension's scores across all sessions.
        Low confidence flags dimensions that benefit from transcript validation.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {composite.dimensions.map(d => {
          const total = composite.sessionCount
          const counts = d.confidenceCounts
          return (
            <div key={d.dimId} className="conf-dist-row">
              <div className="conf-dist-label" style={{ color: d.color }}>
                {dimIcons[d.dimId]} {d.shortName}
              </div>
              <div className="conf-dist-bar">
                {['high', 'medium', 'low', 'null'].map(level => {
                  const n = counts[level] || 0
                  if (!n) return null
                  const pct = Math.round((n / total) * 100)
                  const m = CONF_META[level]
                  return (
                    <div
                      key={level}
                      className="conf-dist-segment"
                      style={{ width: `${pct}%`, background: m.color, opacity: level === 'null' ? 0.3 : 1 }}
                      title={`${m.label}: ${n} session${n !== 1 ? 's' : ''} (${pct}%)`}
                    />
                  )
                })}
              </div>
              <div className="conf-dist-chips">
                {['high', 'medium', 'low'].map(level => {
                  const n = counts[level] || 0
                  if (!n) return null
                  const m = CONF_META[level]
                  return (
                    <span key={level} className="conf-dist-chip" style={{ background: m.bg, color: m.color }}>
                      {m.label}: {n}
                    </span>
                  )
                })}
                {(counts.null || 0) > 0 && (
                  <span className="conf-dist-chip" style={{ background: '#F1F5F9', color: '#94A3B8' }}>
                    Not set: {counts.null}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Respondent notes across all sessions ──────────────────────────────────
function RespondentNotes({ sessions }) {
  const sessionsWithNotes = sessions.filter(s =>
    s.notes && Object.values(s.notes).some(n => n?.trim())
  )
  if (!sessionsWithNotes.length) return null

  return (
    <div className="card" style={{ marginBottom: 24, padding: 24 }}>
      <div className="chart-title">Consultant Observations</div>
      <div className="chart-subtitle">
        Notes captured during each interview, organized by respondent.
        These support transcript validation and qualitative interpretation.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
        {sessionsWithNotes.map(s => {
          const m = ROLE_GROUP_META[s.roleGroup]
          const dimNotes = Object.entries(s.notes || {}).filter(([, n]) => n?.trim())
          return (
            <div key={s.sessionId} className="composite-notes-respondent">
              <div className="composite-notes-respondent-header">
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.respondentName}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.respondentRole}</span>
                <span style={{ padding: '1px 8px', borderRadius: 4, background: m.bg, color: m.color, fontSize: 11, fontWeight: 600 }}>
                  {m.label}
                </span>
              </div>
              {dimNotes.map(([dimId, note]) => {
                const dim = dimensions.find(d => d.id === parseInt(dimId))
                return (
                  <div key={dimId} className="composite-notes-dim-row">
                    <div className="composite-notes-dim-label" style={{ color: dim?.color }}>
                      {dimIcons[parseInt(dimId)]} {dim?.shortName}
                    </div>
                    <p className="composite-notes-text">{note}</p>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Composite scorecard ────────────────────────────────────────────────────
function CompositeScorecard({ composite }) {
  return (
    <div className="card" style={{ marginBottom: 24, overflowX: 'auto' }}>
      <div className="chart-title" style={{ padding: '20px 24px 0' }}>Composite Scorecard</div>
      <div className="chart-subtitle" style={{ padding: '4px 24px 16px' }}>
        Scores by dimension and role group · ⚠ = perception gap ≥ 20 pts
      </div>
      <table className="composite-scorecard-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Composite</th>
            <th>Maturity</th>
            <th style={{ color: ROLE_GROUP_META.executive.color }}>Executive</th>
            <th style={{ color: ROLE_GROUP_META.management.color }}>Management</th>
            <th style={{ color: ROLE_GROUP_META.practitioner.color }}>Practitioner</th>
            <th>Spread</th>
          </tr>
        </thead>
        <tbody>
          {composite.dimensions.map(d => {
            const lvl = getMaturityLevel(d.avg)
            return (
              <tr key={d.dimId}>
                <td>
                  <span style={{ marginRight: 6 }}>{dimIcons[d.dimId]}</span>
                  <span style={{ fontWeight: 500 }}>{d.shortName}</span>
                  {d.perceptionGap && <span className="gap-flag">⚠ Gap</span>}
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: d.color, fontSize: 15 }}>{d.avg}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/100</span>
                </td>
                <td>
                  <span className="scorecard-maturity-pill" style={{ background: lvl.bg, color: lvl.color }}>
                    {lvl.label}
                  </span>
                </td>
                <td style={{ color: ROLE_GROUP_META.executive.color, fontWeight: 600 }}>
                  {d.byGroup.executive?.avg ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td style={{ color: ROLE_GROUP_META.management.color, fontWeight: 600 }}>
                  {d.byGroup.management?.avg ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td style={{ color: ROLE_GROUP_META.practitioner.color, fontWeight: 600 }}>
                  {d.byGroup.practitioner?.avg ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    ±{d.stdDev} · {d.min}–{d.max}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Respondent table ───────────────────────────────────────────────────────
function RespondentTable({ sessions }) {
  return (
    <div className="card" style={{ marginBottom: 24, overflowX: 'auto' }}>
      <div className="chart-title" style={{ padding: '20px 24px 0' }}>All Respondents</div>
      <div className="chart-subtitle" style={{ padding: '4px 24px 16px' }}>
        Individual session scores by respondent
      </div>
      <table className="composite-scorecard-table">
        <thead>
          <tr>
            <th>Respondent</th>
            <th>Role</th>
            <th>Group</th>
            <th>Overall</th>
            <th>Strategy</th>
            <th>Data</th>
            <th>Governance</th>
            <th>Talent</th>
            <th>MLOps</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => {
            const m = ROLE_GROUP_META[s.roleGroup]
            const maturity = getMaturityLevel(s.overallScore)
            return (
              <tr key={s.sessionId}>
                <td style={{ fontWeight: 500 }}>{s.respondentName}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{s.respondentRole}</td>
                <td>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4,
                    background: m.bg, color: m.color, fontSize: 11, fontWeight: 600,
                  }}>{m.label}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: maturity.color }}>{s.overallScore}</span>
                </td>
                {[1, 2, 3, 4, 5].map(id => (
                  <td key={id} style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {s.dimScores[id] ?? '—'}
                  </td>
                ))}
                <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                  {new Date(s.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Main composite results page ────────────────────────────────────────────
export default function CompositeResults({ engagement, onBack }) {
  const radarRef   = useRef(null)
  const contentRef = useRef(null)
  const composite = computeComposite(engagement.sessions)

  if (!composite) return (
    <div className="page">
      <div className="page-inner" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No sessions to aggregate</div>
        <button className="btn btn-primary" onClick={onBack}>← Back to Hub</button>
      </div>
    </div>
  )

  const { company, sessions } = engagement
  const maturity = getMaturityLevel(composite.overallAvg)
  const recommendations = generateRecommendations(composite.asDimScores, company)
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const radarData = composite.dimensions.map(d => ({
    dimension: d.shortName,
    score: d.avg,
    fullMark: 100,
  }))

  return (
    <div className="page">

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div className="topbar">
        <div className="topbar-inner topbar-inner--wide">
          <div className="topbar-logo">
            <div className="topbar-logo-mark">AI</div>
            <span className="topbar-logo-text">Readiness Assessment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => exportEngagement(engagement)}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Engagement
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              ← Back to Hub
            </button>
          </div>
        </div>
      </div>

      <div className="page-inner page-inner--wide" ref={contentRef}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="results-header">
          <div>
            <div className="results-company-name">
              {company.name} · {company.industry} · {company.size}
            </div>
            <h1 className="results-title">Composite AI Readiness Report</h1>
            <p className="results-subtitle">
              Aggregated from {composite.sessionCount} interviews ·{' '}
              {composite.roleCounts.executive > 0 && `${composite.roleCounts.executive} Executive · `}
              {composite.roleCounts.management > 0 && `${composite.roleCounts.management} Management · `}
              {composite.roleCounts.practitioner > 0 && `${composite.roleCounts.practitioner} Practitioner`}
            </p>
            <div className="results-date">{today}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="maturity-badge" style={{ background: maturity.bg, color: maturity.color }}>
              <span>●</span> {maturity.label} Maturity
            </div>
          </div>
        </div>

        {/* ── Overall score ─────────────────────────────────────────────── */}
        <div className="card score-summary" style={{ marginBottom: 24 }}>
          <div className="score-ring-container" style={{ width: 160, height: 160 }}>
            {(() => {
              const size = 160, r = size / 2 - 12
              const circ = 2 * Math.PI * r
              const fill = (composite.overallAvg / 100) * circ
              return (
                <svg width={size} height={size}>
                  <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
                  <circle
                    cx={size/2} cy={size/2} r={r}
                    fill="none" stroke={maturity.color} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${fill} ${circ}`}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                  <text x={size/2} y={size/2 - 6} textAnchor="middle" fill="#1E293B" fontSize={28} fontWeight={700} fontFamily="sans-serif">
                    {composite.overallAvg}
                  </text>
                  <text x={size/2} y={size/2 + 14} textAnchor="middle" fill="#94A3B8" fontSize={11} fontFamily="sans-serif">
                    out of 100
                  </text>
                </svg>
              )
            })()}
          </div>
          <div className="score-summary-content">
            <div className="score-summary-headline">
              Composite Score: {composite.overallAvg}/100
            </div>
            <div className="score-summary-meta">
              {composite.dimensions.map(d => (
                <div key={d.dimId} className="score-meta-item">
                  <div className="score-meta-value" style={{ color: d.color }}>{d.avg}</div>
                  <div className="score-meta-label">{d.shortName}</div>
                </div>
              ))}
            </div>
            {/* Role group breakdown */}
            <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {Object.entries(composite.roleCounts).map(([g, count]) => {
                if (!count) return null
                const m = ROLE_GROUP_META[g]
                const groupAvg = Math.round(
                  sessions.filter(s => s.roleGroup === g)
                    .reduce((a, s) => a + s.overallScore, 0) / count
                )
                return (
                  <div key={g} className="composite-role-summary" style={{ borderColor: m.color }}>
                    <div style={{ color: m.color, fontWeight: 700, fontSize: 18 }}>{groupAvg}</div>
                    <div style={{ fontSize: 11, color: m.color }}>{m.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>n={count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Perception gap callout ────────────────────────────────────── */}
        <PerceptionGapCallout gaps={composite.perceptionGapDimensions} />
        <LowVisibilityCallout dims={composite.lowVisibilityDimensions} />

        {/* ── Composite scorecard ───────────────────────────────────────── */}
        <CompositeScorecard composite={composite} />

        {/* ── Dimension score cards ─────────────────────────────────────── */}
        <div className="dim-scores-grid" style={{ marginBottom: 24 }}>
          {composite.dimensions.map(d => {
            const lvl = getMaturityLevel(d.avg)
            return (
              <div key={d.dimId} className="dim-score-card" style={{ '--card-color': d.color }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 3, background: d.color, borderRadius: '12px 12px 0 0',
                }} />
                <div className="dim-score-card-header">
                  <div className="dim-score-card-name">{d.name}</div>
                  <span style={{ fontSize: 20 }}>{dimIcons[d.dimId]}</span>
                </div>
                <div className="dim-score-value">{d.avg}<span>/100</span></div>
                <div className="dim-score-bar-track">
                  <div className="dim-score-bar-fill" style={{ width: `${d.avg}%`, background: d.color }} />
                </div>
                <div className="dim-score-maturity" style={{ color: lvl.color }}>{lvl.label}</div>
                {/* Role group bars */}
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['executive', 'management', 'practitioner'].map(g => (
                    <GroupBar key={g} group={g} data={d.byGroup[g]} baseline={d.avg} />
                  ))}
                </div>
                {d.perceptionGap && (
                  <div className="dim-gap-badge">
                    ⚠ {d.gapMagnitude}pt perception gap
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Radar chart ───────────────────────────────────────────────── */}
        <div className="card chart-section" style={{ marginBottom: 24 }}>
          <div className="chart-title">Composite Readiness Profile</div>
          <div className="chart-subtitle">Aggregate score across all 5 dimensions (0–100 scale)</div>
          <div ref={radarRef}>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                <PolarGrid gridType="polygon" stroke="#E2E2E2" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#555555', fontSize: 13, fontWeight: 600, fontFamily: 'Open Sans, sans-serif' }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#999', fontSize: 11 }} tickCount={6} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div style={{ background: 'white', border: '1px solid #E2E2E2', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                      <div style={{ fontWeight: 700, color: '#333', marginBottom: 2 }}>{payload[0].payload.dimension}</div>
                      <div style={{ color: '#2EA3F2', fontWeight: 600 }}>{payload[0].payload.score} / 100</div>
                    </div>
                  ) : null}
                />
                <Radar
                  name="Composite" dataKey="score"
                  stroke="#2EA3F2" fill="#2EA3F2" fillOpacity={0.15}
                  strokeWidth={2.5}
                  dot={{ fill: '#2EA3F2', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#2EA3F2' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Question heatmap ──────────────────────────────────────────── */}
        <QuestionHeatmap composite={composite} />

        {/* ── Composite recommendations ─────────────────────────────────── */}
        <div className="recs-section">
          <div className="recs-header">
            <div className="section-eyebrow">Composite Action Plan</div>
            <h2 className="section-title" style={{ fontSize: 22 }}>Prioritized Recommendations</h2>
            <p className="section-subtitle" style={{ fontSize: 14 }}>
              Based on aggregate scores across {composite.sessionCount} respondents. Ordered by readiness gap.
            </p>
          </div>

          {recommendations.map((rec, idx) => {
            const priorityClass = `priority-${rec.priority.toLowerCase()}`
            return (
              <div key={rec.dimensionId} className="rec-card">
                <div className="rec-card-border" style={{ background: rec.dimensionColor }} />
                <div style={{ paddingLeft: 16 }}>
                  <div className="rec-card-top">
                    <div>
                      <div className="rec-card-dimension">
                        {dimIcons[rec.dimensionId]} {rec.dimensionName}
                      </div>
                      <div className="rec-card-title">{rec.title}</div>
                    </div>
                    <div className="rec-card-meta">
                      <div className="rec-score-chip">
                        <span style={{ color: getMaturityLevel(rec.score).color }}>●</span>
                        {rec.score}/100
                      </div>
                      <div className={`priority-badge ${priorityClass}`}>
                        {idx === 0 ? '↑↑ ' : ''}{rec.priority}
                      </div>
                    </div>
                  </div>

                  <p className="rec-card-desc">{rec.description}</p>

                  {rec.industryContext && (
                    <div className="rec-industry-context">
                      <span className="rec-industry-context-label">◆ {company.industry} Context</span>
                      <span className="rec-industry-context-text">{rec.industryContext}</span>
                    </div>
                  )}

                  {rec.keyRisk && (
                    <div className="rec-key-risk">
                      <span className="rec-key-risk-label">⚠ Key Risk if Not Addressed</span>
                      <span className="rec-key-risk-text">{rec.keyRisk}</span>
                    </div>
                  )}

                  <div className="rec-actions-title">Recommended Actions</div>
                  <ul className="rec-actions-list">
                    {rec.actions.map((action, ai) => (
                      <li key={ai} className="rec-action-item">
                        <div className="rec-action-dot" style={{ background: rec.dimensionColor }} />
                        {action}
                      </li>
                    ))}
                  </ul>

                  {rec.phases && (
                    <div className="phases-timeline">
                      {rec.phases.map((phase, pi) => (
                        <div key={pi} className="phase-column">
                          <div className="phase-header" style={{ borderColor: rec.dimensionColor }}>
                            <div className="phase-label" style={{ color: rec.dimensionColor }}>{phase.label}</div>
                            <div className="phase-theme">{phase.theme}</div>
                          </div>
                          <ul className="phase-actions">
                            {phase.actions.map((a, ai) => (
                              <li key={ai} className="phase-action-item">
                                <div className="phase-action-dot" style={{ background: rec.dimensionColor }} />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {rec.sizeNote && (
                    <div className="rec-size-note">
                      <span className="rec-size-note-label">⚖ Scale Consideration</span>
                      <span className="rec-size-note-text">{rec.sizeNote}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Respondent table ──────────────────────────────────────────── */}
        <RespondentTable sessions={sessions} />

        {/* ── Confidence distribution ───────────────────────────────────── */}
        <ConfidenceDistribution composite={composite} />

        {/* ── Respondent notes ──────────────────────────────────────────── */}
        <RespondentNotes sessions={sessions} />

        {/* ── Footer actions ────────────────────────────────────────────── */}
        <div className="results-actions">
          <button className="btn btn-secondary btn-lg" onClick={onBack}>
            ← Back to Hub
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => exportEngagement(engagement)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export JSON
          </button>
          <CompositePDFExportButton engagement={engagement} radarRef={radarRef} contentRef={contentRef} />
        </div>

      </div>
    </div>
  )
}
