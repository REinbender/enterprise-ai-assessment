import { useState, useRef } from 'react'
import { parseImportedFiles, ROLE_GROUP_META, assignRoleGroup } from '../data/engagement'

export default function ImportScreen({ engagement, onImport, onBack }) {
  const [sessions, setSessions]   = useState([])
  const [errors, setErrors]       = useState([])
  const [notices, setNotices]     = useState([])  // non-error info messages (dupes, warnings)
  const [dragging, setDragging]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const inputRef                  = useRef(null)

  const processFiles = async (files) => {
    if (!files?.length) return
    setLoading(true)
    const results = await parseImportedFiles(files)
    const valid   = results.filter(r => r.ok).flatMap(r => r.sessions)
    const errs    = results.filter(r => !r.ok).map(r => r.error)
    // Partial warnings from engagement files that had some invalid sessions
    const warns   = results.filter(r => r.ok && r.warnings?.length).flatMap(r => r.warnings)

    // De-duplicate against existing engagement sessions AND already-staged sessions
    const existingIds = new Set(engagement.sessions.map(s => s.sessionId))
    let dupesVsEngagement = 0

    setSessions(prev => {
      const prevIds = new Set(prev.map(s => s.sessionId))
      const fresh = valid.filter(s => !existingIds.has(s.sessionId) && !prevIds.has(s.sessionId))
      dupesVsEngagement = valid.filter(s => existingIds.has(s.sessionId)).length
      const dupesVsStaged = valid.length - fresh.length - dupesVsEngagement
      const newNotices = []
      if (dupesVsEngagement > 0)
        newNotices.push(`${dupesVsEngagement} session${dupesVsEngagement !== 1 ? 's' : ''} already in this engagement — skipped`)
      if (dupesVsStaged > 0)
        newNotices.push(`${dupesVsStaged} session${dupesVsStaged !== 1 ? 's' : ''} already staged for import — skipped`)
      if (newNotices.length) setNotices(p => [...p, ...newNotices])
      return [...prev, ...fresh]
    })

    setErrors(prev => [...prev, ...errs])
    if (warns.length) setNotices(p => [...p, ...warns])
    setLoading(false)
  }

  const handleFiles = (files) => processFiles(files)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemove = (sessionId) => {
    setSessions(prev => prev.filter(s => s.sessionId !== sessionId))
  }

  const handleImport = () => {
    if (!sessions.length) return
    onImport(sessions)
  }

  const roleCounts = { executive: 0, management: 0, practitioner: 0 }
  sessions.forEach(s => {
    const g = s.roleGroup || assignRoleGroup(s.respondentRole)
    roleCounts[g] = (roleCounts[g] || 0) + 1
  })

  return (
    <div className="page">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-inner topbar-inner--wide">
          <div className="topbar-logo">
            <div className="topbar-logo-mark">AI</div>
            <span className="topbar-logo-text">Readiness Assessment</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>
            ← Back to Hub
          </button>
        </div>
      </div>

      <div className="page-inner">
        <div className="form-section">

          <div className="section-header">
            <div className="section-eyebrow">Import</div>
            <h2 className="section-title">Import Session Files</h2>
            <p className="section-subtitle">
              Select all JSON session files exported from interviews. Each file represents
              one completed respondent. You can import from multiple devices at once.
            </p>
          </div>

          {/* Drop zone */}
          <div
            className={`import-dropzone ${dragging ? 'import-dropzone--active' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".json"
              multiple
              style={{ display: 'none' }}
              onChange={e => handleFiles(e.target.files)}
            />
            <div className="import-dropzone-icon">
              {loading ? '⏳' : dragging ? '📂' : '📁'}
            </div>
            <div className="import-dropzone-label">
              {loading ? 'Reading files…' : dragging
                ? 'Drop files here'
                : 'Drop JSON files here or click to browse'}
            </div>
            <div className="import-dropzone-sub">
              Accepts individual session files (.json) or full engagement backup files
            </div>
          </div>

          {/* Validation errors — files that could not be imported */}
          {errors.length > 0 && (
            <div className="import-errors">
              {errors.map((err, i) => (
                <div key={i} className="import-error-item">
                  <span style={{ color: '#E74C3C' }}>⚠</span> {err}
                </div>
              ))}
            </div>
          )}

          {/* Informational notices — duplicates skipped, partial warnings */}
          {notices.length > 0 && (
            <div style={{
              marginTop: 8, padding: '8px 12px', borderRadius: 6,
              background: '#EFF6FF', border: '1px solid #BFDBFE',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              {notices.map((msg, i) => (
                <div key={i} style={{ fontSize: 12, color: '#1D4ED8', display: 'flex', gap: 6 }}>
                  <span>ℹ</span> {msg}
                </div>
              ))}
            </div>
          )}

          {/* Loaded sessions */}
          {sessions.length > 0 && (
            <>
              <div className="import-summary">
                <div className="import-summary-count">
                  <span style={{ fontWeight: 700, fontSize: 20 }}>{sessions.length}</span>
                  <span> session{sessions.length !== 1 ? 's' : ''} ready to import</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(roleCounts).map(([g, n]) => {
                    if (!n) return null
                    const m = ROLE_GROUP_META[g]
                    return (
                      <span key={g} style={{
                        padding: '2px 10px', borderRadius: 12,
                        background: m.bg, color: m.color, fontSize: 12, fontWeight: 600,
                      }}>
                        {n} {m.label}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="import-session-list">
                {sessions.map(s => {
                  const g = s.roleGroup || assignRoleGroup(s.respondentRole)
                  const m = ROLE_GROUP_META[g]
                  const date = new Date(s.completedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })
                  return (
                    <div key={s.sessionId} className="import-session-row">
                      <div className="import-session-info">
                        <div className="import-session-name">{s.respondentName}</div>
                        <div className="import-session-role">{s.respondentRole}</div>
                      </div>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4,
                        background: m.bg, color: m.color, fontSize: 11, fontWeight: 600,
                      }}>{m.label}</span>
                      <div className="import-session-score">
                        Score: <strong>{s.overallScore}</strong>
                      </div>
                      <div className="import-session-date">{date}</div>
                      <button
                        className="btn-icon btn-icon--danger"
                        onClick={() => handleRemove(s.sessionId)}
                        title="Remove from import"
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-ghost" onClick={onBack}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleImport}
                  disabled={loading}
                >
                  Add {sessions.length} Session{sessions.length !== 1 ? 's' : ''} to Engagement →
                </button>
              </div>
            </>
          )}

          {sessions.length === 0 && !loading && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={onBack}>
                ← Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
