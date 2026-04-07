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

export default function ResultsPage({ company, answers, onRestart }) {
  const radarRef = useRef(null)

  const dimScores     = computeDimensionScores(answers)
  const overallScore  = computeOverallScore(dimScores)
  const maturity      = getMaturityLevel(overallScore)
  const recommendations = generateRecommendations(dimScores)
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
            <h1 className="results-title">AI Readiness Assessment Results</h1>
            <p className="results-subtitle">
              Based on {totalAnswered} responses across 5 dimensions
            </p>
            <div className="results-date">{today}</div>
            {(company.respondentName || company.respondentRole) && (
              <div className="results-respondent">
                Completed by{company.respondentName ? ` ${company.respondentName}` : ''}
                {company.respondentRole ? ` · ${company.respondentRole}` : ''}
                {' '}· Self-reported; validate with multi-stakeholder consensus
              </div>
            )}
          </div>

          <div className="results-header-actions">
            <PDFExportButton
              company={company}
              answers={answers}
              radarChartRef={radarRef}
            />
            <button className="btn btn-secondary" onClick={onRestart}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Retake
            </button>
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

                  <div className="rec-actions-title">Recommended Actions</div>
                  <ul className="rec-actions-list">
                    {rec.actions.map((action, ai) => (
                      <li key={ai} className="rec-action-item">
                        <div className="rec-action-dot" style={{ background: rec.dimensionColor }} />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Methodology note ──────────────────────────────────────── */}
        <div style={{
          padding: '20px 24px', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 12, marginBottom: 32,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            Assessment Methodology
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Scores are calculated by normalizing responses on a 0–100 scale across 12 behaviorally-anchored
            questions per dimension (1 = No capability → 0 pts, 5 = Advanced → 100 pts). The overall score
            is the unweighted average of all five dimension scores. This assessment reflects self-reported maturity
            at a single point in time and should be supplemented with multi-stakeholder validation and
            domain expert review for strategic decision-making. Responses are stored only in your browser
            and are never transmitted externally.
          </p>
        </div>

        {/* ── Logic2020 CTA ──────────────────────────────────────────── */}
        <div className="cta-section">
          <div className="cta-logo-row">
            <div className="cta-logo-mark">L20</div>
            <span className="cta-logo-text">Logic2020</span>
          </div>
          <h3 className="cta-title">Ready to turn these findings into a roadmap?</h3>
          <p className="cta-desc">
            Logic2020's AI advisory team helps enterprises move from assessment to execution —
            building AI strategies, data foundations, governance frameworks, and the talent
            capabilities needed to scale AI with confidence.
          </p>
          <div className="cta-actions">
            <a
              href="https://www.logic2020.com/contact"
              className="btn-cta-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect with an AI Advisor
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <span className="cta-sub">
              Schedule a complimentary 30-minute debrief to walk through your results with an advisor
            </span>
          </div>
        </div>

        {/* ── Footer actions ─────────────────────────────────────────── */}
        <div className="results-actions">
          <PDFExportButton company={company} answers={answers} radarChartRef={radarRef} />
          <button className="btn btn-primary btn-lg" onClick={onRestart}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Start New Assessment
          </button>
        </div>

      </div>
    </div>
  )
}
