import React from 'react'
import { Icon } from '../components/Icon'

const THEMES = [
  { title: 'Left out', sub: 'When no one saved you a seat.', icon: 'arc', color: '#6e8579' },
  { title: 'Someone was mean', sub: "A line that didn't leave your head.", icon: 'crack', color: '#a35d3a' },
  { title: 'Friend drama', sub: 'Things shifted and you can feel it.', icon: 'knot', color: '#c9924a' },
  { title: 'Misunderstood', sub: 'You meant one thing. They heard another.', icon: 'echo', color: '#4a4d6b' },
  { title: 'Too much noise', sub: 'Your head needs the volume down.', icon: 'wave', color: '#6e8579' },
  { title: 'A small win', sub: 'Something good. Worth a real story.', icon: 'spark', color: '#c9924a' },
  { title: 'Tomorrow looms', sub: "A thing on the calendar you're bracing for.", icon: 'horizon', color: '#4a4d6b' },
  { title: 'Just somewhere else', sub: 'No prompt. Take me out of today.', icon: 'door', color: '#a35d3a' },
]

interface TeenThemesProps {
  name: string
  onBack: () => void
  onSelect: (theme: string) => void
}

export function TeenThemes({ name, onBack, onSelect }: TeenThemesProps) {
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
      <div style={{ padding: '16px 20px 0' }}>
        <button onClick={onBack} style={{ padding: 4 }}>
          <Icon name="chevron-left" size={24} color="#3e3830" />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px 20px 40px', overflowY: 'auto' }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#76705f',
            marginBottom: 10,
          }}
        >
          For {name} · Tonight
        </div>

        <h1
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#1f1b16',
            marginBottom: 8,
          }}
        >
          What's the{' '}
          <em style={{ color: '#a35d3a', fontStyle: 'italic' }}>story about?</em>
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: '#76705f',
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          Pick whatever's closest. You can change the ending later.
        </p>

        {/* 2-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {THEMES.map(theme => (
            <button
              key={theme.title}
              onClick={() => onSelect(theme.title)}
              style={{
                minHeight: 148,
                borderRadius: 16,
                border: '1px solid #dfd5bd',
                backgroundColor: '#f3ead8',
                padding: '16px 14px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon name={theme.icon} size={26} color={theme.color} strokeWidth={1.6} />
              <div
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: 17,
                  fontWeight: 400,
                  color: '#1f1b16',
                  lineHeight: 1.2,
                  marginTop: 10,
                }}
              >
                {theme.title}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11.5,
                  color: '#76705f',
                  lineHeight: 1.4,
                  marginTop: 4,
                  flex: 1,
                }}
              >
                {theme.sub}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
