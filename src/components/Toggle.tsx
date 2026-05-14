import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      {label && (
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#3e3830' }}>
          {label}
        </span>
      )}
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: checked ? '#c9924a' : '#dfd5bd',
          position: 'relative',
          transition: 'background-color 0.2s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            transition: 'left 0.2s ease',
          }}
        />
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
    <div
      style={{
        display: 'flex',
        background: '#f3ead8',
        borderRadius: 30,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: 28,
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: value === opt.value ? '#1f1b16' : 'transparent',
            color: value === opt.value ? '#faf4e8' : '#76705f',
            transition: 'all 0.15s ease',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
