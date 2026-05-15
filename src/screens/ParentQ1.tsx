import React, { useState } from 'react'
import { ParentQShell } from './ParentQShell'

interface ParentQ1Props {
  name: string
  moment: string
  onBack: () => void
  onContinue: (moment: string) => void
  onSkip: () => void
}

export function ParentQ1({ name, moment: initialMoment, onBack, onContinue, onSkip }: ParentQ1Props) {
  const [moment, setMoment] = useState(initialMoment)

  return (
    <ParentQShell
      step={1}
      kicker="Tonight · Question 1 of 4"
      question={`What was the moment that stuck with you about ${name}'s day?`}
      onBack={onBack}
      onSkip={onSkip}
      onContinue={() => onContinue(moment)}
    >
      <textarea
        value={moment}
        onChange={e => setMoment(e.target.value)}
        placeholder="Write what comes to mind…"
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
          minHeight: 180,
          flex: 1,
          boxSizing: 'border-box',
        }}
      />
      <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink50)', marginTop: 10, marginBottom: 28 }}>
        Whatever you write stays on this device. The story will reshape it, not repeat it.
      </div>
    </ParentQShell>
  )
}
