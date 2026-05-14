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
        backgroundColor: '#faf4e8',
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
          background: 'linear-gradient(135deg, #c9924a, #a35d3a)',
          boxShadow: '0 12px 30px #c9924a44',
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
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#76705f',
          marginBottom: 18,
        }}
      >
        Storythread
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 38,
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          color: '#1f1b16',
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        A new story,{' '}
        <em style={{ color: '#a35d3a', fontStyle: 'italic' }}>just for tonight.</em>
      </h1>

      {/* Body */}
      <p
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 17,
          lineHeight: 1.55,
          color: '#3e3830',
          textAlign: 'center',
          marginBottom: 44,
          maxWidth: 320,
        }}
      >
        Bedtime stories written for the teen in your life — quietly shaped around the day they actually had.
      </p>

      {/* Buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onBegin}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #c9924a, #a35d3a)',
            color: '#faf4e8',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            boxShadow: '0 4px 16px #c9924a33',
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
            color: '#76705f',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            border: '1px solid #dfd5bd',
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
            backgroundColor: '#1f1b16',
            color: '#faf4e8',
            fontFamily: "'DM Sans', sans-serif",
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
