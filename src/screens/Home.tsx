import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { getGreeting, formatStoryAge, generateId } from '../lib/utils'
import type { Setup, Story, Profile } from '../types'

interface HomeProps {
  setup: Setup
  history: Story[]
  profiles: Profile[]
  activeProfileId: string | null
  onParentEntry: () => void
  onTeenEntry: () => void
  onSettings: () => void
  onOpenStory: (story: Story) => void
  onDeleteStory: (id: string) => void
  onSetActiveProfile: (id: string) => void
  onAddProfile: (profile: Profile) => void
}

interface StoryRowProps {
  story: Story
  isConfirming: boolean
  onOpen: (id: string) => void
  onRequestDelete: (id: string) => void
  onConfirmDelete: (id: string) => void
  onCancelDelete: () => void
}

const StoryRow = React.memo(function StoryRow({ story, isConfirming, onOpen, onRequestDelete, onConfirmDelete, onCancelDelete }: StoryRowProps) {
  const touchStartX = useRef(0)

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (dx > 60) onRequestDelete(story.id)
    if (dx < -40) onCancelDelete()
  }

  if (isConfirming) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 14,
          backgroundColor: 'color-mix(in srgb, var(--accent2) 8%, var(--bg))',
          border: '1px solid color-mix(in srgb, var(--accent2) 20%, transparent)',
          animation: 'st-fade-in 0.15s ease both',
        }}
      >
        <div style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 13, color: 'var(--accent2)' }}>
          Delete "{story.title}"?
        </div>
        <button
          onClick={onCancelDelete}
          style={{ height: 34, padding: '0 14px', borderRadius: 10, border: '1px solid var(--ink15)', backgroundColor: 'var(--bg)', fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink50)', cursor: 'pointer' }}
        >
          Keep
        </button>
        <button
          onClick={() => onConfirmDelete(story.id)}
          style={{ height: 34, padding: '0 14px', borderRadius: 10, border: 'none', backgroundColor: 'var(--accent2)', fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: 'var(--bg)', cursor: 'pointer' }}
        >
          Delete
        </button>
      </div>
    )
  }

  return (
    <div
      style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={() => onOpen(story.id)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, backgroundColor: 'var(--bg2)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 38,
              height: 48,
              borderRadius: 4,
              background: story.illustration
                ? `url(${story.illustration}) center/cover`
                : 'var(--cta)',
              overflow: 'hidden',
            }}
          />
          {story.bookmarked && (
            <div style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--accent)', border: '1.5px solid var(--bg)' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: 'var(--ink)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {story.title}
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: 'var(--ink50)' }}>
            {formatStoryAge(story.generatedAt)} · {story.mode} · {story.destination || 'story'}
          </div>
        </div>
        <Icon name="chevron-right" size={16} color="var(--ink30)" />
      </button>

      <button
        onClick={e => { e.stopPropagation(); onRequestDelete(story.id) }}
        title="Delete story"
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: 8, border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
      >
        <Icon name="trash" size={15} color="var(--accent2)" />
      </button>
    </div>
  )
})

export function Home({ setup, history, profiles, activeProfileId, onParentEntry, onTeenEntry, onSettings, onOpenStory, onDeleteStory, onSetActiveProfile, onAddProfile }: HomeProps) {
  const [greeting, setGreeting] = useState(getGreeting())
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [addingProfile, setAddingProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [showAllStories, setShowAllStories] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 30000)
    return () => clearInterval(interval)
  }, [])

  const visibleStories = showAllStories ? history : history.slice(0, 3)
  const activeProfile = profiles.find(p => p.id === activeProfileId)

  const handleStoryOpen = useCallback((id: string) => {
    const story = history.find(s => s.id === id)
    if (story) onOpenStory(story)
  }, [history, onOpenStory])

  const handleRequestDelete = useCallback((id: string) => setDeletingId(id), [])
  const handleConfirmDelete = useCallback((id: string) => {
    onDeleteStory(id)
    setDeletingId(null)
  }, [onDeleteStory])
  const handleCancelDelete = useCallback(() => setDeletingId(null), [])
  const displayName = activeProfile?.name || setup.name

  function handleAddProfile() {
    const name = newProfileName.trim()
    if (!name) { setAddingProfile(false); return }
    const profile: Profile = { id: generateId(), name, age: '', friends: [], characterSketch: '' }
    onAddProfile(profile)
    setNewProfileName('')
    setAddingProfile(false)
    setShowProfileDropdown(false)
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', animation: 'st-fade-in 0.3s ease both' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 8px' }}>
        <div style={{ width: 34, height: 34, borderRadius: 11, background: 'var(--cta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="moon" size={18} color="white" strokeWidth={1.5} />
        </div>
        <button onClick={onSettings} style={{ padding: 4, color: 'var(--ink70)' }}>
          <Icon name="settings" size={22} color="var(--ink70)" strokeWidth={1.5} />
        </button>
      </div>

      {/* Profile switcher */}
      {profiles.length > 0 && (
        <div style={{ padding: '4px 20px 0', position: 'relative', zIndex: 51 }}>
          <button
            onClick={() => setShowProfileDropdown(v => !v)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px 4px 8px', borderRadius: 20, border: '1px solid var(--ink15)', backgroundColor: 'var(--bg2)', fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink50)', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 500, color: 'var(--ink70)' }}>{displayName}</span>
            <Icon name="chevron-down" size={14} color="var(--ink50)" />
          </button>

          {showProfileDropdown && (
            <>
              <div onClick={() => { setShowProfileDropdown(false); setAddingProfile(false) }} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, backgroundColor: 'var(--bg)', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', border: '1px solid var(--ink15)', overflow: 'hidden', zIndex: 50, minWidth: 180 }}>
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onSetActiveProfile(p.id); setShowProfileDropdown(false) }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: 'none', borderBottom: '1px solid var(--ink15)', backgroundColor: p.id === activeProfileId ? 'var(--bg)' : 'transparent', fontFamily: "var(--sans)", fontSize: 14, color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' }}
                  >
                    {p.name}
                    {p.id === activeProfileId && <Icon name="check" size={14} color="var(--accent)" strokeWidth={2} />}
                  </button>
                ))}
                {addingProfile ? (
                  <div style={{ padding: '10px 16px' }}>
                    <input
                      autoFocus
                      type="text"
                      value={newProfileName}
                      onChange={e => setNewProfileName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddProfile() }}
                      onBlur={handleAddProfile}
                      placeholder="Name…"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--accent)', backgroundColor: 'var(--bg)', fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink)', boxSizing: 'border-box' }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingProfile(true)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', border: 'none', backgroundColor: 'transparent', fontFamily: "var(--sans)", fontSize: 13, color: 'var(--accent2)', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <Icon name="plus" size={14} color="var(--accent2)" strokeWidth={2} />
                    Add profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Greeting */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: 'var(--ink50)', marginBottom: 4 }}>{greeting.label}</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 24 }}>{greeting.time}</div>
      </div>

      {/* Cards */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button
          onClick={onParentEntry}
          style={{ width: '100%', minHeight: 170, borderRadius: 22, background: 'linear-gradient(155deg, var(--dark-bg2), var(--dark-bg))', border: 'none', cursor: 'pointer', padding: '22px 22px 20px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', right: -30, bottom: -40, opacity: 0.18 }}>
            <Icon name="moon" size={180} color="var(--accent-s)" strokeWidth={0.8} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-s)', marginBottom: 10 }}>By Situation</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, color: 'var(--dark-ink)', lineHeight: 1.2, marginBottom: 6 }}>Tonight's story</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 14, color: 'var(--dark-ink70)', lineHeight: 1.5, marginBottom: 18 }}>
              Tell me about {displayName}'s day — I'll shape it into a story by bedtime.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: 'var(--bg)' }}>
              Start
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </div>
          </div>
        </button>

        <button
          onClick={onTeenEntry}
          style={{ width: '100%', minHeight: 128, borderRadius: 22, backgroundColor: 'var(--bg3)', border: 'none', cursor: 'pointer', padding: '20px 22px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', right: -20, bottom: -30, opacity: 0.4 }}>
            <Icon name="sparkle" size={140} color="var(--accent2)" strokeWidth={0.8} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: 8 }}>By Theme</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 4 }}>Make my story</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 14, color: 'var(--ink50)', lineHeight: 1.5 }}>Pick a feeling and I'll write something just for tonight.</div>
          </div>
        </button>

        {history.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 2 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink50)' }}>
                {showAllStories ? `All Stories (${history.length})` : 'Recent Stories'}
              </div>
              {history.length > 3 && (
                <button
                  onClick={() => setShowAllStories(v => !v)}
                  style={{ background: 'none', border: 'none', fontFamily: "var(--sans)", fontSize: 12, color: 'var(--accent2)', cursor: 'pointer', padding: '2px 0' }}
                >
                  {showAllStories ? 'Show less' : `See all ${history.length}`}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {visibleStories.map(story => (
                <StoryRow
                  key={story.id}
                  story={story}
                  isConfirming={deletingId === story.id}
                  onOpen={handleStoryOpen}
                  onRequestDelete={handleRequestDelete}
                  onConfirmDelete={handleConfirmDelete}
                  onCancelDelete={handleCancelDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 32 }} />
    </div>
  )
}
