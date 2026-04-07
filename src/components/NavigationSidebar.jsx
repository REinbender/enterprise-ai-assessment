import { dimensions } from '../data/questions'

const STEP_COMPANY = 1
const STEP_RESULTS = 7

export default function NavigationSidebar({
  currentStep,
  company,
  answers,
  isDimensionComplete,
  onNavigate,
}) {
  const steps = [
    {
      step: STEP_COMPANY,
      label: 'Company Profile',
      icon: '🏢',
      isComplete: !!(company.name && company.industry && company.size),
      isAccessible: true,
    },
    ...dimensions.map((dim, i) => ({
      step: i + 2,
      label: dim.name,
      shortLabel: dim.shortName,
      icon: ['🎯', '🗄️', '⚖️', '👥', '⚙️'][i],
      color: dim.color,
      isComplete: isDimensionComplete(dim.id),
      answeredCount: Object.keys(answers[dim.id] || {}).length,
      totalCount: dim.questions.length,
      isAccessible: true, // allow navigating back to any started step
    })),
  ]

  const overallProgress = steps.filter(s => s.isComplete).length
  const progressPct = Math.round((overallProgress / steps.length) * 100)

  return (
    <aside className="sidebar">
      {/* Logo / Brand */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">AI</div>
          <div>
            <div className="sidebar-brand-name">Readiness</div>
            <div className="sidebar-brand-sub">Assessment</div>
          </div>
        </div>
        {company.name && (
          <div className="sidebar-company-name">{company.name}</div>
        )}
      </div>

      {/* Overall progress bar */}
      <div className="sidebar-progress-wrap">
        <div className="sidebar-progress-label">
          <span>Overall Progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="sidebar-progress-track">
          <div
            className="sidebar-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step list */}
      <nav className="sidebar-nav">
        {steps.map(({ step, label, shortLabel, icon, color, isComplete, isAccessible, answeredCount, totalCount }) => {
          const isCurrent = currentStep === step
          const canClick = isAccessible && step !== currentStep

          return (
            <button
              key={step}
              className={`sidebar-step ${isCurrent ? 'active' : ''} ${isComplete ? 'complete' : ''} ${canClick ? 'clickable' : ''}`}
              onClick={() => canClick && onNavigate(step)}
              disabled={!canClick && !isCurrent}
              title={canClick ? `Go back to: ${label}` : label}
            >
              {/* Status indicator */}
              <div
                className="sidebar-step-indicator"
                style={isComplete ? { background: color || '#10B981' } : isCurrent ? { background: color || '#2EA3F2', opacity: 0.15 } : {}}
              >
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className="sidebar-step-num" style={isCurrent ? { color: color || '#2EA3F2' } : {}}>
                    {step}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="sidebar-step-content">
                <span className="sidebar-step-label">{shortLabel || label}</span>
                {totalCount && !isComplete && (
                  <span className="sidebar-step-progress">
                    {answeredCount}/{totalCount}
                  </span>
                )}
                {isComplete && (
                  <span className="sidebar-step-done">Complete</span>
                )}
              </div>

              {/* Edit icon on hover for completed steps */}
              {isComplete && canClick && (
                <svg className="sidebar-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          )
        })}
      </nav>

      {/* Version badge */}
      <div className="sidebar-footer">
        <span className="sidebar-version">v1.2.0</span>
        <span className="sidebar-version-label">60 questions · 5 dimensions</span>
      </div>
    </aside>
  )
}
