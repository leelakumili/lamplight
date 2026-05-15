import React from 'react'
import { Icon } from '../components/Icon'
import { ParentProgress } from '../components/ProgressDots'
import { CTAButton } from '../components/CTAButton'

interface ParentQShellProps {
  step: 1 | 2 | 3 | 4
  question: string | React.ReactNode
  kicker?: string
  onBack: () => void
  onSkip: () => void
  onContinue: () => void
  continueLabel?: React.ReactNode
  continueDisabled?: boolean
  scrollable?: boolean
  children?: React.ReactNode
}

export function ParentQShell({
  step, question, kicker, onBack, onSkip, onContinue,
  continueLabel = 'Continue', continueDisabled, scrollable, children,
}: ParentQShellProps) {
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', animation: 'st-fade-in 0.3s ease both' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <button onClick={onBack} style={{ padding: 4 }}>
          <Icon name="chevron-left" size={24} color="var(--ink70)" />
        </button>
        <ParentProgress step={step} />
        <button onClick={onSkip} style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink50)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Skip
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px 24px 40px', display: 'flex', flexDirection: 'column', ...(scrollable ? { overflowY: 'auto' } : {}) }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>
          {kicker ?? `Question ${step} of 4`}
        </div>

        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400, lineHeight: 1.22, color: 'var(--ink)', marginBottom: 24 }}>
          {question}
        </h2>

        {children}

        <CTAButton onClick={onContinue} disabled={continueDisabled}>
          {continueLabel}
        </CTAButton>
      </div>
    </div>
  )
}
