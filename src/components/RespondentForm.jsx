import { useState } from 'react'
import { assignRoleGroup, ROLE_GROUP_META } from '../data/engagement'

export default function RespondentForm({ engagement, onSubmit, onBack }) {
  const [name, setName]               = useState('')
  const [role, setRole]               = useState('')
  const [groupOverride, setGroupOverride] = useState(null)
  const [touched, setTouched]         = useState({ name: false, role: false })

  const autoGroup  = role.trim() ? assignRoleGroup(role) : null
  const roleGroup  = groupOverride ?? autoGroup
  const groupMeta  = roleGroup ? ROLE_GROUP_META[roleGroup] : null

  const nameError = touched.name && !name.trim() ? 'Name is required' : null
  const roleError = touched.role && !role.trim() ? 'Role / Title is required' : null
  const isValid   = name.trim() && role.trim()
  const sessionNum = (engagement?.sessions?.length ?? 0) + 1

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ name: true, role: true })
    if (!isValid) return
    onSubmit(name.trim(), role.trim(), roleGroup)
  }

  return (
    <div className="page">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-logo">
            <div className="topbar-logo-mark">AI</div>
            <span className="topbar-logo-text">Readiness Assessment</span>
          </div>
          <div className="topbar-progress">
            <div className="topbar-progress-label">
              {engagement.company.name} · Interview {sessionNum}
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '5%' }} />
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>
            ← Hub
          </button>
        </div>
      </div>

      <div className="page-inner">
        <div className="form-section">

          <div className="section-header">
            <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--primary)', color: 'white',
                  fontSize: 13, fontWeight: 700,
                }}
              >
                {sessionNum}
              </span>
              Interview {sessionNum} — {engagement.company.name}
            </div>
            <h2 className="section-title">Who are we interviewing?</h2>
            <p className="section-subtitle">
              The respondent's role determines how their answers are weighted and
              segmented in the composite report.
            </p>
          </div>

          <form className="card form-card" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Respondent name <span>*</span></label>
                <input
                  className={`form-input${nameError ? ' form-input--error' : ''}`}
                  type="text"
                  placeholder="e.g. Sarah Chen"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, name: true }))}
                  autoFocus
                  aria-required="true"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? 'respondent-name-error' : undefined}
                />
                {nameError && <div id="respondent-name-error" className="form-field-error" role="alert">{nameError}</div>}
              </div>

              <div className="form-field">
                <label className="form-label">Role / Title <span>*</span></label>
                <input
                  className={`form-input${roleError ? ' form-input--error' : ''}`}
                  type="text"
                  placeholder="e.g. CIO, VP Engineering, Data Scientist"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, role: true }))}
                  aria-required="true"
                  aria-invalid={!!roleError}
                  aria-describedby={roleError ? 'respondent-role-error' : 'respondent-role-hint'}
                />
                {roleError
                  ? <div id="respondent-role-error" className="form-field-error" role="alert">{roleError}</div>
                  : <div id="respondent-role-hint" className="form-field-hint">Use their actual title (e.g. "CTO", "IT Director", "ML Engineer") for accurate role group detection</div>
                }
              </div>
            </div>

            {/* Role group selector */}
            {role.trim() && (
              <div className="respondent-group-preview">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 90, display: 'flex', alignItems: 'center', gap: 5 }}>
                    Role Group
                    <span
                      className="role-group-tooltip-trigger"
                      title="Role groups determine how scores are segmented in the composite report. Executive = C-suite, VPs, Directors; Management = Managers, Team Leads, Architects; Practitioner = Engineers, Analysts, Scientists. Perception gaps between groups surface leadership blindspots."
                      aria-label="Role group info"
                    >
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {Object.entries(ROLE_GROUP_META).map(([key, meta]) => {
                      const isSelected = roleGroup === key
                      const isAuto     = !groupOverride && autoGroup === key
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setGroupOverride(groupOverride === key ? null : key)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: 99,
                            border: `1.5px solid ${isSelected ? meta.color : 'var(--border)'}`,
                            background: isSelected ? meta.bg : 'white',
                            color: isSelected ? meta.color : 'var(--text-secondary)',
                            fontSize: 12,
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            transition: 'all 0.15s',
                          }}
                        >
                          {isSelected && <span>●</span>}
                          {meta.label}
                          {isAuto && !groupOverride && (
                            <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400 }}>auto</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <span className="respondent-group-note" style={{ marginTop: 4, display: 'block' }}>
                  {roleGroup === 'executive'
                    ? 'Strategic perspective — scores segmented in leadership analysis'
                    : roleGroup === 'management'
                    ? 'Bridge perspective — included in management tier analysis'
                    : 'Operational perspective — ground-truth view of AI maturity'}
                  {groupOverride && (
                    <button
                      type="button"
                      onClick={() => setGroupOverride(null)}
                      style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Reset to auto ({autoGroup})
                    </button>
                  )}
                </span>
              </div>
            )}

            <div className="respondent-info-box">
              <div style={{ fontWeight: 600, marginBottom: 4 }}>What happens next</div>
              <p style={{ margin: 0 }}>
                You'll answer 12 questions across 5 AI readiness dimensions using
                behaviorally-anchored 1–5 scales. Takes ~15 minutes. At the end,
                the individual results are shown before saving to the engagement.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={onBack}>
                ← Back to Hub
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!isValid}
              >
                Begin Interview →
              </button>
            </div>
          </form>

          {/* Previous respondents chip list */}
          {engagement.sessions.length > 0 && (
            <div className="respondent-previous">
              <div className="respondent-previous-label">Already interviewed</div>
              <div className="respondent-previous-chips">
                {engagement.sessions.map(s => {
                  const m = ROLE_GROUP_META[s.roleGroup]
                  return (
                    <div key={s.sessionId} className="respondent-prev-chip" style={{ borderColor: m.color }}>
                      <span style={{ color: m.color, fontWeight: 700, fontSize: 10 }}>●</span>
                      <span>{s.respondentName}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>· {s.respondentRole}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
