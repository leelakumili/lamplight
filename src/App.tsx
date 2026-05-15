import React, { useReducer, useEffect, useState, useMemo, useRef } from 'react'
import type { AppState, AppAction, Screen, ParentInterview, Setup, Story } from './types'
import { saveSetup, loadSetup, saveStory, loadStories, deleteStory, saveProfiles, loadProfiles, saveActiveProfileId, loadActiveProfileId } from './lib/db'
import { getStoredTheme, applyTheme, type AppTheme } from './lib/theme'
import { generateStory } from './lib/generateStory'
import { generateIllustration } from './lib/illustration'
import { generateId } from './lib/utils'
import { ILLUSTRATION_TIMEOUT_MS } from './lib/constants'
import type { Profile } from './types'

// Screens
import { OnbWelcome } from './screens/OnbWelcome'
import { OnbProfile } from './screens/OnbProfile'
import { OnbLLM } from './screens/OnbLLM'
import { Home } from './screens/Home'
import { ParentQ1 } from './screens/ParentQ1'
import { ParentQ2 } from './screens/ParentQ2'
import { ParentQ3 } from './screens/ParentQ3'
import { ParentQ4 } from './screens/ParentQ4'
import { TeenThemes } from './screens/TeenThemes'
import { Loading } from './screens/Loading'
import { Reading } from './screens/Reading'
import { AfterStory } from './screens/AfterStory'
import { Settings } from './screens/Settings'

const DEFAULT_INTERVIEW: ParentInterview = {
  moment: '',
  whoWasThere: [],
  whoNote: '',
  emotions: [],
  emotionNote: '',
  destination: '',
}

const initialState: AppState = {
  screen: 'onb-welcome',
  setup: null,
  history: [],
  interview: DEFAULT_INTERVIEW,
  selectedTheme: null,
  currentStory: null,
  readerFontSize: 18,
  readerTheme: 'midnight',
  readerFontFamily: 'serif',
  profiles: [],
  activeProfileId: null,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }
    case 'SET_SETUP':
      return { ...state, setup: action.setup }
    case 'ADD_STORY':
      return { ...state, history: [action.story, ...state.history] }
    case 'SET_CURRENT_STORY':
      return { ...state, currentStory: action.story }
    case 'SET_INTERVIEW':
      return { ...state, interview: { ...state.interview, ...action.interview } }
    case 'CLEAR_INTERVIEW':
      return { ...state, interview: DEFAULT_INTERVIEW }
    case 'SET_SELECTED_THEME':
      return { ...state, selectedTheme: action.theme }
    case 'SET_READER_FONT_SIZE':
      return { ...state, readerFontSize: action.size }
    case 'SET_READER_THEME':
      return { ...state, readerTheme: action.theme }
    case 'SET_READER_FONT_FAMILY':
      return { ...state, readerFontFamily: action.family }
    case 'LOAD_HISTORY':
      return { ...state, history: action.stories }
    case 'DELETE_STORY':
      return { ...state, history: state.history.filter(s => s.id !== action.id) }
    case 'TOGGLE_BOOKMARK': {
      const updated = state.history.map(s =>
        s.id === action.id ? { ...s, bookmarked: !s.bookmarked } : s
      )
      const updatedStory = updated.find(s => s.id === action.id) ?? null
      return {
        ...state,
        history: updated,
        currentStory: state.currentStory?.id === action.id ? updatedStory : state.currentStory,
      }
    }
    case 'SET_PROFILES':
      return { ...state, profiles: action.profiles, activeProfileId: action.activeProfileId }
    case 'SET_ACTIVE_PROFILE':
      return { ...state, activeProfileId: action.id }
    case 'ADD_PROFILE':
      return { ...state, profiles: [...state.profiles, action.profile] }
    case 'UPDATE_ACTIVE_PROFILE': {
      const profiles = state.profiles.map(p =>
        p.id === state.activeProfileId ? { ...p, ...action.profile } : p
      )
      return { ...state, profiles }
    }
    case 'UPDATE_STORY_ILLUSTRATION': {
      const history = state.history.map(s =>
        s.id === action.id ? { ...s, illustration: action.illustration } : s
      )
      const currentStory = state.currentStory?.id === action.id
        ? { ...state.currentStory, illustration: action.illustration }
        : state.currentStory
      return { ...state, history, currentStory }
    }
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loaded, setLoaded] = useState(false)
  const [dbError, setDbError] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [appTheme, setAppTheme] = useState<AppTheme>(getStoredTheme)
  // Tracks live story IDs so background illustration tasks can bail if a story was deleted.
  const historyIdsRef = useRef<Set<string>>(new Set())

  // Keep historyIdsRef in sync so background tasks can check if a story still exists.
  useEffect(() => {
    historyIdsRef.current = new Set(state.history.map(s => s.id))
  }, [state.history])

  // Apply theme to <html data-theme="..."> on mount and on change
  useEffect(() => {
    applyTheme(appTheme)
  }, [appTheme])

  // Load persisted data
  useEffect(() => {
    async function init() {
      try {
        const [setup, stories, profiles, activeProfileId] = await Promise.all([
          loadSetup(), loadStories(), loadProfiles(), loadActiveProfileId(),
        ])
        if (setup) {
          dispatch({ type: 'SET_SETUP', setup })
          dispatch({ type: 'SET_READER_FONT_SIZE', size: setup.defaultFontSize || 16 })
          dispatch({ type: 'SET_READER_THEME', theme: setup.defaultTheme || 'midnight' })
          dispatch({ type: 'SET_READER_FONT_FAMILY', family: setup.defaultFontFamily || 'serif' })
          dispatch({ type: 'SET_SCREEN', screen: 'home' })
        }
        if (stories.length > 0) dispatch({ type: 'LOAD_HISTORY', stories })
        if (profiles.length > 0) dispatch({ type: 'SET_PROFILES', profiles, activeProfileId })
      } catch (err) {
        if (import.meta.env.DEV) console.error('DB init failed:', err)
        setDbError(true)
      }
      setLoaded(true)
    }
    init()
  }, [])

  function showToast(msg: string, duration = 3000) {
    setToast(msg)
    setTimeout(() => setToast(null), duration)
  }

  function nav(screen: Screen) {
    dispatch({ type: 'SET_SCREEN', screen })
  }

  async function finishSetup(partialSetup: Partial<Setup>) {
    const merged: Setup = {
      name: '',
      age: '',
      friends: [],
      characterSketch: '',
      provider: 'claude',
      useLocal: false,
      ollamaModel: 'mistral',
      defaultFontSize: 18,
      defaultTheme: 'midnight',
      defaultFontFamily: 'serif',
      storyStyle: 'modern',
      ...state.setup,
      ...partialSetup,
    }
    dispatch({ type: 'SET_SETUP', setup: merged })
    await saveSetup(merged)
    nav('home')
  }

  const effectiveSetup = useMemo((): Setup | null => {
    if (!state.setup) return null
    const profile = state.profiles.find(p => p.id === state.activeProfileId)
    if (!profile) return state.setup
    return {
      ...state.setup,
      name: profile.name || state.setup.name,
      age: profile.age || state.setup.age,
      friends: profile.friends.length > 0 ? profile.friends : state.setup.friends,
      characterSketch: profile.characterSketch || state.setup.characterSketch,
    }
  }, [state.setup, state.profiles, state.activeProfileId])

  const generationControllerRef = useRef<AbortController | null>(null)

  async function startGeneration(mode: 'parent' | 'teen') {
    if (!effectiveSetup) return
    nav('loading')

    const controller = new AbortController()
    generationControllerRef.current = controller

    try {
      const result = await generateStory({
        setup: effectiveSetup,
        mode,
        interview: mode === 'parent' ? state.interview : undefined,
        theme: mode === 'teen' ? state.selectedTheme || undefined : undefined,
        signal: controller.signal,
        onInputSanitized: () => showToast('Some input was removed for safety.', 4000),
      })

      const story: Story = {
        id: generateId(),
        title: result.title,
        content: result.content,
        destination: mode === 'parent' ? state.interview.destination : state.selectedTheme || '',
        generatedAt: Date.now(),
        mode,
      }

      await saveStory(story)
      dispatch({ type: 'ADD_STORY', story })
      dispatch({ type: 'SET_CURRENT_STORY', story })

      if (mode === 'parent') dispatch({ type: 'CLEAR_INTERVIEW' })
      nav('reading')

      // Generate illustration in the background — user can read immediately.
      // Aborts after 30s; skips update if the story was deleted before it finishes.
      if (!effectiveSetup.useLocal) {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), ILLUSTRATION_TIMEOUT_MS)
        const storyId = story.id
        generateIllustration(story, effectiveSetup, controller.signal)
          .then(illustration => {
            clearTimeout(timeout)
            if (!illustration) return
            if (!historyIdsRef.current.has(storyId)) return // story deleted mid-flight
            dispatch({ type: 'UPDATE_STORY_ILLUSTRATION', id: storyId, illustration })
            saveStory({ ...story, illustration })
          })
          .catch(err => {
            clearTimeout(timeout)
            if (import.meta.env.DEV) console.warn('Illustration generation failed:', err)
          })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      showToast(`Error: ${msg}`)
      nav('home')
    }
  }

  async function handleSaveSetupChange(updatedSetup: Setup) {
    dispatch({ type: 'SET_SETUP', setup: updatedSetup })
    await saveSetup(updatedSetup)
  }

  if (!loaded) {
    return (
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
    )
  }

  if (dbError) {
    return (
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--ink)', marginBottom: 12 }}>
          Couldn't load your data
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink50)', marginBottom: 32, lineHeight: 1.5 }}>
          Storage is unavailable — this can happen in private browsing mode. Your stories are safe if you've used the app before.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500, padding: '12px 28px', borderRadius: 14, background: 'var(--cta)', color: 'var(--cta-fg, var(--bg))', border: 'none', cursor: 'pointer' }}
        >
          Try again
        </button>
      </div>
    )
  }

  async function toggleBookmark(id: string) {
    dispatch({ type: 'TOGGLE_BOOKMARK', id })
    // Persist updated story
    const story = state.history.find(s => s.id === id)
    if (story) {
      await saveStory({ ...story, bookmarked: !story.bookmarked })
    }
  }

  async function handleSaveProfiles(profiles: Profile[], activeProfileId: string | null) {
    dispatch({ type: 'SET_PROFILES', profiles, activeProfileId })
    await saveProfiles(profiles)
    await saveActiveProfileId(activeProfileId)
  }

  const { screen, setup, history, interview, selectedTheme, currentStory, readerFontSize, readerTheme, readerFontFamily, profiles, activeProfileId } = state

  function renderScreen() {
    switch (screen) {
      case 'onb-welcome':
        return <OnbWelcome onBegin={() => nav('onb-profile')} />

      case 'onb-profile':
        return (
          <OnbProfile
            onBack={() => nav('onb-welcome')}
            onContinue={data => {
              dispatch({ type: 'SET_SETUP', setup: { ...(setup || {} as Setup), ...data } as Setup })
              nav('onb-llm')
            }}
            initial={setup || undefined}
          />
        )

      case 'onb-llm':
        return (
          <OnbLLM
            onBack={() => nav('onb-profile')}
            onFinish={finishSetup}
          />
        )

      case 'home':
        return setup ? (
          <Home
            setup={setup}
            history={history}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onParentEntry={() => nav('parent-q1')}
            onTeenEntry={() => nav('teen-themes')}
            onSettings={() => nav('settings')}
            onOpenStory={story => {
              dispatch({ type: 'SET_CURRENT_STORY', story })
              nav('reading')
            }}
            onDeleteStory={async id => {
              dispatch({ type: 'DELETE_STORY', id })
              await deleteStory(id)
            }}
            onSetActiveProfile={async id => {
              dispatch({ type: 'SET_ACTIVE_PROFILE', id })
              await saveActiveProfileId(id)
            }}
            onAddProfile={async profile => {
              const newProfiles = [...profiles, profile]
              dispatch({ type: 'ADD_PROFILE', profile })
              dispatch({ type: 'SET_ACTIVE_PROFILE', id: profile.id })
              await saveProfiles(newProfiles)
              await saveActiveProfileId(profile.id)
            }}
          />
        ) : null

      case 'parent-q1':
        return effectiveSetup ? (
          <ParentQ1
            name={effectiveSetup.name}
            moment={interview.moment}
            onBack={() => nav('home')}
            onContinue={moment => {
              dispatch({ type: 'SET_INTERVIEW', interview: { moment } })
              nav('parent-q2')
            }}
            onSkip={() => nav('parent-q2')}
          />
        ) : null

      case 'parent-q2':
        return effectiveSetup ? (
          <ParentQ2
            friends={effectiveSetup.friends}
            whoWasThere={interview.whoWasThere}
            whoNote={interview.whoNote}
            onBack={() => nav('parent-q1')}
            onContinue={(whoWasThere, whoNote) => {
              dispatch({ type: 'SET_INTERVIEW', interview: { whoWasThere, whoNote } })
              nav('parent-q3')
            }}
            onSkip={() => nav('parent-q3')}
          />
        ) : null

      case 'parent-q3':
        return effectiveSetup ? (
          <ParentQ3
            name={effectiveSetup.name}
            emotions={interview.emotions}
            emotionNote={interview.emotionNote}
            onBack={() => nav('parent-q2')}
            onContinue={(emotions, emotionNote) => {
              dispatch({ type: 'SET_INTERVIEW', interview: { emotions, emotionNote } })
              nav('parent-q4')
            }}
            onSkip={() => nav('parent-q4')}
          />
        ) : null

      case 'parent-q4':
        return (
          <ParentQ4
            destination={interview.destination}
            onBack={() => nav('parent-q3')}
            onSubmit={destination => {
              dispatch({ type: 'SET_INTERVIEW', interview: { destination } })
              startGeneration('parent')
            }}
            onSkip={() => startGeneration('parent')}
          />
        )

      case 'teen-themes':
        return effectiveSetup ? (
          <TeenThemes
            name={effectiveSetup.name}
            onBack={() => nav('home')}
            onSelect={theme => {
              dispatch({ type: 'SET_SELECTED_THEME', theme })
              startGeneration('teen')
            }}
          />
        ) : null

      case 'loading':
        return (
          <Loading
            useLocal={effectiveSetup?.useLocal ?? false}
            onTimeout={() => {
              generationControllerRef.current?.abort()
              generationControllerRef.current = null
              showToast('Generation timed out. Please try again.')
              nav('home')
            }}
          />
        )

      case 'reading':
        return currentStory ? (
          <Reading
            story={currentStory}
            fontSize={readerFontSize}
            theme={readerTheme}
            fontFamily={readerFontFamily}
            bookmarked={!!currentStory.bookmarked}
            onBack={() => nav('home')}
            onDone={() => nav('after-story')}
            onChangeFontSize={size => dispatch({ type: 'SET_READER_FONT_SIZE', size })}
            onChangeTheme={theme => dispatch({ type: 'SET_READER_THEME', theme })}
            onChangeFontFamily={family => dispatch({ type: 'SET_READER_FONT_FAMILY', family })}
            onToggleBookmark={() => currentStory && toggleBookmark(currentStory.id)}
            onToast={showToast}
          />
        ) : null

      case 'after-story':
        return currentStory ? (
          <AfterStory
            story={{ title: currentStory.title, content: currentStory.content }}
            onBack={() => nav('reading')}
            onSave={() => {
              showToast('Story saved.')
              nav('home')
            }}
            onRegenerate={() => {
              dispatch({ type: 'SET_CURRENT_STORY', story: null })
              startGeneration(currentStory.mode)
            }}
            onDone={() => {
              dispatch({ type: 'SET_CURRENT_STORY', story: null })
              nav('home')
            }}
          />
        ) : null

      case 'settings':
        return setup ? (
          <Settings
            setup={setup}
            profiles={profiles}
            activeProfileId={activeProfileId}
            appTheme={appTheme}
            onBack={() => nav('home')}
            onSave={handleSaveSetupChange}
            onSaveProfiles={handleSaveProfiles}
            onChangeTheme={setAppTheme}
          />
        ) : null

      default:
        return null
    }
  }

  const isDark = screen === 'loading' || screen === 'after-story' || screen === 'reading'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100dvh',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          minHeight: '100dvh',
          position: 'relative',
          backgroundColor: isDark ? 'var(--dark-bg)' : 'var(--bg)',
        }}
      >
        {renderScreen()}

        {/* Toast */}
        {toast && (
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
              maxWidth: '90vw',
              textAlign: 'center',
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
