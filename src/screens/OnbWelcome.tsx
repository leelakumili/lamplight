import React, { useState } from 'react'
import { Icon } from '../components/Icon'

interface OnbWelcomeProps {
  onBegin: () => void
}

export function OnbWelcome({ onBegin }: OnbWelcomeProps) {
  const [showToast, setShowToast] = useState(false)

  function handleComingSoon() {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px 48px',
        position: 'relative',
        animation: 'st-fade-in 0.4s ease both',
      }}
    >
      {/* App glyph */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          background: 'var(--cta)',
          boxShadow: '0 12px 30px color-mix(in srgb, var(--accent) 27%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        <Icon name="moon" size={28} color="white" strokeWidth={1.5} />
      </div>

      {/* Kicker */}
      <div
        style={{
          fontFamily: "var(--sans)",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--ink50)',
          marginBottom: 18,
        }}
      >
        Lamplight
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--serif)",
          fontSize: 38,
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        A new story,{' '}
        <em style={{ color: 'var(--accent2)', fontStyle: 'italic' }}>just for tonight.</em>
      </h1>

      {/* Body */}
      <p
        style={{
          fontFamily: "var(--serif)",
          fontSize: 17,
          lineHeight: 1.55,
          color: 'var(--ink70)',
          textAlign: 'center',
          marginBottom: 44,
          maxWidth: 320,
        }}
      >
        Bedtime stories written for the pre-teen or teen in your life — quietly shaped around the day they actually had.
      </p>

      {/* Buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onBegin}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 14,
            background: 'var(--cta)',
            color: 'var(--bg)',
            fontFamily: "var(--sans)",
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 20%, transparent)',
          }}
        >
          Begin setup
        </button>

        <button
          onClick={handleComingSoon}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 14,
            background: 'transparent',
            color: 'var(--ink50)',
            fontFamily: "var(--sans)",
            fontSize: 14,
            fontWeight: 500,
            border: '1px solid var(--ink15)',
            cursor: 'pointer',
          }}
        >
          I already have an account
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--ink)',
            color: 'var(--bg)',
            fontFamily: "var(--sans)",
            fontSize: 13,
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: 20,
            zIndex: 100,
            animation: 'st-fade-in 0.2s ease both',
            whiteSpace: 'nowrap',
          }}
        >
          Coming soon
        </div>
      )}
    </div>
  )
}
