import React, { useEffect, useState } from 'react'

interface LoadingProps {
  onTimeout?: () => void
}

export function Loading({ onTimeout }: LoadingProps) {
  const [longWait, setLongWait] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLongWait(true), 45000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!onTimeout) return
    const timer = setTimeout(() => {
      // If still loading after 90 seconds, signal timeout
      onTimeout()
    }, 90000)
    return () => clearTimeout(timer)
  }, [onTimeout])

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#15182a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px',
        animation: 'st-fade-in 0.4s ease both',
      }}
    >
      {/* Breathing orb */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #e5b574, #a35d3a 70%, transparent 75%)',
          filter: 'blur(2px)',
          opacity: 0.85,
          animation: 'st-breath 4.5s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 36,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #e5b574, #c9924a)',
            boxShadow: '0 0 40px #c9924a',
          }}
        />
      </div>

      {/* Kicker */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#e5b574',
          marginBottom: 14,
        }}
      >
        Writing
      </div>

      {/* Headline */}
      <h2
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 24,
          fontWeight: 400,
          lineHeight: 1.25,
          color: '#e9dfc9',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        {longWait ? (
          'Still going. The good ones take a minute.'
        ) : (
          <>
            Lining up the streetlamps,{' '}
            <em style={{ color: '#e5b574', fontStyle: 'italic' }}>finding the right way in…</em>
          </>
        )}
      </h2>

      {/* Sub */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: 'rgba(233,223,201,0.7)',
          textAlign: 'center',
          lineHeight: 1.55,
          maxWidth: 280,
        }}
      >
        This usually takes about twenty seconds. There's no need to wait — we'll let you know.
      </p>
    </div>
  )
}
