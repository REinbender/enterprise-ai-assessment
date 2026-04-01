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
          <div className="topbar-logo-mark">◆</div>
          <span className="topbar-logo-text">AI <span>Readiness</span></span>
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

function QuestionCard({ question, index, selectedValue, onSelect, color }) {
  const answered = selectedValue !== undefined
  return (
    <div className={`question-card${answered ? ' answered' : ''}`}>
      <div className="question-top">
        <span className="question-num" style={{ background: answered ? color + '20' : undefined, color: answered ? color : undefined }}>
          {index + 1}
        </span>
        <p className="question-text">{question}</p>
      </div>

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
              style={selectedValue === val ? {
                background: color,
                borderColor: color,
                color: 'white',
                boxShadow: `0 2px 8px ${color}55`,
              } : {}}
            >
              {val}
            </div>
          </label>
        ))}
      </div>

      <div className="scale-labels">
        <span className="scale-label-text">Not at all</span>
        <span className="scale-label-text">Advanced</span>
      </div>
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
        {/* Dimension Header */}
        <div className="dim-header">
          <div
            className="dim-header-pill"
            style={{ background: dimension.bgColor, color: dimension.color }}
          >
            <span style={{ fontSize: 16 }}>{dimIcons[dimension.id]}</span>
            Dimension {stepNumber - 1} of 5
            {isComplete && (
              <span className="completion-badge" style={{ marginLeft: 4 }}>
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

        {/* Scale Legend */}
        <div className="scale-legend">
          <span className="scale-legend-label">Rating scale:</span>
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
                {v < 5 && <span style={{ color: 'var(--border)', marginLeft: 2 }}>·</span>}
              </div>
            ))}
          </div>
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

        {/* Completion nudge */}
        {!isComplete && answeredCount > 0 && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--card)',
            border: '1px dashed var(--border)',
            borderRadius: 12,
            marginBottom: 32,
            fontSize: 13,
            color: 'var(--text-muted)',
          }}>
            {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? 's' : ''} remaining
            before you can continue
          </div>
        )}
      </div>

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
