import { useRef, useState } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import {
  computeDimensionScores,
  computeOverallScore,
  getMaturityLevel,
  generateNarrative,
  getRiskProfile,
  dimensions as allDimensions,
  scaleLabels,
} from '../data/questions'
import { generateRecommendations } from '../data/recommendations'
import { getComplianceRisk } from '../data/industryProfiles'
import IndustryIntelligenceCard from './IndustryIntelligenceCard'
import IndustryRegulatoryContextCard from './IndustryRegulatoryContextCard'
import FrameworkAlignmentCard from './FrameworkAlignmentCard'
import EffortImpactMatrix from './EffortImpactMatrix'
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

// EffortImpactMatrix has moved to ./EffortImpactMatrix.jsx so both
// ResultsPage and CompositeResults can share the same visualization.

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

const CONFIDENCE_META = {
  high:   { label: 'High Confidence',   color: '#059669', bg: '#D1FAE5' },
  medium: { label: 'Medium Confidence', color: '#D97706', bg: '#FEF3C7' },
  low:    { label: 'Low Confidence',    color: '#E74C3C', bg: '#FEE2E2' },
}

export default function ResultsPage({
  company, answers, notes = {}, onRestart,
  // Engagement mode — when onSaveToEngagement is provided, show Save/Discard buttons
  onSaveToEngagement, onDiscard,
  respondentName, respondentRole,
  confidence = {}, dimMeta = {},
}) {
  const engagementMode  = !!onSaveToEngagement
  const [showDiscard, setShowDiscard] = useState(false)
  const radarRef = useRef(null)

  const dimScores     = computeDimensionScores(answers)
  const overallScore  = computeOverallScore(dimScores)
  const maturity      = getMaturityLevel(overallScore)
  const recommendations = generateRecommendations(dimScores, company)
  const narrative     = generateNarrative(company, dimScores, overallScore, dimMeta)

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
    <>
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
                <button className="btn btn-ghost" onClick={() => setShowDiscard(true)}>
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
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div
                className="maturity-badge"
                style={{ background: maturity.bg, color: maturity.color }}
              >
                <span>●</span> {maturity.label} Maturity
              </div>
              {maturity.context && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, maxWidth: 280, lineHeight: 1.5, textAlign: 'right' }}>
                  {maturity.context}
                </div>
              )}
            </div>
          </div>
          <div className="exec-summary-body">
            {narrative.map((sentence, i) => (
              <p key={i} className="exec-summary-sentence">{sentence}</p>
            ))}
          </div>
        </div>

        {/* ── Risk profile callout ────────────────────────────────────── */}
        {(() => {
          const risk = getRiskProfile(dimScores)
          if (!risk) return null
          return (
            <div style={{
              background: risk.bg, border: `1.5px solid ${risk.color}`,
              borderRadius: 10, padding: '16px 20px', marginBottom: 24,
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>⚠</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: risk.color, marginBottom: 5 }}>
                  Risk Profile: {risk.label}
                </div>
                <div style={{ fontSize: 13, color: risk.color, lineHeight: 1.65, opacity: 0.9 }}>
                  {risk.description}
                </div>
              </div>
            </div>
          )
        })()}

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
        <EffortImpactMatrix recommendations={recommendations.filter(r => r.tier !== 'sustain')} />

        {/* ── Lowest-scoring questions ────────────────────────────────── */}
        {(() => {
          const allQ = []
          allDimensions.forEach(dim => {
            const dimAnswers = answers[dim.id] || {}
            dim.questions.forEach((q, qi) => {
              const val = dimAnswers[qi]
              if (typeof val !== 'number') return
              allQ.push({ dimName: dim.shortName, dimColor: dim.color, text: q.text, score: val })
            })
          })
          const worst = allQ.sort((a, b) => a.score - b.score).slice(0, 3)
          if (worst.length === 0) return null
          return (
            <div className="card" style={{ marginBottom: 24, padding: '20px 24px' }}>
              <div className="section-eyebrow" style={{ marginBottom: 6 }}>Targeted Findings</div>
              <div className="chart-title" style={{ marginBottom: 4 }}>Lowest-Scoring Questions</div>
              <div className="chart-subtitle" style={{ marginBottom: 16 }}>
                The most specific capability gaps surfaced by this assessment — highest-value areas for follow-up discovery.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {worst.map((q, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    padding: '12px 16px', borderRadius: 8,
                    background: '#FEF2F2', border: '1.5px solid #FECACA',
                  }}>
                    <div style={{
                      minWidth: 32, height: 32, borderRadius: '50%',
                      background: '#DC2626', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>{q.score}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: q.dimColor, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {q.dimName}
                      </div>
                      <div style={{ fontSize: 13, color: '#1E293B', lineHeight: 1.55 }}>{q.text}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                        Score {q.score}/5 — {scaleLabels[q.score]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ── Industry Intelligence ─────────────────────────────────── */}
        <IndustryIntelligenceCard industry={company.industry} overallScore={overallScore} />

        {/* ── Industry Regulatory Context (always visible) ──────────── */}
        <IndustryRegulatoryContextCard industry={company.industry} />

        {/* ── Compliance urgency flag ───────────────────────────────── */}
        {(() => {
          const cr = getComplianceRisk(company.industry, dimScores)
          if (!cr) return null
          return (
            <div style={{
              background: '#FFF1F2', border: '2px solid #FDA4AF', borderRadius: 10,
              padding: '16px 20px', marginBottom: 24,
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>⚠</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#BE123C', marginBottom: 5 }}>
                  {cr.label}
                </div>
                <div style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 700,
                  color: '#9F1239', background: '#FFE4E6', padding: '2px 8px',
                  borderRadius: 99, marginBottom: 8,
                }}>
                  {cr.regulations}
                </div>
                <div style={{ fontSize: 13, color: '#9F1239', lineHeight: 1.7 }}>
                  {cr.description}
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── Recommendations ────────────────────────────────────────── */}
        <div className="recs-section">
          <div className="recs-header">
            <div className="section-eyebrow">Action Plan</div>
            <h2 className="section-title" style={{ fontSize: 22 }}>Prioritized Recommendations</h2>
            <p className="section-subtitle" style={{ fontSize: 14 }}>
              Ordered by readiness gap — address critical items first for the highest impact.
            </p>
          </div>

          {/* Start-here banner: when 4+ dimensions are in the critical/low tier */}
          {recommendations.filter(r => r.tier === 'low').length >= 4 && (
            <div style={{
              background: '#FFF7ED', border: '1.5px solid #F59E0B',
              borderRadius: 10, padding: '18px 22px', marginBottom: 24,
              display: 'flex', gap: 14,
            }}>
              <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>⚑</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#92400E', marginBottom: 6 }}>
                  Start Here — Sequence Investment Deliberately
                </div>
                <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.65 }}>
                  {recommendations.filter(r => r.tier === 'low').length === 5
                    ? 'All five dimensions require foundational investment. '
                    : `${recommendations.filter(r => r.tier === 'low').length} of 5 dimensions require foundational investment. `
                  }
                  Executing all of these in parallel is not realistic and typically results in stalled programs and frustrated teams.
                  The most effective approach is to sequence: establish <strong>Strategy and executive sponsorship first</strong> (Phase 1),
                  then invest in <strong>Data and Governance in parallel</strong> (Phase 2), then <strong>Operations</strong> (Phase 3),
                  then <strong>organization-wide enablement</strong> (Phase 4).
                  Each phase creates the conditions the next one depends on.
                </div>
              </div>
            </div>
          )}

          {recommendations.map((rec, idx) => {
            const isSustain     = rec.tier === 'sustain'
            const priorityClass = `priority-${rec.priority.toLowerCase()}`
            const dimNotes      = notes[rec.dimensionId]
            const dimConf       = confidence[rec.dimensionId]
            const confMeta      = dimConf ? CONFIDENCE_META[dimConf] : null
            const meta          = dimMeta[rec.dimensionId]
            const hasDk         = meta?.dkCount > 0
            return (
              <div key={rec.dimensionId} className={`rec-card${isSustain ? ' rec-card--sustain' : ''}`}>
                <div className="rec-card-border" style={{ background: isSustain ? '#10B981' : rec.dimensionColor }} />
                <div style={{ paddingLeft: 16 }}>
                  <div className="rec-card-top">
                    <div>
                      <div className="rec-card-dimension">
                        {dimIcons[rec.dimensionId]} {rec.dimensionName}
                        {/* Visibility chip */}
                        {meta && (
                          <span className="visibility-chip">
                            {meta.answered}/{meta.total} scored
                            {hasDk && <span style={{ color: '#94A3B8' }}> · {meta.dkCount} DK</span>}
                          </span>
                        )}
                      </div>
                      <div className="rec-card-title">{rec.title}</div>
                    </div>
                    <div className="rec-card-meta">
                      <div className="rec-score-chip">
                        <span style={{ color: getMaturityLevel(rec.score).color }}>●</span>
                        {rec.score}/100
                      </div>
                      {confMeta && (
                        <div className="confidence-badge" style={{ background: confMeta.bg, color: confMeta.color }}>
                          {confMeta.label}
                        </div>
                      )}
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

        {/* ── DK-heavy warning (engagement mode only) ───────────────── */}
        {engagementMode && (() => {
          const dkHeavyDims = dimScores.filter(d => {
            const meta = dimMeta[d.id]
            return meta && meta.total > 0 && (meta.dkCount / meta.total) >= 0.5
          })
          if (!dkHeavyDims.length) return null
          const dimNames = { 1: 'Strategy', 2: 'Data', 3: 'Governance', 4: 'Talent', 5: 'Operations' }
          return (
            <div style={{
              marginBottom: 24,
              padding: '16px 20px',
              background: '#FFFBEB',
              border: '1.5px solid #F59E0B',
              borderRadius: 10,
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#92400E', marginBottom: 6 }}>
                  Low Visibility Warning — Consider Re-interviewing
                </div>
                <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6 }}>
                  The following dimension{dkHeavyDims.length > 1 ? 's have' : ' has'} 50%+ "Don't Know" responses,
                  which may produce unreliable scores. Before saving, consider revisiting these dimensions
                  with a more informed stakeholder:
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {dkHeavyDims.map(d => {
                    const meta = dimMeta[d.id]
                    return (
                      <span key={d.id} style={{
                        padding: '3px 10px',
                        borderRadius: 99,
                        background: '#FEF3C7',
                        border: '1px solid #F59E0B',
                        color: '#92400E',
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {dimNames[d.id]} — {meta.dkCount}/{meta.total} DK
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── Framework Alignment ───────────────────────────────────── */}
        <FrameworkAlignmentCard />

        {/* ── Scoring methodology ────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 24, padding: '20px 24px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 8 }}>METHODOLOGY NOTE</div>
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
            <strong style={{ color: '#1E293B' }}>How scores are calculated:</strong> Each dimension is assessed with 12 questions on a 1–5 scale
            (1 = No capability, 3 = Developing, 5 = Advanced). Scores are normalized to a 0–100 range using the formula{' '}
            <code style={{ background: '#E2E8F0', padding: '1px 5px', borderRadius: 3, fontSize: 12 }}>
              ((sum − n) / (n × 4)) × 100
            </code>
            , where <em>n</em> is the number of answered questions. "Don't Know" responses are excluded from scoring
            and tracked separately as a visibility indicator. The overall score is the unweighted mean of all five
            dimension scores. All scores reflect the consultant's structured assessment of observable organizational
            evidence, not a self-reported survey.
          </div>
        </div>

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
              <button className="btn btn-secondary" onClick={() => setShowDiscard(true)}>
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

    {/* ── Discard confirmation modal ──────────────────────────────────── */}
    {showDiscard && (
      <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="discard-modal-title" onClick={() => setShowDiscard(false)}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-title" id="discard-modal-title">Discard this interview?</div>
          <p className="modal-body">
            The scores, notes, and confidence selections for{' '}
            <strong>{respondentName || 'this respondent'}</strong> will not be
            saved to the engagement.
          </p>
          <p className="modal-body" style={{ color: '#E74C3C' }}>
            This cannot be undone — the interview data will be lost unless you
            already downloaded the JSON backup.
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setShowDiscard(false)}>
              Cancel — Keep reviewing
            </button>
            <button className="btn btn-danger" onClick={onDiscard}>
              Discard Interview
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
