import React from 'react'

interface ChipProps {
  label: string
  active?: boolean
  onToggle?: () => void
  onRemove?: () => void
  style?: React.CSSProperties
}

export function Chip({ label, active = false, onToggle, onRemove, style }: ChipProps) {
  return (
    <div
      onClick={onToggle}
      role={onToggle ? 'button' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 12px',
        borderRadius: 20,
        fontSize: 13,
        fontFamily: 'var(--sans)',
        fontWeight: 500,
        cursor: onToggle ? 'pointer' : 'default',
        backgroundColor: active ? 'var(--ink)' : 'var(--bg2)',
        color: active ? 'var(--bg)' : 'var(--ink70)',
        border: `1px solid ${active ? 'var(--ink)' : 'var(--ink15)'}`,
        transition: 'all 0.15s ease',
        userSelect: 'none',
        ...style,
      }}
    >
      {label}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit', marginLeft: 2, opacity: 0.7 }}
          aria-label={`Remove ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}
