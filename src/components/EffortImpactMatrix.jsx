const QUADRANT_LABELS = [
  { x: 75, y: 12, text: 'Strategic Bets', sub: 'High effort · High impact', color: '#2EA3F2' },
  { x: 25, y: 12, text: 'Quick Wins',     sub: 'Low effort · High impact',  color: '#27AE60' },
  { x: 25, y: 62, text: 'Consider Later', sub: 'Low effort · Low impact',   color: '#999999' },
  { x: 75, y: 62, text: 'Deprioritize',   sub: 'High effort · Low impact',  color: '#E74C3C' },
]

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

  return (
    <div className="card chart-section" style={{ marginBottom: 24 }}>
      <div className="chart-title">Effort × Impact Matrix</div>
      <div className="chart-subtitle">
        {subtitle || 'Prioritize initiatives by quadrant — Quick Wins first, Strategic Bets next'}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
          {/* Quadrant backgrounds */}
          <rect x={PAD.left} y={PAD.top}  width={cW / 2} height={cH / 2} fill="#EAFAF1" opacity={0.7} />
          <rect x={midX}     y={PAD.top}  width={cW / 2} height={cH / 2} fill="#E8F4FD" opacity={0.7} />
          <rect x={PAD.left} y={midY}     width={cW / 2} height={cH / 2} fill="#F8F8F8" opacity={0.7} />
          <rect x={midX}     y={midY}     width={cW / 2} height={cH / 2} fill="#FDEDEC" opacity={0.7} />

          {/* Grid lines */}
          <line x1={PAD.left} y1={midY}  x2={PAD.left + cW} y2={midY}        stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={midX}     y1={PAD.top} x2={midX}          y2={PAD.top + cH} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 3" />

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
                <circle cx={cx} cy={cy} r={7}  fill={rec.dimensionColor} />
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
