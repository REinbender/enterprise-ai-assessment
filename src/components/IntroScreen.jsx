import { dimensions } from '../data/questions'

const dimIcons = ['🎯', '🗄️', '⚖️', '👥', '⚙️']

export default function IntroScreen({ onStart }) {
  return (
    <div className="intro">
      <div className="intro-badge">
        <span>◆</span> Enterprise Assessment Tool
      </div>

      <h1 className="intro-title">
        AI Readiness Assessment<br />
        <span>for the Enterprise</span>
      </h1>

      <p className="intro-subtitle">
        A structured, evidence-based evaluation across 5 critical dimensions.
        Benchmark your organization's AI maturity and receive prioritized, actionable recommendations.
      </p>

      <div className="intro-stats">
        <div className="intro-stat">
          <span className="intro-stat-value">5</span>
          <span className="intro-stat-label">Dimensions</span>
        </div>
        <div className="intro-stat-divider" />
        <div className="intro-stat">
          <span className="intro-stat-value">75</span>
          <span className="intro-stat-label">Questions</span>
        </div>
        <div className="intro-stat-divider" />
        <div className="intro-stat">
          <span className="intro-stat-value">~20</span>
          <span className="intro-stat-label">Minutes</span>
        </div>
        <div className="intro-stat-divider" />
        <div className="intro-stat">
          <span className="intro-stat-value">5+</span>
          <span className="intro-stat-label">Recommendations</span>
        </div>
      </div>

      <div className="intro-dimensions">
        {dimensions.map((dim, i) => (
          <div key={dim.id} className="intro-dim-card">
            <div
              className="intro-dim-icon"
              style={{ background: dim.bgColor }}
            >
              {dimIcons[i]}
            </div>
            <div className="intro-dim-content">
              <div className="intro-dim-name">{dim.name}</div>
              <div className="intro-dim-count">15 questions</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          Begin Assessment
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          No account needed · All responses stay in your browser
        </p>
      </div>
    </div>
  )
}
