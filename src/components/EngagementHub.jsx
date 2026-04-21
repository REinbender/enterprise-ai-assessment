import { useState } from 'react'
import { ROLE_GROUP_META } from '../data/engagement'
import { getMaturityLevel } from '../data/questions'

const dimIcons = { 1: '🎯', 2: '🗄️', 3: '⚖️', 4: '👥', 5: '⚙️' }

function ScoreBar({ score, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          width: `${score}%`, height: '100%',
          background: color, borderRadius: 3,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 28, textAlign: 'right' }}>
        {score}
      </span>
    </div>
  )
}

function RoleChip({ roleGroup }) {
  const m = ROLE_GROUP_META[roleGroup]
  return (
    <span className="role-chip" style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  )
}

function SessionRow({ session, onExport, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const maturity = getMaturityLevel(session.overallScore)
  const date = new Date(session.completedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="hub-session-row">
      <div className="hub-session-main">
        <div className="hub-session-respondent">
          <div className="hub-session-name">{session.respondentName}</div>
          <div className="hub-session-role">{session.respondentRole}</div>
        </div>
        <RoleChip roleGroup={session.roleGroup} />
      </div>

      <div className="hub-session-score-wrap">
        <ScoreBar score={session.overallScore} color={maturity.color} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginTop: 4,
        }}>
          <span className="maturity-pill" style={{ background: maturity.bg, color: maturity.color }}>
            {maturity.label}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{date}</span>
        </div>
      </div>

      <div className="hub-session-actions">
        <button
          className="btn-icon"
          aria-label={`Re-download JSON for ${session.respondentName}`}
          title="Re-download session JSON"
          onClick={onExport}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        {confirmDelete ? (
          <div role="group" aria-label="Confirm delete" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#E74C3C' }}>Delete?</span>
            <button className="btn btn-danger btn-xs" onClick={onDelete}>Yes</button>
            <button className="btn btn-ghost btn-xs" onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        ) : (
          <button
            className="btn-icon btn-icon--danger"
            aria-label={`Delete session for ${session.respondentName}`}
            title="Delete session"
            onClick={() => setConfirmDelete(true)}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default function EngagementHub({
  engagement,
  onStartInterview,
  onDeleteSession,
  onExportSession,
  onGenerateComposite,
  onImport,
  onExportEngagement,
  onResetEngagement,
}) {
  const [showReset, setShowReset] = useState(false)
  const { company, sessions, createdAt } = engagement

  const roleCounts = { executive: 0, management: 0, practitioner: 0 }
  sessions.forEach(s => { roleCounts[s.roleGroup] = (roleCounts[s.roleGroup] || 0) + 1 })

  const createdDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  const canGenerate = sessions.length >= 2

  return (
    <div className="hub-page">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="topbar">
        <div className="topbar-inner topbar-inner--wide">
          <div className="topbar-logo">
            <div className="topbar-logo-mark">AI</div>
            <span className="topbar-logo-text">Readiness Assessment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={onExportEngagement} title="Export full engagement backup">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Backup
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowReset(true)}>
              New Engagement
            </button>
          </div>
        </div>
      </div>

      <div className="hub-inner">

        {/* ── Engagement header ────────────────────────────────────────── */}
        <div className="hub-header">
          <div>
            <div className="hub-company-name">{company.name}</div>
            <div className="hub-company-meta">
              {company.industry} · {company.size} · Started {createdDate}
            </div>
          </div>
          <div className="hub-role-counts">
            {Object.entries(roleCounts).map(([group, count]) => {
              if (!count) return null
              const m = ROLE_GROUP_META[group]
              return (
                <div key={group} className="hub-role-count-chip" style={{ background: m.bg, color: m.color }}>
                  <span style={{ fontWeight: 700 }}>{count}</span> {m.label}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        <div className="hub-stats">
          <div className="hub-stat-card">
            <div className="hub-stat-value">{sessions.length}</div>
            <div className="hub-stat-label">Interviews Complete</div>
          </div>
          <div className="hub-stat-card">
            <div className="hub-stat-value" style={{ color: ROLE_GROUP_META.executive.color }}>
              {roleCounts.executive}
            </div>
            <div className="hub-stat-label">Executive</div>
          </div>
          <div className="hub-stat-card">
            <div className="hub-stat-value" style={{ color: ROLE_GROUP_META.management.color }}>
              {roleCounts.management}
            </div>
            <div className="hub-stat-label">Management</div>
          </div>
          <div className="hub-stat-card">
            <div className="hub-stat-value" style={{ color: ROLE_GROUP_META.practitioner.color }}>
              {roleCounts.practitioner}
            </div>
            <div className="hub-stat-label">Practitioner</div>
          </div>
          {sessions.length > 0 && (
            <div className="hub-stat-card">
              <div className="hub-stat-value">
                {Math.round(sessions.reduce((a, s) => a + s.overallScore, 0) / sessions.length)}
              </div>
              <div className="hub-stat-label">Avg Score</div>
            </div>
          )}
        </div>

        {/* ── Action buttons ───────────────────────────────────────────── */}
        <div className="hub-actions">
          <button className="btn btn-primary btn-lg" onClick={onStartInterview}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Start New Interview
          </button>
          <button className="btn btn-secondary" onClick={onImport}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Sessions
          </button>
          <button
            className={`btn ${canGenerate ? 'btn-accent' : 'btn-disabled'}`}
            onClick={canGenerate ? onGenerateComposite : undefined}
            disabled={!canGenerate}
            title={!canGenerate ? 'Complete at least 2 interviews to generate composite report' : ''}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Composite Report
            {sessions.length > 0 && (
              <span className="btn-badge">{sessions.length}</span>
            )}
          </button>
        </div>

        {!canGenerate && sessions.length < 2 && (
          <div className="hub-hint">
            {sessions.length === 0
              ? 'Start by conducting your first interview above.'
              : 'Complete at least one more interview to unlock the composite report.'}
          </div>
        )}

        {/* ── Session list ─────────────────────────────────────────────── */}
        {sessions.length > 0 && (
          <div className="hub-sessions-section">
            <div className="hub-sessions-title">
              Completed Interviews
              <span className="hub-sessions-count">{sessions.length}</span>
            </div>
            <div className="hub-sessions-list">
              {[...sessions].reverse().map(session => (
                <SessionRow
                  key={session.sessionId}
                  session={session}
                  onExport={() => onExportSession(session)}
                  onDelete={() => onDeleteSession(session.sessionId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {sessions.length === 0 && (
          <div className="hub-empty">
            <div className="hub-empty-icon">📋</div>
            <div className="hub-empty-title">No interviews yet</div>
            <div className="hub-empty-sub">
              Click "Start New Interview" to conduct the first session for {company.name}.
              Each completed interview is automatically backed up as a JSON file.
            </div>
          </div>
        )}
      </div>

      {/* ── Reset confirmation modal ─────────────────────────────────────── */}
      {showReset && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title" onClick={() => setShowReset(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title" id="reset-modal-title">Start a New Engagement?</div>
            <p className="modal-body">
              This will permanently delete the current engagement for{' '}
              <strong>{company.name}</strong> and all {sessions.length} session
              {sessions.length !== 1 ? 's' : ''} from this browser.
            </p>
            <p className="modal-body" style={{ color: '#E74C3C' }}>
              Make sure you have exported your backup first. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowReset(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={onResetEngagement}>
                Delete & Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
