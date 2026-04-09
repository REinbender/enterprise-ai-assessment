import { useState } from 'react'

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

export default function EngagementSetup({ onSubmit }) {
  const [name, setName]         = useState('')
  const [industry, setIndustry] = useState('')
  const [size, setSize]         = useState('')

  const isValid = name.trim() && industry && size

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit({ name: name.trim(), industry, size })
  }

  return (
    <div className="setup-page">
      <div className="setup-inner">

        {/* Brand */}
        <div className="setup-brand">
          <div className="setup-brand-icon">AI</div>
          <div>
            <div className="setup-brand-name">AI Readiness Assessment</div>
            <div className="setup-brand-sub">Enterprise Engagement Platform</div>
          </div>
        </div>

        {/* Hero */}
        <div className="setup-hero">
          <h1 className="setup-title">Start a New Engagement</h1>
          <p className="setup-subtitle">
            Set up an engagement to conduct multiple interviews across your client organization.
            Each interview is saved separately and aggregated into a composite report.
          </p>
        </div>

        {/* How it works */}
        <div className="setup-steps">
          {[
            { n: '1', label: 'Create engagement', sub: 'Enter client company details once' },
            { n: '2', label: 'Run interviews',    sub: 'Conduct 10–15 sessions across roles' },
            { n: '3', label: 'Generate report',   sub: 'Composite analysis with role segmentation' },
          ].map(s => (
            <div key={s.n} className="setup-step-item">
              <div className="setup-step-num">{s.n}</div>
              <div>
                <div className="setup-step-label">{s.label}</div>
                <div className="setup-step-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form className="setup-form card" onSubmit={handleSubmit}>
          <div className="setup-form-title">Client Organization</div>

          <div className="form-field form-field--full">
            <label className="form-label">Organization name <span>*</span></label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Acme Corporation"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="form-field">
              <label className="form-label">Industry <span>*</span></label>
              <div className="form-select-wrapper">
                <select className="form-select" value={industry} onChange={e => setIndustry(e.target.value)}>
                  <option value="">Select industry…</option>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Company size <span>*</span></label>
              <div className="form-select-wrapper">
                <select className="form-select" value={size} onChange={e => setSize(e.target.value)}>
                  <option value="">Select size…</option>
                  {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={!isValid}
            style={{ marginTop: 24, width: '100%' }}
          >
            Create Engagement & Go to Hub
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>

        <p className="setup-privacy">
          All data is stored locally in your browser. Nothing is transmitted externally.
          Each completed interview auto-downloads as a JSON backup file.
        </p>
      </div>
    </div>
  )
}

