import { useState } from 'react'
import { dimensions } from './data/questions'
import IntroScreen from './components/IntroScreen'
import CompanyForm from './components/CompanyForm'
import DimensionAssessment from './components/DimensionAssessment'
import ResultsPage from './components/ResultsPage'

const initialAnswers = () =>
  dimensions.reduce((acc, d) => ({ ...acc, [d.id]: {} }), {})

export default function App() {
  const [step, setStep] = useState(0)
  const [company, setCompany] = useState({ name: '', industry: '', size: '' })
  const [answers, setAnswers] = useState(initialAnswers)

  // steps: 0=intro, 1=company, 2-6=dimension[0-4], 7=results
  const dimIndex = step - 2 // 0-4 when step is 2-6
  const currentDimension = dimIndex >= 0 && dimIndex < dimensions.length
    ? dimensions[dimIndex]
    : null

  const handleAnswer = (questionIdx, score) => {
    setAnswers(prev => ({
      ...prev,
      [currentDimension.id]: {
        ...prev[currentDimension.id],
        [questionIdx]: score,
      },
    }))
  }

  const isDimensionComplete = (dimId) => {
    const dim = dimensions.find(d => d.id === dimId)
    return Object.keys(answers[dimId]).length === dim.questions.length
  }

  const handleRestart = () => {
    setStep(0)
    setCompany({ name: '', industry: '', size: '' })
    setAnswers(initialAnswers())
  }

  const totalSteps = 7 // company + 5 dims + results

  if (step === 0) {
    return <IntroScreen onStart={() => setStep(1)} />
  }

  if (step === 1) {
    return (
      <CompanyForm
        company={company}
        onChange={setCompany}
        onNext={() => setStep(2)}
        onBack={() => setStep(0)}
      />
    )
  }

  if (step >= 2 && step <= 6) {
    return (
      <DimensionAssessment
        dimension={currentDimension}
        answers={answers[currentDimension.id]}
        onAnswer={handleAnswer}
        onNext={() => setStep(step + 1)}
        onBack={() => setStep(step - 1)}
        isComplete={isDimensionComplete(currentDimension.id)}
        stepNumber={step}
        totalSteps={totalSteps}
        company={company}
      />
    )
  }

  if (step === 7) {
    return (
      <ResultsPage
        company={company}
        answers={answers}
        onRestart={handleRestart}
      />
    )
  }

  return null
}
