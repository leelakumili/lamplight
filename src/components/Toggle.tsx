import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      {label && <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink70)' }}>{label}</span>}
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 13, flexShrink: 0, position: 'relative',
          backgroundColor: checked ? 'var(--accent)' : 'var(--ink15)',
          transition: 'background-color 0.2s ease',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.2s ease',
        }} />
      </div>
    </label>
  )
}

interface SegmentedToggleProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}

export function SegmentedToggle({ options, value, onChange }: SegmentedToggleProps) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg2)', borderRadius: 30, padding: 3, gap: 2 }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: '8px 16px', borderRadius: 28,
            fontSize: 14, fontFamily: 'var(--sans)', fontWeight: 500,
            border: 'none', cursor: 'pointer',
            backgroundColor: value === opt.value ? 'var(--ink)' : 'transparent',
            color: value === opt.value ? 'var(--bg)' : 'var(--ink50)',
            transition: 'all 0.15s ease',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
