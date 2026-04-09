import { useState } from 'react'
import { assignRoleGroup, ROLE_GROUP_META } from '../data/engagement'

export default function RespondentForm({ engagement, onSubmit, onBack }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  const roleGroup  = role.trim() ? assignRoleGroup(role) : null
  const groupMeta  = roleGroup ? ROLE_GROUP_META[roleGroup] : null
  const isValid    = name.trim() && role.trim()
  const sessionNum = (engagement?.sessions?.length ?? 0) + 1

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(name.trim(), role.trim())
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
                  className="form-input"
                  type="text"
                  placeholder="e.g. Sarah Chen"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label className="form-label">Role / Title <span>*</span></label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. CIO, VP Engineering, Data Scientist"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </div>
            </div>

            {/* Live role group preview */}
            {groupMeta && (
              <div className="respondent-group-preview">
                <div
                  className="respondent-group-chip"
                  style={{ background: groupMeta.bg, color: groupMeta.color }}
                >
                  <span style={{ fontWeight: 700 }}>●</span>
                  {groupMeta.label}
                </div>
                <span className="respondent-group-note">
                  {roleGroup === 'executive'
                    ? 'Strategic perspective — weighted in leadership analysis'
                    : roleGroup === 'management'
                    ? 'Bridge perspective — included in management tier'
                    : 'Operational perspective — ground-truth view of AI maturity'}
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
