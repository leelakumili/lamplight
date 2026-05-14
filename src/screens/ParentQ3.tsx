import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { ParentProgress } from '../components/ProgressDots'

const EMOTIONS = ['Left out', 'Frustrated', 'Embarrassed', 'Quiet', 'Worried', 'Tired', 'Proud', 'Confused', 'Hurt']

interface ParentQ3Props {
  name: string
  emotions: string[]
  emotionNote: string
  onBack: () => void
  onContinue: (emotions: string[], note: string) => void
  onSkip: () => void
}

export function ParentQ3({ name, emotions: initEmotions, emotionNote: initNote, onBack, onContinue, onSkip }: ParentQ3Props) {
  const [selected, setSelected] = useState<string[]>(initEmotions)
  const [note, setNote] = useState(initNote)

  function toggleEmotion(e: string) {
    setSelected(prev =>
      prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
    )
  }

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
        <ParentProgress step={3} />
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
          Question 3 of 4
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
          How did {name} seem to be carrying it?
        </h2>

        {/* Emotion chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {EMOTIONS.map(emotion => {
            const active = selected.includes(emotion)
            return (
              <button
                key={emotion}
                onClick={() => toggleEmotion(emotion)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: `1px solid ${active ? 'var(--ink)' : 'var(--ink15)'}`,
                  backgroundColor: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--bg)' : 'var(--ink70)',
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {emotion}
              </button>
            )
          })}
        </div>

        {/* Optional note */}
        <label
          style={{
            fontFamily: "var(--sans)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--ink50)',
            marginBottom: 8,
            display: 'block',
          }}
        >
          Anything else? Optional
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="A note, a phrase they used, anything…"
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: '1px solid var(--ink15)',
            backgroundColor: 'var(--bg2)',
            fontFamily: "var(--serif)",
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.5,
            color: 'var(--ink)',
            minHeight: 100,
            flex: 1,
            marginBottom: 28,
          }}
        />

        <button
          onClick={() => onContinue(selected, note)}
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
