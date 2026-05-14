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

const THEME_BG: Record<'cream' | 'sepia' | 'midnight', string> = {
  midnight: 'linear-gradient(180deg, #15182a 0%, #1c2138 100%)',
  sepia:    'linear-gradient(180deg, #1e1708 0%, #2a2010 100%)',
  cream:    'linear-gradient(180deg, #faf4e8 0%, #f3ead8 100%)',
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
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null)
  const [showTypeSheet, setShowTypeSheet] = useState(false)

  const pages = paginateStory(story.content)
  const totalPages = pages.length
  const currentPageText = pages[page] || ''

  function goToPage(next: number) {
    if (next < 0 || next > totalPages) return
    setSlideDir(next > page ? 'left' : 'right')
    setTimeout(() => {
      setPage(next < totalPages ? next : page)
      if (next >= totalPages) onDone()
      setSlideDir(null)
    }, 220)
  }

  const colors = THEME_COLORS[theme]
  const ff = fontFamily === 'serif' ? "'Newsreader', Georgia, serif" : "'DM Sans', sans-serif"

  function handleTap(e: React.MouseEvent) {
    const x = e.clientX
    const width = (e.currentTarget as HTMLElement).clientWidth
    if (x < width * 0.35) {
      if (page > 0) goToPage(page - 1)
    } else if (x > width * 0.65) {
      goToPage(page + 1)
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
        background: THEME_BG[theme],
        animation: 'st-fade-in 0.4s ease both',
      }}
      onClick={handleTap}
    >

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

      {/* Title zone — top half background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: '0 auto',
          height: '38%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '72px 32px 16px',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: theme === 'cream' ? '#76705f' : 'rgba(229,181,116,0.6)',
            marginBottom: 12,
          }}
        >
          {story.mode === 'parent' ? 'A story for tonight' : 'Your story'}
        </div>
        <div
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            color: theme === 'cream' ? '#1f1b16' : '#e9dfc9',
            textAlign: 'center',
            opacity: slideDir ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          {story.title}
        </div>
      </div>

      {/* Story card — bottom 65% */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: '0 auto',
          height: '65%',
          padding: '0 14px 20px',
          zIndex: 10,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            height: '100%',
            backgroundColor: colors.bg,
            borderRadius: '22px 22px 18px 18px',
            padding: '18px 20px 16px',
            boxShadow: '0 -8px 48px rgba(0,0,0,0.35)',
            display: 'flex',
            flexDirection: 'column',
            transform: slideDir === 'left' ? 'translateX(-22px)' : slideDir === 'right' ? 'translateX(22px)' : 'translateX(0)',
            opacity: slideDir ? 0 : 1,
            transition: slideDir ? 'transform 0.22s ease, opacity 0.22s ease' : 'none',
          }}
        >
          {/* Story text — scrollable fill */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              fontFamily: ff,
              fontSize,
              lineHeight: 1.65,
              color: colors.text,
              marginBottom: 12,
            }}
          >
            {currentPageText.split('\n\n').map((para, i) => {
              const isFirst = page === 0 && i === 0
              const firstLetter = isFirst ? para.charAt(0) : ''
              const rest = isFirst ? para.slice(1) : para
              const paras = currentPageText.split('\n\n')
              return (
                <p key={i} style={{ margin: 0, marginBottom: i < paras.length - 1 ? '0.9em' : 0, overflow: 'hidden' }}>
                  {isFirst && (
                    <span
                      style={{
                        float: 'left',
                        fontFamily: "'Newsreader', Georgia, serif",
                        fontSize: fontSize * 3.2,
                        lineHeight: 0.82,
                        paddingRight: 7,
                        paddingTop: 5,
                        color: theme === 'cream' ? '#a35d3a' : '#e5b574',
                        fontStyle: 'italic',
                        fontWeight: 400,
                      }}
                    >
                      {firstLetter}
                    </span>
                  )}
                  {rest}
                </p>
              )
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: `1px solid ${theme === 'cream' ? '#dfd5bd' : 'rgba(233,223,201,0.1)'}`,
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: theme === 'cream' ? '#b2aa97' : 'rgba(233,223,201,0.4)',
                letterSpacing: '0.06em',
                minWidth: 44,
              }}
            >
              {pageNum}/{totalNum}
            </div>

            {/* Dot progress */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {Array.from({ length: Math.min(totalPages, 9) }).map((_, i) => (
                <div
                  key={i}
                  onClick={e => { e.stopPropagation(); goToPage(i) }}
                  style={{
                    width: i === page ? 16 : 5,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: i <= page ? '#c9924a' : (theme === 'cream' ? '#dfd5bd' : 'rgba(233,223,201,0.2)'),
                    cursor: 'pointer',
                    transition: 'width 0.25s ease, background-color 0.15s ease',
                  }}
                />
              ))}
            </div>

            {/* Nav arrow */}
            <button
              onClick={e => { e.stopPropagation(); goToPage(page + 1) }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                minWidth: 44,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Icon name="chevron-right" size={18} color={theme === 'cream' ? '#b2aa97' : 'rgba(233,223,201,0.4)'} />
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
