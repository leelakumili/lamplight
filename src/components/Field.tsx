import React from 'react'

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  type?: string
  style?: React.CSSProperties
}

export function Field({ label, value, onChange, placeholder, maxLength, type = 'text', style }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <label
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#76705f',
        }}
      >
        {label}
      </label>
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
          border: '1px solid #dfd5bd',
          backgroundColor: '#f3ead8',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: '#1f1b16',
          appearance: 'none',
        }}
      />
    </div>
  )
}

interface TextareaFieldProps {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minHeight?: number
  style?: React.CSSProperties
  fontFamily?: string
}

export function TextareaField({ label, value, onChange, placeholder, minHeight = 120, style, fontFamily }: TextareaFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && (
        <label
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#76705f',
          }}
        >
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px solid #dfd5bd',
          backgroundColor: '#f3ead8',
          fontFamily: fontFamily || "'Newsreader', Georgia, serif",
          fontSize: 15,
          lineHeight: 1.5,
          color: '#1f1b16',
          minHeight,
        }}
      />
    </div>
  )
}
