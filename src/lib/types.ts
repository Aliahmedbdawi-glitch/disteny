export interface PanelConfig {
  text: string
}

export interface AppState {
  habitTitle: string
  streakGoal: number
  streak: number
  score: number
  lastPositiveDate: string | null
  seenIntro: boolean
  greetings: string[]
  left: PanelConfig
  right: PanelConfig
}

export type PanelSide = 'left' | 'right'

export interface PositiveResult {
  state: AppState
  streakGained: number
  scoreGained: number
}

export const DEFAULT_STATE: AppState = {
  habitTitle: '',
  streakGoal: 30,
  streak: 0,
  score: 0,
  lastPositiveDate: null,
  seenIntro: false,
  greetings: [],
  left: { text: '' },
  right: { text: '' },
}
