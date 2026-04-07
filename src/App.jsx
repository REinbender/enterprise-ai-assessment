import { useState, useEffect } from 'react'
import { dimensions } from './data/questions'
import IntroScreen from './components/IntroScreen'
import CompanyForm from './components/CompanyForm'
import DimensionAssessment from './components/DimensionAssessment'
import ResultsPage from './components/ResultsPage'
import NavigationSidebar from './components/NavigationSidebar'
import ResumePrompt from './components/ResumePrompt'

const STORAGE_KEY = 'ai_readiness_v1'

const defaultAnswers = () =>
  dimensions.reduce((acc, d) => ({ ...acc, [d.id]: {} }), {})

const defaultState = () => ({
  step: 0,
  company: { name: '', industry: '', size: '' },
  answers: defaultAnswers(),
})

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  const [appState, setAppState] = useState(defaultState)
  const [savedData, setSavedData] = useState(null)
  const [showResume, setShowResume] = useState(false)

  const { step, company, answers } = appState

  // On mount: check for saved progress
  useEffect(() => {
    const saved = loadSaved()
    if (saved && saved.step > 0) {
      setSavedData(saved)
      setShowResume(true)
    }
  }, [])

  // Auto-save whenever state changes (skip step 0 / results)
  useEffect(() => {
    if (step > 0 && step < 7) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
    }
  }, [appState])

  const patch = (obj) => setAppState(prev => ({ ...prev, ...obj }))

  const goTo = (s) => patch({ step: s })

  const handleAnswer = (dimId, qIdx, score) => {
    patch({
      answers: {
        ...answers,
        [dimId]: { ...answers[dimId], [qIdx]: score },
      },
    })
  }

  const isDimensionComplete = (dimId) => {
    const dim = dimensions.find(d => d.id === dimId)
    return Object.keys(answers[dimId]).length === dim.questions.length
  }

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAppState(defaultState())
  }

  const handleResume = () => {
    setAppState(savedData)
    setShowResume(false)
  }

  const handleStartFresh = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSavedData(null)
    setShowResume(false)
  }

  const currentDimension = step >= 2 && step <= 6 ? dimensions[step - 2] : null
  const showSidebar = step >= 1 && step <= 6

  if (showResume) {
    return (
      <ResumePrompt
        savedData={savedData}
        onResume={handleResume}
        onStartFresh={handleStartFresh}
      />
    )
  }

  return (
    <div className="app-shell">
      {showSidebar && (
        <NavigationSidebar
          currentStep={step}
          company={company}
          answers={answers}
          isDimensionComplete={isDimensionComplete}
          onNavigate={goTo}
        />
      )}

      <main className={`app-main${showSidebar ? ' with-sidebar' : ''}`}>
        {step === 0 && <IntroScreen onStart={() => goTo(1)} />}

        {step === 1 && (
          <CompanyForm
            company={company}
            onChange={(c) => patch({ company: c })}
            onNext={() => goTo(2)}
            onBack={() => goTo(0)}
          />
        )}

        {step >= 2 && step <= 6 && (
          <DimensionAssessment
            dimension={currentDimension}
            answers={answers[currentDimension.id]}
            onAnswer={(qIdx, score) =>
              handleAnswer(currentDimension.id, qIdx, score)
            }
            onNext={() => goTo(step + 1)}
            onBack={() => goTo(step - 1)}
            isComplete={isDimensionComplete(currentDimension.id)}
            stepNumber={step}
            totalSteps={7}
            company={company}
          />
        )}

        {step === 7 && (
          <ResultsPage
            company={company}
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}
