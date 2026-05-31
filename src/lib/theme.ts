export type AppTheme = 'editorial-calm' | 'playful' | 'moody' | 'editorial'

const STORAGE_KEY = 'lamplight.theme'
const DEFAULT_THEME: AppTheme = 'editorial-calm'

export function getStoredTheme(): AppTheme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'editorial-calm' || v === 'playful' || v === 'moody' || v === 'editorial') return v
  } catch { /* ignore */ }
  return DEFAULT_THEME
}

export function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme
  try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignore */ }
}

export const THEME_META: Record<AppTheme, { label: string; desc: string; bg: string; ink: string; accent: string }> = {
  'editorial-calm': {
    label: 'Editorial Calm',
    desc: 'Warm cream, Newsreader serif. The default.',
    bg: '#faf4e8',
    ink: '#1f1b16',
    accent: '#c9924a',
  },
  playful: {
    label: 'Playful',
    desc: 'Bright grape & peach. Best for ages 9–12.',
    bg: '#fff7ea',
    ink: '#241a18',
    accent: '#7a5cff',
  },
  moody: {
    label: 'Moody',
    desc: 'Dark-first with expressive italic serif.',
    bg: '#0d0d12',
    ink: '#f5f0e8',
    accent: '#ff7a59',
  },
  editorial: {
    label: 'Editorial',
    desc: 'Bone paper, acid yellow. Zine confident.',
    bg: '#ecead8',
    ink: '#0a0a0a',
    accent: '#d6ff3d',
  },
}
