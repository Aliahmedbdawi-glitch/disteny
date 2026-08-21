export interface PanelConfig {
  text: string
}

export interface AppState {
  habitTitle: string
  streakGoal: number
  streak: number
  score: number
  money: number
  lastPositiveDate: string | null
  seenIntro: boolean
  greetings: string[]
  left: PanelConfig
  right: PanelConfig
}

export type PanelSide = 'left' | 'right'

export type SlipPenalty = 100 | 1000

export interface PositiveResult {
  state: AppState
  streakGained: number
  scoreGained: number
  moneyGained: number
}

export const DEFAULT_STATE: AppState = {
  habitTitle: '',
  streakGoal: 100,
  streak: 0,
  score: 0,
  money: -1500,
  lastPositiveDate: null,
  seenIntro: false,
  greetings: [],
  left: { text: '' },
  right: { text: '' },
}
