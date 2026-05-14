import React, { useReducer, useEffect, useState } from 'react'
import type { AppState, AppAction, Screen, ParentInterview, Setup, Story } from './types'
import { saveSetup, loadSetup, saveStory, loadStories } from './lib/db'
import { generateStory } from './lib/generateStory'
import { generateId } from './lib/utils'

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
  readerFontSize: 16,
  readerTheme: 'midnight',
  readerFontFamily: 'serif',
  generationError: null,
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
    case 'SET_GENERATION_ERROR':
      return { ...state, generationError: action.error }
    case 'LOAD_HISTORY':
      return { ...state, history: action.stories }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loaded, setLoaded] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Load persisted data
  useEffect(() => {
    async function init() {
      const [setup, stories] = await Promise.all([loadSetup(), loadStories()])
      if (setup) {
        dispatch({ type: 'SET_SETUP', setup })
        dispatch({ type: 'SET_READER_FONT_SIZE', size: setup.defaultFontSize || 16 })
        dispatch({ type: 'SET_READER_THEME', theme: setup.defaultTheme || 'midnight' })
        dispatch({ type: 'SET_READER_FONT_FAMILY', family: setup.defaultFontFamily || 'serif' })
        dispatch({ type: 'SET_SCREEN', screen: 'home' })
      }
      if (stories.length > 0) {
        dispatch({ type: 'LOAD_HISTORY', stories })
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
      apiKey: '',
      useLocal: false,
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'mistral',
      defaultFontSize: 16,
      defaultTheme: 'midnight',
      defaultFontFamily: 'serif',
      ...state.setup,
      ...partialSetup,
    }
    dispatch({ type: 'SET_SETUP', setup: merged })
    await saveSetup(merged)
    nav('home')
  }

  async function startGeneration(mode: 'parent' | 'teen') {
    if (!state.setup) return
    nav('loading')

    try {
      const result = await generateStory({
        setup: state.setup,
        mode,
        interview: mode === 'parent' ? state.interview : undefined,
        theme: mode === 'teen' ? state.selectedTheme || undefined : undefined,
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

      if (mode === 'parent') {
        dispatch({ type: 'CLEAR_INTERVIEW' })
      }

      nav('reading')
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
      <div
        style={{
          minHeight: '100dvh',
          backgroundColor: '#faf4e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    )
  }

  const { screen, setup, history, interview, selectedTheme, currentStory, readerFontSize, readerTheme, readerFontFamily } = state

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
            onParentEntry={() => nav('parent-q1')}
            onTeenEntry={() => nav('teen-themes')}
            onSettings={() => nav('settings')}
            onOpenStory={story => {
              dispatch({ type: 'SET_CURRENT_STORY', story })
              nav('reading')
            }}
          />
        ) : null

      case 'parent-q1':
        return setup ? (
          <ParentQ1
            name={setup.name}
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
        return setup ? (
          <ParentQ2
            friends={setup.friends}
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
        return setup ? (
          <ParentQ3
            name={setup.name}
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
        return setup ? (
          <TeenThemes
            name={setup.name}
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
            onTimeout={() => {
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
            onBack={() => nav('home')}
            onDone={() => nav('after-story')}
            onChangeFontSize={size => dispatch({ type: 'SET_READER_FONT_SIZE', size })}
            onChangeTheme={theme => dispatch({ type: 'SET_READER_THEME', theme })}
            onChangeFontFamily={family => dispatch({ type: 'SET_READER_FONT_FAMILY', family })}
          />
        ) : null

      case 'after-story':
        return currentStory ? (
          <AfterStory
            mode={currentStory.mode}
            onBack={() => nav('reading')}
            onSave={() => {
              showToast('Story saved.')
              nav('home')
            }}
            onWriteAnother={() => {
              dispatch({ type: 'SET_CURRENT_STORY', story: null })
              if (currentStory.mode === 'teen') {
                nav('teen-themes')
              } else {
                nav('parent-q1')
              }
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
            onBack={() => nav('home')}
            onSave={handleSaveSetupChange}
          />
        ) : null

      default:
        return null
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100dvh',
        backgroundColor: '#faf4e8',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100dvh',
          position: 'relative',
          backgroundColor: screen === 'loading' || screen === 'after-story' || screen === 'reading' ? '#15182a' : '#faf4e8',
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
