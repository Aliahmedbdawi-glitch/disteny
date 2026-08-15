import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const SLIDES = [
  { wordmark: 'Disteny', line: 'One habit. Two sides.' },
  { wordmark: 'Disteny', line: 'Right holds the line. Left resets the days.' },
  { wordmark: 'Disteny', line: 'Set the images. Set the goal.' },
]

export default function Intro() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { markIntroSeen } = useApp()

  const finish = (toSettings: boolean) => {
    markIntroSeen()
    navigate(toSettings ? '/settings' : '/')
  }

  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  return (
    <main className="intro-page">
      <div>
        <h1 className="intro-page__wordmark">{slide.wordmark}</h1>
        <p className="intro-page__line">{slide.line}</p>
      </div>

      <div>
        <div className="intro-page__dots" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`intro-page__dot${i === step ? ' intro-page__dot--active' : ''}`}
            />
          ))}
        </div>

        <div className="intro-page__actions">
          <button type="button" className="intro-page__skip" onClick={() => finish(false)}>
            Skip
          </button>
          <button
            type="button"
            className="intro-page__next"
            onClick={() => {
              if (isLast) finish(true)
              else setStep((s) => s + 1)
            }}
          >
            {isLast ? 'Set up' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  )
}
