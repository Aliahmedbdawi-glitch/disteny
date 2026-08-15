import type { PanelSide } from '../lib/types'
import './SplitPanel.css'

interface SplitPanelProps {
  side: PanelSide
  label: string
  text: string
  imageUrl: string | null
  active?: boolean
  dimmed?: boolean
  mini?: boolean
  onClick?: () => void
}

export default function SplitPanel({
  side,
  label,
  text,
  imageUrl,
  active,
  dimmed,
  mini,
  onClick,
}: SplitPanelProps) {
  const className = [
    'split-panel',
    `split-panel--${side}`,
    active ? 'split-panel--active' : '',
    dimmed ? 'split-panel--dimmed' : '',
    mini ? 'split-panel--mini' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <div className="split-panel__media">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="split-panel__image" />
        ) : (
          <div className="split-panel__placeholder">
            <div className="split-panel__brackets" aria-hidden="true">
              <span className="split-panel__bracket split-panel__bracket--tl" />
              <span className="split-panel__bracket split-panel__bracket--tr" />
              <span className="split-panel__bracket split-panel__bracket--bl" />
              <span className="split-panel__bracket split-panel__bracket--br" />
            </div>
            <span className="split-panel__placeholder-text">Load image</span>
          </div>
        )}
      </div>

      {!mini && (
        <div className="split-panel__brackets" aria-hidden="true">
          <span className="split-panel__bracket split-panel__bracket--tl" />
          <span className="split-panel__bracket split-panel__bracket--tr" />
          <span className="split-panel__bracket split-panel__bracket--bl" />
          <span className="split-panel__bracket split-panel__bracket--br" />
        </div>
      )}

      <div className="split-panel__gradient" aria-hidden="true" />

      <div className="split-panel__caption">
        <span className="split-panel__label">{label}</span>
        <p className={`split-panel__text${text ? '' : ' split-panel__text--empty'}`}>
          {text || 'Add your message'}
        </p>
      </div>
    </>
  )

  if (mini || !onClick) {
    return <div className={className}>{content}</div>
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={`${label} panel`}
    >
      {content}
    </button>
  )
}
