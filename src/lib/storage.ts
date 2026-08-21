import { get, set, del } from 'idb-keyval'
import { DEFAULT_STATE, type AppState, type PanelSide } from './types'

const STATE_KEY = 'disteny-state'
const LEFT_IMAGE_KEY = 'left-image'
const RIGHT_IMAGE_KEY = 'right-image'

function mergeState(parsed: Partial<AppState>): AppState {
  return {
    ...DEFAULT_STATE,
    ...parsed,
    money: typeof parsed.money === 'number' ? parsed.money : DEFAULT_STATE.money,
    greetings: Array.isArray(parsed.greetings) ? parsed.greetings : DEFAULT_STATE.greetings,
    left: { ...DEFAULT_STATE.left, ...parsed.left },
    right: { ...DEFAULT_STATE.right, ...parsed.right },
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return mergeState(JSON.parse(raw) as Partial<AppState>)
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STATE_KEY, JSON.stringify(state))
}

export async function loadImage(side: PanelSide): Promise<string | null> {
  const key = side === 'left' ? LEFT_IMAGE_KEY : RIGHT_IMAGE_KEY
  const blob = await get<Blob>(key)
  if (!blob) return null
  return URL.createObjectURL(blob)
}

export async function saveImage(side: PanelSide, file: File): Promise<string> {
  const key = side === 'left' ? LEFT_IMAGE_KEY : RIGHT_IMAGE_KEY
  await set(key, file)
  return URL.createObjectURL(file)
}

export async function removeImage(side: PanelSide): Promise<void> {
  const key = side === 'left' ? LEFT_IMAGE_KEY : RIGHT_IMAGE_KEY
  await del(key)
}

export async function loadAllImages(): Promise<{ left: string | null; right: string | null }> {
  const [left, right] = await Promise.all([loadImage('left'), loadImage('right')])
  return { left, right }
}
