import React, { useState } from 'react'
import { Chip } from '../components/Chip'
import { ParentQShell } from './ParentQShell'

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
    setSelected(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  return (
    <ParentQShell
      step={3}
      question={`How did ${name} seem to be carrying it?`}
      onBack={onBack}
      onSkip={onSkip}
      onContinue={() => onContinue(selected, note)}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {EMOTIONS.map(emotion => (
          <Chip key={emotion} label={emotion} active={selected.includes(emotion)} onToggle={() => toggleEmotion(emotion)} />
        ))}
      </div>
      <label style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink50)', marginBottom: 8, display: 'block' }}>
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
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 1.5,
          color: 'var(--ink)',
          minHeight: 100,
          flex: 1,
          marginBottom: 28,
          boxSizing: 'border-box',
        }}
      />
    </ParentQShell>
  )
}
