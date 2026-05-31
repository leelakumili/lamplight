import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { Toggle } from '../components/Toggle'
import type { Setup, Profile } from '../types'
import { generateId } from '../lib/utils'
import { THEME_META, type AppTheme } from '../lib/theme'

interface SettingsProps {
  setup: Setup
  profiles: Profile[]
  activeProfileId: string | null
  appTheme: AppTheme
  onBack: () => void
  onSave: (setup: Setup) => void
  onSaveProfiles: (profiles: Profile[], activeProfileId: string | null) => void
  onChangeTheme: (theme: AppTheme) => void
}

export function Settings({ setup: initialSetup, profiles, activeProfileId, appTheme, onBack, onSave, onSaveProfiles, onChangeTheme }: SettingsProps) {
  const [setup, setSetup] = useState<Setup>(initialSetup)
  const [editingSketch, setEditingSketch] = useState(false)
  const [addingFriend, setAddingFriend] = useState(false)
  const [friendInput, setFriendInput] = useState('')
  const [addingProfile, setAddingProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

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

  function handleAddProfile() {
    const name = newProfileName.trim()
    if (!name) { setAddingProfile(false); return }
    const profile: Profile = { id: generateId(), name, age: '', friends: [], characterSketch: '' }
    const updated = [...profiles, profile]
    onSaveProfiles(updated, profile.id)
    setNewProfileName('')
    setAddingProfile(false)
  }

  function handleSetActiveProfile(id: string) {
    onSaveProfiles(profiles, id)
  }

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontFamily: "var(--sans)", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink50)', marginBottom: 8, paddingLeft: 2 }}>
      {children}
    </div>
  )

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div style={{ backgroundColor: 'var(--bg2)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
      {children}
    </div>
  )

  const Row = ({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: last ? 'none' : '1px solid var(--ink15)', gap: 12 }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink70)', flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, textAlign: 'right' }}>{children}</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', animation: 'st-fade-in 0.3s ease both' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--ink15)' }}>
        <button onClick={onBack} style={{ padding: 4 }}>
          <Icon name="chevron-left" size={24} color="var(--ink70)" />
        </button>
        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>Settings</div>
      </div>

      <div style={{ flex: 1, padding: '20px 16px 40px', overflowY: 'auto' }}>

        {/* Profiles section */}
        {profiles.length > 0 && (
          <>
            <SectionLabel>Profiles</SectionLabel>
            <div style={{ backgroundColor: 'var(--bg2)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
              {profiles.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => handleSetActiveProfile(p.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: 'none', borderBottom: i < profiles.length - 1 || addingProfile ? '1px solid var(--ink15)' : 'none', backgroundColor: 'transparent', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink70)', cursor: 'pointer', textAlign: 'left' }}
                >
                  {p.name}
                  {p.id === activeProfileId && <Icon name="check" size={16} color="var(--accent)" strokeWidth={2} />}
                </button>
              ))}
              {addingProfile ? (
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--ink15)' }}>
                  <input
                    autoFocus
                    type="text"
                    value={newProfileName}
                    onChange={e => setNewProfileName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddProfile() }}
                    onBlur={handleAddProfile}
                    placeholder="Profile name…"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--accent)', backgroundColor: 'var(--bg)', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink)', boxSizing: 'border-box' }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setAddingProfile(true)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '14px 16px', border: 'none', borderTop: '1px solid var(--ink15)', backgroundColor: 'transparent', fontFamily: "var(--sans)", fontSize: 13, color: 'var(--accent2)', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Icon name="plus" size={14} color="var(--accent2)" strokeWidth={2} />
                  Add profile
                </button>
              )}
            </div>
          </>
        )}

        {/* Reader Profile */}
        <SectionLabel>Reader Profile</SectionLabel>
        <Card>
          <Row label="Name">
            <input
              type="text"
              value={setup.name}
              onChange={e => update('name', e.target.value.slice(0, 24))}
              maxLength={24}
              style={{ background: 'none', border: 'none', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink50)', textAlign: 'right', width: 150 }}
            />
          </Row>
          <Row label="Age" last>
            <input
              type="text"
              value={setup.age}
              onChange={e => update('age', e.target.value)}
              style={{ background: 'none', border: 'none', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink50)', textAlign: 'right', width: 80 }}
            />
          </Row>
        </Card>

        {/* Friends */}
        <SectionLabel>Friends ({setup.friends.length} / 5)</SectionLabel>
        <div style={{ backgroundColor: 'var(--bg2)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {setup.friends.map((f, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px 6px 12px', borderRadius: 20, backgroundColor: 'var(--ink)', color: 'var(--bg)', fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500 }}>
                {f}
                <button onClick={() => removeFriend(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 2, color: 'var(--ink30)', display: 'flex', alignItems: 'center' }}>
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
                style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid var(--accent)', backgroundColor: 'var(--bg)', fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink)', width: 120 }}
              />
            ) : setup.friends.length < 5 ? (
              <button
                onClick={() => setAddingFriend(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 20, border: '1.5px dashed var(--ink30)', backgroundColor: 'transparent', color: 'var(--ink50)', fontFamily: "var(--sans)", fontSize: 13, cursor: 'pointer' }}
              >
                <Icon name="plus" size={12} color="var(--ink50)" strokeWidth={2} />
                Add
              </button>
            ) : null}
          </div>
        </div>

        {/* Character Sketch */}
        <SectionLabel>Character Sketch</SectionLabel>
        <div style={{ backgroundColor: 'var(--bg2)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
          {editingSketch ? (
            <textarea
              autoFocus
              value={setup.characterSketch}
              onChange={e => update('characterSketch', e.target.value)}
              onBlur={() => setEditingSketch(false)}
              style={{ width: '100%', border: 'none', backgroundColor: 'transparent', fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.55, color: 'var(--ink)', minHeight: 80 }}
            />
          ) : (
            <>
              <p style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.55, color: setup.characterSketch ? 'var(--ink)' : 'var(--ink30)', marginBottom: 10, fontStyle: setup.characterSketch ? 'normal' : 'italic' }}>
                {setup.characterSketch || 'No sketch added yet.'}
              </p>
              <button onClick={() => setEditingSketch(true)} style={{ fontFamily: "var(--sans)", fontSize: 13, color: 'var(--accent2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
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
              style={{ background: 'none', border: 'none', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink50)', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="claude">Claude Sonnet</option>
              <option value="openai">GPT-4o</option>
            </select>
          </Row>
          <Row label="Story style">
            <select
              value={setup.storyStyle || 'modern'}
              onChange={e => update('storyStyle', e.target.value as 'modern' | 'panchatantra')}
              style={{ background: 'none', border: 'none', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink50)', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="modern">Modern fiction</option>
              <option value="panchatantra">Panchatantra fable 🪔</option>
            </select>
          </Row>
          <Row label="Use local model">
            <Toggle checked={setup.useLocal} onChange={v => update('useLocal', v)} />
          </Row>
          {setup.useLocal && (
            <div style={{ padding: '4px 16px 14px' }}>
              <div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink50)', marginBottom: 6 }}>Model name</div>
                <input
                  type="text"
                  value={setup.ollamaModel || ''}
                  onChange={e => update('ollamaModel', e.target.value)}
                  placeholder="e.g. gemma3:12b, llama3.1, mistral"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ink15)', backgroundColor: 'var(--bg)', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink)', boxSizing: 'border-box' }}
                />
                <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: 'var(--ink30)', marginTop: 5 }}>Must match exactly what `ollama list` shows</div>
              </div>
            </div>
          )}
          {!setup.useLocal && <div style={{ height: 1 }} />}
        </Card>

        {/* Look & feel */}
        <SectionLabel>Look &amp; feel</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {(Object.entries(THEME_META) as [AppTheme, typeof THEME_META[AppTheme]][]).map(([id, meta]) => {
            const active = appTheme === id
            return (
              <button
                key={id}
                onClick={() => onChangeTheme(id)}
                style={{
                  padding: '14px 14px 12px',
                  borderRadius: 'var(--r-card)',
                  border: active ? '2px solid var(--accent)' : '1px solid var(--ink15)',
                  backgroundColor: meta.bg,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  position: 'relative',
                  transition: 'border-color 0.15s',
                }}
              >
                {active && (
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Icon name="check" size={14} color={meta.accent} strokeWidth={2.5} />
                  </div>
                )}
                {/* Mini accent swatch */}
                <div style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: meta.accent }} />
                <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: meta.ink, lineHeight: 1.2 }}>{meta.label}</div>
                <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, color: meta.ink, opacity: 0.55, lineHeight: 1.3 }}>{meta.desc}</div>
              </button>
            )
          })}
        </div>

        {/* Reading */}
        <SectionLabel>Reading</SectionLabel>
        <Card>
          <Row label="Default font size" last>
            <select
              value={setup.defaultFontSize}
              onChange={e => update('defaultFontSize', Number(e.target.value))}
              style={{ background: 'none', border: 'none', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink50)', appearance: 'none', cursor: 'pointer' }}
            >
              {[16, 18, 20, 22, 24].map(s => (
                <option key={s} value={s}>{s}px</option>
              ))}
            </select>
          </Row>
        </Card>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px', textAlign: 'center', fontFamily: "var(--mono)", fontSize: 11, color: 'var(--ink50)' }}>
        Lamplight · v1.0 · local-first
      </div>
    </div>
  )
}
