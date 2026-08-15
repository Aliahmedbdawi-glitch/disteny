import type { AppState, PositiveResult } from './types'

export function getTodayKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function applyPositive(state: AppState, today = getTodayKey()): PositiveResult {
  const next: AppState = { ...state, score: state.score + 1 }
  let streakGained = 0

  if (state.lastPositiveDate !== today) {
    next.streak = state.streak + 1
    next.lastPositiveDate = today
    streakGained += 1
  }

  if (next.score > 0 && next.score % 10 === 0) {
    next.streak += 1
    streakGained += 1
  }

  return {
    state: next,
    streakGained,
    scoreGained: 1,
  }
}

export function applyNegative(state: AppState): AppState {
  return {
    ...state,
    streak: 0,
  }
}

export function getGoalProgress(streak: number, goal: number): number {
  if (goal <= 0) return 0
  return Math.min(streak / goal, 1)
}

export function isGoalComplete(streak: number, goal: number): boolean {
  return goal > 0 && streak >= goal
}
