export type Screen =
  | 'onb-welcome'
  | 'onb-profile'
  | 'onb-llm'
  | 'home'
  | 'parent-q1'
  | 'parent-q2'
  | 'parent-q3'
  | 'parent-q4'
  | 'teen-themes'
  | 'loading'
  | 'reading'
  | 'after-story'
  | 'settings'

export interface Profile {
  id: string
  name: string
  age: string
  friends: string[]
  characterSketch: string
}

export interface Setup {
  name: string
  age: string
  friends: string[]
  characterSketch: string
  provider: 'claude' | 'openai'
  apiKey: string
  useLocal: boolean
  ollamaUrl: string
  ollamaModel: string
  defaultFontSize: number
  defaultTheme: 'cream' | 'sepia' | 'midnight'
  defaultFontFamily: 'serif' | 'sans'
}

export interface Story {
  id: string
  title: string
  content: string
  destination: string
  generatedAt: number
  mode: 'parent' | 'teen'
  bookmarked?: boolean
}

export interface ParentInterview {
  moment: string
  whoWasThere: string[]
  whoNote: string
  emotions: string[]
  emotionNote: string
  destination: string
}

export interface AppState {
  screen: Screen
  setup: Setup | null
  history: Story[]
  interview: ParentInterview
  selectedTheme: string | null
  currentStory: Story | null
  readerFontSize: number
  readerTheme: 'cream' | 'sepia' | 'midnight'
  readerFontFamily: 'serif' | 'sans'
  generationError: string | null
  currentMode: 'parent' | 'teen' | null
  profiles: Profile[]
  activeProfileId: string | null
}

export type AppAction =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SET_SETUP'; setup: Setup }
  | { type: 'ADD_STORY'; story: Story }
  | { type: 'SET_CURRENT_STORY'; story: Story | null }
  | { type: 'SET_INTERVIEW'; interview: Partial<ParentInterview> }
  | { type: 'CLEAR_INTERVIEW' }
  | { type: 'SET_SELECTED_THEME'; theme: string | null }
  | { type: 'SET_READER_FONT_SIZE'; size: number }
  | { type: 'SET_READER_THEME'; theme: 'cream' | 'sepia' | 'midnight' }
  | { type: 'SET_READER_FONT_FAMILY'; family: 'serif' | 'sans' }
  | { type: 'SET_GENERATION_ERROR'; error: string | null }
  | { type: 'LOAD_HISTORY'; stories: Story[] }
  | { type: 'DELETE_STORY'; id: string }
  | { type: 'TOGGLE_BOOKMARK'; id: string }
  | { type: 'SET_MODE'; mode: 'parent' | 'teen' }
  | { type: 'SET_PROFILES'; profiles: Profile[]; activeProfileId: string | null }
  | { type: 'SET_ACTIVE_PROFILE'; id: string }
  | { type: 'ADD_PROFILE'; profile: Profile }
  | { type: 'UPDATE_ACTIVE_PROFILE'; profile: Partial<Profile> }
