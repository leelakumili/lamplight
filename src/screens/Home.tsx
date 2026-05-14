import React, { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { getGreeting, formatStoryAge } from '../lib/utils'
import type { Setup, Story } from '../types'

interface HomeProps {
  setup: Setup
  history: Story[]
  onParentEntry: () => void
  onTeenEntry: () => void
  onSettings: () => void
  onOpenStory: (story: Story) => void
}

export function Home({ setup, history, onParentEntry, onTeenEntry, onSettings, onOpenStory }: HomeProps) {
  const [greeting, setGreeting] = useState(getGreeting())

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 30000)
    return () => clearInterval(interval)
  }, [])

  const recentStories = history.slice(0, 3)

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
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 8px',
        }}
      >
        {/* App glyph */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            background: 'linear-gradient(135deg, #c9924a, #a35d3a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="moon" size={18} color="white" strokeWidth={1.5} />
        </div>

        {/* Settings */}
        <button onClick={onSettings} style={{ padding: 4, color: '#3e3830' }}>
          <Icon name="settings" size={22} color="#3e3830" strokeWidth={1.5} />
        </button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: '#76705f',
            marginBottom: 4,
          }}
        >
          {greeting.label}
        </div>
        <div
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 30,
            fontWeight: 400,
            color: '#1f1b16',
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          {greeting.time}
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Tonight's Story (parent entry) */}
        <button
          onClick={onParentEntry}
          style={{
            width: '100%',
            minHeight: 170,
            borderRadius: 22,
            background: 'linear-gradient(155deg, #2c3158, #15182a)',
            border: 'none',
            cursor: 'pointer',
            padding: '22px 22px 20px',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Moon icon decorative */}
          <div
            style={{
              position: 'absolute',
              right: -30,
              bottom: -40,
              opacity: 0.18,
            }}
          >
            <Icon name="moon" size={180} color="#e5b574" strokeWidth={0.8} />
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#e5b574',
                marginBottom: 10,
              }}
            >
              For the Parent
            </div>
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 26,
                fontWeight: 400,
                color: '#e9dfc9',
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              Tonight's story
            </div>
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 14,
                color: 'rgba(233,223,201,0.66)',
                lineHeight: 1.5,
                marginBottom: 18,
              }}
            >
              Four quiet questions about {setup.name}'s day. Then a story by bedtime.
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: '#faf4e8',
              }}
            >
              Start
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </button>

        {/* Make My Story (teen entry) */}
        <button
          onClick={onTeenEntry}
          style={{
            width: '100%',
            minHeight: 128,
            borderRadius: 22,
            backgroundColor: '#ebdfc7',
            border: 'none',
            cursor: 'pointer',
            padding: '20px 22px',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Sparkle decorative */}
          <div
            style={{
              position: 'absolute',
              right: -20,
              bottom: -30,
              opacity: 0.4,
            }}
          >
            <Icon name="sparkle" size={140} color="#a35d3a" strokeWidth={0.8} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#a35d3a',
                marginBottom: 8,
              }}
            >
              For {setup.name}
            </div>
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 24,
                fontWeight: 400,
                color: '#1f1b16',
                lineHeight: 1.2,
                marginBottom: 4,
              }}
            >
              Make my story
            </div>
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 14,
                color: '#76705f',
                lineHeight: 1.5,
              }}
            >
              Pick a theme and I'll write you something tonight.
            </div>
          </div>
        </button>

        {/* Recent stories */}
        {recentStories.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#76705f',
                marginBottom: 12,
                paddingLeft: 2,
              }}
            >
              Recent Stories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentStories.map(story => (
                <button
                  key={story.id}
                  onClick={() => onOpenStory(story)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 14px',
                    borderRadius: 14,
                    backgroundColor: '#f3ead8',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {/* Book spine thumbnail */}
                  <div
                    style={{
                      width: 38,
                      height: 48,
                      borderRadius: 4,
                      background: 'linear-gradient(160deg, #c9924a, #a35d3a)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Newsreader', Georgia, serif",
                        fontSize: 15,
                        color: '#1f1b16',
                        fontWeight: 400,
                        marginBottom: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {story.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        color: '#76705f',
                      }}
                    >
                      {formatStoryAge(story.generatedAt)} · {story.mode} · {story.destination || 'story'}
                    </div>
                  </div>
                  <Icon name="chevron-right" size={16} color="#b2aa97" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacer */}
      <div style={{ flex: 1, minHeight: 32 }} />
    </div>
  )
}
