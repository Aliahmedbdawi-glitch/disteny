import { Link } from 'react-router-dom'
import { GoalStepper, GreetingsEditor, PanelEditor } from '../components/SettingsParts'
import { useApp } from '../context/AppContext'
import '../components/SplitPanel.css'
import '../components/SettingsParts.css'

export default function Settings() {
  const { state, images, updateState, updatePanel, uploadImage } = useApp()

  return (
    <main className="settings-page">
      <Link to="/" className="settings-page__back">
        ← Cockpit
      </Link>

      <header className="settings-page__header">
        <h1 className="settings-page__title">Command Deck</h1>
        <span className="settings-page__status">Synced · Local</span>
      </header>

      <section className="settings-section">
        <p className="settings-section__label">Habit title</p>
        <div className="settings-field">
          <input
            type="text"
            className="settings-field__input"
            placeholder="e.g. No smoking"
            value={state.habitTitle}
            maxLength={40}
            onChange={(e) => updateState({ habitTitle: e.target.value })}
          />
        </div>
      </section>

      <section className="settings-section">
        <p className="settings-section__label">Panels</p>
        <div className="settings-grid">
          <PanelEditor
            side="left"
            label="Slip"
            text={state.left.text}
            imageUrl={images.left}
            onTextChange={(text) => updatePanel('left', text)}
            onImageUpload={(file) => void uploadImage('left', file)}
          />
          <PanelEditor
            side="right"
            label="Hold"
            text={state.right.text}
            imageUrl={images.right}
            onTextChange={(text) => updatePanel('right', text)}
            onImageUpload={(file) => void uploadImage('right', file)}
          />
        </div>
      </section>

      <section className="settings-section">
        <p className="settings-section__label">Greetings</p>
        <GreetingsEditor
          greetings={state.greetings}
          onChange={(greetings) => updateState({ greetings })}
        />
      </section>

      <section className="settings-section">
        <p className="settings-section__label">Streak goal (days)</p>
        <GoalStepper
          value={state.streakGoal}
          onChange={(streakGoal) => updateState({ streakGoal })}
        />
      </section>
    </main>
  )
}
