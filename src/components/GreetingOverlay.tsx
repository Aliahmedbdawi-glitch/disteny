import { useCallback, useEffect, useState } from 'react'
import './GreetingOverlay.css'

const AUTO_DISMISS_MS = 2800

interface GreetingOverlayProps {
  message: string
  onDismiss: () => void
}

export default function GreetingOverlay({ message, onDismiss }: GreetingOverlayProps) {
  const [exiting, setExiting] = useState(false)

  const dismiss = useCallback(() => {
    setExiting(true)
    window.setTimeout(onDismiss, 280)
  }, [onDismiss])

  useEffect(() => {
    const timer = window.setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [dismiss])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dismiss])

  return (
    <div
      className={`greeting-overlay${exiting ? ' greeting-overlay--out' : ''}`}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="greeting-message"
    >
      <div className="greeting-overlay__card glass">
        <span className="greeting-overlay__tag">Hold</span>
        <p className="greeting-overlay__message" id="greeting-message">
          {message}
        </p>
        <span className="greeting-overlay__dismiss">Tap to dismiss</span>
      </div>
    </div>
  )
}
