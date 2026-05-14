import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { ParentProgress } from '../components/ProgressDots'

interface ParentQ2Props {
  friends: string[]
  whoWasThere: string[]
  whoNote: string
  onBack: () => void
  onContinue: (whoWasThere: string[], whoNote: string) => void
  onSkip: () => void
}

export function ParentQ2({ friends, whoWasThere: initWho, whoNote: initNote, onBack, onContinue, onSkip }: ParentQ2Props) {
  const [selected, setSelected] = useState<string[]>(initWho)
  const [note, setNote] = useState(initNote)

  function toggleFriend(f: string) {
    setSelected(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
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
        <ParentProgress step={2} />
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
          Question 2 of 4
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
          Who was around today — for better or worse?
        </h2>

        {/* Friend chips */}
        {friends.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#76705f',
                marginBottom: 10,
              }}
            >
              Friends
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {friends.map(f => {
                const active = selected.includes(f)
                return (
                  <button
                    key={f}
                    onClick={() => toggleFriend(f)}
                    style={{
                      padding: '7px 14px',
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
                    {f}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Anyone else you want to mention…"
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
            minHeight: 140,
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
