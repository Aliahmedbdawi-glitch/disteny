import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Home from './pages/Home'
import Intro from './pages/Intro'
import Settings from './pages/Settings'

function IntroGate({ children }: { children: React.ReactNode }) {
  const { state } = useApp()
  if (!state.seenIntro) return <Navigate to="/intro" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/intro" element={<Intro />} />
        <Route
          path="/"
          element={
            <IntroGate>
              <Home />
            </IntroGate>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
