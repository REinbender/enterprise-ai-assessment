const industries = [
  'Financial Services & Banking',
  'Healthcare & Life Sciences',
  'Technology & Software',
  'Manufacturing & Industrial',
  'Retail & Consumer Goods',
  'Energy & Utilities',
  'Government & Public Sector',
  'Professional Services',
  'Telecommunications',
  'Media & Entertainment',
  'Education',
  'Transportation & Logistics',
  'Real Estate & Construction',
  'Other',
]

const sizes = [
  '1–50 employees',
  '51–200 employees',
  '201–500 employees',
  '501–1,000 employees',
  '1,001–5,000 employees',
  '5,001–10,000 employees',
  '10,000+ employees',
]

function TopBar({ progress }) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-logo">
          <div className="topbar-logo-mark">◆</div>
          <span className="topbar-logo-text">AI <span>Readiness</span></span>
        </div>
        <div className="topbar-progress">
          <div className="topbar-progress-label">Step 1 of 7 — Company Context</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="topbar-step-info">1 / 7</span>
      </div>
    </div>
  )
}

export default function CompanyForm({ company, onChange, onNext, onBack }) {
  const isValid = company.name.trim() && company.industry && company.size
  const progress = (1 / 7) * 100

  const set = (field) => (e) => onChange({ ...company, [field]: e.target.value })

  return (
    <div className="page">
      <TopBar progress={progress} />

      <div className="page-inner">
        <div className="form-section">
          <div className="section-header">
            <div className="section-eyebrow">Step 1 — Context</div>
            <h2 className="section-title">Tell us about your organization</h2>
            <p className="section-subtitle">
              This context helps us tailor recommendations to your industry and scale.
              Your responses are not stored or shared.
            </p>
          </div>

          <div className="card form-card">
            <div className="form-grid">
              <div className="form-field form-field--full">
                <label className="form-label">
                  Organization name <span>*</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  value={company.name}
                  onChange={set('name')}
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Industry <span>*</span>
                </label>
                <div className="form-select-wrapper">
                  <select
                    className="form-select"
                    value={company.industry}
                    onChange={set('industry')}
                    style={{ width: '100%', cursor: 'pointer' }}
                  >
                    <option value="">Select industry…</option>
                    {industries.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  Company size <span>*</span>
                </label>
                <div className="form-select-wrapper">
                  <select
                    className="form-select"
                    value={company.size}
                    onChange={set('size')}
                    style={{ width: '100%', cursor: 'pointer' }}
                  >
                    <option value="">Select size…</option>
                    {sizes.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {isValid && (
              <div
                style={{
                  marginTop: 24,
                  padding: '12px 16px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Ready — click <strong>Continue</strong> to start the assessment
              </div>
            )}
          </div>

          <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>What happens next:</strong>{' '}
              You'll answer 15 questions for each of 5 AI readiness dimensions, scored 1–5.
              The assessment takes approximately 15–25 minutes to complete thoughtfully.
            </p>
          </div>
        </div>
      </div>

      <div className="nav-footer">
        <div className="nav-footer-inner">
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back
          </button>
          <div className="nav-progress-text">
            <strong>1</strong> of 7 steps
          </div>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!isValid}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
