import type { AppState, PositiveResult, SlipPenalty } from './types'

const DAY_POSITIVE_MONEY = 100
const CLICK_POSITIVE_MONEY = 20
const MILESTONE_MONEY = 200
const BASE_MILESTONES = new Set([3, 7, 10, 14, 20])

export function getTodayKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isJourneyMilestone(day: number): boolean {
  if (BASE_MILESTONES.has(day)) return true
  return day >= 30 && day % 10 === 0
}

export function countCrossedMilestones(fromStreak: number, toStreak: number): number {
  let count = 0
  for (let day = fromStreak + 1; day <= toStreak; day++) {
    if (isJourneyMilestone(day)) count += 1
  }
  return count
}

export function applyPositive(state: AppState, today = getTodayKey()): PositiveResult {
  const previousStreak = state.streak
  const firstOfDay = state.lastPositiveDate !== today
  const next: AppState = { ...state, score: state.score + 1 }
  let streakGained = 0

  if (firstOfDay) {
    next.streak = state.streak + 1
    next.lastPositiveDate = today
    streakGained += 1
  }

  if (next.score > 0 && next.score % 10 === 0) {
    next.streak += 1
    streakGained += 1
  }

  const tapMoney = firstOfDay ? DAY_POSITIVE_MONEY : CLICK_POSITIVE_MONEY
  const stageMoney = countCrossedMilestones(previousStreak, next.streak) * MILESTONE_MONEY
  const moneyGained = tapMoney + stageMoney
  next.money = state.money + moneyGained

  return {
    state: next,
    streakGained,
    scoreGained: 1,
    moneyGained,
  }
}

export function applyNegative(state: AppState, penalty: SlipPenalty): AppState {
  return {
    ...state,
    streak: 0,
    money: state.money - penalty,
  }
}

export function getGoalProgress(streak: number, goal: number): number {
  if (goal <= 0) return 0
  return Math.min(streak / goal, 1)
}

export function isGoalComplete(streak: number, goal: number): boolean {
  return goal > 0 && streak >= goal
}
