import { useRef } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import {
  computeDimensionScores,
  computeOverallScore,
  getMaturityLevel,
  generateNarrative,
} from '../data/questions'
import { generateRecommendations } from '../data/recommendations'
import PDFExportButton from './PDFExport'

const dimIcons = { 1: '🎯', 2: '🗄️', 3: '⚖️', 4: '👥', 5: '⚙️' }

const DIM_OWNERS = {
  1: 'CEO / CDAO',
  2: 'CTO / CIO',
  3: 'CISO / CDAO',
  4: 'CHRO / CDAO',
  5: 'CTO / VP Engineering',
}

// Dimensions where a given role has strong vs. limited direct visibility
const ROLE_CONFIDENCE = {
  'CEO / President':                    { high: [1, 4], low: [2, 5] },
  'COO / Chief Operating Officer':      { high: [1, 4], low: [2, 3] },
  'CTO / Chief Technology Officer':     { high: [2, 5], low: [3, 4] },
  'CIO / Chief Information Officer':    { high: [2, 3], low: [4, 5] },
  'CDAO / Chief Data & AI Officer':     { high: [1, 2, 3], low: [] },
  'VP / Director, Technology':          { high: [2, 5], low: [1, 4] },
  'VP / Director, Data & Analytics':    { high: [2], low: [1, 4] },
  'VP / Director, AI & Innovation':     { high: [1, 5], low: [4] },
  'Head of Digital Transformation':     { high: [1, 4], low: [2, 5] },
  'Enterprise Architect':               { high: [2, 5], low: [1, 4] },
}

const DIM_FRAMEWORKS = {
  1: 'NIST AI RMF 1.0 (GOVERN) · OECD AI Principles',
  2: 'DAMA-DMBOK v2 · NIST AI RMF (MAP)',
  3: 'NIST AI RMF 1.0 (MAP/MEASURE/MANAGE) · ISO/IEC 42001:2023 · EU AI Act (2024)',
  4: 'NIST AI RMF (GOVERN 6.x) · WEF AI Governance Alliance',
  5: 'Google MLOps Maturity Model · Microsoft Azure MLOps Model · NIST AI RMF (MANAGE)',
}

function ConfidenceBanner({ role }) {
  const conf = ROLE_CONFIDENCE[role]
  if (!conf) return null
  const shortName = { 1: 'Strategy', 2: 'Data', 3: 'Governance', 4: 'Talent', 5: 'Operations' }
  const highDims = conf.high.map(id => shortName[id]).join(', ')
  const lowDims  = conf.low.map(id => shortName[id]).join(', ')
  return (
    <div className="confidence-banner">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>
        <strong>Assessment perspective:</strong> Completed by a <em>{role}</em>.
        {highDims && <> Strong domain visibility: <strong>{highDims}</strong>.</>}
        {lowDims && <> Consider supplementing with additional stakeholders for: <strong>{lowDims}</strong>.</>}
        {' '}Aligned with CMMI/SCAMPI multi-rater methodology and NIST AI RMF GOVERN guidance.
      </span>
    </div>
  )
}

function ScorecardTable({ dimScores, recommendations }) {
  const recByDim = Object.fromEntries(recommendations.map(r => [r.dimensionId, r]))
  return (
    <div className="scorecard-table-wrap card" style={{ marginBottom: 24 }}>
      <div className="scorecard-table-header">
        <div className="chart-title" style={{ marginBottom: 2 }}>Executive Scorecard</div>
        <div className="chart-subtitle">Summary view across all five dimensions with accountability mapping</div>
      </div>
      <table className="scorecard-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Score</th>
            <th>Maturity</th>
            <th>Priority</th>
            <th>Accountable Role</th>
          </tr>
        </thead>
        <tbody>
          {dimScores.map(d => {
            const lvl = getMaturityLevel(d.score)
            const rec = recByDim[d.id]
            const priorityColors = { Critical: '#E74C3C', High: '#E67E22', Medium: '#2EA3F2', Sustain: '#10B981' }
            return (
              <tr key={d.id}>
                <td>
                  <span style={{ marginRight: 6 }}>{dimIcons[d.id]}</span>
                  <span style={{ fontWeight: 500 }}>{d.name}</span>
                </td>
                <td>
                  <span className="scorecard-score" style={{ color: d.color }}>{d.score}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/100</span>
                </td>
                <td>
                  <span className="scorecard-maturity-pill" style={{ background: lvl.bg, color: lvl.color }}>
                    {lvl.label}
                  </span>
                </td>
                <td>
                  {rec && (
                    <span className="scorecard-priority-pill" style={{ color: priorityColors[rec.priority] }}>
                      ● {rec.priority}
                    </span>
                  )}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{DIM_OWNERS[d.id]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ScoreRing({ score, color, size = 160 }) {
  const r = (size / 2) - 12
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ

  return (
    <div className="score-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="score-ring-center">
        <div className="score-ring-value">{score}</div>
        <div className="score-ring-label">out of 100</div>
      </div>
    </div>
  )
}

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner topbar-inner--wide">
        <div className="topbar-logo">
          <div className="topbar-logo-mark">AI</div>
          <span className="topbar-logo-text">Readiness Assessment</span>
        </div>
        <div className="topbar-progress">
          <div className="topbar-progress-label">Assessment Complete</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: '100%' }} />
          </div>
        </div>
        <span className="topbar-step-info" style={{ color: '#10B981' }}>✓ Done</span>
      </div>
    </div>
  )
}

const QUADRANT_LABELS = [
  { x: 75, y: 12, text: 'Strategic Bets', sub: 'High effort · High impact', color: '#2EA3F2' },
  { x: 25, y: 12, text: 'Quick Wins', sub: 'Low effort · High impact', color: '#27AE60' },
  { x: 25, y: 62, text: 'Consider Later', sub: 'Low effort · Low impact', color: '#999999' },
  { x: 75, y: 62, text: 'Deprioritize', sub: 'High effort · Low impact', color: '#E74C3C' },
]

function EIMatrix({ recommendations }) {
  const W = 480, H = 340
  const PAD = { top: 32, right: 32, bottom: 44, left: 52 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top - PAD.bottom

  const toX = (effort) => PAD.left + ((effort - 1) / 4) * cW
  const toY = (impact) => PAD.top + ((5 - impact) / 4) * cH

  const midX = PAD.left + cW / 2
  const midY = PAD.top + cH / 2

  return (
    <div className="card chart-section" style={{ marginBottom: 24 }}>
      <div className="chart-title">Effort × Impact Matrix</div>
      <div className="chart-subtitle">Prioritize initiatives by quadrant — Quick Wins first, Strategic Bets next</div>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
          {/* Quadrant backgrounds */}
          <rect x={PAD.left} y={PAD.top} width={cW / 2} height={cH / 2} fill="#EAFAF1" opacity={0.7} />
          <rect x={midX} y={PAD.top} width={cW / 2} height={cH / 2} fill="#E8F4FD" opacity={0.7} />
          <rect x={PAD.left} y={midY} width={cW / 2} height={cH / 2} fill="#F8F8F8" opacity={0.7} />
          <rect x={midX} y={midY} width={cW / 2} height={cH / 2} fill="#FDEDEC" opacity={0.7} />

          {/* Grid lines */}
          <line x1={PAD.left} y1={midY} x2={PAD.left + cW} y2={midY} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={midX} y1={PAD.top} x2={midX} y2={PAD.top + cH} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />

          {/* Border */}
          <rect x={PAD.left} y={PAD.top} width={cW} height={cH} fill="none" stroke="#E2E2E2" strokeWidth={1} />

          {/* Quadrant labels */}
          {QUADRANT_LABELS.map((q, i) => (
            <g key={i}>
              <text
                x={`${q.x}%`}
                y={PAD.top + (q.y / 100) * cH}
                textAnchor="middle"
                fill={q.color}
                fontSize={11}
                fontWeight={700}
                fontFamily="Open Sans, sans-serif"
                opacity={0.75}
              >
                {q.text}
              </text>
              <text
                x={`${q.x}%`}
                y={PAD.top + (q.y / 100) * cH + 14}
                textAnchor="middle"
                fill="#999"
                fontSize={9}
                fontFamily="Open Sans, sans-serif"
              >
                {q.sub}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={PAD.left + cW / 2} y={H - 6} textAnchor="middle" fill="#555" fontSize={11} fontFamily="Open Sans, sans-serif">
            ← Lower Effort · Higher Effort →
          </text>
          <text
            x={16}
            y={PAD.top + cH / 2}
            textAnchor="middle"
            fill="#555"
            fontSize={11}
            fontFamily="Open Sans, sans-serif"
            transform={`rotate(-90, 16, ${PAD.top + cH / 2})`}
          >
            ← Lower Impact · Higher Impact →
          </text>

          {/* Dots */}
          {recommendations.map((rec) => {
            const cx = toX(rec.effort)
            const cy = toY(rec.impact)
            return (
              <g key={rec.dimensionId}>
                <circle cx={cx} cy={cy} r={14} fill={rec.dimensionColor} opacity={0.18} />
                <circle cx={cx} cy={cy} r={7} fill={rec.dimensionColor} />
                <title>{rec.dimensionName}: Effort {rec.effort}/5, Impact {rec.impact}/5</title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 }}>
        {recommendations.map(rec => (
          <div key={rec.dimensionId} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: rec.dimensionColor, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{rec.dimensionName}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>E{rec.effort}/I{rec.impact}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const CustomRadarTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload
    return (
      <div style={{
        background: 'white', border: '1px solid #E2E2E2', borderRadius: 8,
        padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, color: '#333333', marginBottom: 2 }}>{d.dimension}</div>
        <div style={{ color: '#2EA3F2', fontWeight: 600 }}>{d.score} / 100</div>
      </div>
    )
  }
  return null
}

export default function ResultsPage({
  company, answers, notes = {}, onRestart,
  // Engagement mode — when onSaveToEngagement is provided, show Save/Discard buttons
  onSaveToEngagement, onDiscard,
  respondentName, respondentRole,
}) {
  const engagementMode = !!onSaveToEngagement
  const radarRef = useRef(null)

  const dimScores     = computeDimensionScores(answers)
  const overallScore  = computeOverallScore(dimScores)
  const maturity      = getMaturityLevel(overallScore)
  const recommendations = generateRecommendations(dimScores, company)
  const narrative     = generateNarrative(company, dimScores, overallScore)

  const radarData = dimScores.map(d => ({
    dimension: d.shortName,
    score: d.score,
    fullMark: 100,
  }))

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const totalAnswered = dimScores.reduce(
    (acc, d) => acc + Object.keys(answers[d.id]).length, 0
  )

  return (
    <div className="page">
      <TopBar />

      <div className="page-inner page-inner--wide">

        {/* ── Results header ─────────────────────────────────────────── */}
        <div className="results-header">
          <div>
            <div className="results-company-name">
              {company.name} · {company.industry} · {company.size}
            </div>
            <h1 className="results-title">
              {engagementMode ? 'Interview Results' : 'AI Readiness Assessment Results'}
            </h1>
            {engagementMode && (respondentName || respondentRole) && (
              <div className="results-respondent-banner">
                <span>{respondentName}</span>
                {respondentRole && <span> · {respondentRole}</span>}
              </div>
            )}
            <p className="results-subtitle">
              Based on {totalAnswered} responses across 5 dimensions
            </p>
            <div className="results-date">{today}</div>
            {!engagementMode && (company.respondentName || company.respondentRole) && (
              <div className="results-respondent">
                Completed by{company.respondentName ? ` ${company.respondentName}` : ''}
                {company.respondentRole ? ` · ${company.respondentRole}` : ''}
                {' '}· Single-respondent; validate with multi-stakeholder consensus
              </div>
            )}
            {!engagementMode && company.respondentRole && <ConfidenceBanner role={company.respondentRole} />}
            {engagementMode && respondentRole && <ConfidenceBanner role={respondentRole} />}
          </div>

          <div className="results-header-actions">
            {engagementMode ? (
              <>
                <button className="btn btn-primary" onClick={onSaveToEngagement}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-1" />
                  </svg>
                  Save to Engagement
                </button>
                <button className="btn btn-ghost" onClick={onDiscard}>
                  Discard
                </button>
              </>
            ) : (
              <>
                <PDFExportButton
                  company={company}
                  answers={answers}
                  notes={notes}
                  radarChartRef={radarRef}
                />
                <button className="btn btn-secondary" onClick={onRestart}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Retake
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Executive Summary ──────────────────────────────────────── */}
        <div className="exec-summary card" style={{ marginBottom: 24 }}>
          <div className="exec-summary-header">
            <div className="exec-summary-eyebrow">Executive Summary</div>
            <div
              className="maturity-badge"
              style={{ background: maturity.bg, color: maturity.color, marginLeft: 'auto' }}
            >
              <span>●</span> {maturity.label} Maturity
            </div>
          </div>
          <div className="exec-summary-body">
            {narrative.map((sentence, i) => (
              <p key={i} className="exec-summary-sentence">{sentence}</p>
            ))}
          </div>
        </div>

        {/* ── Executive Scorecard ────────────────────────────────────── */}
        <ScorecardTable dimScores={dimScores} recommendations={recommendations} />

        {/* ── Overall Score ──────────────────────────────────────────── */}
        <div className="card score-summary" style={{ marginBottom: 24 }}>
          <ScoreRing score={overallScore} color={maturity.color} />
          <div className="score-summary-content">
            <div className="score-summary-headline">
              Overall AI Readiness: {overallScore}/100
            </div>
            <div className="score-summary-meta">
              {dimScores.map(d => (
                <div key={d.id} className="score-meta-item">
                  <div className="score-meta-value" style={{ color: d.color }}>{d.score}</div>
                  <div className="score-meta-label">{d.shortName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dimension score cards ──────────────────────────────────── */}
        <div className="dim-scores-grid">
          {dimScores.map(d => {
            const lvl = getMaturityLevel(d.score)
            return (
              <div key={d.id} className="dim-score-card" style={{ '--card-color': d.color }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 3, background: d.color, borderRadius: '12px 12px 0 0',
                }} />
                <div className="dim-score-card-header">
                  <div className="dim-score-card-name">{d.name}</div>
                  <span style={{ fontSize: 20 }}>{dimIcons[d.id]}</span>
                </div>
                <div className="dim-score-value">{d.score}<span>/100</span></div>
                <div className="dim-score-bar-track">
                  <div className="dim-score-bar-fill" style={{ width: `${d.score}%`, background: d.color }} />
                </div>
                <div className="dim-score-maturity" style={{ color: lvl.color }}>{lvl.label}</div>
              </div>
            )
          })}
        </div>

        {/* ── Radar Chart ────────────────────────────────────────────── */}
        <div className="card chart-section" style={{ marginBottom: 24 }}>
          <div className="chart-title">Readiness Profile</div>
          <div className="chart-subtitle">Score across all 5 dimensions (0–100 scale)</div>

          <div ref={radarRef}>
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                <PolarGrid gridType="polygon" stroke="#E2E2E2" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#555555', fontSize: 13, fontWeight: 600, fontFamily: 'Open Sans, sans-serif' }}
                />
                <PolarRadiusAxis
                  angle={90} domain={[0, 100]}
                  tick={{ fill: '#999999', fontSize: 11 }}
                  tickCount={6} axisLine={false}
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Radar
                  name="Score" dataKey="score"
                  stroke="#2EA3F2" fill="#2EA3F2" fillOpacity={0.15}
                  strokeWidth={2.5}
                  dot={{ fill: '#2EA3F2', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#2EA3F2' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            {dimScores.map(d => {
              const lvl = getMaturityLevel(d.score)
              return (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ fontSize: 14 }}>{dimIcons[d.id]}</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{d.shortName}</span>
                  <span style={{
                    padding: '1px 7px', borderRadius: 4,
                    background: lvl.bg, color: lvl.color, fontWeight: 600, fontSize: 11,
                  }}>{d.score}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Effort × Impact Matrix ─────────────────────────────────── */}
        <EIMatrix recommendations={recommendations.filter(r => r.tier !== 'sustain')} />

        {/* ── Recommendations ────────────────────────────────────────── */}
        <div className="recs-section">
          <div className="recs-header">
            <div className="section-eyebrow">Action Plan</div>
            <h2 className="section-title" style={{ fontSize: 22 }}>Prioritized Recommendations</h2>
            <p className="section-subtitle" style={{ fontSize: 14 }}>
              Ordered by readiness gap — address critical items first for the highest impact.
            </p>
          </div>

          {recommendations.map((rec, idx) => {
            const isSustain = rec.tier === 'sustain'
            const priorityClass = `priority-${rec.priority.toLowerCase()}`
            const dimNotes = notes[rec.dimensionId]
            return (
              <div key={rec.dimensionId} className={`rec-card${isSustain ? ' rec-card--sustain' : ''}`}>
                <div className="rec-card-border" style={{ background: isSustain ? '#10B981' : rec.dimensionColor }} />
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
                        {isSustain ? '✓ ' : idx === 0 ? '↑↑ ' : ''}{rec.priority}
                      </div>
                    </div>
                  </div>

                  {isSustain && (
                    <div className="rec-sustain-banner">
                      <span>✦ Leading</span> — This dimension is performing at a high-maturity level. Focus on sustaining and leveraging this capability rather than remediation.
                    </div>
                  )}

                  <p className="rec-card-desc">{rec.description}</p>

                  {rec.industryContext && (
                    <div className="rec-industry-context">
                      <span className="rec-industry-context-label">◆ {company.industry} Context</span>
                      <span className="rec-industry-context-text">{rec.industryContext}</span>
                    </div>
                  )}

                  {rec.keyRisk && (
                    <div className={isSustain ? 'rec-sustain-risk' : 'rec-key-risk'}>
                      <span className={isSustain ? 'rec-sustain-risk-label' : 'rec-key-risk-label'}>
                        {isSustain ? '◎ Watch For' : '⚠ Key Risk if Not Addressed'}
                      </span>
                      <span className={isSustain ? 'rec-sustain-risk-text' : 'rec-key-risk-text'}>{rec.keyRisk}</span>
                    </div>
                  )}

                  <div className="rec-actions-title">
                    {isSustain ? 'Maintain & Leverage' : 'Recommended Actions'}
                  </div>
                  <ul className="rec-actions-list">
                    {rec.actions.map((action, ai) => (
                      <li key={ai} className="rec-action-item">
                        <div className="rec-action-dot" style={{ background: isSustain ? '#10B981' : rec.dimensionColor }} />
                        {action}
                      </li>
                    ))}
                  </ul>

                  {!isSustain && rec.phases && (
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

                  {dimNotes && (
                    <div className="rec-consultant-notes">
                      <span className="rec-consultant-notes-label">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 4 }}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Consultant Observations
                      </span>
                      <p className="rec-consultant-notes-text">{dimNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── About This Assessment ─────────────────────────────────── */}
        <div className="about-assessment" style={{ marginBottom: 32 }}>
          <div className="about-assessment-title">About This Assessment</div>
          <p className="about-assessment-body">
            This assessment evaluates organizational AI maturity across five dimensions using a behaviorally-anchored
            scoring model (1 = No capability → 5 = Advanced). Scores are normalized to a 0–100 scale per dimension;
            the overall score is the unweighted average. Findings reflect self-reported maturity at a single point in
            time and should be supplemented with multi-stakeholder validation and domain expert review before
            strategic investment decisions are made. This tool does not evaluate individual AI project performance,
            specific vendor relationships, or detailed technical architecture. Responses are stored only in your
            browser and are never transmitted externally.
          </p>
          <div className="framework-alignment">
            <div className="framework-alignment-title">Framework Alignment</div>
            <div className="framework-grid">
              {dimScores.map(d => (
                <div key={d.id} className="framework-row">
                  <span className="framework-dim-label" style={{ color: d.color }}>
                    {dimIcons[d.id]} {d.shortName}
                  </span>
                  <span className="framework-refs">{DIM_FRAMEWORKS[d.id]}</span>
                </div>
              ))}
            </div>
            <p className="framework-note">
              Scoring methodology informed by CMMI/SCAMPI appraisal standards and NIST AI RMF multi-stakeholder
              guidance. ISO/IEC 42001:2023 is the certifiable AI Management System standard published by ISO/IEC.
              EU AI Act (Regulation (EU) 2024/1689) entered into force August 2024.
            </p>
          </div>
        </div>

        {/* ── Logic2020 CTA ──────────────────────────────────────────── */}
        {(() => {
          const ctaTier =
            overallScore <= 40 ? {
              badge: 'Recommended Next Step',
              engagement: 'AI Strategy Diagnostic Session',
              desc: 'Your assessment indicates foundational gaps that benefit from structured expert facilitation. Logic2020\'s 2-hour AI Strategy Diagnostic Session aligns your leadership team on priorities, surfaces hidden risks, and produces a clear starting point for your AI investment plan.',
              cta: 'Book a Diagnostic Session',
            } : overallScore <= 65 ? {
              badge: 'Recommended Next Step',
              engagement: 'AI Foundations Engagement',
              desc: 'Your organization has AI momentum but needs execution rigor to scale. Logic2020\'s 4-week AI Foundations Engagement delivers a prioritized roadmap, governance framework, and quick-win implementation plan — translating these findings into funded, accountable action.',
              cta: 'Start a Foundations Engagement',
            } : {
              badge: 'Recommended Next Step',
              engagement: 'AI Acceleration Program',
              desc: 'Your AI maturity positions you for competitive differentiation. Logic2020\'s AI Acceleration Program helps leading organizations build proprietary capabilities, optimize AI operations at scale, and establish thought leadership — turning your existing investment into sustainable advantage.',
              cta: 'Explore the Acceleration Program',
            }
          return (
            <div className="cta-section">
              <div className="cta-logo-row">
                <div className="cta-logo-mark">L20</div>
                <span className="cta-logo-text">Logic2020</span>
                <span className="cta-engagement-badge">{ctaTier.badge}</span>
              </div>
              <h3 className="cta-title">{ctaTier.engagement}</h3>
              <p className="cta-desc">{ctaTier.desc}</p>
              <div className="cta-actions">
                <a
                  href="https://www.logic2020.com/contact"
                  className="btn-cta-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ctaTier.cta}
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
                <span className="cta-sub">
                  Schedule a complimentary 30-minute debrief to walk through your results with an advisor
                </span>
              </div>
            </div>
          )
        })()}

        {/* ── Footer actions ─────────────────────────────────────────── */}
        <div className="results-actions">
          {engagementMode ? (
            <>
              <button className="btn btn-primary btn-lg" onClick={onSaveToEngagement}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-1" />
                </svg>
                Save to Engagement
              </button>
              <button className="btn btn-secondary" onClick={onDiscard}>
                Discard Interview
              </button>
            </>
          ) : (
            <>
              <PDFExportButton company={company} answers={answers} notes={notes} radarChartRef={radarRef} />
              <button className="btn btn-primary btn-lg" onClick={onRestart}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Start New Assessment
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
