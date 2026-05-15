import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { ParentQShell } from './ParentQShell'

const DESTINATIONS = [
  { value: 'Hopeful',    label: 'Hopeful',    sub: 'A lighter ending. Things shift.' },
  { value: 'Understood', label: 'Understood', sub: 'Someone sees them clearly.' },
  { value: 'Brave',      label: 'Brave',      sub: 'They step toward, not away.' },
  { value: 'Confident',  label: 'Confident',  sub: 'Their own voice gets louder.' },
  { value: 'Calm',       label: 'Calm',       sub: 'The day quiets and softens.' },
  { value: 'Empowered',  label: 'Empowered',  sub: 'They choose what comes next.' },
]

interface ParentQ4Props {
  destination: string
  onBack: () => void
  onSubmit: (destination: string) => void
  onSkip: () => void
}

export function ParentQ4({ destination: initDest, onBack, onSubmit, onSkip }: ParentQ4Props) {
  const [selected, setSelected] = useState(initDest)

  return (
    <ParentQShell
      step={4}
      question="Where should the story leave them?"
      onBack={onBack}
      onSkip={onSkip}
      onContinue={() => selected && onSubmit(selected)}
      continueLabel={<><Icon name="sparkle" size={18} color={selected ? 'var(--cta-fg, var(--bg))' : 'var(--ink30)'} /> Write their story</>}
      continueDisabled={!selected}
      scrollable
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {DESTINATIONS.map(dest => {
          const active = selected === dest.value
          return (
            <button
              key={dest.value}
              onClick={() => setSelected(dest.value)}
              style={{
                minHeight: 88,
                borderRadius: 16,
                border: `1px solid ${active ? 'var(--ink)' : 'var(--ink15)'}`,
                backgroundColor: active ? 'var(--ink)' : 'var(--bg2)',
                padding: 14,
                textAlign: 'left',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              {active && (
                <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: 'var(--accent-s)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500, color: active ? 'var(--bg)' : 'var(--ink)', marginBottom: 4 }}>
                {dest.label}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: active ? 'var(--bg)' : 'var(--ink50)', opacity: active ? 0.7 : 1, lineHeight: 1.4 }}>
                {dest.sub}
              </div>
            </button>
          )
        })}
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink50)', marginTop: 8 }}>
        Takes about 20 seconds.
      </div>
    </ParentQShell>
  )
}
