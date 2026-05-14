import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { ParentProgress } from '../components/ProgressDots'

interface ParentQ1Props {
  name: string
  moment: string
  onBack: () => void
  onContinue: (moment: string) => void
  onSkip: () => void
}

export function ParentQ1({ name, moment: initialMoment, onBack, onContinue, onSkip }: ParentQ1Props) {
  const [moment, setMoment] = useState(initialMoment)

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
        <ParentProgress step={1} />
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
      <div style={{ flex: 1, padding: '16px 24px 40px', display: 'flex', flexDirection: 'column' }}>
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
          Tonight · Question 1 of 4
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
          What was the moment that stuck with you about {name}'s day?
        </h2>

        <textarea
          value={moment}
          onChange={e => setMoment(e.target.value)}
          placeholder="Write what comes to mind…"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            border: '1px solid var(--ink15)',
            backgroundColor: 'var(--bg2)',
            fontFamily: "var(--serif)",
            fontSize: 16,
            lineHeight: 1.5,
            color: 'var(--ink)',
            minHeight: 180,
            flex: 1,
          }}
        />

        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 12,
            color: 'var(--ink50)',
            marginTop: 10,
            marginBottom: 28,
          }}
        >
          Whatever you write stays on this device. The story will reshape it, not repeat it.
        </div>

        <button
          onClick={() => onContinue(moment)}
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
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
