import React, { useState } from 'react'
import { Chip } from '../components/Chip'
import { ParentQShell } from './ParentQShell'

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
    setSelected(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  return (
    <ParentQShell
      step={2}
      question="Who was around today — for better or worse?"
      onBack={onBack}
      onSkip={onSkip}
      onContinue={() => onContinue(selected, note)}
    >
      {friends.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink50)', marginBottom: 10 }}>
            Friends
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {friends.map(f => (
              <Chip key={f} label={f} active={selected.includes(f)} onToggle={() => toggleFriend(f)} />
            ))}
          </div>
        </div>
      )}
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Anyone else you want to mention…"
        style={{
          width: '100%',
          padding: 16,
          borderRadius: 16,
          border: '1px solid var(--ink15)',
          backgroundColor: 'var(--bg2)',
          fontFamily: 'var(--serif)',
          fontSize: 16,
          lineHeight: 1.5,
          color: 'var(--ink)',
          minHeight: 140,
          flex: 1,
          marginBottom: 28,
          boxSizing: 'border-box',
        }}
      />
    </ParentQShell>
  )
}
