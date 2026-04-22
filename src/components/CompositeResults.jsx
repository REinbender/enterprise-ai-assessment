import { useRef, useState, useEffect } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { getMaturityLevel, dimensions, getRiskProfile, generateNarrative } from '../data/questions'
import { generateRecommendations } from '../data/recommendations'
import { computeComposite, ROLE_GROUP_META, exportEngagement } from '../data/engagement'
import { getIndustryProfile, isGovPhase1Industry, getComplianceRisk } from '../data/industryProfiles'
import IndustryIntelligenceCard from './IndustryIntelligenceCard'
import IndustryRegulatoryContextCard from './IndustryRegulatoryContextCard'
import FrameworkAlignmentCard from './FrameworkAlignmentCard'
import EffortImpactMatrix from './EffortImpactMatrix'
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
  const pct = data.avg != null ? (data.avg / 100) * 100 : 0
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
      <div className="group-bar-score" style={{ color: m.color }}>{data.avg ?? '—'}</div>
      <div className="group-bar-count">n={data.count}</div>
    </div>
  )
}

// ── Perception gap callout ─────────────────────────────────────────────────
const GAP_PAIR_LABELS = {
  exec_vs_pract: ['Executive', 'Practitioner'],
  exec_vs_mgmt:  ['Executive', 'Management'],
  mgmt_vs_pract: ['Management', 'Practitioner'],
}

// Severity-specific interpretation copy
function gapInsight(d, grpA, grpB, keyA) {
  const higherGroup = d.gapDirection?.split('_higher')[0]
  const higher = higherGroup === keyA ? grpA : grpB
  const lower  = higherGroup === keyA ? grpB : grpA
  const mag    = d.gapMagnitude
  const sev    = d.gapSeverity?.level

  if (sev === 'critical') {
    return `${higher} rates this dimension ${mag} points higher than ${lower} — a critical disconnect that goes beyond normal organizational variance. This magnitude of misalignment typically indicates that ${higher.toLowerCase()} leadership and ${lower.toLowerCase()}s are operating with fundamentally different mental models of the organization's AI capability. A dedicated cross-level alignment session is strongly recommended before any investment decisions are made in this area.`
  }
  if (sev === 'severe') {
    return `${higher} rates this dimension ${mag} points higher than ${lower} — a severe misalignment that warrants investigation. This pattern typically reflects either a communication gap (${higher.toLowerCase()} has implemented controls or capabilities that ${lower.toLowerCase()}s are unaware of) or an optimism gap (leadership perceives maturity that practitioners do not experience in practice). Root-cause identification should precede remediation planning.`
  }
  // concerning
  return higherGroup === keyA
    ? `${grpA} rates this dimension ${mag} points higher than ${grpB}. This is a concerning but not uncommon variance — leadership may have visibility into strategy and intent that practitioners don't yet experience in their day-to-day work. Targeted communication or training may close the gap.`
    : `${grpB} rates this dimension ${mag} points higher than ${grpA}. ${grpB} may have closer visibility to operational AI capabilities that leadership hasn't fully recognized or measured. Surfacing these capabilities to leadership is a quick win.`
}

function PerceptionGapCallout({ gaps }) {
  if (!gaps.length) return null

  // Sort by severity: critical first
  const severityOrder = { critical: 0, severe: 1, concerning: 2 }
  const sorted = [...gaps].sort((a, b) =>
    (severityOrder[a.gapSeverity?.level] ?? 9) - (severityOrder[b.gapSeverity?.level] ?? 9)
  )

  const criticalCount   = gaps.filter(d => d.gapSeverity?.level === 'critical').length
  const severeCount     = gaps.filter(d => d.gapSeverity?.level === 'severe').length

  const headerSub = criticalCount
    ? `${criticalCount} dimension${criticalCount > 1 ? 's have' : ' has'} a critical misalignment (40+ points) requiring dedicated alignment work before investment decisions are made.`
    : severeCount
    ? `${severeCount} dimension${severeCount > 1 ? 's show' : ' shows'} severe misalignment (25–40 points) — root-cause investigation is recommended before remediation planning.`
    : `These dimensions show a 15–25 point variance between role groups — concerning but addressable through targeted communication and awareness.`

  return (
    <div className="perception-gap-section">
      <div className="perception-gap-header">
        <span className="perception-gap-icon">⚠</span>
        <div>
          <div className="perception-gap-title">Perception Gap Analysis</div>
          <div className="perception-gap-sub">
            <strong>{sorted.length} dimension{sorted.length !== 1 ? 's' : ''} show{sorted.length === 1 ? 's' : ''} a significant divergence between role groups.</strong>{' '}
            {headerSub}
          </div>
        </div>
      </div>
      {sorted.map(d => {
        const pairKey  = d.gapPair || 'exec_vs_pract'
        const [grpA, grpB] = (GAP_PAIR_LABELS[pairKey] || ['Executive', 'Practitioner'])
        const keyA = grpA.toLowerCase()
        const keyB = grpB.toLowerCase()
        const metaA = ROLE_GROUP_META[keyA]
        const metaB = ROLE_GROUP_META[keyB]
        const sev   = d.gapSeverity
        return (
          <div key={d.dimId} className="perception-gap-item">
            <div className="perception-gap-dim">
              <span>{dimIcons[d.dimId]}</span>
              <span style={{ color: d.color, fontWeight: 600 }}>{d.name}</span>
              <span className="perception-gap-magnitude">{d.gapMagnitude} pt gap</span>
              {sev && (
                <span style={{
                  padding: '2px 8px', borderRadius: 99,
                  background: sev.bg, color: sev.color,
                  fontSize: 11, fontWeight: 700,
                }}>
                  {sev.label}
                </span>
              )}
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({grpA} vs {grpB})</span>
            </div>
            <div className="perception-gap-bars">
              {[{ key: keyA, meta: metaA, label: grpA }, { key: keyB, meta: metaB, label: grpB }].map(({ key, meta, label }) => (
                <div key={key} className="perception-gap-bar-row">
                  <span style={{ color: meta.color, fontSize: 12, width: 96 }}>{label}</span>
                  <div className="pgap-bar-track">
                    <div className="pgap-bar-fill" style={{
                      width: `${d.byGroup[key]?.avg ?? 0}%`,
                      background: meta.color,
                    }} />
                  </div>
                  <span style={{ color: meta.color, fontSize: 13, fontWeight: 700, minWidth: 28 }}>
                    {d.byGroup[key]?.avg ?? '—'}
                  </span>
                </div>
              ))}
            </div>
            <div className="perception-gap-insight">
              {gapInsight(d, grpA, grpB, keyA)}
            </div>
          </div>
        )
      })}
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
        Scores by dimension and role group · ⚠ = perception gap ≥ 15 pts
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
                  <span style={{ fontWeight: 700, color: d.color, fontSize: 15 }}>{d.avg ?? '—'}</span>
                  {d.avg != null && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/100</span>}
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
                    {d.avg == null
                      ? 'No data'
                      : d.stdDev == null
                      ? `n=1 · ${d.avg}`
                      : `±${d.stdDev} · ${d.min}–${d.max}`
                    }
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

// ── Investment sequencing recommendation ──────────────────────────────────
//
// The dependency graph for AI maturity dimensions:
//   Strategy (1) — prerequisite for everything. Without exec sponsorship and
//                  a clear direction, investment in other dimensions stalls.
//   Data (2) + Governance (3) — parallel track after strategy is established.
//                  Data provides the fuel; Governance provides the guardrails.
//                  Neither should significantly outpace the other.
//   Operations (5) — built on top of Data + Governance. MLOps without clean
//                  data or risk controls creates technical debt and exposure.
//   Talent (4) — cross-cutting, but most impactful once there is a delivery
//                  engine to operate. Hiring ahead of strategy/data leads to
//                  attrition as practitioners have nothing to work on.

const DIM_SEQUENCE = [
  { id: 1, phase: 1, label: 'Phase 1 — Foundation',  color: '#7C3AED', bg: '#EDE9FE', why: 'Executive sponsorship and strategic direction are prerequisites for all other investment. Without them, data, governance, and talent initiatives stall due to competing priorities and lack of funding protection.' },
  { id: 2, phase: 2, label: 'Phase 2 — Enablement',  color: '#2563EB', bg: '#DBEAFE', why: 'Data and Governance must develop in parallel — data provides the fuel for AI, governance provides the controls. A significant imbalance in either direction creates risk: uncontrolled deployment or capability-starved programs.' },
  { id: 3, phase: 2, label: 'Phase 2 — Enablement',  color: '#2563EB', bg: '#DBEAFE', why: null },
  { id: 5, phase: 3, label: 'Phase 3 — Delivery',    color: '#059669', bg: '#D1FAE5', why: 'MLOps and operational engineering practices become the focus once the data foundation and governance framework are stable. Building operations before these foundations are in place creates fragile, ungoverned systems.' },
  { id: 4, phase: 4, label: 'Phase 4 — Scale',       color: '#D97706', bg: '#FEF3C7', why: 'This phase covers organization-wide AI enablement: workforce literacy programs, cultural change management, AI Center of Excellence maturity, and enterprise talent infrastructure (career frameworks, learning academies, embedded unit roles). Important distinction: core AI team hiring — the architects, data engineers, and ML engineers who build the platform — is a Phase 2 prerequisite. What scales here is the organization\'s broad capacity to adopt, sustain, and continuously improve AI.' },
]

// Phase status: 'established' = all dims >= 60, 'active' = first phase with a gap, 'pending' = not yet active
function computePhaseStatuses(dimById) {
  const phaseStatuses = {}
  let foundActive = false
  for (let phase = 1; phase <= 4; phase++) {
    const phaseDimIds = DIM_SEQUENCE.filter(d => d.phase === phase).map(d => d.id)
    const scores = phaseDimIds.map(id => dimById[id]?.avg ?? null).filter(s => s !== null)
    if (scores.length === 0) { phaseStatuses[phase] = 'pending'; continue }
    const allEstablished = scores.every(s => s >= 60)
    if (allEstablished) {
      phaseStatuses[phase] = 'established'
    } else if (!foundActive) {
      phaseStatuses[phase] = 'active'
      foundActive = true
    } else {
      phaseStatuses[phase] = 'pending'
    }
  }
  return phaseStatuses
}

const PHASE_STATUS_META = {
  established: { label: 'Established', color: '#059669', bg: '#D1FAE5', icon: '✓' },
  active:      { label: 'Active Focus', color: '#2563EB', bg: '#DBEAFE', icon: '▶' },
  pending:     { label: 'Pending',      color: '#94A3B8', bg: '#F1F5F9', icon: '○' },
}

function SequencingRecommendation({ composite, industry }) {
  const dimById = Object.fromEntries(composite.dimensions.map(d => [d.dimId, d]))
  const govPhase1 = isGovPhase1Industry(industry)
  const industryProfile = industry ? getIndustryProfile(industry) : null

  // Build effective sequence — for regulated industries, move Governance to Phase 1
  const effectiveSequence = govPhase1
    ? [
        { id: 1, phase: 1, label: 'Phase 1 — Foundation', color: '#7C3AED', bg: '#EDE9FE',
          why: DIM_SEQUENCE.find(d => d.id === 1)?.why },
        { id: 3, phase: 1, label: 'Phase 1 — Foundation', color: '#7C3AED', bg: '#EDE9FE',
          why: industryProfile?.govPhase1Rationale || DIM_SEQUENCE.find(d => d.id === 3)?.why },
        { id: 2, phase: 2, label: 'Phase 2 — Enablement', color: '#2563EB', bg: '#DBEAFE',
          why: 'With Governance established as a regulatory foundation, Data Infrastructure becomes the primary enablement investment — providing the clean, accessible, well-governed data that AI systems require.' },
        { id: 5, phase: 3, label: 'Phase 3 — Delivery', color: '#059669', bg: '#D1FAE5',
          why: DIM_SEQUENCE.find(d => d.id === 5)?.why },
        { id: 4, phase: 4, label: 'Phase 4 — Scale', color: '#D97706', bg: '#FEF3C7',
          why: DIM_SEQUENCE.find(d => d.id === 4)?.why },
      ]
    : DIM_SEQUENCE

  // Detect imbalances that should be called out
  const strat = dimById[1]?.avg ?? null
  const data  = dimById[2]?.avg ?? null
  const gov   = dimById[3]?.avg ?? null
  const ops   = dimById[5]?.avg ?? null
  const tal   = dimById[4]?.avg ?? null

  const imbalances = []
  if (strat !== null && ops !== null && ops > strat + 20)
    imbalances.push('Operations is outpacing Strategy — you are building delivery capability without the strategic direction to guide it.')
  if (data !== null && gov !== null && Math.abs(data - gov) >= 25)
    imbalances.push(`Data (${data}) and Governance (${gov}) are significantly out of balance — these should develop in parallel to avoid ${data > gov ? 'ungoverned deployment risk' : 'governance overhead without the data capability to apply it to'}.`)
  if (ops !== null && data !== null && gov !== null && ops > 50 && (data < 35 || gov < 35))
    imbalances.push('Operations maturity is high but Data or Governance foundations are weak — this is a technical debt and risk accumulation pattern.')
  if (tal !== null && strat !== null && tal > strat + 15 && strat < 40)
    imbalances.push('Talent investment is ahead of Strategy maturity — practitioners may find limited structured work to do, which drives attrition.')

  const phaseStatuses = computePhaseStatuses(dimById)
  const activePhase = Object.entries(phaseStatuses).find(([, s]) => s === 'active')?.[0]
  const establishedCount = Object.values(phaseStatuses).filter(s => s === 'established').length

  return (
    <div className="card" style={{ marginBottom: 24, padding: '24px 28px' }}>
      <div className="section-eyebrow" style={{ marginBottom: 8 }}>Investment Sequencing</div>
      <div className="chart-title" style={{ marginBottom: 4 }}>Recommended Execution Order</div>
      <div className="chart-subtitle" style={{ marginBottom: 16 }}>
        AI maturity dimensions have prerequisite dependencies. Pursuing all five in parallel dilutes resources
        and typically results in stalled programs. The sequence below reflects the dependency graph — each
        phase unlocks the next.
      </div>

      {/* You-are-here summary banner */}
      {activePhase ? (
        <div style={{
          padding: '10px 16px', borderRadius: 8, marginBottom: 20,
          background: '#EFF6FF', border: '1.5px solid #BFDBFE',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <span style={{ fontSize: 18 }}>📍</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1D4ED8' }}>
              You are here: Phase {activePhase}
            </div>
            <div style={{ fontSize: 12, color: '#1E40AF', lineHeight: 1.5, marginTop: 2 }}>
              {establishedCount > 0
                ? `${establishedCount} phase${establishedCount !== 1 ? 's' : ''} established · Phase ${activePhase} is your current focus area · ${4 - parseInt(activePhase)} phase${4 - parseInt(activePhase) !== 1 ? 's' : ''} pending`
                : `Phase ${activePhase} is the recommended starting point based on current scores`
              }
            </div>
          </div>
        </div>
      ) : establishedCount === 4 ? (
        <div style={{
          padding: '10px 16px', borderRadius: 8, marginBottom: 20,
          background: '#F0FDF4', border: '1.5px solid #BBF7D0',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <span style={{ fontSize: 18 }}>🏆</span>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#059669' }}>
            All four phases established — focus shifts to continuous improvement and innovation
          </div>
        </div>
      ) : null}

      {/* Industry-adjusted sequencing notice */}
      {govPhase1 && industryProfile && (
        <div style={{
          padding: '10px 16px', borderRadius: 8, marginBottom: 20,
          background: '#FFF7ED', border: '1.5px solid #FED7AA',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚖</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#C2410C', marginBottom: 3 }}>
              Industry-Adjusted Sequence: Governance elevated to Phase 1
            </div>
            <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
              {industryProfile.govPhase1Rationale}
            </div>
          </div>
        </div>
      )}

      {/* Phase timeline — uses effectiveSequence which may have Governance at Phase 1 */}
      {(() => {
        const phases = [...new Set(effectiveSequence.map(d => d.phase))].sort()
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {phases.map((phase, phaseIdx) => {
              const phaseDims = effectiveSequence.filter(d => d.phase === phase)
              const firstDim  = phaseDims[0]
              const phaseLabel = firstDim.label
              const phaseColor = firstDim.color
              const phaseBg    = firstDim.bg
              // Collect unique why texts for this phase
              const phaseWhys = phaseDims.map(d => d.why).filter(Boolean).filter((w, i, a) => a.indexOf(w) === i)
              const status     = phaseStatuses[phase] || 'pending'
              const statusMeta = PHASE_STATUS_META[status]
              const isActive   = status === 'active'
              const isPending  = status === 'pending'
              const isLast     = phaseIdx === phases.length - 1

              return (
                <div key={phase} style={{ display: 'flex', gap: 0, position: 'relative' }}>
                  {/* Vertical connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: isPending ? '#E2E8F0' : phaseColor,
                      color: isPending ? '#94A3B8' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0, zIndex: 1,
                      boxShadow: isActive ? `0 0 0 3px ${phaseBg}` : 'none',
                    }}>{phase}</div>
                    {!isLast && (
                      <div style={{ width: 2, flex: 1, background: '#E2E8F0', minHeight: 20, marginTop: 2, marginBottom: 2 }} />
                    )}
                  </div>

                  <div style={{
                    paddingLeft: 14, paddingBottom: !isLast ? 20 : 0, flex: 1,
                    opacity: isPending ? 0.6 : 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isPending ? '#94A3B8' : phaseColor }}>
                        {phaseLabel}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                        background: statusMeta.bg, color: statusMeta.color,
                      }}>
                        {statusMeta.icon} {statusMeta.label}
                      </span>
                      {govPhase1 && phaseDims.some(d => d.id === 3) && phase === 1 && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                          background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA',
                        }}>
                          ⚖ Regulatory Prerequisite
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: phaseWhys.length ? 8 : 0 }}>
                      {phaseDims.map(({ id }) => {
                        const d = dimById[id]
                        if (!d) return null
                        const lvl = getMaturityLevel(d.avg)
                        const noData    = d.avg == null
                        const needsWork = !noData && d.avg < 40
                        const onTrack   = !noData && d.avg >= 60
                        return (
                          <div key={id} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 14px',
                            background: noData ? '#F8FAFC' : needsWork ? '#FEF2F2' : onTrack ? '#F0FDF4' : '#F8FAFC',
                            border: `1.5px solid ${noData ? '#E2E8F0' : needsWork ? '#FECACA' : onTrack ? '#BBF7D0' : '#E2E8F0'}`,
                            borderRadius: 8,
                          }}>
                            <span style={{ fontSize: 18 }}>{dimIcons[id]}</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: d.color }}>{d.shortName}</div>
                              <div style={{ fontSize: 12, color: noData ? 'var(--text-muted)' : lvl.color, fontWeight: 600 }}>
                                {noData ? 'No data' : `${d.avg}/100 · ${lvl.label}`}
                              </div>
                            </div>
                            {needsWork && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '2px 6px', borderRadius: 4 }}>
                                GAP
                              </span>
                            )}
                            {onTrack && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#D1FAE5', padding: '2px 6px', borderRadius: 4 }}>
                                ✓
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {phaseWhys.map((why, wi) => (
                      <div key={wi} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic', marginTop: wi > 0 ? 6 : 0 }}>
                        {why}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* Imbalance callouts */}
      {imbalances.length > 0 && (
        <div style={{
          marginTop: 20, padding: '14px 16px',
          background: '#FFFBEB', border: '1.5px solid #F59E0B', borderRadius: 8,
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#92400E', marginBottom: 8 }}>
            Sequencing Imbalances Detected
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {imbalances.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#78350F', lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>•</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main composite results page ────────────────────────────────────────────
// ── Technical Sandbox Tests ────────────────────────────────────────────────
const SANDBOX_TESTS = [
  {
    id: 1,
    name: '"Data Swamp" RAG Stress Test',
    description: 'Ingest 5–10 of the client\'s most complex unstructured PDFs into Azure AI Search. Measures Hallucination Rate and Retrieval Accuracy.',
    metrics: ['Hallucination Rate', 'Retrieval Accuracy'],
  },
  {
    id: 2,
    name: '"Copilot vs. Custom" Performance Benchmark',
    description: 'Run standardized high-complexity prompts through both M365 Copilot and a custom Azure OpenAI GPT-X instance. Validates the decision matrix.',
    metrics: ['Token Cost', 'Latency (Time to First Token)', 'Rate Limits (TPM/RPM)'],
  },
  {
    id: 3,
    name: 'Guardrail & Content Safety Probe',
    description: 'Execute Red-Teaming diagnostic probes (prompt injections, jailbreak attempts) against the sandbox environment. Identifies if security configurations are functional.',
    metrics: ['Content Safety Filter Effectiveness', 'Jailbreak Detection Rate'],
  },
  {
    id: 4,
    name: 'Infra & FinOps Audit (The "APIM" Check)',
    description: 'Audit Azure tenant API Management (APIM) configuration, VNET routing, and cost-control tags. Prevents "Day 1" failures in production rollout.',
    metrics: ['Rate-Limiting Bottlenecks', 'Configuration Gaps'],
  },
]

const DEFAULT_SANDBOX = SANDBOX_TESTS.map(t => ({ id: t.id, observations: '', results: '' }))

function SandboxSection({ sandboxResults, onChange }) {
  const results = sandboxResults?.length === 4 ? sandboxResults : DEFAULT_SANDBOX

  return (
    <div className="sandbox-section">
      <div className="sandbox-header">
        <div className="section-eyebrow">Empirical GenAI Diagnostic</div>
        <h2 className="section-title" style={{ fontSize: 22 }}>Technical Sandbox Micro-Tests</h2>
        <p className="section-subtitle" style={{ fontSize: 14 }}>
          Results from a 10-day GenAI Technical Architect deployment into a designated Azure Sandbox.
          Four micro-tests capture hard telemetry and baseline the environment's performance.
        </p>
      </div>

      <div className="sandbox-tests">
        {SANDBOX_TESTS.map((test, i) => {
          const result = results.find(r => r.id === test.id) || { observations: '', results: '' }
          return (
            <div key={test.id} className="sandbox-test-card">
              <div className="sandbox-test-num">{test.id}</div>
              <div className="sandbox-test-body">
                <div className="sandbox-test-name">{test.name}</div>
                <div className="sandbox-test-desc">{test.description}</div>
                <div className="sandbox-metrics">
                  <span className="sandbox-metrics-label">Key Telemetry:</span>
                  {test.metrics.map(m => (
                    <span key={m} className="sandbox-metric-chip">{m}</span>
                  ))}
                </div>
                <div className="sandbox-inputs">
                  <div className="sandbox-input-group">
                    <label className="sandbox-input-label">Observations</label>
                    <textarea
                      className="sandbox-textarea"
                      placeholder="Enter key observations from this test…"
                      value={result.observations}
                      onChange={e => onChange(test.id, 'observations', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="sandbox-input-group">
                    <label className="sandbox-input-label">Results / Telemetry</label>
                    <textarea
                      className="sandbox-textarea"
                      placeholder="Enter specific metrics and results (e.g. 40% hallucination rate, 2.3s TTFT)…"
                      value={result.results}
                      onChange={e => onChange(test.id, 'results', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="sandbox-why">
        <div className="sandbox-why-title">Why This Matters</div>
        <div className="sandbox-why-items">
          <div className="sandbox-why-item">
            <span className="sandbox-why-icon">🔬</span>
            <div><strong>Moves Past the Architecture Bottleneck</strong> — Hard data eliminates debates about "best practices" and replaces them with current realities.</div>
          </div>
          <div className="sandbox-why-item">
            <span className="sandbox-why-icon">💰</span>
            <div><strong>Unlocks Microsoft ECIF Funding</strong> — Specific Azure consumption blockers (rate limits, high latency) make a compelling case for Phase 2 investment.</div>
          </div>
          <div className="sandbox-why-item">
            <span className="sandbox-why-icon">🎯</span>
            <div><strong>Protects Productivity Goals</strong> — Ensures the foundation is solid enough to support the mandated efficiency targets before scaling begins.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Action plan commitment widget (per rec card) ──────────────────────────
function ActionPlanCommitment({ dimId, dimColor, recTitle, value, onChange }) {
  const committed = value?.committed || false

  return (
    <div style={{
      marginTop: 16, borderTop: '1px solid #E2E8F0', paddingTop: 14,
    }}>
      {/* Commit toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: committed ? 14 : 0 }}>
        <button
          onClick={() => onChange({ ...value, committed: !committed })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
            border: `1.5px solid ${committed ? dimColor : '#CBD5E1'}`,
            background: committed ? dimColor : 'white',
            color: committed ? 'white' : '#64748B',
            fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
          }}
        >
          <span>{committed ? '✓' : '○'}</span>
          {committed ? 'Committed to this dimension' : 'Commit to this dimension'}
        </button>
        {committed && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Fields below will appear in the Action Plan summary
          </span>
        )}
      </div>

      {/* Detail fields — only shown when committed */}
      {committed && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Owner / Accountable Party
            </label>
            <input
              type="text"
              placeholder="e.g. VP of Data, CDAO, IT Director…"
              value={value?.owner || ''}
              onChange={e => onChange({ ...value, owner: e.target.value })}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6,
                border: '1px solid #CBD5E1', fontSize: 12,
                color: 'var(--text-primary)', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Target Completion
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 2025, Within 90 days…"
              value={value?.targetDate || ''}
              onChange={e => onChange({ ...value, targetDate: e.target.value })}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6,
                border: '1px solid #CBD5E1', fontSize: 12,
                color: 'var(--text-primary)', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Commitment Notes <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional — specific actions, dependencies, or constraints)</span>
            </label>
            <textarea
              placeholder="e.g. Starting with the data quality audit in Q2; blocked on budget approval until board meeting…"
              value={value?.customNote || ''}
              onChange={e => onChange({ ...value, customNote: e.target.value })}
              rows={2}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6,
                border: '1px solid #CBD5E1', fontSize: 12,
                color: 'var(--text-primary)', boxSizing: 'border-box',
                fontFamily: 'inherit', resize: 'vertical',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Action plan summary card (shown when any commitment exists) ───────────
function ActionPlanSummaryCard({ recommendations, actionPlan, company }) {
  const committed = recommendations.filter(r => actionPlan?.[r.dimensionId]?.committed)
  if (committed.length === 0) return null

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="card" style={{ marginBottom: 24, padding: '24px 28px', border: '2px solid #2EA3F2' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="section-eyebrow" style={{ marginBottom: 6 }}>Committed Action Plan</div>
          <h3 className="chart-title" style={{ margin: 0 }}>
            {company.name ? `${company.name} — ` : ''}AI Readiness Commitments
          </h3>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {committed.length} of 5 dimensions committed · Generated {today}
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 8, background: '#F0F9FF',
          border: '1px solid #BAE6FD', fontSize: 12, fontWeight: 700, color: '#0369A1',
        }}>
          {committed.length} Active Commitment{committed.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr',
          padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px 6px 0 0',
          border: '1px solid #E2E8F0', borderBottom: 'none',
          fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <span>Dimension / Recommendation</span>
          <span>Owner</span>
          <span>Target</span>
          <span>Notes</span>
        </div>

        {committed.map((rec, i) => {
          const plan = actionPlan[rec.dimensionId]
          const isLast = i === committed.length - 1
          return (
            <div key={rec.dimensionId} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr',
              padding: '12px 12px', alignItems: 'start',
              border: '1px solid #E2E8F0',
              borderRadius: isLast ? '0 0 6px 6px' : 0,
              borderTop: i === 0 ? '1px solid #E2E8F0' : 'none',
              background: i % 2 === 0 ? 'white' : '#FAFBFC',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: rec.dimensionColor, marginBottom: 2 }}>
                  {rec.dimensionName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{rec.title}</div>
                <div style={{
                  display: 'inline-block', marginTop: 4,
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
                  background: rec.tier === 'low' ? '#FEE2E2' : rec.tier === 'medium' ? '#FEF3C7' : '#D1FAE5',
                  color: rec.tier === 'low' ? '#991B1B' : rec.tier === 'medium' ? '#92400E' : '#065F46',
                }}>
                  {rec.priority}
                </div>
              </div>
              <div style={{ fontSize: 12, color: plan?.owner ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: plan?.owner ? 'normal' : 'italic' }}>
                {plan?.owner || 'Not assigned'}
              </div>
              <div style={{ fontSize: 12, color: plan?.targetDate ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: plan?.targetDate ? 'normal' : 'italic' }}>
                {plan?.targetDate || 'Not set'}
              </div>
              <div style={{ fontSize: 12, color: plan?.customNote ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: plan?.customNote ? 'normal' : 'italic' }}>
                {plan?.customNote || '—'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Uncommitted dims reminder */}
      {committed.length < 5 && (
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 6,
          background: '#FFFBEB', border: '1px solid #FDE68A',
          fontSize: 12, color: '#92400E',
        }}>
          {5 - committed.length} dimension{5 - committed.length !== 1 ? 's' : ''} not yet committed —
          scroll down to the recommendation cards below to add commitments for remaining dimensions.
        </div>
      )}
    </div>
  )
}

export default function CompositeResults({ engagement, onBack, onUpdateEngagement }) {
  const radarRef   = useRef(null)
  const contentRef = useRef(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const actionPlan = engagement.actionPlan || {}
  const handleActionPlanChange = (dimId, value) => {
    if (!onUpdateEngagement) return
    onUpdateEngagement({ ...engagement, actionPlan: { ...actionPlan, [dimId]: value } })
  }

  const radarData = composite.dimensions
    .filter(d => d.avg != null)
    .map(d => ({
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
          <div style={{ textAlign: 'right' }}>
            <div className="maturity-badge" style={{ background: maturity.bg, color: maturity.color }}>
              <span>●</span> {maturity.label} Maturity
            </div>
            {maturity.context && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, maxWidth: 300, lineHeight: 1.5 }}>
                {maturity.context}
              </div>
            )}
          </div>
        </div>

        {/* ── Executive narrative ───────────────────────────────────────── */}
        {(() => {
          const narrativeDimMeta = {}
          composite.dimensions.forEach(d => {
            const dkCount = Math.round((d.dkRate / 100) * composite.sessionCount)
            narrativeDimMeta[d.dimId] = { total: composite.sessionCount, dkCount }
          })
          const sentences = generateNarrative(company, composite.asDimScores, composite.overallAvg, narrativeDimMeta)
          if (!sentences || sentences.length === 0) return null
          return (
            <div className="card" style={{ marginBottom: 24, padding: '24px 28px' }}>
              <div className="section-eyebrow" style={{ marginBottom: 8 }}>Executive Summary</div>
              <div className="chart-title" style={{ marginBottom: 12 }}>Composite Findings Narrative</div>
              <div style={{
                fontSize: 12, color: 'var(--text-muted)', marginBottom: 16,
                padding: '6px 12px', background: '#F8FAFC', borderRadius: 6,
                display: 'inline-flex', gap: 6, alignItems: 'center',
              }}>
                <span>👥</span>
                <span>
                  Based on {composite.sessionCount} interview{composite.sessionCount !== 1 ? 's' : ''} across{' '}
                  {[
                    composite.roleCounts.executive > 0 && `${composite.roleCounts.executive} executive${composite.roleCounts.executive !== 1 ? 's' : ''}`,
                    composite.roleCounts.management > 0 && `${composite.roleCounts.management} management`,
                    composite.roleCounts.practitioner > 0 && `${composite.roleCounts.practitioner} practitioner${composite.roleCounts.practitioner !== 1 ? 's' : ''}`,
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sentences.map((s, i) => (
                  <p key={i} style={{
                    fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)', margin: 0,
                    paddingLeft: 16, borderLeft: `3px solid ${i === 0 ? maturity.color : '#E2E8F0'}`,
                  }}>
                    {s}
                  </p>
                ))}
              </div>
            </div>
          )
        })()}

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
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                </svg>
              )
            })()}
            <div className="score-ring-center">
              <div className="score-ring-value" style={{ fontSize: 34, color: maturity.color }}>{composite.overallAvg}</div>
              <div className="score-ring-label">out of 100</div>
            </div>
          </div>
          <div className="score-summary-content">
            <div className="score-summary-headline">
              Composite Score: {composite.overallAvg}/100
            </div>
            <div className="score-summary-meta">
              {composite.dimensions.map(d => (
                <div key={d.dimId} className="score-meta-item">
                  <div className="score-meta-value" style={{ color: d.color }}>{d.avg ?? '—'}</div>
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
        {composite.singleRoleGroup && (
          <div style={{
            marginBottom: 20, padding: '12px 16px', borderRadius: 8,
            background: '#F8FAFC', border: '1.5px solid #CBD5E1',
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#475569', marginBottom: 3 }}>
                Perception Gap Analysis Not Available
              </div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
                All respondents in this engagement belong to the same role group. Perception gap analysis requires responses from at least two distinct groups (Executive, Management, Practitioner). The absence of gaps here reflects limited role diversity in the sample — not organizational alignment.
              </div>
            </div>
          </div>
        )}
        <PerceptionGapCallout gaps={composite.perceptionGapDimensions} />
        <LowVisibilityCallout dims={composite.lowVisibilityDimensions} />

        {/* ── Risk profile callout ──────────────────────────────────────── */}
        {(() => {
          const risk = getRiskProfile(composite.dimensions.map(d => ({ id: d.dimId, score: d.avg })))
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
                <div className="dim-score-value">{d.avg ?? '—'}{d.avg != null && <span>/100</span>}</div>
                <div className="dim-score-bar-track">
                  <div className="dim-score-bar-fill" style={{ width: `${d.avg ?? 0}%`, background: d.color }} />
                </div>
                <div className="dim-score-maturity" style={{ color: lvl.color }}>{lvl.label}</div>
                {/* Role group bars */}
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['executive', 'management', 'practitioner'].map(g => (
                    <GroupBar key={g} group={g} data={d.byGroup[g]} baseline={d.avg} />
                  ))}
                </div>
                {d.perceptionGap && d.gapSeverity && (
                  <div className="dim-gap-badge" style={{
                    background: d.gapSeverity.bg,
                    color: d.gapSeverity.color,
                    borderColor: d.gapSeverity.color,
                  }}>
                    ⚠ {d.gapMagnitude}pt · {d.gapSeverity.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Radar chart ───────────────────────────────────────────────── */}
        <div className="card chart-section" style={{ marginBottom: 24 }}>
          <div className="chart-title">Composite Readiness Profile</div>
          <div className="chart-subtitle">
            Aggregate score across {radarData.length < 5 ? `${radarData.length} of 5` : 'all 5'} dimensions (0–100 scale)
            {radarData.length < 5 && (
              <span style={{ marginLeft: 8, color: '#94A3B8', fontSize: 11 }}>
                · {5 - radarData.length} dimension{5 - radarData.length !== 1 ? 's' : ''} excluded (no data)
              </span>
            )}
          </div>
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

        {/* ── Lowest-scoring questions ──────────────────────────────────── */}
        {(() => {
          const allQ = []
          composite.dimensions.forEach(d => {
            const dimDef = dimensions.find(dd => dd.id === d.dimId)
            if (!dimDef) return
            d.qAvgs.forEach((qa, qi) => {
              if (qa.avg === null) return
              allQ.push({
                dimName: d.shortName, dimColor: d.color,
                text: dimDef.questions[qi]?.text || '',
                avg: qa.avg, dkRate: qa.dkRate,
              })
            })
          })
          const worst = allQ.sort((a, b) => a.avg - b.avg).slice(0, 3)
          if (worst.length === 0) return null
          return (
            <div className="card" style={{ marginBottom: 24, padding: '20px 24px' }}>
              <div className="section-eyebrow" style={{ marginBottom: 6 }}>Targeted Findings</div>
              <div className="chart-title" style={{ marginBottom: 4 }}>Lowest-Scoring Questions</div>
              <div className="chart-subtitle" style={{ marginBottom: 16 }}>
                The most specific capability gaps surfaced across all respondents — highest-value areas for focused follow-up and detailed discovery.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {worst.map((q, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    padding: '12px 16px', borderRadius: 8,
                    background: '#FEF2F2', border: '1.5px solid #FECACA',
                  }}>
                    <div style={{
                      minWidth: 36, height: 36, borderRadius: '50%',
                      background: '#DC2626', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, flexShrink: 0, flexDirection: 'column', lineHeight: 1.1,
                    }}>
                      <span>{q.avg.toFixed(1)}</span>
                      <span style={{ fontSize: 9, opacity: 0.8 }}>/5</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: q.dimColor, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {q.dimName}
                        {q.dkRate > 0 && (
                          <span style={{ color: '#94A3B8', fontWeight: 400, marginLeft: 6, textTransform: 'none' }}>
                            · {q.dkRate}% don't know
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: '#1E293B', lineHeight: 1.55 }}>{q.text}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                        Avg {q.avg.toFixed(1)}/5 across {composite.sessionCount} respondents
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ── Industry Intelligence ─────────────────────────────────────── */}
        <IndustryIntelligenceCard industry={company.industry} overallScore={composite.overallAvg} />

        {/* ── Industry Regulatory Context (always visible) ──────────────── */}
        <IndustryRegulatoryContextCard industry={company.industry} />

        {/* ── Compliance urgency flag ───────────────────────────────────── */}
        {(() => {
          const cr = getComplianceRisk(company.industry, composite.dimensions.map(d => ({ id: d.dimId, score: d.avg })))
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

        {/* ── Investment sequencing ─────────────────────────────────────── */}
        <SequencingRecommendation composite={composite} industry={company.industry} />

        {/* ── Effort × Impact Matrix ────────────────────────────────────── */}
        <EffortImpactMatrix
          recommendations={recommendations.filter(r => r.tier !== 'sustain')}
          subtitle={`Prioritize initiatives across ${composite.sessionCount} respondent${composite.sessionCount !== 1 ? 's' : ''} — Quick Wins first, Strategic Bets next`}
        />

        {/* ── Composite recommendations ─────────────────────────────────── */}
        <div className="recs-section">
          <div className="recs-header">
            <div className="section-eyebrow">Composite Action Plan</div>
            <h2 className="section-title" style={{ fontSize: 22 }}>Prioritized Recommendations</h2>
            <p className="section-subtitle" style={{ fontSize: 14 }}>
              Based on aggregate scores across {composite.sessionCount} respondents. Ordered by readiness gap.
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
                  Each phase creates the conditions the next one depends on. See the Investment Sequencing framework above for the full dependency map.
                </div>
              </div>
            </div>
          )}

          {/* Action plan summary — shows when any commitments exist */}
          <ActionPlanSummaryCard
            recommendations={recommendations}
            actionPlan={actionPlan}
            company={company}
          />

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

                  <ActionPlanCommitment
                    dimId={rec.dimensionId}
                    dimColor={rec.dimensionColor}
                    recTitle={rec.title}
                    value={actionPlan[rec.dimensionId]}
                    onChange={(val) => handleActionPlanChange(rec.dimensionId, val)}
                  />
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

        {/* ── Technical Sandbox ─────────────────────────────────────────── */}
        <SandboxSection
          sandboxResults={engagement.sandboxResults}
          onChange={(testId, field, value) => {
            if (!onUpdateEngagement) return
            const current = engagement.sandboxResults?.length === 4
              ? engagement.sandboxResults
              : DEFAULT_SANDBOX
            const updated = current.map(r => r.id === testId ? { ...r, [field]: value } : r)
            onUpdateEngagement({ ...engagement, sandboxResults: updated })
          }}
        />

        {/* ── Framework Alignment ───────────────────────────────────────── */}
        <FrameworkAlignmentCard />

        {/* ── Scoring methodology ───────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 24, padding: '20px 24px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 8 }}>METHODOLOGY NOTE</div>
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
            <strong style={{ color: '#1E293B' }}>How scores are calculated:</strong> Each dimension is assessed with 12 questions on a 1–5 scale
            (1 = No capability, 3 = Developing, 5 = Advanced). Scores are normalized to a 0–100 range using the formula{' '}
            <code style={{ background: '#E2E8F0', padding: '1px 5px', borderRadius: 3, fontSize: 12 }}>
              ((sum − n) / (n × 4)) × 100
            </code>
            , where <em>n</em> is the number of answered questions. "Don't Know" responses are excluded from scoring
            and tracked separately as a visibility indicator. Composite scores are the unweighted mean of individual
            respondent dimension scores. Perception gaps are flagged when any two role groups diverge by 20+ points
            on the same dimension. All scores reflect consultants' structured assessment of observable organizational
            evidence across {composite.sessionCount} respondent{composite.sessionCount !== 1 ? 's' : ''}.
          </div>
        </div>

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

      {/* ── Scroll-to-top FAB ─────────────────────────────────────────── */}
      {showScrollTop && (
        <button
          className="scroll-top-fab"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          title="Back to top"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  )
}
