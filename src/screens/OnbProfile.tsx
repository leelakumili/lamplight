import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { ProgressDots } from '../components/ProgressDots'
import type { Setup } from '../types'

interface OnbProfileProps {
  onBack: () => void
  onContinue: (data: Partial<Setup>) => void
  initial?: Partial<Setup>
}

export function OnbProfile({ onBack, onContinue, initial }: OnbProfileProps) {
  const [name, setName] = useState(initial?.name || '')
  const [friends, setFriends] = useState<string[]>(initial?.friends || [])
  const [sketch, setSketch] = useState(initial?.characterSketch || '')
  const [addingFriend, setAddingFriend] = useState(false)
  const [friendInput, setFriendInput] = useState('')
  const [friendError, setFriendError] = useState('')
  const [nameError, setNameError] = useState('')

  function addFriend() {
    const trimmed = friendInput.trim()
    if (!trimmed) {
      setAddingFriend(false)
      return
    }
    if (friends.length >= 5) {
      setFriendError("That's plenty. You can always change these later.")
      setAddingFriend(false)
      setFriendInput('')
      return
    }
    setFriends(prev => [...prev, trimmed])
    setFriendInput('')
    setAddingFriend(false)
    setFriendError('')
  }

  function removeFriend(i: number) {
    setFriends(prev => prev.filter((_, idx) => idx !== i))
    setFriendError('')
  }

  function handleContinue() {
    if (!name.trim()) {
      setNameError('Please enter a name.')
      return
    }
    onContinue({ name: name.trim(), friends, characterSketch: sketch })
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
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
        }}
      >
        <button onClick={onBack} style={{ padding: 4, color: 'var(--ink70)' }}>
          <Icon name="chevron-left" size={24} color="var(--ink70)" />
        </button>
        <ProgressDots total={3} filled={2} />
        <div style={{ width: 32 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 24px 40px', overflowY: 'auto' }}>
        {/* Kicker + Headline */}
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink50)',
            marginBottom: 10,
          }}
        >
          Step 2 of 3
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: 30,
            fontWeight: 400,
            lineHeight: 1.15,
            color: 'var(--ink)',
            marginBottom: 32,
          }}
        >
          Who is the story for?
        </h1>

        {/* Name field */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: 'block',
              fontFamily: "var(--sans)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink50)',
              marginBottom: 8,
            }}
          >
            Their name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value.slice(0, 24)); setNameError('') }}
            placeholder="e.g. Maya"
            maxLength={24}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: `1px solid ${nameError ? 'var(--accent2)' : 'var(--ink15)'}`,
              backgroundColor: 'var(--bg2)',
              fontFamily: "var(--sans)",
              fontSize: 15,
              color: 'var(--ink)',
            }}
          />
          {nameError && (
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--accent2)', fontFamily: "var(--sans)" }}>
              {nameError}
            </div>
          )}
        </div>

        {/* Friends */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: 'block',
              fontFamily: "var(--sans)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink50)',
              marginBottom: 10,
            }}
          >
            Their friends (up to 5)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {friends.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 10px 6px 12px',
                  borderRadius: 20,
                  backgroundColor: 'var(--ink)',
                  color: 'var(--bg)',
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {f}
                <button
                  onClick={() => removeFriend(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: 2,
                    color: 'var(--ink30)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon name="x" size={12} color="var(--ink30)" strokeWidth={2} />
                </button>
              </div>
            ))}

            {addingFriend ? (
              <input
                autoFocus
                type="text"
                value={friendInput}
                onChange={e => setFriendInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addFriend() }}
                onBlur={addFriend}
                placeholder="Name…"
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: '1px solid var(--accent)',
                  backgroundColor: 'var(--bg2)',
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: 'var(--ink)',
                  width: 120,
                }}
              />
            ) : friends.length < 5 ? (
              <button
                onClick={() => { setAddingFriend(true); setFriendError('') }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: '1.5px dashed var(--ink30)',
                  backgroundColor: 'transparent',
                  color: 'var(--ink50)',
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <Icon name="plus" size={12} color="var(--ink50)" strokeWidth={2} />
                Add a friend's name
              </button>
            ) : null}
          </div>
          {friendError && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink50)', fontFamily: "var(--sans)", fontStyle: 'italic' }}>
              {friendError}
            </div>
          )}
        </div>

        {/* Character sketch */}
        <div style={{ marginBottom: 36 }}>
          <label
            style={{
              display: 'block',
              fontFamily: "var(--sans)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink50)',
              marginBottom: 8,
            }}
          >
            Quick character sketch
          </label>
          <textarea
            value={sketch}
            onChange={e => setSketch(e.target.value)}
            placeholder="Describe their look, personality, quirks… whatever feels true."
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid var(--ink15)',
              backgroundColor: 'var(--bg2)',
              fontFamily: "var(--serif)",
              fontSize: 15,
              lineHeight: 1.5,
              color: 'var(--ink)',
              minHeight: 96,
            }}
          />
        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
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
