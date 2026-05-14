import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { Toggle } from '../components/Toggle'
import type { Setup } from '../types'

interface SettingsProps {
  setup: Setup
  onBack: () => void
  onSave: (setup: Setup) => void
}

export function Settings({ setup: initialSetup, onBack, onSave }: SettingsProps) {
  const [setup, setSetup] = useState<Setup>(initialSetup)
  const [editingSketch, setEditingSketch] = useState(false)
  const [addingFriend, setAddingFriend] = useState(false)
  const [friendInput, setFriendInput] = useState('')
  const [showKey, setShowKey] = useState(false)

  function update<K extends keyof Setup>(key: K, value: Setup[K]) {
    const newSetup = { ...setup, [key]: value }
    setSetup(newSetup)
    onSave(newSetup)
  }

  function addFriend() {
    const trimmed = friendInput.trim()
    if (!trimmed || setup.friends.length >= 5) {
      setAddingFriend(false)
      setFriendInput('')
      return
    }
    update('friends', [...setup.friends, trimmed])
    setFriendInput('')
    setAddingFriend(false)
  }

  function removeFriend(i: number) {
    update('friends', setup.friends.filter((_, idx) => idx !== i))
  }

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#76705f',
        marginBottom: 8,
        paddingLeft: 2,
      }}
    >
      {children}
    </div>
  )

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        backgroundColor: '#f3ead8',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  )

  const Row = ({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: last ? 'none' : '1px solid #dfd5bd',
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: '#3e3830',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>{children}</div>
    </div>
  )

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
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid #ebdfc7',
        }}
      >
        <button onClick={onBack} style={{ padding: 4 }}>
          <Icon name="chevron-left" size={24} color="#3e3830" />
        </button>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: '#1f1b16',
          }}
        >
          Settings
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 16px 40px', overflowY: 'auto' }}>
        {/* Reader Profile */}
        <SectionLabel>Reader Profile</SectionLabel>
        <Card>
          <Row label="Name">
            <input
              type="text"
              value={setup.name}
              onChange={e => update('name', e.target.value.slice(0, 24))}
              maxLength={24}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#76705f',
                textAlign: 'right',
                width: 150,
              }}
            />
          </Row>
          <Row label="Age" last>
            <input
              type="text"
              value={setup.age}
              onChange={e => update('age', e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#76705f',
                textAlign: 'right',
                width: 80,
              }}
            />
          </Row>
        </Card>

        {/* Friends */}
        <SectionLabel>Friends ({setup.friends.length} / 5)</SectionLabel>
        <div
          style={{
            backgroundColor: '#f3ead8',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {setup.friends.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 10px 6px 12px',
                  borderRadius: 20,
                  backgroundColor: '#1f1b16',
                  color: '#faf4e8',
                  fontFamily: "'DM Sans', sans-serif",
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
                    color: '#b2aa97',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon name="x" size={12} color="#b2aa97" strokeWidth={2} />
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
                  border: '1px solid #c9924a',
                  backgroundColor: '#fff',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: '#1f1b16',
                  width: 120,
                }}
              />
            ) : setup.friends.length < 5 ? (
              <button
                onClick={() => setAddingFriend(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: '1.5px dashed #b2aa97',
                  backgroundColor: 'transparent',
                  color: '#76705f',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <Icon name="plus" size={12} color="#76705f" strokeWidth={2} />
                Add
              </button>
            ) : null}
          </div>
        </div>

        {/* Character Sketch */}
        <SectionLabel>Character Sketch</SectionLabel>
        <div
          style={{
            backgroundColor: '#f3ead8',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          {editingSketch ? (
            <textarea
              autoFocus
              value={setup.characterSketch}
              onChange={e => update('characterSketch', e.target.value)}
              onBlur={() => setEditingSketch(false)}
              style={{
                width: '100%',
                border: 'none',
                backgroundColor: 'transparent',
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 14,
                lineHeight: 1.55,
                color: '#1f1b16',
                minHeight: 80,
              }}
            />
          ) : (
            <>
              <p
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: setup.characterSketch ? '#1f1b16' : '#b2aa97',
                  marginBottom: 10,
                  fontStyle: setup.characterSketch ? 'normal' : 'italic',
                }}
              >
                {setup.characterSketch || 'No sketch added yet.'}
              </p>
              <button
                onClick={() => setEditingSketch(true)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: '#a35d3a',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Edit sketch
              </button>
            </>
          )}
        </div>

        {/* Story Engine */}
        <SectionLabel>Story Engine</SectionLabel>
        <Card>
          <Row label="Provider">
            <select
              value={setup.provider}
              onChange={e => update('provider', e.target.value as 'claude' | 'openai')}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#76705f',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="claude">Claude Sonnet</option>
              <option value="openai">GPT-4o</option>
            </select>
          </Row>
          <Row label="API Key">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={setup.apiKey}
                onChange={e => update('apiKey', e.target.value)}
                placeholder="Not set"
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: '#76705f',
                  textAlign: 'right',
                  maxWidth: 150,
                }}
              />
              <button
                onClick={() => setShowKey(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Icon name={showKey ? 'eye-off' : 'eye'} size={16} color="#76705f" />
              </button>
            </div>
          </Row>
          <Row label="Use local model" last>
            <Toggle
              checked={setup.useLocal}
              onChange={v => update('useLocal', v)}
            />
          </Row>
        </Card>

        {/* Reading */}
        <SectionLabel>Reading</SectionLabel>
        <Card>
          <Row label="Default font size" last>
            <select
              value={setup.defaultFontSize}
              onChange={e => update('defaultFontSize', Number(e.target.value))}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#76705f',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              {[14, 16, 18, 20, 22].map(s => (
                <option key={s} value={s}>{s}px</option>
              ))}
            </select>
          </Row>
        </Card>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px',
          textAlign: 'center',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: '#76705f',
        }}
      >
        Storythread · v1.0 · local-first
      </div>
    </div>
  )
}
