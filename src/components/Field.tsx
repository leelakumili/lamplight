import React from 'react'

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--ink50)',
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  type?: string
  error?: string
  style?: React.CSSProperties
}

export function Field({ label, value, onChange, placeholder, maxLength, type = 'text', error, style }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 12,
          border: `1px solid ${error ? 'var(--accent2)' : 'var(--ink15)'}`,
          backgroundColor: 'var(--bg2)',
          fontFamily: 'var(--sans)',
          fontSize: 15,
          color: 'var(--ink)',
          appearance: 'none',
        }}
      />
      {error && <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--accent2)' }}>{error}</span>}
    </div>
  )
}

interface TextareaFieldProps {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minHeight?: number
  italic?: boolean
  flex?: boolean
  style?: React.CSSProperties
}

export function TextareaField({ label, value, onChange, placeholder, minHeight = 120, italic, flex, style }: TextareaFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...(flex ? { flex: 1 } : {}), ...style }}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px solid var(--ink15)',
          backgroundColor: 'var(--bg2)',
          fontFamily: 'var(--serif)',
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: 15,
          lineHeight: 1.5,
          color: 'var(--ink)',
          minHeight,
          ...(flex ? { flex: 1 } : {}),
        }}
      />
    </div>
  )
}
