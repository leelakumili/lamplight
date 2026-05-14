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
        backgroundColor: '#faf4e8',
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
          <Icon name="chevron-left" size={24} color="#3e3830" />
        </button>
        <ParentProgress step={1} />
        <button
          onClick={onSkip}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: '#76705f',
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
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#c9924a',
            marginBottom: 16,
          }}
        >
          Tonight · Question 1 of 4
        </div>

        <h2
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 26,
            fontWeight: 400,
            lineHeight: 1.22,
            color: '#1f1b16',
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
            border: '1px solid #dfd5bd',
            backgroundColor: '#f3ead8',
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 16,
            lineHeight: 1.5,
            color: '#1f1b16',
            minHeight: 180,
            flex: 1,
          }}
        />

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: '#76705f',
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
            background: 'linear-gradient(135deg, #c9924a, #a35d3a)',
            color: '#faf4e8',
            fontFamily: "'DM Sans', sans-serif",
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
