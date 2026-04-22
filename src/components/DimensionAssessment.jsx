import { useState } from 'react'
import { scaleLabels, scaleShortLabels, DK } from '../data/questions'
import { getQuestionFramework } from '../constants/frameworks'

const dimIcons = { 1: '🎯', 2: '🗄️', 3: '⚖️', 4: '👥', 5: '⚙️' }

// scaleSummaryLabels sourced from questions.js — single source of truth
const scaleSummaryLabels = scaleShortLabels

const CONFIDENCE_OPTIONS = [
  { value: 'high',   label: 'High',   color: '#059669', bg: '#D1FAE5', desc: 'Respondent had clear, direct knowledge of this area' },
  { value: 'medium', label: 'Medium', color: '#D97706', bg: '#FEF3C7', desc: 'Some uncertainty — respondent had partial visibility' },
  { value: 'low',    label: 'Low',    color: '#E74C3C', bg: '#FEE2E2', desc: 'Limited visibility — score should be validated further' },
]

function formatSavedAgo(date) {
  if (!date) return null
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 5)  return 'just now'
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  return `${mins}m ago`
}

function TopBar({ dimension, stepNumber, totalSteps, answeredCount, dkCount, totalQuestions, lastSavedAt }) {
  const progress = (stepNumber / totalSteps) * 100
  const savedLabel = formatSavedAgo(lastSavedAt)

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-logo">
          <div className="topbar-logo-mark">AI</div>
          <span className="topbar-logo-text">Readiness Assessment</span>
        </div>
        <div className="topbar-progress">
          <div className="topbar-progress-label">
            Dimension {stepNumber - 1} of 5 — {dimension.shortName}
            {' '}· {answeredCount}/{totalQuestions} scored
            {dkCount > 0 && <span style={{ color: '#94A3B8', marginLeft: 4 }}>· {dkCount} don't know</span>}
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {savedLabel ? (
          <span className="topbar-saved-indicator" role="status" aria-live="polite">
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Saved {savedLabel}
          </span>
        ) : (
          <span className="topbar-step-info">{stepNumber} / {totalSteps}</span>
        )}
      </div>
    </div>
  )
}

function AnchorPanel({ anchors, selectedValue, color }) {
  if (!anchors) return null
  if (!selectedValue || selectedValue === DK) {
    return (
      <div className="anchor-hint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Select a score to see behavioral descriptors for each level
      </div>
    )
  }

  return (
    <div className="anchor-panel" style={{ borderLeftColor: color }}>
      <div className="anchor-panel-header">
        <div className="anchor-score-badge" style={{ background: color }}>
          {selectedValue}
        </div>
        <div>
          <div className="anchor-score-label" style={{ color }}>
            {scaleLabels[selectedValue]}
          </div>
          <div className="anchor-desc">
            {anchors[selectedValue]}
          </div>
        </div>
      </div>

      <div className="anchor-strip">
        {[1, 2, 3, 4, 5].map(v => (
          <div
            key={v}
            className={`anchor-strip-item ${v === selectedValue ? 'selected' : ''}`}
            style={v === selectedValue ? { borderColor: color, background: color + '10' } : {}}
            title={anchors[v]}
          >
            <span
              className="anchor-strip-num"
              style={v === selectedValue ? { background: color, color: 'white' } : {}}
            >
              {v}
            </span>
            <span className="anchor-strip-text">{anchors[v]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuestionCard({ question, index, dimId, selectedValue, onSelect, color }) {
  const answered  = selectedValue !== undefined
  const isDontKnow = selectedValue === DK
  const isScored   = typeof selectedValue === 'number'
  const framework  = getQuestionFramework(dimId, index)

  return (
    <div className={`question-card ${answered ? 'answered' : ''} ${isDontKnow ? 'question-card--dk' : ''}`}>
      <div className="question-top">
        <span
          className="question-num"
          style={{
            background: isDontKnow ? '#F1F5F9' : isScored ? color + '20' : undefined,
            color:      isDontKnow ? '#94A3B8'  : isScored ? color       : undefined,
          }}
        >
          {index + 1}
        </span>
        <div style={{ flex: 1 }}>
          <p className="question-text" style={{ margin: 0 }}>{question.text}</p>
          {framework && (
            <div
              style={{
                marginTop: 6,
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                alignItems: 'center',
                fontSize: 10,
                color: 'var(--text-muted)',
              }}
              title="Framework alignment for this question"
            >
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: 3,
                  background: color + '15',
                  color: color,
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.02em',
                }}
              >
                {framework.primary}
              </span>
              {framework.secondary && (
                <span
                  style={{
                    padding: '1px 7px',
                    borderRadius: 3,
                    background: '#F1F5F9',
                    color: '#64748B',
                    fontWeight: 600,
                    fontSize: 10,
                  }}
                >
                  {framework.secondary}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 1–5 scale + Don't Know */}
      <div className="scale-row" role="radiogroup" aria-label={`Question ${index + 1} rating`}>
        {[1, 2, 3, 4, 5].map(val => (
          <label key={val} className="scale-option">
            <input
              type="radio"
              name={`q-${index}`}
              value={val}
              checked={selectedValue === val}
              onChange={() => onSelect(index, val)}
              aria-label={`${val} — ${scaleSummaryLabels[val - 1]}`}
            />
            <div
              className="scale-option-btn"
              style={
                selectedValue === val
                  ? { background: color, borderColor: color, color: 'white', boxShadow: `0 2px 8px ${color}55` }
                  : {}
              }
              title={question.anchors?.[val]}
              aria-hidden="true"
            >
              {val}
            </div>
          </label>
        ))}

        {/* Don't Know separator */}
        <div className="scale-dk-divider" aria-hidden="true" />

        {/* Don't Know button */}
        <label className="scale-option">
          <input
            type="radio"
            name={`q-${index}`}
            value={DK}
            checked={isDontKnow}
            onChange={() => onSelect(index, DK)}
            aria-label="Don't know — excluded from scoring"
          />
          <div
            className={`scale-dk-btn ${isDontKnow ? 'scale-dk-btn--selected' : ''}`}
            title="Respondent doesn't know or this is outside their area — excluded from scoring"
            aria-hidden="true"
          >
            ?
          </div>
        </label>
      </div>

      <div className="scale-end-labels">
        <span>1 — Not at all</span>
        <span style={{ flex: 1 }} />
        <span>5 — Advanced</span>
        <span className="scale-dk-label" style={{ marginLeft: 24 }}>? — Don't know</span>
      </div>

      {isDontKnow && (
        <div className="dk-note">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
          </svg>
          This question will be excluded from the dimension score. It will appear as a visibility gap in the report.
        </div>
      )}

      {question.anchors && !isDontKnow && (
        <AnchorPanel
          anchors={question.anchors}
          selectedValue={selectedValue}
          color={color}
        />
      )}
    </div>
  )
}

function ConfidenceSelector({ confidence, onConfidenceChange, color }) {
  return (
    <div className="confidence-section">
      <div className="confidence-header">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="confidence-label">Consultant Confidence</span>
        <span className="notes-optional">Optional</span>
      </div>
      <p className="confidence-hint">
        How confident are you in this dimension's scores? This reflects the respondent's
        visibility into the area — not their performance. Low confidence flags dimensions
        for transcript validation or a follow-up conversation.
      </p>
      <div className="confidence-options" role="group" aria-label="Consultant confidence level">
        {CONFIDENCE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`confidence-btn ${confidence === opt.value ? 'confidence-btn--selected' : ''}`}
            style={confidence === opt.value ? { background: opt.bg, borderColor: opt.color, color: opt.color } : {}}
            onClick={() => onConfidenceChange(confidence === opt.value ? null : opt.value)}
            aria-pressed={confidence === opt.value}
            aria-label={`${opt.label} confidence — ${opt.desc}`}
            title={opt.desc}
          >
            <span className="confidence-btn-dot" style={{ background: opt.color }} />
            {opt.label}
          </button>
        ))}
      </div>
      {confidence && (
        <div className="confidence-selected-note" style={{
          background: CONFIDENCE_OPTIONS.find(o => o.value === confidence)?.bg,
          color: CONFIDENCE_OPTIONS.find(o => o.value === confidence)?.color,
        }}>
          {CONFIDENCE_OPTIONS.find(o => o.value === confidence)?.desc}
        </div>
      )}
    </div>
  )
}

export default function DimensionAssessment({
  dimension,
  answers,
  onAnswer,
  notes,
  onNotesChange,
  confidence,
  onConfidenceChange,
  onNext,
  onBack,
  isComplete,
  stepNumber,
  totalSteps,
  company,
  lastSavedAt,
}) {
  const allEntries  = Object.values(answers)
  const scoredCount = allEntries.filter(v => typeof v === 'number').length
  const dkCount     = allEntries.filter(v => v === DK).length
  const totalAnswered = scoredCount + dkCount
  const totalQuestions = dimension.questions.length

  return (
    <div className="page">
      <TopBar
        dimension={dimension}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        answeredCount={scoredCount}
        dkCount={dkCount}
        totalQuestions={totalQuestions}
        lastSavedAt={lastSavedAt}
      />

      <div className="page-inner">
        {/* Dimension header */}
        <div className="dim-header">
          <div
            className="dim-header-pill"
            style={{ background: dimension.bgColor, color: dimension.color }}
          >
            <span style={{ fontSize: 16 }}>{dimIcons[dimension.id]}</span>
            Dimension {stepNumber - 1} of 5
            {isComplete && (
              <span className="completion-badge" style={{ marginLeft: 8 }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Complete
              </span>
            )}
          </div>

          <h2 className="dim-header-title">{dimension.name}</h2>
          <p className="dim-header-desc">{dimension.description}</p>
        </div>

        {/* Scale legend */}
        <div className="scale-legend">
          <span className="scale-legend-label">Scoring scale:</span>
          <div className="scale-legend-items">
            {[1, 2, 3, 4, 5].map(v => (
              <div key={v} className="scale-legend-item">
                <div
                  className="scale-legend-num"
                  style={{ background: dimension.bgColor, color: dimension.color }}
                >
                  {v}
                </div>
                <span>{scaleSummaryLabels[v - 1]}</span>
                {v < 5 && <span style={{ color: 'var(--border)', marginLeft: 4 }}>·</span>}
              </div>
            ))}
            <div className="scale-legend-item" style={{ marginLeft: 8 }}>
              <div className="scale-legend-num scale-legend-dk">?</div>
              <span style={{ color: 'var(--text-muted)' }}>Don't know</span>
            </div>
          </div>
        </div>

        {/* Behavioral anchors callout */}
        <div className="anchors-callout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Each question includes <strong>behaviorally-anchored descriptors</strong> — select a score to see what good evidence looks like at each level. Use <strong>?</strong> if the respondent lacks visibility into that question.
        </div>

        {/* Questions */}
        <div className="question-list">
          {dimension.questions.map((q, i) => (
            <QuestionCard
              key={i}
              question={q}
              index={i}
              dimId={dimension.id}
              selectedValue={answers[i]}
              onSelect={onAnswer}
              color={dimension.color}
            />
          ))}
        </div>

        {/* Remaining nudge */}
        {!isComplete && totalAnswered > 0 && (
          <div className="remaining-nudge">
            {totalQuestions - totalAnswered} question
            {totalQuestions - totalAnswered !== 1 ? 's' : ''} remaining — score each one or mark as <strong>?</strong> (Don't know) to continue
          </div>
        )}

        {/* Consultant Confidence */}
        <ConfidenceSelector
          confidence={confidence}
          onConfidenceChange={onConfidenceChange}
          color={dimension.color}
        />

        {/* Consultant Observations */}
        <div className="notes-section">
          <div className="notes-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="notes-label">Consultant Observations</span>
            <span className="notes-optional">Optional</span>
          </div>
          <p className="notes-hint">
            Key quotes, context, or observations that justify the scores above. These appear in the results report and can serve as your transcript validation reference.
          </p>
          <textarea
            className="notes-textarea"
            placeholder={`e.g. "Leadership expressed strong interest in AI but strategy ownership is unclear. CTO is a champion but lacks budget authority..."`}
            value={notes || ''}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
          />
        </div>
      </div>

      {/* Sticky footer nav */}
      <div className="nav-footer">
        <div className="nav-footer-inner">
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back
          </button>

          <div className="nav-progress-text">
            <strong>{scoredCount}</strong> scored
            {dkCount > 0 && <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>· {dkCount} don't know</span>}
            <span style={{ color: 'var(--text-muted)' }}> / {totalQuestions}</span>
          </div>

          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!isComplete}
            title={!isComplete ? `Answer all ${totalQuestions} questions to continue` : ''}
          >
            {stepNumber < totalSteps - 1 ? 'Next Dimension →' : 'View Results →'}
          </button>
        </div>
      </div>
    </div>
  )
}
