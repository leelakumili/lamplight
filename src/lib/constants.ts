// Central constants — one place to update model IDs, sizes, and shared values.

export const MODELS = {
  claudeSonnet: 'claude-sonnet-4-20250514',
  claudeHaiku:  'claude-haiku-4-5-20251001',
  openaiChat:   'gpt-4o',
  openaiImage:  'dall-e-3',
  ollamaDefault: 'gemma3:12b',
} as const

export const ANTHROPIC_VERSION = '2023-06-01'

export const FONT_SIZES = [16, 18, 20, 22, 24] as const
export type FontSize = typeof FONT_SIZES[number]

export const READER_THEMES = ['cream', 'sepia', 'midnight'] as const
export type ReaderTheme = typeof READER_THEMES[number]

export const OLLAMA_DEFAULT_URL = 'http://localhost:11434'

// Timing constants
export const ILLUSTRATION_TIMEOUT_MS  = 30_000
export const GENERATION_LONG_WAIT_MS  = 30_000   // show "still going" message after this
export const GENERATION_TIMEOUT_MS    = 300_000  // 5 min — local models on slow hardware
export const BOOKMARK_TOAST_MS        = 1_500
