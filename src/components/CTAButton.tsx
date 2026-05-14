import React from 'react'

interface CTAButtonProps {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
}

export function CTAButton({ onClick, disabled, children, style }: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: 54,
        borderRadius: 14,
        background: disabled ? 'var(--ink15)' : 'var(--cta)',
        color: disabled ? 'var(--ink30)' : 'var(--cta-fg, var(--bg))',
        fontFamily: 'var(--sans)',
        fontSize: 16,
        fontWeight: 500,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'opacity 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
