import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { ParentProgress } from '../components/ProgressDots'

const DESTINATIONS = [
  { value: 'Hopeful', label: 'Hopeful', sub: 'A lighter ending. Things shift.' },
  { value: 'Understood', label: 'Understood', sub: 'Someone sees them clearly.' },
  { value: 'Brave', label: 'Brave', sub: 'They step toward, not away.' },
  { value: 'Confident', label: 'Confident', sub: 'Their own voice gets louder.' },
  { value: 'Calm', label: 'Calm', sub: 'The day quiets and softens.' },
  { value: 'Empowered', label: 'Empowered', sub: 'They choose what comes next.' },
]

interface ParentQ4Props {
  destination: string
  onBack: () => void
  onSubmit: (destination: string) => void
  onSkip: () => void
}

export function ParentQ4({ destination: initDest, onBack, onSubmit, onSkip }: ParentQ4Props) {
  const [selected, setSelected] = useState(initDest)

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'st-fade-in 0.3s ease both',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
        }}
      >
        <button onClick={onBack} style={{ padding: 4 }}>
          <Icon name="chevron-left" size={24} color="var(--ink70)" />
        </button>
        <ParentProgress step={4} />
        <button
          onClick={onSkip}
          style={{
            fontFamily: "var(--sans)",
            fontSize: 14,
            color: 'var(--ink50)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px 24px 40px', overflowY: 'auto' }}>
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 16,
          }}
        >
          Question 4 of 4
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: 26,
            fontWeight: 400,
            lineHeight: 1.22,
            color: 'var(--ink)',
            marginBottom: 24,
          }}
        >
          Where should the story leave them?
        </h2>

        {/* 2-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {DESTINATIONS.map(dest => {
            const active = selected === dest.value
            return (
              <button
                key={dest.value}
                onClick={() => setSelected(dest.value)}
                style={{
                  minHeight: 88,
                  borderRadius: 16,
                  border: `1px solid ${active ? 'var(--ink)' : 'var(--ink15)'}`,
                  backgroundColor: active ? 'var(--ink)' : 'var(--bg2)',
                  padding: '14px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: 'var(--accent-s)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 16,
                    fontWeight: 500,
                    color: active ? 'var(--bg)' : 'var(--ink)',
                    marginBottom: 4,
                  }}
                >
                  {dest.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 12,
                    color: active ? 'rgba(233,223,201,0.7)' : 'var(--ink50)',
                    lineHeight: 1.4,
                  }}
                >
                  {dest.sub}
                </div>
              </button>
            )
          })}
        </div>

        {/* Write story button */}
        <button
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 14,
            background: selected ? 'var(--cta)' : 'var(--ink15)',
            color: selected ? 'var(--bg)' : 'var(--ink30)',
            fontFamily: "var(--sans)",
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.15s ease',
          }}
        >
          <Icon name="sparkle" size={18} color={selected ? 'var(--bg)' : 'var(--ink30)'} />
          Write their story
        </button>
        <div
          style={{
            textAlign: 'center',
            fontFamily: "var(--sans)",
            fontSize: 12,
            color: 'var(--ink50)',
            marginTop: 8,
          }}
        >
          Takes about 20 seconds.
        </div>
      </div>
    </div>
  )
}
