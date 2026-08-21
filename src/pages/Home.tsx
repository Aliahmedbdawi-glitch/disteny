import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GreetingOverlay from '../components/GreetingOverlay'
import Hud from '../components/Hud'
import SplitPanel from '../components/SplitPanel'
import VerifySheet from '../components/VerifySheet'
import { useApp } from '../context/AppContext'
import { pickGreeting } from '../lib/greetings'
import type { ConfirmKind } from '../components/VerifySheet'
import type { PanelSide } from '../lib/types'

export default function Home() {
  const { state, images, confirmPositive, confirmNegative } = useApp()
  const [verifySide, setVerifySide] = useState<PanelSide | null>(null)
  const [activeSide, setActiveSide] = useState<PanelSide | null>(null)
  const [pulse, setPulse] = useState(false)
  const [drain, setDrain] = useState(false)
  const [greeting, setGreeting] = useState<string | null>(null)
  const lastGreetingRef = useRef<string | null>(null)

  const needsSetup = !images.left && !images.right

  const handlePanelClick = (side: PanelSide) => {
    setActiveSide(side)
    setVerifySide(side)
  }

  const handleCancel = useCallback(() => {
    setVerifySide(null)
    setActiveSide(null)
  }, [])

  const handleConfirm = useCallback((kind?: ConfirmKind) => {
    if (!verifySide) return

    if (verifySide === 'right') {
      confirmPositive()
      setPulse(true)
      setTimeout(() => setPulse(false), 600)

      const picked = pickGreeting(state.greetings, lastGreetingRef.current)
      if (picked) {
        lastGreetingRef.current = picked
        setGreeting(picked)
      }
    } else {
      confirmNegative(kind === 'severe' ? 1000 : 100)
      setDrain(true)
      setTimeout(() => setDrain(false), 500)
    }

    setVerifySide(null)
    setActiveSide(null)
  }, [verifySide, confirmPositive, confirmNegative, state.greetings])

  return (
    <main className="cockpit">
      <Hud
        habitTitle={state.habitTitle}
        streak={state.streak}
        score={state.score}
        money={state.money}
        streakGoal={state.streakGoal}
        pulse={pulse}
        drain={drain}
      />

      <div className="cockpit__split">
        <SplitPanel
          side="left"
          label="Slip"
          text={state.left.text}
          imageUrl={images.left}
          active={activeSide === 'left'}
          dimmed={activeSide === 'right'}
          onClick={() => handlePanelClick('left')}
        />
        <SplitPanel
          side="right"
          label="Hold"
          text={state.right.text}
          imageUrl={images.right}
          active={activeSide === 'right'}
          dimmed={activeSide === 'left'}
          onClick={() => handlePanelClick('right')}
        />
        <div className="cockpit__edge" aria-hidden="true" />
      </div>

      {needsSetup && (
        <Link to="/settings" className="cockpit__setup">
          Setup
        </Link>
      )}

      {verifySide && (
        <VerifySheet
          side={verifySide}
          caption={verifySide === 'left' ? state.left.text : state.right.text}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {greeting && (
        <GreetingOverlay message={greeting} onDismiss={() => setGreeting(null)} />
      )}
    </main>
  )
}
