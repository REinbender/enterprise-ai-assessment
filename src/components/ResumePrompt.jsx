import { dimensions } from '../data/questions'

export default function ResumePrompt({ savedData, onResume, onStartFresh }) {
  const { company, answers, step } = savedData

  // Count how many dimensions have at least one answer
  const dimsStarted = dimensions.filter(
    d => Object.keys(answers[d.id] || {}).length > 0
  ).length

  const stepLabel =
    step === 1
      ? 'Company information'
      : step >= 2 && step <= 6
      ? `${dimensions[step - 2].name}`
      : 'Assessment'

  return (
    <div className="resume-overlay">
      <div className="resume-card">
        <div className="resume-icon">💾</div>
        <h2 className="resume-title">Welcome back!</h2>
        <p className="resume-subtitle">
          You have an assessment in progress
          {company?.name ? ` for ${company.name}` : ''}.
        </p>

        <div className="resume-meta">
          <div className="resume-meta-item">
            <span className="resume-meta-label">Last section</span>
            <span className="resume-meta-value">{stepLabel}</span>
          </div>
          <div className="resume-meta-item">
            <span className="resume-meta-label">Dimensions started</span>
            <span className="resume-meta-value">
              {dimsStarted} of {dimensions.length}
            </span>
          </div>
          {company?.name && (
            <div className="resume-meta-item">
              <span className="resume-meta-label">Organization</span>
              <span className="resume-meta-value">{company.name}</span>
            </div>
          )}
        </div>

        <div className="resume-actions">
          <button className="btn-primary" onClick={onResume}>
            Continue Assessment
          </button>
          <button className="btn-ghost" onClick={onStartFresh}>
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  )
}
