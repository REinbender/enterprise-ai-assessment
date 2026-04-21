// ─────────────────────────────────────────────────────────────────────────────
// IndustryIntelligenceCard — D2
//
// Renders on both ResultsPage (single session) and CompositeResults.
// Shows: peer landscape (qualitative), top use cases, regulatory landscape.
//
// NOTE: Numeric benchmark comparisons are intentionally omitted — there is no
// publicly available dataset that maps industry AI readiness to this tool's
// scoring framework. Qualitative positioning is used instead. As Logic2020
// accumulates assessment data, proprietary benchmarks will replace this.
// ─────────────────────────────────────────────────────────────────────────────

import { getIndustryProfile } from '../data/industryProfiles'

const DIM_NAMES  = { 1: 'Strategy', 2: 'Data', 3: 'Governance', 4: 'Talent', 5: 'Operations' }
const DIM_COLORS = { 1: '#2EA3F2', 2: '#0EA5E9', 3: '#8B5CF6', 4: '#F59E0B', 5: '#10B981' }

// Maturity tier pill — maps the string label to a color
const TIER_STYLE = {
  'Beginning':              { bg: '#FEE2E2', color: '#991B1B' },
  'Beginning → Developing': { bg: '#FEF3C7', color: '#92400E' },
  'Developing':             { bg: '#FEF3C7', color: '#92400E' },
  'Developing → Maturing':  { bg: '#FEF9C3', color: '#713F12' },
  'Maturing':               { bg: '#E0F2FE', color: '#0369A1' },
  'Maturing → Advanced':    { bg: '#DBEAFE', color: '#1D4ED8' },
  'Advanced':               { bg: '#D1FAE5', color: '#065F46' },
}

function MaturityTierPill({ tier }) {
  const style = TIER_STYLE[tier] || { bg: '#F1F5F9', color: '#475569' }
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 99,
      background: style.bg, color: style.color,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
    }}>
      {tier}
    </span>
  )
}

export default function IndustryIntelligenceCard({ industry, overallScore }) {
  if (!industry || industry === 'Other') return null
  const profile = getIndustryProfile(industry)
  if (!profile) return null

  const { peerBenchmark, topUseCases, regulations, priorityDimension } = profile
  const priorityDimName  = DIM_NAMES[priorityDimension]
  const priorityDimColor = DIM_COLORS[priorityDimension]

  return (
    <div className="card" style={{ marginBottom: 24, padding: '24px 28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <div className="section-eyebrow" style={{ marginBottom: 6 }}>Industry Intelligence</div>
          <h3 className="chart-title" style={{ margin: 0 }}>{industry}</h3>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Industry landscape · peer maturity · priority use cases · regulatory context
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 8, background: '#F0F9FF',
          border: '1px solid #BAE6FD', fontSize: 11, color: '#0369A1',
          fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          Priority Dimension:&nbsp;
          <span style={{ color: priorityDimColor }}>{priorityDimName}</span>
        </div>
      </div>

      {/* Two-column layout: Peer Landscape + Use Cases */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>

        {/* Peer Landscape */}
        <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 18px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Industry Maturity Landscape
          </div>

          {/* Tier pill */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 8 }}>Typical range:</span>
            <MaturityTierPill tier={peerBenchmark.maturityTier} />
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.65, marginBottom: 12 }}>
            {peerBenchmark.context}
          </div>

          <div style={{
            fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic',
            lineHeight: 1.55, paddingTop: 10, borderTop: '1px solid #E2E8F0',
          }}>
            <strong style={{ fontStyle: 'normal', color: 'var(--text-secondary)' }}>What leaders do differently: </strong>
            {peerBenchmark.leaders}
          </div>

          {/* Future benchmark note */}
          <div style={{
            marginTop: 14, padding: '8px 12px', borderRadius: 6,
            background: '#F0F9FF', border: '1px dashed #BAE6FD',
            fontSize: 11, color: '#0369A1', lineHeight: 1.5,
          }}>
            Numeric benchmark comparison coming soon — Logic2020 is building a proprietary benchmark dataset from completed assessments.
          </div>
        </div>

        {/* Top Use Cases */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Highest-Value AI Use Cases
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topUseCases.map((uc, i) => (
              <div key={i} style={{
                background: '#FAFBFF', border: '1px solid #E2E8F0', borderRadius: 8,
                padding: '10px 14px', borderLeft: `3px solid ${DIM_COLORS[(i % 5) + 1]}`,
              }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)', marginBottom: 3 }}>
                  {uc.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {uc.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regulatory Landscape */}
      {regulations && regulations.length > 0 && (
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Regulatory &amp; Compliance Landscape
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {regulations.map((reg, i) => (
              <div key={i} style={{
                background: '#FFF8F1', border: '1px solid #FED7AA', borderRadius: 8,
                padding: '10px 14px', flex: '1 1 280px',
              }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#C2410C', marginBottom: 4 }}>
                  {reg.name}
                </div>
                <div style={{ fontSize: 11, color: '#78350F', lineHeight: 1.6 }}>
                  {reg.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
