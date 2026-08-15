import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { applyNegative, applyPositive } from '../lib/streak'
import { loadAllImages, loadState, saveImage, saveState } from '../lib/storage'
import type { AppState, PanelSide } from '../lib/types'

interface ImageUrls {
  left: string | null
  right: string | null
}

interface AppContextValue {
  state: AppState
  images: ImageUrls
  updateState: (patch: Partial<AppState>) => void
  updatePanel: (side: PanelSide, text: string) => void
  uploadImage: (side: PanelSide, file: File) => Promise<void>
  confirmPositive: () => { streakGained: number; scoreGained: number }
  confirmNegative: () => void
  markIntroSeen: () => void
  refreshImages: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())
  const [images, setImages] = useState<ImageUrls>({ left: null, right: null })

  useEffect(() => {
    saveState(state)
  }, [state])

  const refreshImages = useCallback(async () => {
    const loaded = await loadAllImages()
    setImages(loaded)
  }, [])

  useEffect(() => {
    void refreshImages()
  }, [refreshImages])

  const updateState = useCallback((patch: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])

  const updatePanel = useCallback((side: PanelSide, text: string) => {
    setState((prev) => ({
      ...prev,
      [side]: { text },
    }))
  }, [])

  const uploadImage = useCallback(async (side: PanelSide, file: File) => {
    const url = await saveImage(side, file)
    setImages((prev) => ({ ...prev, [side]: url }))
  }, [])

  const confirmPositive = useCallback(() => {
    let result = { streakGained: 0, scoreGained: 0 }
    setState((prev) => {
      const next = applyPositive(prev)
      result = { streakGained: next.streakGained, scoreGained: next.scoreGained }
      return next.state
    })
    return result
  }, [])

  const confirmNegative = useCallback(() => {
    setState((prev) => applyNegative(prev))
    if (navigator.vibrate) navigator.vibrate(40)
  }, [])

  const markIntroSeen = useCallback(() => {
    setState((prev) => ({ ...prev, seenIntro: true }))
  }, [])

  const value = useMemo(
    () => ({
      state,
      images,
      updateState,
      updatePanel,
      uploadImage,
      confirmPositive,
      confirmNegative,
      markIntroSeen,
      refreshImages,
    }),
    [
      state,
      images,
      updateState,
      updatePanel,
      uploadImage,
      confirmPositive,
      confirmNegative,
      markIntroSeen,
      refreshImages,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
