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
        <ParentProgress step={3} />
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
          Question 3 of 4
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
                  border: `1px solid ${active ? '#1f1b16' : '#dfd5bd'}`,
                  backgroundColor: active ? '#1f1b16' : 'transparent',
                  color: active ? '#faf4e8' : '#3e3830',
                  fontFamily: "'DM Sans', sans-serif",
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
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#76705f',
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
            border: '1px solid #dfd5bd',
            backgroundColor: '#f3ead8',
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.5,
            color: '#1f1b16',
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
