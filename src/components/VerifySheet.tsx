import { useCallback, useEffect, useRef, useState } from 'react'
import { excerptText } from '../lib/text'
import type { PanelSide } from '../lib/types'
import './VerifySheet.css'

const HOLD_DURATION = 1200

interface VerifySheetProps {
  side: PanelSide
  caption: string
  onConfirm: () => void
  onCancel: () => void
}

export default function VerifySheet({ side, caption, onConfirm, onCancel }: VerifySheetProps) {
  const [holdProgress, setHoldProgress] = useState(0)
  const holdRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  const isLeft = side === 'left'
  const displayCaption = excerptText(caption) || (isLeft ? 'I slipped.' : 'I held the line.')

  const clearHold = useCallback(() => {
    if (holdRef.current) window.clearTimeout(holdRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    holdRef.current = null
    startRef.current = null
    rafRef.current = null
    setHoldProgress(0)
  }, [])

  const startHold = useCallback(() => {
    if (completedRef.current) return
    startRef.current = performance.now()

    const tick = (now: number) => {
      if (!startRef.current) return
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / HOLD_DURATION, 1)
      setHoldProgress(progress)

      if (progress >= 1) {
        completedRef.current = true
        onConfirm()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [onConfirm])

  const endHold = useCallback(() => {
    if (!completedRef.current && holdProgress < 1) {
      clearHold()
    }
  }, [clearHold, holdProgress])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
      if (!isLeft && e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isLeft, onCancel, onConfirm])

  useEffect(() => () => clearHold(), [clearHold])

  return (
    <div className="verify-overlay" onClick={onCancel} role="presentation">
      <div
        className={`verify-sheet glass verify-sheet--${side}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
      >
        <p className="verify-sheet__tag" id="verify-title">
          {isLeft ? 'Slip' : 'Hold'}
        </p>
        <p className="verify-sheet__quote serif">
          {displayCaption}
        </p>
        <p className="verify-sheet__hint">
          {isLeft
            ? 'Reset streak to 0. Score is kept.'
            : 'Confirm to log a positive tap.'}
        </p>

        {isLeft ? (
          <div className="hold-rail">
            <div
              className="hold-rail__track"
              role="progressbar"
              aria-valuenow={Math.round(holdProgress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Hold to reset streak"
            >
              <div className="hold-rail__fill" style={{ width: `${holdProgress * 100}%` }} />
              <span className="hold-rail__label">
                {holdProgress >= 1 ? 'Reset' : 'Hold 1.2s to reset'}
              </span>
            </div>
            <button
              type="button"
              className="hold-rail__btn"
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              onPointerCancel={endHold}
            >
              Press and hold
            </button>
            <div className="hold-rail__progress" aria-hidden="true">
              <div
                className="hold-rail__progress-fill"
                style={{ width: `${holdProgress * 100}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="verify-sheet__actions">
          <button type="button" className="verify-sheet__btn verify-sheet__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          {!isLeft && (
            <button type="button" className="verify-sheet__btn verify-sheet__btn--confirm" onClick={onConfirm}>
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
