import { DIM_FRAMEWORKS } from '../constants/frameworks'
import { dimensions } from '../data/questions'

const dimIcons = { 1: '🎯', 2: '🗄️', 3: '⚖️', 4: '👥', 5: '⚙️' }

/**
 * Framework Alignment Card
 *
 * Shows which recognized industry frameworks each assessment dimension draws from.
 * Renders on CompositeResults and ResultsPage so stakeholders can trace the
 * assessment's grounding back to authoritative sources.
 */
export default function FrameworkAlignmentCard() {
  return (
    <div className="card" style={{ marginBottom: 24, padding: '24px 28px' }}>
      <div className="section-eyebrow" style={{ marginBottom: 6 }}>Methodology</div>
      <div className="chart-title" style={{ marginBottom: 4 }}>Framework Alignment</div>
      <div className="chart-subtitle" style={{ marginBottom: 20 }}>
        Each dimension of this assessment is grounded in recognized industry frameworks.
        These references indicate the authoritative sources each dimension's
        questions are designed to measure against — they are alignment references,
        not certifications.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {dimensions.map(dim => {
          const fw = DIM_FRAMEWORKS[dim.id]
          if (!fw) return null
          return (
            <div
              key={dim.id}
              style={{
                borderLeft: `3px solid ${dim.color}`,
                paddingLeft: 14,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{dimIcons[dim.id]}</span>
                <span style={{ fontWeight: 700, color: dim.color, fontSize: 14 }}>
                  {dim.shortName}
                </span>
              </div>

              {/* Primary frameworks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {fw.primary.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: dim.color,
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                        minWidth: 90,
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}
                    >
                      {f.name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {f.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Secondary frameworks (if any) */}
              {fw.secondary?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                  {fw.secondary.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: '#F1F5F9',
                          color: '#64748B',
                          fontSize: 10,
                          fontWeight: 600,
                          flexShrink: 0,
                          minWidth: 90,
                          textAlign: 'center',
                          lineHeight: 1.3,
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        {f.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, fontStyle: 'italic' }}>
                        {f.detail}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 18,
          padding: '10px 14px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 6,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--text-secondary)' }}>Sources:</strong>{' '}
        NIST AI Risk Management Framework 1.0 (2023) · ISO/IEC 42001:2023 AI Management Systems ·
        ISO/IEC 23894:2023 AI Risk Management · EU AI Act (Regulation 2024/1689) · OECD AI Principles ·
        DAMA-DMBOK v2 · Google/Microsoft MLOps Maturity Models · WEF AI Governance Alliance.
      </div>
    </div>
  )
}
