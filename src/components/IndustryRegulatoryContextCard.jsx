import { getIndustryFrameworks } from '../constants/frameworks'

/**
 * Industry Regulatory Context Card
 *
 * Shows the regulatory frameworks that apply to the selected industry — always
 * visible (unlike compliance-risk callouts which only fire on low scores).
 *
 * Renders nothing if the industry has no mapped frameworks (e.g., "Other").
 */

const TIER_META = {
  'Highly Regulated':         { bg: '#FEF2F2', border: '#FECACA', label: '#991B1B' },
  'Regulated (Operational Safety)': { bg: '#FFF7ED', border: '#FED7AA', label: '#9A3412' },
  'Regulated (Safety)':       { bg: '#FFF7ED', border: '#FED7AA', label: '#9A3412' },
  'Regulated (Student Data)': { bg: '#FFF7ED', border: '#FED7AA', label: '#9A3412' },
  'Privacy-Regulated':        { bg: '#FEFCE8', border: '#FDE68A', label: '#854D0E' },
  'Regulated (Network & Privacy)': { bg: '#FEFCE8', border: '#FDE68A', label: '#854D0E' },
  'Fair-Lending & Safety':    { bg: '#FEFCE8', border: '#FDE68A', label: '#854D0E' },
  'Emerging Regulation':      { bg: '#EFF6FF', border: '#BFDBFE', label: '#1E40AF' },
  'Voluntary + Customer-Driven': { bg: '#F0F9FF', border: '#BAE6FD', label: '#0369A1' },
  'Voluntary + Client-Driven':   { bg: '#F0F9FF', border: '#BAE6FD', label: '#0369A1' },
}

export default function IndustryRegulatoryContextCard({ industry }) {
  const info = getIndustryFrameworks(industry)
  if (!info) return null

  const tier = TIER_META[info.tier] || TIER_META['Emerging Regulation']

  return (
    <div className="card" style={{ marginBottom: 24, padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 6 }}>
        <div>
          <div className="section-eyebrow">Regulatory Context</div>
          <div className="chart-title" style={{ marginTop: 2 }}>
            {industry} — Applicable Frameworks
          </div>
        </div>
        <span
          style={{
            flexShrink: 0,
            padding: '4px 10px',
            borderRadius: 99,
            background: tier.bg,
            color: tier.label,
            border: `1px solid ${tier.border}`,
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {info.tier}
        </span>
      </div>

      <div className="chart-subtitle" style={{ marginBottom: 18 }}>
        {info.summary}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {info.frameworks.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 14,
              padding: '10px 14px',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              background: '#FAFBFC',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                flexShrink: 0,
                minWidth: 120,
                padding: '4px 10px',
                borderRadius: 6,
                background: '#1E293B',
                color: 'white',
                fontSize: 12,
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: 1.3,
                alignSelf: 'flex-start',
              }}
            >
              {f.name}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {f.scope}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          padding: '8px 12px',
          background: '#F1F5F9',
          borderRadius: 6,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}
      >
        This is a high-level summary of frameworks commonly applicable to the industry.
        Actual obligations depend on jurisdiction, AI system classification, and organizational scope —
        qualified legal and compliance review is required before operationalizing.
      </div>
    </div>
  )
}
