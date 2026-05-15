import React from 'react'

interface ProgressDotsProps {
  total: number
  filled: number
  style?: React.CSSProperties
}

export function ProgressDots({ total, filled, style }: ProgressDotsProps) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', ...style }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i < filled ? 20 : 6, height: 6, borderRadius: 3,
          backgroundColor: i < filled ? 'var(--ink)' : 'var(--ink15)',
          transition: 'all 0.2s ease',
        }} />
      ))}
    </div>
  )
}

interface ParentProgressProps {
  step: number // 1–4
}

export function ParentProgress({ step }: ParentProgressProps) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{
          width: i < step ? (i === step - 1 ? 24 : 16) : 6, height: 6, borderRadius: 3,
          backgroundColor: i < step ? 'var(--accent)' : 'var(--ink15)',
          transition: 'all 0.2s ease',
        }} />
      ))}
    </div>
  )
}
