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

interface LoadingProps {
  useLocal?: boolean
  onTimeout?: () => void
  progress?: number
}

export function Loading({ useLocal = false, onTimeout, progress = 0 }: LoadingProps) {
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
      {/* Breathing orb with optional progress ring */}
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 48 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, var(--accent-s), var(--accent2) 70%, transparent 75%)',
            filter: 'blur(2px)',
            opacity: 0.85,
            animation: 'st-breath 4.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 24,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, var(--accent-s), var(--accent))',
            boxShadow: '0 0 40px color-mix(in srgb, var(--accent) 53%, transparent)',
          }}
        />
        {useLocal && (
          <svg
            style={{
              position: 'absolute',
              top: -10,
              left: -10,
              width: 140,
              height: 140,
              transform: 'rotate(-90deg)',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
            viewBox="0 0 140 140"
          >
            <circle cx="70" cy="70" r="66" fill="none" stroke="rgba(233,223,201,0.12)" strokeWidth="3" />
            <circle
              cx="70" cy="70" r="66"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 66}`}
              strokeDashoffset={`${2 * Math.PI * 66 * (1 - progress)}`}
              style={{ transition: 'stroke-dashoffset 1.2s ease', opacity: progress > 0 ? 1 : 0 }}
            />
          </svg>
        )}
      </div>

      {/* Kicker */}
      <div
        style={{
          fontFamily: "var(--sans)",
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
          fontFamily: "var(--serif)",
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

      {/* Progress dots */}
      {!longWait && (
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

      {/* Sub */}
      <p
        style={{
          fontFamily: "var(--sans)",
          fontSize: 13,
          color: 'rgba(233,223,201,0.5)',
          textAlign: 'center',
          lineHeight: 1.55,
          maxWidth: 260,
          marginTop: 32,
        }}
      >
        {useLocal && progress > 0
          ? `${Math.round(progress * 100)}% written`
          : useLocal
            ? 'Local models take 1–3 minutes.'
            : 'Usually about twenty seconds.'}
      </p>
    </div>
  )
}
