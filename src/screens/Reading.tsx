import React, { useState } from 'react'
import { Icon } from '../components/Icon'
import { paginateStory } from '../lib/utils'
import type { Story } from '../types'

interface ReadingProps {
  story: Story
  fontSize: number
  theme: 'cream' | 'sepia' | 'midnight'
  fontFamily: 'serif' | 'sans'
  onBack: () => void
  onDone: () => void
  onChangeFontSize: (s: number) => void
  onChangeTheme: (t: 'cream' | 'sepia' | 'midnight') => void
  onChangeFontFamily: (f: 'serif' | 'sans') => void
}

const FONT_SIZES = [14, 16, 18, 20, 22]

const THEME_COLORS = {
  cream: { bg: '#ffffff', text: '#1f1b16', scene1: '#c8d8e8', scene2: '#e8e0d0', scene3: '#d0c8b0' },
  sepia: { bg: '#2a2218', text: '#e9dfc9', scene1: '#1a1510', scene2: '#2a2010', scene3: '#1e1a0e' },
  midnight: { bg: '#15182a', text: '#e9dfc9', scene1: '#0f1020', scene2: '#15182a', scene3: '#1c2138' },
}

const SCENE_PALETTES = {
  midnight: { sky: '#1c2138', mid: '#2a3052', low: '#3c3a4f', ground: '#0f1020', glow: '#c9924a', silhouette: '#080c16' },
  sepia:    { sky: '#2a1e0e', mid: '#3a2a14', low: '#2e2010', ground: '#1a1008', glow: '#d4a056', silhouette: '#120c04' },
  cream:    { sky: '#b8ccdc', mid: '#d4c8a8', low: '#c8bc98', ground: '#b0a888', glow: '#c9924a', silhouette: '#8c7e60' },
}

function ImmersiveScene({ theme }: { theme: 'cream' | 'sepia' | 'midnight' }) {
  const p = SCENE_PALETTES[theme]
  const isDark = theme !== 'cream'

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Sky → mid → low gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${p.sky} 0%, ${p.mid} 55%, ${p.low} 100%)`,
        }}
      />

      {/* Warm glow — moon/lamp source, upper right */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          right: '18%',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${p.glow}55 0%, ${p.glow}22 45%, transparent 70%)`,
          filter: 'blur(4px)',
        }}
      />
      {/* Bright core of the glow */}
      <div
        style={{
          position: 'absolute',
          top: '11%',
          right: '24%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${p.glow}99 0%, ${p.glow}33 60%, transparent 80%)`,
        }}
      />

      {/* Horizon line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '32%',
          height: 1,
          background: isDark ? 'rgba(229,181,116,0.18)' : 'rgba(31,27,22,0.14)',
        }}
      />

      {/* SVG rooftop silhouette */}
      <svg
        style={{ position: 'absolute', bottom: '28%', left: 0, width: '100%', height: 110 }}
        viewBox="0 0 430 110"
        preserveAspectRatio="none"
        fill={p.silhouette}
      >
        <path d="M0 110 L0 75 L25 75 L25 52 L55 28 L85 52 L85 68 L125 68 L125 42 L155 18 L185 42 L185 68 L215 68 L215 48 L238 24 L258 48 L258 63 L285 63 L285 48 L308 28 L328 48 L328 75 L358 75 L358 52 L385 38 L415 52 L415 75 L430 75 L430 110 Z" />
      </svg>

      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28%',
          backgroundColor: p.ground,
          background: `repeating-linear-gradient(0deg, ${p.ground}, ${p.ground} 3px, transparent 3px, transparent 14px), ${p.ground}`,
          opacity: isDark ? 1 : 0.6,
        }}
      />

      {/* Vignette edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, transparent 35%, ${isDark ? 'rgba(5,6,14,0.65)' : 'rgba(20,16,10,0.35)'} 100%)`,
        }}
      />
    </div>
  )
}

export function Reading({
  story,
  fontSize,
  theme,
  fontFamily,
  onBack,
  onDone,
  onChangeFontSize,
  onChangeTheme,
  onChangeFontFamily,
}: ReadingProps) {
  const [page, setPage] = useState(0)
  const [showTypeSheet, setShowTypeSheet] = useState(false)

  const pages = paginateStory(story.content)
  const totalPages = pages.length
  const currentPageText = pages[page] || ''

  const colors = THEME_COLORS[theme]
  const ff = fontFamily === 'serif' ? "'Newsreader', Georgia, serif" : "'DM Sans', sans-serif"

  function handleTap(e: React.MouseEvent) {
    const x = e.clientX
    const width = (e.currentTarget as HTMLElement).clientWidth
    if (x < width * 0.35) {
      if (page > 0) setPage(p => p - 1)
    } else if (x > width * 0.65) {
      if (page < totalPages - 1) setPage(p => p + 1)
      else onDone()
    }
  }

  const pageNum = String(page + 1).padStart(2, '0')
  const totalNum = String(totalPages).padStart(2, '0')

  return (
    <div
      style={{
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        animation: 'st-fade-in 0.4s ease both',
      }}
      onClick={handleTap}
    >
      {/* Scene background */}
      <ImmersiveScene theme={theme} />

      {/* Chrome pills top */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        {/* Back pill */}
        <button
          onClick={e => { e.stopPropagation(); onBack() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 14px 8px 10px',
            borderRadius: 20,
            backgroundColor: 'rgba(15,16,26,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(233,223,201,0.12)',
            color: '#e9dfc9',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Icon name="chevron-left" size={16} color="#e9dfc9" />
          Back
        </button>

        {/* Chapter label */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 20,
            backgroundColor: 'rgba(15,16,26,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(233,223,201,0.12)',
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 13,
            fontStyle: 'italic',
            color: '#c9924a',
          }}
        >
          {story.mode === 'parent' ? 'Tonight\'s Story' : 'Your Story'}
        </div>

        {/* Type-sheet icon */}
        <button
          onClick={e => { e.stopPropagation(); setShowTypeSheet(v => !v) }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 36,
            borderRadius: 20,
            backgroundColor: 'rgba(15,16,26,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(233,223,201,0.12)',
            color: '#e9dfc9',
            cursor: 'pointer',
          }}
        >
          <Icon name="type" size={16} color="#e9dfc9" />
        </button>
      </div>

      {/* Floating story card */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: '0 auto',
          padding: '0 16px 24px',
          zIndex: 10,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: colors.bg,
            borderRadius: 22,
            padding: '20px 22px',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Chapter label italic */}
          <div
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 13,
              fontStyle: 'italic',
              color: '#a35d3a',
              marginBottom: 10,
            }}
          >
            {story.mode === 'parent' ? 'A story for tonight' : 'Your story'}
          </div>

          {/* Title on first page */}
          {page === 0 && (
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 20,
                fontWeight: 500,
                color: colors.text,
                lineHeight: 1.3,
                marginBottom: 12,
              }}
            >
              {story.title}
            </div>
          )}

          {/* Story text */}
          <div
            style={{
              fontFamily: ff,
              fontSize,
              lineHeight: 1.55,
              color: colors.text,
              maxHeight: 260,
              overflowY: 'auto',
              marginBottom: 16,
            }}
          >
            {currentPageText.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: i < currentPageText.split('\n\n').length - 1 ? '1em' : 0 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: '#76705f',
                letterSpacing: '0.04em',
              }}
            >
              {pageNum}/{totalNum}
            </div>

            {/* Dot progress */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {Array.from({ length: Math.min(totalPages, 9) }).map((_, i) => (
                <div
                  key={i}
                  onClick={e => { e.stopPropagation(); setPage(i) }}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: i <= page ? '#c9924a' : '#dfd5bd',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                />
              ))}
            </div>

            {/* Nav arrow */}
            <button
              onClick={e => {
                e.stopPropagation()
                if (page < totalPages - 1) setPage(p => p + 1)
                else onDone()
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: '#76705f',
              }}
            >
              <Icon name="chevron-right" size={18} color="#76705f" />
            </button>
          </div>
        </div>
      </div>

      {/* Type sheet */}
      {showTypeSheet && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setShowTypeSheet(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 430,
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: '22px 22px 0 0',
              padding: '20px 24px 40px',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
              animation: 'st-fade-in 0.2s ease both',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#76705f',
                marginBottom: 16,
              }}
            >
              Reading Options
            </div>

            {/* Font size dots */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#3e3830', marginBottom: 10 }}>Font size</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {FONT_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => onChangeFontSize(s)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: `2px solid ${fontSize === s ? '#c9924a' : '#dfd5bd'}`,
                      backgroundColor: fontSize === s ? '#c9924a' : 'transparent',
                      color: fontSize === s ? '#fff' : '#76705f',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme pills */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#3e3830', marginBottom: 10 }}>Theme</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['cream', 'sepia', 'midnight'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => onChangeTheme(t)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 10,
                      border: `2px solid ${theme === t ? '#c9924a' : '#dfd5bd'}`,
                      backgroundColor: t === 'cream' ? '#fff' : t === 'sepia' ? '#2a2218' : '#15182a',
                      color: t === 'cream' ? '#1f1b16' : '#e9dfc9',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: '1px solid rgba(0,0,0,0.1)',
                        backgroundColor: t === 'cream' ? '#faf4e8' : t === 'sepia' ? '#3d3020' : '#262c47',
                      }}
                    />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Font family */}
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#3e3830', marginBottom: 10 }}>Font</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onChangeFontFamily('serif')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 10,
                    border: `2px solid ${fontFamily === 'serif' ? '#c9924a' : '#dfd5bd'}`,
                    backgroundColor: fontFamily === 'serif' ? '#faf4e8' : 'transparent',
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: 15,
                    color: '#1f1b16',
                    cursor: 'pointer',
                  }}
                >
                  Newsreader
                </button>
                <button
                  onClick={() => onChangeFontFamily('sans')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 10,
                    border: `2px solid ${fontFamily === 'sans' ? '#c9924a' : '#dfd5bd'}`,
                    backgroundColor: fontFamily === 'sans' ? '#faf4e8' : 'transparent',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    color: '#1f1b16',
                    cursor: 'pointer',
                  }}
                >
                  Sans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
