import { useState, useEffect } from 'react'
import { dimensions } from './data/questions'
import {
  loadEngagement, saveEngagement, clearEngagement, createEngagement,
  buildSession, addSession, removeSession, updateSession,
  exportSession, exportEngagement,
  loadSessionDraft, saveSessionDraft, clearSessionDraft,
} from './data/engagement'
import DimensionAssessment from './components/DimensionAssessment'
import NavigationSidebar from './components/NavigationSidebar'
import EngagementSetup from './components/EngagementSetup'
import EngagementHub from './components/EngagementHub'
import RespondentForm from './components/RespondentForm'
import ResultsPage from './components/ResultsPage'
import CompositeResults from './components/CompositeResults'
import ImportScreen from './components/ImportScreen'
import EngagementApproachDocument from './components/EngagementApproachDocument'

// App modes:
// 'loading'      – initial mount, reading localStorage
// 'setup'        – EngagementSetup (create new engagement, no engagement exists)
// 'hub'          – EngagementHub (session list, actions)
// 'respondent'   – RespondentForm (name + role before each interview)
// 'interview'    – DimensionAssessment flow (interviewStep 1–5)
// 'session-done' – Individual ResultsPage with Save to Engagement button
// 'composite'    – CompositeResults (multi-respondent aggregate)
// 'import'       – ImportScreen (drag-and-drop JSON files)
// 'approach-doc' – EngagementApproachDocument (sales artifact, 3-page methodology PDF)

const defaultAnswers    = () => dimensions.reduce((acc, d) => ({ ...acc, [d.id]: {} }), {})
const defaultNotes      = () => dimensions.reduce((acc, d) => ({ ...acc, [d.id]: '' }), {})
const defaultConfidence = () => dimensions.reduce((acc, d) => ({ ...acc, [d.id]: null }), {})

export default function App() {
  const [mode, setMode]               = useState('loading')
  const [engagement, setEngagement]   = useState(null)
  const [storageWarning, setStorageWarning] = useState(null) // { pct, critical } | null
  const [lastSavedAt, setLastSavedAt] = useState(null)

  // Current in-progress interview state
  const [interviewStep, setInterviewStep]         = useState(1) // 1–5 = dimensions
  const [respondentName, setRespondentName]       = useState('')
  const [respondentRole, setRespondentRole]       = useState('')
  const [respondentRoleGroup, setRespondentRoleGroup] = useState(null)
  const [answers, setAnswers]                     = useState(defaultAnswers)
  const [notes, setNotes]                         = useState(defaultNotes)
  const [confidence, setConfidence]               = useState(defaultConfidence)
  const [completedSession, setCompletedSession]   = useState(null)
  // When set, interview flow is editing an existing session in-place rather
  // than creating a new one. Save step calls updateSession() and preserves
  // sessionId + completedAt (see buildSession existingSession branch).
  const [editingSession, setEditingSession]       = useState(null)

  // ── Storage capacity listeners ─────────────────────────────────────────────
  useEffect(() => {
    const onWarning    = (e) => setStorageWarning(e.detail)
    const onFull       = ()  => setStorageWarning({ pct: 100, critical: true, full: true })
    const onSaveFailed = (e) => setStorageWarning({
      pct: 100, critical: true, full: true,
      saveFailed: true,
      reason: e?.detail?.reason || 'unknown',
      message: e?.detail?.message || '',
    })
    window.addEventListener('ai_storage_warning',     onWarning)
    window.addEventListener('ai_storage_full',        onFull)
    window.addEventListener('ai_storage_save_failed', onSaveFailed)
    return () => {
      window.removeEventListener('ai_storage_warning',     onWarning)
      window.removeEventListener('ai_storage_full',        onFull)
      window.removeEventListener('ai_storage_save_failed', onSaveFailed)
    }
  }, [])

  // ── Mount: load engagement and any in-progress draft ──────────────────────
  useEffect(() => {
    const eng   = loadEngagement()
    const draft = loadSessionDraft()

    if (eng) {
      setEngagement(eng)
      if (draft && draft.respondentName) {
        // Resume in-progress interview
        setRespondentName(draft.respondentName || '')
        setRespondentRole(draft.respondentRole || '')
        setRespondentRoleGroup(draft.respondentRoleGroup ?? null)
        setAnswers(draft.answers         || defaultAnswers())
        setNotes(draft.notes             || defaultNotes())
        setConfidence(draft.confidence   || defaultConfidence())
        setInterviewStep(draft.step || 1)
        setMode('interview')
      } else {
        setMode('hub')
      }
    } else {
      setMode('setup')
    }
  }, [])

  // ── Auto-save draft during interview ──────────────────────────────────────
  // Skipped when editing an existing session — the in-progress draft slot is
  // reserved for new interviews so resuming after a reload stays unambiguous.
  useEffect(() => {
    if (mode === 'interview' && !editingSession) {
      saveSessionDraft({
        respondentName,
        respondentRole,
        respondentRoleGroup,
        answers,
        notes,
        confidence,
        step: interviewStep,
      })
      setLastSavedAt(new Date())
    }
  }, [mode, interviewStep, answers, notes, confidence, respondentName, respondentRole, respondentRoleGroup, editingSession])

  // ── Engagement creation ────────────────────────────────────────────────────
  const handleCreateEngagement = (company) => {
    const eng = createEngagement(company)
    saveEngagement(eng)
    setEngagement(eng)
    setMode('hub')
  }

  // ── Start a new interview ──────────────────────────────────────────────────
  const handleStartInterview = () => {
    setEditingSession(null)
    setRespondentName('')
    setRespondentRole('')
    setRespondentRoleGroup(null)
    setAnswers(defaultAnswers())
    setNotes(defaultNotes())
    setConfidence(defaultConfidence())
    setInterviewStep(1)
    clearSessionDraft()
    setMode('respondent')
  }

  // ── Edit an existing session ───────────────────────────────────────────────
  // Loads the saved session's data into the interview state and reuses the
  // respondent → interview flow. On save, buildSession is called with
  // existingSession so sessionId + completedAt are preserved and lastEditedAt
  // is stamped.
  const handleEditSession = (session) => {
    setEditingSession(session)
    setRespondentName(session.respondentName || '')
    setRespondentRole(session.respondentRole || '')
    setRespondentRoleGroup(session.roleGroup || null)
    setAnswers(session.answers         || defaultAnswers())
    setNotes(session.notes             || defaultNotes())
    setConfidence(session.confidence   || defaultConfidence())
    setInterviewStep(1)
    setMode('respondent')
  }

  const handleRespondentSubmit = (name, role, roleGroup) => {
    setRespondentName(name)
    setRespondentRole(role)
    setRespondentRoleGroup(roleGroup ?? null)
    setInterviewStep(1)
    setMode('interview')
  }

  // ── Interview handlers ─────────────────────────────────────────────────────
  const handleAnswer = (dimId, qIdx, score) => {
    setAnswers(prev => ({ ...prev, [dimId]: { ...prev[dimId], [qIdx]: score } }))
  }

  const handleNotesChange = (dimId, text) => {
    setNotes(prev => ({ ...prev, [dimId]: text }))
  }

  const handleConfidenceChange = (dimId, level) => {
    setConfidence(prev => ({ ...prev, [dimId]: level }))
  }

  // A dimension is complete when every question has a numeric score OR 'dk'
  const isDimensionComplete = (dimId) => {
    const dim = dimensions.find(d => d.id === dimId)
    return Object.keys(answers[dimId] || {}).length === dim.questions.length
  }

  const handleInterviewNext = () => {
    if (interviewStep < 5) {
      setInterviewStep(s => s + 1)
    } else {
      // All 5 dimensions done — build session and show individual results.
      // When editing, pass existingSession to preserve sessionId + completedAt.
      const session = buildSession({
        respondentName,
        respondentRole,
        roleGroupOverride: respondentRoleGroup,
        answers,
        notes,
        confidence,
        existingSession: editingSession,
      })
      setCompletedSession(session)
      if (!editingSession) clearSessionDraft()
      setMode('session-done')
    }
  }

  const handleInterviewBack = () => {
    if (interviewStep > 1) {
      setInterviewStep(s => s - 1)
    } else {
      setMode('respondent')
    }
  }

  // ── Save completed session to engagement ───────────────────────────────────
  // When editing an existing session, replaces it in place (preserving order).
  // When creating a new session, appends to the list.
  const handleSaveSession = () => {
    const updated = editingSession
      ? updateSession(engagement, completedSession)
      : addSession(engagement, completedSession)
    saveEngagement(updated)
    setEngagement(updated)
    exportSession(updated, completedSession) // auto-download JSON backup
    setCompletedSession(null)
    setEditingSession(null)
    setMode('hub')
  }

  // ── Discard interview (don't save) ─────────────────────────────────────────
  const handleDiscardSession = () => {
    setCompletedSession(null)
    setEditingSession(null)
    setMode('hub')
  }

  // ── Delete a session from the engagement ───────────────────────────────────
  const handleDeleteSession = (sessionId) => {
    const updated = removeSession(engagement, sessionId)
    saveEngagement(updated)
    setEngagement(updated)
  }

  // ── Import sessions from JSON files ───────────────────────────────────────
  const handleImportSessions = (sessions) => {
    let updated = { ...engagement }
    sessions.forEach(s => { updated = addSession(updated, s) })
    saveEngagement(updated)
    setEngagement(updated)
    setMode('hub')
  }

  // ── Reset / start fresh ────────────────────────────────────────────────────
  const handleResetEngagement = () => {
    clearEngagement()
    setEngagement(null)
    setCompletedSession(null)
    setMode('setup')
  }

  // ── Sidebar navigation during interview ───────────────────────────────────
  // interviewStep 1–5 maps to sidebar step 2–6
  const sidebarStep = interviewStep + 1
  const currentDim  = mode === 'interview' ? dimensions[interviewStep - 1] : null

  // ── Storage warning banner ─────────────────────────────────────────────────
  const StorageWarningBanner = storageWarning && (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: storageWarning.full ? '#991B1B' : storageWarning.critical ? '#B45309' : '#92400E',
      color: '#FFF',
      padding: '10px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: 13, fontWeight: 500, gap: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      <span>
        {storageWarning.saveFailed
          ? `⛔ Save failed (${storageWarning.reason}) — your last change wasn't saved. Export your engagement immediately. ${storageWarning.message || ''}`
          : storageWarning.full
          ? '⛔ Storage full — your last save failed. Export your engagement now, then clear browser storage to continue.'
          : `⚠ Storage ${storageWarning.pct}% full — export your engagement as a backup to prevent data loss.`}
      </span>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {engagement && (
          <button
            onClick={() => exportEngagement(engagement)}
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#FFF', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          >
            Export Backup
          </button>
        )}
        {storageWarning.full && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', maxWidth: 220 }}>
            After exporting, open DevTools → Application → Storage → Clear site data
          </span>
        )}
        {!storageWarning.full && (
          <button
            onClick={() => setStorageWarning(null)}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
          >✕</button>
        )}
      </div>
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  if (mode === 'loading') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '4px solid #E2E8F0', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ color: '#94A3B8', fontSize: 14 }}>Loading…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (mode === 'setup') return (
    <EngagementSetup onSubmit={handleCreateEngagement} />
  )

  if (mode === 'hub') return (
    <>{StorageWarningBanner}<EngagementHub
      engagement={engagement}
      onStartInterview={handleStartInterview}
      onEditSession={handleEditSession}
      onDeleteSession={handleDeleteSession}
      onExportSession={(s) => exportSession(engagement, s)}
      onGenerateComposite={() => setMode('composite')}
      onImport={() => setMode('import')}
      onExportEngagement={() => exportEngagement(engagement)}
      onResetEngagement={handleResetEngagement}
      onOpenApproachDoc={() => setMode('approach-doc')}
    /></>
  )

  if (mode === 'respondent') return (
    <>{StorageWarningBanner}<RespondentForm
      engagement={engagement}
      onSubmit={handleRespondentSubmit}
      onBack={() => setMode('hub')}
      initialName={respondentName}
      initialRole={respondentRole}
      initialRoleGroup={respondentRoleGroup}
    /></>
  )

  if (mode === 'interview' && currentDim) return (
    <>
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      {StorageWarningBanner}
      <div className="app-shell">
        <NavigationSidebar
          currentStep={sidebarStep}
          company={engagement.company}
          answers={answers}
          isDimensionComplete={isDimensionComplete}
          onNavigate={(s) => {
            if (s >= 2 && s <= 6) setInterviewStep(s - 1)
          }}
        />
        <main id="main-content" className="app-main with-sidebar">
          <DimensionAssessment
            dimension={currentDim}
            answers={answers[currentDim.id]}
            onAnswer={(qIdx, score) => handleAnswer(currentDim.id, qIdx, score)}
            notes={notes[currentDim.id]}
            onNotesChange={(text) => handleNotesChange(currentDim.id, text)}
            confidence={confidence[currentDim.id]}
            onConfidenceChange={(level) => handleConfidenceChange(currentDim.id, level)}
            onNext={handleInterviewNext}
            onBack={handleInterviewBack}
            isComplete={isDimensionComplete(currentDim.id)}
            stepNumber={sidebarStep}
            totalSteps={7}
            company={engagement.company}
            lastSavedAt={lastSavedAt}
          />
        </main>
      </div>
    </>
  )

  if (mode === 'session-done' && completedSession) return (
    <>{StorageWarningBanner}<ResultsPage
      company={engagement.company}
      answers={completedSession.answers}
      notes={completedSession.notes}
      confidence={completedSession.confidence}
      dimMeta={completedSession.dimMeta}
      respondentName={completedSession.respondentName}
      respondentRole={completedSession.respondentRole}
      isEditing={!!editingSession}
      onSaveToEngagement={handleSaveSession}
      onDiscard={handleDiscardSession}
    /></>
  )

  const handleUpdateEngagement = (updated) => {
    saveEngagement(updated)
    setEngagement(updated)
  }

  if (mode === 'composite') return (
    <>{StorageWarningBanner}<CompositeResults
      engagement={engagement}
      onBack={() => setMode('hub')}
      onUpdateEngagement={handleUpdateEngagement}
    /></>
  )

  if (mode === 'import') return (
    <>{StorageWarningBanner}<ImportScreen
      engagement={engagement}
      onImport={handleImportSessions}
      onBack={() => setMode('hub')}
    /></>
  )

  if (mode === 'approach-doc') return (
    <EngagementApproachDocument onClose={() => setMode('hub')} />
  )

  return null
}
