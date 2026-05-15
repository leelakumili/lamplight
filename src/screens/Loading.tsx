import React, { useEffect, useState } from 'react'
import { GENERATION_LONG_WAIT_MS, GENERATION_TIMEOUT_MS } from '../lib/constants'

const PHRASES = [
  { main: 'Lining up the streetlamps,', em: 'finding the right way in…' },
  { main: 'Choosing the right Tuesday,', em: 'the one that holds the most.' },
  { main: 'Setting the scene,', em: 'getting the light exactly wrong first…' },
  { main: 'Finding the sentence', em: 'that only she could say.' },
  { main: 'Picking up the thread,', em: 'following it somewhere true.' },
  { main: 'Listening for the detail', em: 'that makes it real.' },
  { main: 'Writing the moment', em: 'just before everything shifts.' },
  { main: 'Getting the ending right,', em: 'then a little more right.' },
]

const RING_R = 74
const CIRCUMFERENCE = 2 * Math.PI * RING_R

interface LoadingProps {
  useLocal?: boolean
  onTimeout?: () => void
  onCancel?: () => void
  progress?: number
}

export function Loading({ useLocal = false, onTimeout, onCancel, progress = 0 }: LoadingProps) {
  const [longWait, setLongWait] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLongWait(true), GENERATION_LONG_WAIT_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!onTimeout) return
    const timer = setTimeout(() => onTimeout(), GENERATION_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [onTimeout])

  // Cycle through phrases with a fade transition
  useEffect(() => {
    if (longWait) return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setPhraseIndex(i => (i + 1) % PHRASES.length)
        setVisible(true)
      }, 500)
    }, 4000)
    return () => clearInterval(interval)
  }, [longWait])

  const phrase = PHRASES[phraseIndex]
  const pct = Math.round(progress * 100)

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--dark-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px',
        animation: 'st-fade-in 0.4s ease both',
      }}
    >
      {/* Breathing orb + progress ring */}
      <div style={{ position: 'relative', width: 136, height: 136, marginBottom: 40 }}>
        {/* Orb glow */}
        <div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, var(--accent-s), var(--accent2) 70%, transparent 75%)',
            filter: 'blur(2px)',
            opacity: 0.85,
            animation: 'st-breath 4.5s ease-in-out infinite',
          }}
        />
        {/* Orb core */}
        <div
          style={{
            position: 'absolute',
            inset: 32,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, var(--accent-s), var(--accent))',
            boxShadow: '0 0 40px color-mix(in srgb, var(--accent) 53%, transparent)',
          }}
        />
        {/* Progress ring — sits outside the orb glow, overflow:visible so it isn't clipped */}
        {useLocal && (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: 136,
              height: 136,
              transform: 'rotate(-90deg)',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
            viewBox="0 0 136 136"
          >
            {/* Track */}
            <circle
              cx="68" cy="68" r={RING_R}
              fill="none"
              stroke="rgba(233,223,201,0.25)"
              strokeWidth="4"
            />
            {/* Fill arc */}
            <circle
              cx="68" cy="68" r={RING_R}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - Math.max(progress, 0.008))}
              style={{ transition: 'stroke-dashoffset 1.5s ease' }}
            />
          </svg>
        )}
      </div>

      {/* Kicker */}
      <div
        style={{
          fontFamily: 'var(--sans)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--accent-s)',
          marginBottom: 18,
        }}
      >
        Writing
      </div>

      {/* Cycling phrase */}
      <div
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.3,
          color: 'var(--dark-ink)',
          textAlign: 'center',
          maxWidth: 300,
          minHeight: 72,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {longWait ? (
          <em style={{ color: 'var(--accent-s)' }}>Still going. The good ones take a minute.</em>
        ) : (
          <>
            {phrase.main}{' '}
            <em style={{ color: 'var(--accent-s)', fontStyle: 'italic' }}>{phrase.em}</em>
          </>
        )}
      </div>

      {/* Progress dots — only when not local (cloud has no ring) */}
      {!longWait && !useLocal && (
        <div style={{ display: 'flex', gap: 6, marginTop: 36 }}>
          {PHRASES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === phraseIndex ? 18 : 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: i === phraseIndex ? 'var(--accent)' : 'rgba(233,223,201,0.2)',
                transition: 'width 0.4s ease, background-color 0.4s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Sub-text */}
      <p
        style={{
          fontFamily: 'var(--sans)',
          fontSize: 13,
          color: 'rgba(233,223,201,0.5)',
          textAlign: 'center',
          lineHeight: 1.55,
          maxWidth: 260,
          marginTop: 28,
          marginBottom: 0,
        }}
      >
        {useLocal && progress > 0.01
          ? `${pct}% written`
          : useLocal
            ? 'Local models take 1–3 minutes.'
            : 'Usually about twenty seconds.'}
      </p>

      {/* Cancel — shown after 15s for local, always available */}
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: 24,
            fontFamily: 'var(--sans)',
            fontSize: 13,
            fontWeight: 400,
            color: 'rgba(233,223,201,0.3)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(233,223,201,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(233,223,201,0.3)')}
        >
          Cancel
        </button>
      )}
    </div>
  )
}
