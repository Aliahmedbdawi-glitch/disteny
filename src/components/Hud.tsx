import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { getGoalProgress, isGoalComplete } from '../lib/streak'
import './Hud.css'

interface HudProps {
  habitTitle: string
  streak: number
  score: number
  streakGoal: number
  pulse?: boolean
  drain?: boolean
}

function LedRail({
  filled,
  total,
  pulse,
  drain,
  goalComplete,
}: {
  filled: number
  total: number
  pulse?: boolean
  drain?: boolean
  goalComplete?: boolean
}) {
  const segments = Math.max(total, 1)
  const filledCount = Math.min(filled, segments)

  return (
    <div
      className={`led-rail${goalComplete ? ' led-rail--goal' : ''}${pulse ? ' led-rail--pulse' : ''}${drain ? ' led-rail--drain' : ''}`}
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Streak progress: ${filled} of ${total} days`}
    >
      {Array.from({ length: segments }, (_, i) => (
        <div
          key={i}
          className={`led-rail__segment${i < filledCount ? ' led-rail__segment--filled' : ''}`}
          style={drain ? { animationDelay: `${i * 20}ms` } : undefined}
        />
      ))}
    </div>
  )
}

export default function Hud({ habitTitle, streak, score, streakGoal, pulse, drain }: HudProps) {
  const reduceMotion = useReducedMotion()
  const goalComplete = isGoalComplete(streak, streakGoal)
  const progress = getGoalProgress(streak, streakGoal)

  return (
    <header className="hud glass">
      <div className="hud__top">
        <div className="hud__brand">
          <motion.div
            className={`hud__wordmark${goalComplete ? ' hud__wordmark--goal' : ''}`}
            key={goalComplete ? 'goal' : 'disteny'}
            initial={reduceMotion ? false : { opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {goalComplete ? 'GOAL' : 'Disteny'}
          </motion.div>
          {habitTitle && <span className="hud__habit">{habitTitle}</span>}
        </div>

        <div className="hud__stats">
          <div className="hud__stat">
            <span className="hud__stat-label">Streak</span>
            <motion.span
              className="hud__stat-value hud__stat-value--streak mono"
              key={streak}
              initial={reduceMotion ? false : { y: -4, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {streak}
            </motion.span>
          </div>
          <div className="hud__stat">
            <span className="hud__stat-label">Score</span>
            <motion.span
              className="hud__stat-value mono"
              key={score}
              initial={reduceMotion ? false : { y: -4, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {score}
            </motion.span>
          </div>
        </div>

        <Link to="/settings" className="hud__settings" aria-label="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </Link>
      </div>

      <LedRail
        filled={Math.round(progress * streakGoal)}
        total={streakGoal}
        pulse={pulse}
        drain={drain}
        goalComplete={goalComplete}
      />
    </header>
  )
}
