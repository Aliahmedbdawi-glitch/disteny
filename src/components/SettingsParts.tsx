import { useRef, useState } from 'react'
import SplitPanel from './SplitPanel'
import { CAPTION_MAX_LENGTH, GREETING_MAX_LENGTH } from '../lib/text'
import type { PanelSide } from '../lib/types'
import './SettingsParts.css'

const PRESETS = [7, 14, 21, 30, 60, 90, 100]

interface GoalStepperProps {
  value: number
  onChange: (value: number) => void
}

export function GoalStepper({ value, onChange }: GoalStepperProps) {
  const isPreset = PRESETS.includes(value)

  return (
    <div>
      <div className="goal-stepper">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`goal-stepper__chip${value === preset ? ' goal-stepper__chip--active' : ''}`}
            onClick={() => onChange(preset)}
          >
            {preset}d
          </button>
        ))}
      </div>
      <div className="goal-stepper__custom">
        <span className="goal-stepper__custom-label">Custom</span>
        <input
          type="number"
          className="goal-stepper__custom-input"
          min={1}
          max={365}
          value={isPreset ? '' : value}
          placeholder={String(value)}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10)
            if (!Number.isNaN(n) && n > 0) onChange(Math.min(n, 365))
          }}
        />
      </div>
    </div>
  )
}

interface ImageUploadProps {
  side: PanelSide
  onUpload: (file: File) => void
}

export function ImageUpload({ side, onUpload }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    onUpload(file)
  }

  return (
    <div className="image-upload">
      <div
        className={`image-upload__drop${dragging ? ' image-upload__drop--active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files[0])
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
      >
        <span className="image-upload__drop-text">
          {side === 'left' ? 'Upload slip image' : 'Upload hold image'}
        </span>
        <span className="image-upload__drop-text">Tap or drag & drop</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="image-upload__input"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

interface PanelEditorProps {
  side: PanelSide
  label: string
  text: string
  imageUrl: string | null
  onTextChange: (text: string) => void
  onImageUpload: (file: File) => void
}

export function PanelEditor({
  side,
  label,
  text,
  imageUrl,
  onTextChange,
  onImageUpload,
}: PanelEditorProps) {
  return (
    <div className="panel-editor">
      <div className="panel-editor__header">
        <span className={`panel-editor__side panel-editor__side--${side}`}>{label}</span>
      </div>

      <SplitPanel
        side={side}
        label={side === 'left' ? 'Slip' : 'Hold'}
        text={text}
        imageUrl={imageUrl}
        mini
      />
      <ImageUpload side={side} onUpload={onImageUpload} />

      <div className="settings-field">
        <textarea
          className="settings-field__textarea settings-field__textarea--long"
          value={text}
          maxLength={CAPTION_MAX_LENGTH}
          placeholder="Your message..."
          rows={8}
          onChange={(e) => onTextChange(e.target.value)}
        />
        <span className="settings-field__hint">
          {text.length}/{CAPTION_MAX_LENGTH}
        </span>
      </div>
    </div>
  )
}

interface GreetingsEditorProps {
  greetings: string[]
  onChange: (greetings: string[]) => void
}

export function GreetingsEditor({ greetings, onChange }: GreetingsEditorProps) {
  const [draft, setDraft] = useState('')

  const addGreeting = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...greetings, trimmed.slice(0, GREETING_MAX_LENGTH)])
    setDraft('')
  }

  const removeGreeting = (index: number) => {
    onChange(greetings.filter((_, i) => i !== index))
  }

  return (
    <div className="greetings-editor">
      <p className="greetings-editor__hint">
        Shown as a full-screen greeting after you confirm a Hold tap.
      </p>

      {greetings.length === 0 ? (
        <p className="greetings-editor__empty">No greetings yet</p>
      ) : (
        <ul className="greetings-editor__list">
          {greetings.map((greeting, index) => (
            <li key={`${greeting}-${index}`} className="greetings-editor__item">
              <span className="greetings-editor__text">{greeting}</span>
              <button
                type="button"
                className="greetings-editor__remove"
                onClick={() => removeGreeting(index)}
                aria-label={`Remove greeting ${index + 1}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="greetings-editor__add">
        <input
          type="text"
          className="greetings-editor__input"
          value={draft}
          maxLength={GREETING_MAX_LENGTH}
          placeholder="Add a rewarding message..."
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addGreeting()
            }
          }}
        />
        <button
          type="button"
          className="greetings-editor__btn"
          onClick={addGreeting}
          disabled={!draft.trim()}
        >
          Add
        </button>
      </div>
    </div>
  )
}
