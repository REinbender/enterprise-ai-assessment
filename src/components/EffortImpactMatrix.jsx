// ─────────────────────────────────────────────────────────────────────────────
// Effort × Impact Matrix
//
// Implementation note: this used to be an SVG. html2canvas (used by the
// Composite PDF export) has persistent quirks with SVG elements — when it
// can't resolve the SVG's computed size, it falls back to the intrinsic
// 300×150 default and crops the right side. Rewritten as pure HTML using
// CSS grid for the four quadrants and absolutely-positioned dots for the
// data points. html2canvas handles this layout deterministically and the
// chart now renders full-size regardless of capture context.
// ─────────────────────────────────────────────────────────────────────────────

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

  // Secondary — strategic bets commentary when quick wins exist too
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

// ── Quadrant definitions ─────────────────────────────────────────────────────
// Grid layout: 2 rows × 2 cols. The `key` is used to bucket recs; bg is the
// soft quadrant background, border is its accent colour for the label.
const QUADRANTS = [
  { key: 'quickWins',     row: 0, col: 0, title: 'Quick Wins',     sub: 'Low effort · High impact',  bg: '#EAFAF1', color: '#27AE60' },
  { key: 'strategicBets', row: 0, col: 1, title: 'Strategic Bets', sub: 'High effort · High impact', bg: '#E8F4FD', color: '#2EA3F2' },
  { key: 'considerLater', row: 1, col: 0, title: 'Consider Later', sub: 'Low effort · Low impact',   bg: '#F8F8F8', color: '#999999' },
  { key: 'deprioritize',  row: 1, col: 1, title: 'Deprioritize',   sub: 'High effort · Low impact',  bg: '#FDEDEC', color: '#E74C3C' },
]

/**
 * Effort × Impact Matrix — shared 2×2 prioritization chart
 *
 * Used on ResultsPage (single-session) and CompositeResults (aggregate).
 *
 * Props:
 *   recommendations: array of { dimensionId, dimensionName, dimensionColor, effort (1-5), impact (1-5) }
 *   subtitle: optional override — composite uses aggregate-specific copy
 */
export default function EffortImpactMatrix({ recommendations, subtitle }) {
  if (!recommendations?.length) return null

  const insight = buildMatrixInsight(recommendations)

  // Plot dot coordinates as % within the plot area (effort on x, impact on y).
  // (effort 1 → 0%, effort 5 → 100% ; impact 1 → bottom 0%, impact 5 → top 100%)
  const dotX = (effort) => ((effort - 1) / 4) * 100
  const dotY = (impact) => ((5 - impact) / 4) * 100

  return (
    <div className="card chart-section" style={{ marginBottom: 24 }}>
      <div className="chart-title">Effort × Impact Matrix</div>
      <div className="chart-subtitle">
        {subtitle || 'Prioritize initiatives by quadrant — Quick Wins first, Strategic Bets next'}
      </div>

      {/* Chart frame: y-axis label (left) + plot area (center) + spacer (right) */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 12,
          maxWidth: 560,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* Y-axis label — rotated */}
        <div
          style={{
            width: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap',
              fontSize: 11,
              color: '#555',
              fontWeight: 500,
            }}
          >
            ← Lower Impact · Higher Impact →
          </div>
        </div>

        {/* Plot area — flex 1 so it fills remaining width */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Quadrant grid */}
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              width: '100%',
              aspectRatio: '1.5 / 1',
              border: '1px solid #E2E2E2',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {/* Quadrant backgrounds + labels */}
            {QUADRANTS.map(q => (
              <div
                key={q.key}
                style={{
                  background: q.bg,
                  opacity: 0.7,
                  padding: 12,
                  position: 'relative',
                  borderRight: q.col === 0 ? '1px dashed #CBD5E1' : 'none',
                  borderBottom: q.row === 0 ? '1px dashed #CBD5E1' : 'none',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: q.color, fontSize: 12, fontWeight: 700, opacity: 0.8 }}>{q.title}</div>
                  <div style={{ color: '#999', fontSize: 10, marginTop: 2 }}>{q.sub}</div>
                </div>
              </div>
            ))}

            {/* Dots — absolutely positioned inside the plot area */}
            {recommendations.map((rec) => {
              const left = dotX(rec.effort)
              const top  = dotY(rec.impact)
              return (
                <div
                  key={rec.dimensionId}
                  title={`${rec.dimensionName}: Effort ${rec.effort}/5, Impact ${rec.impact}/5`}
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: rec.dimensionColor,
                    boxShadow: `0 0 0 8px ${rec.dimensionColor}2E`, // soft halo via rgba-like hex
                    zIndex: 2,
                  }}
                />
              )
            })}
          </div>

          {/* X-axis label */}
          <div
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: '#555',
              fontWeight: 500,
              marginTop: 8,
            }}
          >
            ← Lower Effort · Higher Effort →
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 12 }}>
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
