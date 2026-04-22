const QUADRANT_LABELS = [
  { x: 75, y: 12, text: 'Strategic Bets', sub: 'High effort · High impact', color: '#2EA3F2' },
  { x: 25, y: 12, text: 'Quick Wins',     sub: 'Low effort · High impact',  color: '#27AE60' },
  { x: 25, y: 62, text: 'Consider Later', sub: 'Low effort · Low impact',   color: '#999999' },
  { x: 75, y: 62, text: 'Deprioritize',   sub: 'High effort · Low impact',  color: '#E74C3C' },
]

// Bucket a recommendation into its quadrant based on effort/impact (1–5 scale).
// Midpoint is 3 — strictly below is "low", 3 or above is "high" on each axis.
// Exported so the PDF renderer can generate the same insight text.
export function quadrantOf(rec) {
  const highImpact = rec.impact >= 3
  const highEffort = rec.effort >= 3
  if (highImpact && !highEffort) return 'quickWins'
  if (highImpact &&  highEffort) return 'strategicBets'
  if (!highImpact && !highEffort) return 'considerLater'
  return 'deprioritize'
}

// Build a short, dynamic interpretation of the matrix. Exported so the PDF
// drawing routine can render the same text.
export function buildMatrixInsight(recommendations) {
  if (!recommendations?.length) return null

  const buckets = { quickWins: [], strategicBets: [], considerLater: [], deprioritize: [] }
  recommendations.forEach(r => { buckets[quadrantOf(r)].push(r) })

  // Lead sentence — what should the consultant do first?
  let lead
  if (buckets.quickWins.length) {
    const names = buckets.quickWins.map(r => r.dimensionName).join(', ')
    lead = `Start with ${buckets.quickWins.length === 1 ? 'the Quick Win' : `${buckets.quickWins.length} Quick Wins`} — ${names}. These offer meaningful impact without heavy investment and build internal credibility for larger AI initiatives.`
  } else if (buckets.strategicBets.length) {
    const names = buckets.strategicBets.map(r => r.dimensionName).join(', ')
    lead = `No Quick Wins emerged from this assessment. The path forward is through Strategic Bets — ${names} — which will require sustained executive commitment but have the highest long-term payoff.`
  } else {
    lead = 'No high-impact opportunities surfaced in this assessment. Focus on foundational discovery and capability building before committing to specific AI investments.'
  }

  // Secondary signal — strategic bets commentary when quick wins exist too
  let secondary = null
  if (buckets.quickWins.length && buckets.strategicBets.length) {
    const names = buckets.strategicBets.map(r => r.dimensionName).join(', ')
    secondary = `Sequence ${buckets.strategicBets.length === 1 ? 'the Strategic Bet' : `${buckets.strategicBets.length} Strategic Bets`} (${names}) behind the Quick Wins — they require larger investment but are the highest-leverage plays once the organization has momentum.`
  }

  // Tertiary — warning if deprioritize-heavy
  let tertiary = null
  if (buckets.deprioritize.length >= 2) {
    const names = buckets.deprioritize.map(r => r.dimensionName).join(', ')
    tertiary = `Defer ${names} — these require significant effort for lower relative impact at current maturity. Revisit after Quick Wins close the foundational gaps.`
  } else if (buckets.considerLater.length && !buckets.quickWins.length && !buckets.strategicBets.length) {
    tertiary = 'All items currently fall below the high-impact threshold — an indicator that foundational maturity work is needed before high-impact AI investments will yield returns.'
  }

  return { lead, secondary, tertiary, buckets }
}

/**
 * Effort × Impact Matrix — shared 2×2 prioritization chart
 *
 * Used on ResultsPage (single-session) and CompositeResults (aggregate) so
 * stakeholders see prioritization visually rather than only as inline E/I
 * badges in the recommendation cards.
 *
 * Props:
 *   recommendations: array of { dimensionId, dimensionName, dimensionColor, effort (1-5), impact (1-5) }
 *   subtitle: optional override — composite uses aggregate-specific copy
 */
export default function EffortImpactMatrix({ recommendations, subtitle }) {
  if (!recommendations?.length) return null

  const W = 480, H = 340
  const PAD = { top: 32, right: 32, bottom: 44, left: 52 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top - PAD.bottom

  const toX = (effort) => PAD.left + ((effort - 1) / 4) * cW
  const toY = (impact) => PAD.top + ((5 - impact) / 4) * cH

  const midX = PAD.left + cW / 2
  const midY = PAD.top + cH / 2

  const insight = buildMatrixInsight(recommendations)

  return (
    <div className="card chart-section" style={{ marginBottom: 24 }}>
      <div className="chart-title">Effort × Impact Matrix</div>
      <div className="chart-subtitle">
        {subtitle || 'Prioritize initiatives by quadrant — Quick Wins first, Strategic Bets next'}
      </div>

      {/* width/height ARE ATTRIBUTES (not CSS) because html2canvas falls back to
          the SVG's intrinsic size (~300×150 default) when sizing is CSS-only,
          producing a shrunken/partial render in the PDF. viewBox preserves the
          internal coordinate system; maxWidth:100% lets the chart shrink on
          narrow screens without affecting what html2canvas captures. */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
      >
        {/* Quadrant backgrounds */}
        <rect x={PAD.left} y={PAD.top}  width={cW / 2} height={cH / 2} fill="#EAFAF1" opacity={0.7} />
        <rect x={midX}     y={PAD.top}  width={cW / 2} height={cH / 2} fill="#E8F4FD" opacity={0.7} />
        <rect x={PAD.left} y={midY}     width={cW / 2} height={cH / 2} fill="#F8F8F8" opacity={0.7} />
        <rect x={midX}     y={midY}     width={cW / 2} height={cH / 2} fill="#FDEDEC" opacity={0.7} />

        {/* Grid lines */}
        <line x1={PAD.left} y1={midY}   x2={PAD.left + cW} y2={midY}        stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={midX}     y1={PAD.top} x2={midX}          y2={PAD.top + cH} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />

        {/* Border */}
        <rect x={PAD.left} y={PAD.top} width={cW} height={cH} fill="none" stroke="#E2E2E2" strokeWidth={1} />

        {/* Quadrant labels — coordinates relative to SVG viewBox, not the container */}
        {QUADRANT_LABELS.map((q, i) => {
          const lx = PAD.left + (q.x / 100) * cW
          const ly = PAD.top  + (q.y / 100) * cH
          return (
            <g key={i}>
              <text
                x={lx}
                y={ly}
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
                x={lx}
                y={ly + 14}
                textAnchor="middle"
                fill="#999"
                fontSize={9}
                fontFamily="Open Sans, sans-serif"
              >
                {q.sub}
              </text>
            </g>
          )
        })}

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
              <circle cx={cx} cy={cy} r={7}  fill={rec.dimensionColor} />
              <title>{rec.dimensionName}: Effort {rec.effort}/5, Impact {rec.impact}/5</title>
            </g>
          )
        })}
      </svg>

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

      {/* Insights — dynamic interpretation of the quadrant distribution */}
      {insight && (
        <div
          style={{
            marginTop: 18,
            padding: '14px 16px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#64748B',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            What this tells you
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>{insight.lead}</strong></div>
            {insight.secondary && <div>{insight.secondary}</div>}
            {insight.tertiary && <div>{insight.tertiary}</div>}
          </div>

          {/* Quadrant summary counts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
            {[
              { key: 'quickWins',     label: 'Quick Wins',     color: '#065F46', bg: '#D1FAE5' },
              { key: 'strategicBets', label: 'Strategic Bets', color: '#1E40AF', bg: '#DBEAFE' },
              { key: 'considerLater', label: 'Consider Later', color: '#475569', bg: '#F1F5F9' },
              { key: 'deprioritize',  label: 'Deprioritize',   color: '#991B1B', bg: '#FEE2E2' },
            ].map(q => {
              const n = insight.buckets[q.key].length
              if (!n) return null
              return (
                <span
                  key={q.key}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 99,
                    background: q.bg,
                    color: q.color,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {q.label}: {n}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
