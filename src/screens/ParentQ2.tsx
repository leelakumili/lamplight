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
        <ParentProgress step={2} />
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
          Question 2 of 4
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
          Who was around today — for better or worse?
        </h2>

        {/* Friend chips */}
        {friends.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--ink50)',
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
            border: '1px solid var(--ink15)',
            backgroundColor: 'var(--bg2)',
            fontFamily: "var(--serif)",
            fontSize: 16,
            lineHeight: 1.5,
            color: 'var(--ink)',
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
