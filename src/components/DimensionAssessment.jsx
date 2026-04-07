import { useState } from 'react'
import { scaleLabels } from '../data/questions'

const dimIcons = { 1: '🎯', 2: '🗄️', 3: '⚖️', 4: '👥', 5: '⚙️' }

const scaleSummaryLabels = [
  'Not at all',
  'Early / Ad-hoc',
  'Developing',
  'Established',
  'Advanced',
]

function TopBar({ dimension, stepNumber, totalSteps, answeredCount, totalQuestions }) {
  const progress = (stepNumber / totalSteps) * 100

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
            {' '}· {answeredCount}/{totalQuestions} answered
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="topbar-step-info">{stepNumber} / {totalSteps}</span>
      </div>
    </div>
  )
}

// Expandable behavioral anchor panel shown when a score is selected or on hover
function AnchorPanel({ anchors, selectedValue, color }) {
  if (!anchors) return null

  const display = selectedValue || null

  if (!display) {
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
          {display}
        </div>
        <div>
          <div className="anchor-score-label" style={{ color }}>
            {scaleLabels[display]}
          </div>
          <div className="anchor-desc">
            {anchors[display]}
          </div>
        </div>
      </div>

      {/* Mini scale strip showing all 5 anchors */}
      <div className="anchor-strip">
        {[1, 2, 3, 4, 5].map(v => (
          <div
            key={v}
            className={`anchor-strip-item ${v === display ? 'selected' : ''}`}
            style={v === display ? { borderColor: color, background: color + '10' } : {}}
            title={anchors[v]}
          >
            <span
              className="anchor-strip-num"
              style={v === display ? { background: color, color: 'white' } : {}}
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

function QuestionCard({ question, index, selectedValue, onSelect, color }) {
  const [showAllAnchors, setShowAllAnchors] = useState(false)
  const answered = selectedValue !== undefined

  return (
    <div className={`question-card ${answered ? 'answered' : ''}`}>
      <div className="question-top">
        <span
          className="question-num"
          style={{
            background: answered ? color + '20' : undefined,
            color: answered ? color : undefined,
          }}
        >
          {index + 1}
        </span>
        <p className="question-text">{question.text}</p>
      </div>

      {/* 1–5 scale */}
      <div className="scale-row">
        {[1, 2, 3, 4, 5].map(val => (
          <label key={val} className="scale-option">
            <input
              type="radio"
              name={`q-${index}`}
              value={val}
              checked={selectedValue === val}
              onChange={() => onSelect(index, val)}
            />
            <div
              className="scale-option-btn"
              style={
                selectedValue === val
                  ? {
                      background: color,
                      borderColor: color,
                      color: 'white',
                      boxShadow: `0 2px 8px ${color}55`,
                    }
                  : {}
              }
              title={question.anchors?.[val]}
            >
              {val}
            </div>
          </label>
        ))}
      </div>

      <div className="scale-end-labels">
        <span>Not at all</span>
        <span>Advanced</span>
      </div>

      {/* Behavioral anchor panel */}
      {question.anchors && (
        <AnchorPanel
          anchors={question.anchors}
          selectedValue={selectedValue}
          color={color}
        />
      )}
    </div>
  )
}

export default function DimensionAssessment({
  dimension,
  answers,
  onAnswer,
  onNext,
  onBack,
  isComplete,
  stepNumber,
  totalSteps,
  company,
}) {
  const answeredCount = Object.keys(answers).length
  const totalQuestions = dimension.questions.length

  return (
    <div className="page">
      <TopBar
        dimension={dimension}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
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
          </div>
        </div>

        {/* Behavioral anchors callout */}
        <div className="anchors-callout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Each question includes <strong>behaviorally-anchored descriptors</strong> — select a score to see what good evidence looks like at each level.
        </div>

        {/* Questions */}
        <div className="question-list">
          {dimension.questions.map((q, i) => (
            <QuestionCard
              key={i}
              question={q}
              index={i}
              selectedValue={answers[i]}
              onSelect={onAnswer}
              color={dimension.color}
            />
          ))}
        </div>

        {/* Remaining nudge */}
        {!isComplete && answeredCount > 0 && (
          <div className="remaining-nudge">
            {totalQuestions - answeredCount} question
            {totalQuestions - answeredCount !== 1 ? 's' : ''} remaining before you can continue
          </div>
        )}
      </div>

      {/* Sticky footer nav */}
      <div className="nav-footer">
        <div className="nav-footer-inner">
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back
          </button>

          <div className="nav-progress-text">
            <strong>{answeredCount}</strong> / {totalQuestions} answered
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
