import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Icon } from '../components/Icon'
import { paginateStory } from '../lib/utils'
import type { Story } from '../types'

interface ReadingProps {
  story: Story
  fontSize: number
  theme: 'cream' | 'sepia' | 'midnight'
  fontFamily: 'serif' | 'sans'
  bookmarked: boolean
  onBack: () => void
  onDone: () => void
  onChangeFontSize: (s: number) => void
  onChangeTheme: (t: 'cream' | 'sepia' | 'midnight') => void
  onChangeFontFamily: (f: 'serif' | 'sans') => void
  onToggleBookmark: () => void
}

const FONT_SIZES = [16, 18, 20, 22, 24]

const THEME_COLORS = {
  cream:    { bg: 'var(--bg)',     text: 'var(--ink)' },
  sepia:    { bg: '#2a2218',       text: 'var(--dark-ink)' },
  midnight: { bg: 'var(--dark-bg)', text: 'var(--dark-ink)' },
}

const THEME_BG: Record<'cream' | 'sepia' | 'midnight', string> = {
  midnight: 'linear-gradient(180deg, var(--dark-bg) 0%, var(--dark-bg2) 100%)',
  sepia:    'linear-gradient(180deg, #1e1708 0%, #2a2010 100%)',
  cream:    'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)',
}

export function Reading({
  story,
  fontSize,
  theme,
  fontFamily,
  bookmarked,
  onBack,
  onDone,
  onChangeFontSize,
  onChangeTheme,
  onChangeFontFamily,
  onToggleBookmark,
}: ReadingProps) {
  const [page, setPage] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null)
  const [showTypeSheet, setShowTypeSheet] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const pages = useMemo(() => paginateStory(story.content), [story.content])
  const totalPages = pages.length
  const currentPageText = pages[page] || ''

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  // When page changes, stop speech (cancel is a no-op when nothing is playing)
  useEffect(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }, [page])

  function speakPage(text: string) {
    window.speechSynthesis?.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.92
    utterance.pitch = 1.0
    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }
    utteranceRef.current = utterance
    window.speechSynthesis?.speak(utterance)
    setIsSpeaking(true)
    setIsPaused(false)
  }

  function toggleSpeech() {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis?.pause()
      setIsPaused(true)
    } else if (isPaused) {
      window.speechSynthesis?.resume()
      setIsPaused(false)
    } else {
      speakPage(currentPageText)
    }
  }

  function handleBack() {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    onBack()
  }

  function goToPage(next: number) {
    if (next < 0) return
    if (next >= totalPages) {
      onDone()
      return
    }
    setSlideDir(next > page ? 'left' : 'right')
    setTimeout(() => {
      setPage(next)
      setSlideDir(null)
    }, 220)
  }

  function handleBookmarkToggle(e: React.MouseEvent) {
    e.stopPropagation()
    onToggleBookmark()
    const msg = bookmarked ? 'Removed' : 'Saved'
    setBookmarkToast(msg)
    setTimeout(() => setBookmarkToast(null), 1500)
  }

  const colors = THEME_COLORS[theme]
  const ff = fontFamily === 'serif' ? "var(--serif)" : "var(--sans)"

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

  const wordCount = story.content.trim().split(/\s+/).length
  const readingMins = Math.max(1, Math.round(wordCount / 200))
  const readingLabel = readingMins === 1 ? '~1 min read' : `~${readingMins} min read`

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
          maxWidth: 720,
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
          onClick={e => { e.stopPropagation(); handleBack() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 14px 8px 10px',
            borderRadius: 20,
            backgroundColor: 'rgba(15,16,26,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(233,223,201,0.12)',
            color: 'var(--dark-ink)',
            fontFamily: "var(--sans)",
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Icon name="chevron-left" size={16} color="var(--dark-ink)" />
          Back
        </button>

        {/* Center pill — mode label + reading time */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            backgroundColor: 'rgba(15,16,26,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(233,223,201,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 12,
              fontStyle: 'italic',
              color: 'var(--accent)',
              lineHeight: 1.2,
            }}
          >
            {story.mode === 'parent' ? 'Tonight\'s Story' : 'Your Story'}
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: 'rgba(233,223,201,0.45)',
              letterSpacing: '0.06em',
              lineHeight: 1.2,
            }}
          >
            {readingLabel}
          </div>
        </div>

        {/* Right side: Speaker + Type buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Speaker/Pause button */}
          <button
            onClick={e => { e.stopPropagation(); toggleSpeech() }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 36,
              borderRadius: 20,
              backgroundColor: (isSpeaking || isPaused) ? 'rgba(201,146,74,0.3)' : 'rgba(15,16,26,0.7)',
              backdropFilter: 'blur(10px)',
              border: (isSpeaking || isPaused) ? '1px solid rgba(201,146,74,0.5)' : '1px solid rgba(233,223,201,0.12)',
              color: 'var(--dark-ink)',
              cursor: 'pointer',
            }}
          >
            <Icon name={isSpeaking && !isPaused ? 'pause' : 'speaker'} size={16} color="var(--dark-ink)" />
          </button>

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
              color: 'var(--dark-ink)',
              cursor: 'pointer',
            }}
          >
            <Icon name="type" size={16} color="var(--dark-ink)" />
          </button>
        </div>
      </div>

      {/* Title zone — top 38% */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          maxWidth: 720,
          margin: '0 auto',
          height: '38%',
          overflow: 'hidden',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        {/* Illustration background */}
        {story.illustration && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${story.illustration})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />
        )}

        {/* Gradient overlay — always present, heavier when illustration shows */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: story.illustration
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)'
              : THEME_BG[theme],
          }}
        />

        {/* Title text */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '72px 32px 16px',
          }}
        >
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: story.illustration
                ? 'rgba(255,255,255,0.7)'
                : theme === 'cream' ? 'var(--ink50)' : 'rgba(229,181,116,0.6)',
              marginBottom: 12,
            }}
          >
            {story.mode === 'parent' ? 'A story for tonight' : 'Your story'}
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: '-0.015em',
              color: story.illustration ? '#ffffff' : theme === 'cream' ? 'var(--ink)' : 'var(--dark-ink)',
              textAlign: 'center',
              textShadow: story.illustration ? '0 2px 12px rgba(0,0,0,0.5)' : 'none',
              opacity: slideDir ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {story.title}
          </div>
        </div>
      </div>

      {/* Story card — bottom 65% */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 720,
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
                        fontFamily: "var(--serif)",
                        fontSize: fontSize * 3.2,
                        lineHeight: 0.82,
                        paddingRight: 7,
                        paddingTop: 5,
                        color: theme === 'cream' ? 'var(--accent2)' : 'var(--accent-s)',
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
              borderTop: `1px solid ${theme === 'cream' ? 'var(--ink15)' : 'rgba(233,223,201,0.1)'}`,
            }}
          >
            {/* Bookmark button (left side) */}
            <button
              onClick={handleBookmarkToggle}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                minWidth: 44,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon
                name="bookmark"
                size={18}
                color={bookmarked ? 'var(--accent)' : (theme === 'cream' ? 'var(--ink30)' : 'rgba(233,223,201,0.4)')}
                strokeWidth={bookmarked ? 0 : 1.6}
                style={bookmarked ? { fill: 'var(--accent)' } : undefined}
              />
            </button>

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
                    backgroundColor: i <= page ? 'var(--accent)' : (theme === 'cream' ? 'var(--ink15)' : 'rgba(233,223,201,0.2)'),
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
              <Icon name="chevron-right" size={18} color={theme === 'cream' ? 'var(--ink30)' : 'rgba(233,223,201,0.4)'} />
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
              maxWidth: 720,
              margin: '0 auto',
              backgroundColor: 'var(--bg)',
              borderRadius: '22px 22px 0 0',
              padding: '20px 24px 40px',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
              animation: 'st-fade-in 0.2s ease both',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink50)',
                marginBottom: 16,
              }}
            >
              Reading Options
            </div>

            {/* Font size dots */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink70)', marginBottom: 10 }}>Font size</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {FONT_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => onChangeFontSize(s)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: `2px solid ${fontSize === s ? 'var(--accent)' : 'var(--ink15)'}`,
                      backgroundColor: fontSize === s ? 'var(--accent)' : 'transparent',
                      color: fontSize === s ? 'var(--bg)' : 'var(--ink50)',
                      fontFamily: "var(--sans)",
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
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink70)', marginBottom: 10 }}>Theme</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['cream', 'sepia', 'midnight'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => onChangeTheme(t)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 10,
                      border: `2px solid ${theme === t ? 'var(--accent)' : 'var(--ink15)'}`,
                      backgroundColor: t === 'cream' ? 'var(--bg)' : t === 'sepia' ? '#2a2218' : 'var(--dark-bg)',
                      color: t === 'cream' ? 'var(--ink)' : 'var(--dark-ink)',
                      fontFamily: "var(--sans)",
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
                        backgroundColor: t === 'cream' ? 'var(--bg2)' : t === 'sepia' ? '#3d3020' : 'var(--dark-bg2)',
                      }}
                    />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Font family */}
            <div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink70)', marginBottom: 10 }}>Font</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onChangeFontFamily('serif')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 10,
                    border: `2px solid ${fontFamily === 'serif' ? 'var(--accent)' : 'var(--ink15)'}`,
                    backgroundColor: fontFamily === 'serif' ? 'var(--bg)' : 'transparent',
                    fontFamily: "var(--serif)",
                    fontSize: 15,
                    color: 'var(--ink)',
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
                    border: `2px solid ${fontFamily === 'sans' ? 'var(--accent)' : 'var(--ink15)'}`,
                    backgroundColor: fontFamily === 'sans' ? 'var(--bg)' : 'transparent',
                    fontFamily: "var(--sans)",
                    fontSize: 15,
                    color: 'var(--ink)',
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

      {/* Bookmark toast */}
      {bookmarkToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 48,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--ink)',
            color: 'var(--bg)',
            fontFamily: "var(--sans)",
            fontSize: 13,
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: 20,
            zIndex: 100,
            animation: 'st-fade-in 0.2s ease both',
            whiteSpace: 'nowrap',
          }}
        >
          {bookmarkToast}
        </div>
      )}
    </div>
  )
}
