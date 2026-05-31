import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import type { StoryReflection } from '../types'

interface AfterStoryProps {
  story: { title: string; content: string }
  existingReflection?: StoryReflection
  onReflect: (reflection: StoryReflection) => void
  onSave: () => void
  onDone: () => void
  onBack: () => void
  onRegenerate: () => void
}

const REFLECTIONS: { value: StoryReflection; label: string; sub: string }[] = [
  { value: 'felt-right', label: 'That felt right.', sub: 'It landed the way I needed' },
  { value: 'felt-okay', label: 'Felt okay.', sub: 'Close, but not quite there' },
  { value: 'didnt-fit', label: "Didn't really fit.", sub: 'Tonight needed something else' },
]

export function AfterStory({ story, existingReflection, onReflect, onSave, onDone, onBack, onRegenerate }: AfterStoryProps) {
  // If we already have a reflection (re-visiting the screen), skip straight to actions
  const [reflection, setReflection] = useState<StoryReflection | null>(existingReflection ?? null)
  const [shareToast, setShareToast] = useState<string | null>(null)

  const canShare = typeof navigator !== 'undefined' && (!!navigator.share || !!navigator.clipboard)

  function handleReflect(value: StoryReflection) {
    setReflection(value)
    onReflect(value)
  }

  async function handleShare() {
    const text = `${story.title}\n\n${story.content}\n\n— A Lamplight story`
    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text })
        showShareToast('Shared!')
      } catch {
        await tryClipboard(text)
      }
    } else {
      await tryClipboard(text)
    }
  }

  async function tryClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      showShareToast('Copied to clipboard')
    } catch {
      showShareToast('Could not share')
    }
  }

  function showShareToast(msg: string) {
    setShareToast(msg)
    setTimeout(() => setShareToast(null), 2000)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--dark-bg)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 24px 40px',
        animation: 'st-fade-in 0.4s ease both',
      }}
    >
      {/* Back */}
      <button onClick={onBack} style={{ padding: 4, alignSelf: 'flex-start', marginBottom: 'auto' }}>
        <Icon name="chevron-left" size={24} color="var(--dark-ink)" />
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>

        {/* ── Phase 1: Reflection ── */}
        {!reflection && (
          <div style={{ animation: 'st-fade-in 0.35s ease both' }}>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--accent-s)',
                marginBottom: 14,
              }}
            >
              The End
            </div>

            <h2
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 30,
                fontWeight: 400,
                color: 'var(--dark-ink)',
                lineHeight: 1.2,
                marginBottom: 10,
              }}
            >
              How did that land?
            </h2>

            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 15,
                color: 'rgba(233,223,201,0.6)',
                lineHeight: 1.55,
                marginBottom: 36,
              }}
            >
              Just for you. No one sees this.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {REFLECTIONS.map(r => (
                <button
                  key={r.value}
                  onClick={() => handleReflect(r.value)}
                  style={{
                    padding: '18px 20px',
                    borderRadius: 16,
                    border: '1px solid rgba(229,181,116,0.25)',
                    backgroundColor: 'rgba(229,181,116,0.06)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                >
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--dark-ink)', marginBottom: 3 }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--accent-s)' }}>
                    {r.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Phase 2: Actions (shown after reflection) ── */}
        {reflection && (
          <div style={{ animation: 'st-fade-in 0.35s ease both' }}>
            {/* Reflection echo */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 28,
                padding: '8px 14px',
                borderRadius: 20,
                border: '1px solid rgba(229,181,116,0.3)',
                backgroundColor: 'rgba(229,181,116,0.08)',
              }}
            >
              <span style={{ fontSize: 14 }}>
                {reflection === 'felt-right' ? '✦' : reflection === 'felt-okay' ? '◦' : '○'}
              </span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--accent-s)' }}>
                {REFLECTIONS.find(r => r.value === reflection)?.label}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 26,
                fontWeight: 400,
                color: 'var(--dark-ink)',
                lineHeight: 1.25,
                marginBottom: 28,
              }}
            >
              {reflection === 'felt-right'
                ? 'Keep it for later?'
                : reflection === 'felt-okay'
                  ? 'Want to try another one?'
                  : 'Want something different tonight?'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={onSave}
                style={{
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: '1px solid rgba(229,181,116,0.4)',
                  backgroundColor: 'rgba(229,181,116,0.08)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--dark-ink)', marginBottom: 2 }}>
                  Save it.
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--accent-s)' }}>
                  Keep this story
                </div>
              </button>

              <button
                onClick={onRegenerate}
                style={{
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: '1px solid rgba(233,223,201,0.15)',
                  backgroundColor: 'rgba(233,223,201,0.04)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--dark-ink)', marginBottom: 2 }}>
                  One more.
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'rgba(233,223,201,0.5)' }}>
                  Try a new story
                </div>
              </button>

              <button
                onClick={onDone}
                style={{
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: '1px solid rgba(233,223,201,0.1)',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: 'rgba(233,223,201,0.6)', marginBottom: 2 }}>
                  Good night.
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'rgba(233,223,201,0.35)' }}>
                  Close the book
                </div>
              </button>

              {canShare && (
                <button
                  onClick={handleShare}
                  style={{
                    marginTop: 4,
                    padding: '14px 20px',
                    borderRadius: 16,
                    border: '1px solid rgba(201,146,74,0.25)',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Icon name="share" size={18} color="var(--accent)" />
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--accent)', fontWeight: 500 }}>
                    Share this story
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          color: 'rgba(233,223,201,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          textAlign: 'center',
        }}
      >
        Nothing tracked · Nothing shared
      </div>

      {shareToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--ink)',
            color: 'var(--bg)',
            fontFamily: 'var(--sans)',
            fontSize: 13,
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: 20,
            zIndex: 200,
            animation: 'st-fade-in 0.2s ease both',
            whiteSpace: 'nowrap',
          }}
        >
          {shareToast}
        </div>
      )}
    </div>
  )
}
