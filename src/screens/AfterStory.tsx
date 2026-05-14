import React, { useState } from 'react'
import { Icon } from '../components/Icon'

interface AfterStoryProps {
  mode: 'parent' | 'teen'
  story: { title: string; content: string }
  onSave: () => void
  onWriteAnother: () => void
  onDone: () => void
  onBack: () => void
  onRegenerate: () => void
}

export function AfterStory({ mode, story, onSave, onWriteAnother, onDone, onBack, onRegenerate }: AfterStoryProps) {
  const [shareToast, setShareToast] = useState<string | null>(null)

  const canShare = typeof navigator !== 'undefined' && (!!navigator.share || !!navigator.clipboard)

  async function handleShare() {
    const text = `${story.title}\n\n${story.content}\n\n— A Storythread story`
    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text })
        showShareToast('Shared!')
      } catch {
        // User cancelled or error — try clipboard
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
        backgroundColor: '#15182a',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 24px 40px',
        animation: 'st-fade-in 0.4s ease both',
      }}
    >
      {/* Back */}
      <button onClick={onBack} style={{ padding: 4, alignSelf: 'flex-start', marginBottom: 'auto' }}>
        <Icon name="chevron-left" size={24} color="#e9dfc9" />
      </button>

      {/* Center content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#e5b574',
            marginBottom: 14,
          }}
        >
          The End
        </div>

        <h2
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 30,
            fontWeight: 400,
            color: '#e9dfc9',
            lineHeight: 1.2,
            marginBottom: 10,
          }}
        >
          How did that land?
        </h2>

        <p
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 15,
            color: 'rgba(233,223,201,0.7)',
            lineHeight: 1.55,
            marginBottom: 36,
          }}
        >
          Just for you. No one sees this. No streaks, no scores — only a way to mark the night.
        </p>

        {/* Option cards */}
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
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 17,
                color: '#e9dfc9',
                marginBottom: 2,
              }}
            >
              That felt right.
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#e5b574',
              }}
            >
              Save it
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
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 17,
                color: '#e9dfc9',
                marginBottom: 2,
              }}
            >
              Something else.
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: 'rgba(233,223,201,0.5)',
              }}
            >
              Try again
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
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 17,
                color: 'rgba(233,223,201,0.6)',
                marginBottom: 2,
              }}
            >
              Just done.
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: 'rgba(233,223,201,0.35)',
              }}
            >
              Close the book
            </div>
          </button>

          {/* Share button */}
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
              <Icon name="share" size={18} color="#c9924a" />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#c9924a',
                  fontWeight: 500,
                }}
              >
                Share this story
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          color: 'rgba(233,223,201,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          textAlign: 'center',
        }}
      >
        Nothing tracked · Nothing shared
      </div>

      {/* Share toast */}
      {shareToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1f1b16',
            color: '#faf4e8',
            fontFamily: "'DM Sans', sans-serif",
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
