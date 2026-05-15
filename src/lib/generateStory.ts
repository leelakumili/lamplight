import type { Setup, ParentInterview } from '../types'
import { sanitizeInput, checkSafetySmart } from './safety'
import { getSystemPrompt, buildParentPrompt, buildTeenPrompt } from './prompt'
import { MODELS } from './constants'

// Words that prove a title is an incomplete sentence fragment.
const TRAILING_CONNECTOR = /\b(and|or|but|the|a|an|of|in|on|at|to|for|with|by|from|that|which|this|its|their|his|her|our|your|my|as|if|when|where|while|though|although|because|since|until|unless|after|before|between|within|without|over|under|through|across|against|along|around|near|toward|upon|amid|despite|during|per|than|then|via)\s*[,.]?\s*$/i

function isTitleComplete(title: string, content: string): boolean {
  if (!title || title.trim().length < 2) return false
  if (TRAILING_CONNECTOR.test(title.trim())) return false
  const t = title.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/).slice(0, 4).join(' ')
  const c = content.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/).slice(0, 6).join(' ')
  if (t.length > 6 && c.startsWith(t)) return false
  return true
}

function parseResponse(text: string): { title: string; content: string } {
  const lines = text.trim().split('\n')
  let title = lines[0].trim()
  // Strip common model prefixes: "Title:", "# Heading", "**bold**", asterisks
  title = title
    .replace(/^#+\s*/, '')
    .replace(/^(title|story title|title:)\s*/i, '')
    .replace(/^\*+|\*+$/g, '')
    .trim()

  let contentStart = 1
  while (contentStart < lines.length && lines[contentStart].trim() === '') contentStart++
  const content = lines.slice(contentStart).join('\n').trim()

  const wordCount = title.split(/\s+/).length
  if (wordCount > 8 || title.length > 60) {
    // Truncate — but always use content *without* the title line (already done above)
    const shortTitle = title.split(/\s+/).slice(0, 5).join(' ').replace(/[,;:.!?]+$/, '')
    return { title: shortTitle, content }
  }

  return { title, content }
}

// ── Provider adapters ─────────────────────────────────────────────────────────

async function callClaude(system: string, user: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch('/api/proxy/anthropic', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal,
    body: JSON.stringify({
      model: MODELS.claudeSonnet,
      max_tokens: 2500,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (res.status === 401) throw new Error('SESSION_EXPIRED')
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(err.error?.message || `Claude API error: ${res.status}`)
  }
  const data = await res.json() as { content: Array<{ text: string }> }
  return data.content[0].text
}

async function callOpenAI(system: string, user: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch('/api/proxy/openai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      model: MODELS.openaiChat,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  })
  if (res.status === 401) throw new Error('SESSION_EXPIRED')
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(err.error?.message || `OpenAI API error: ${res.status}`)
  }
  const data = await res.json() as { choices: Array<{ message: { content: string } }> }
  return data.choices[0].message.content
}

async function callOllama(model: string, system: string, user: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch('/api/proxy/ollama/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  })
  if (res.status === 401) throw new Error('SESSION_EXPIRED')
  if (!res.ok) throw new Error(`Ollama error: ${res.status} — check that the model name matches 'ollama list' exactly`)
  const data = await res.json() as { message: { content: string } }
  return data.message.content
}

async function callOllamaStreaming(
  model: string,
  system: string,
  user: string,
  onProgress: (ratio: number) => void,
  signal?: AbortSignal,
  targetWords = 1200,
): Promise<string> {
  const res = await fetch('/api/proxy/ollama/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      model,
      stream: true,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  })
  if (res.status === 401) throw new Error('SESSION_EXPIRED')
  if (!res.ok) throw new Error(`Ollama error: ${res.status} — check that the model name matches 'ollama list' exactly`)
  if (!res.body) throw new Error('No response body from Ollama')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const chunk = JSON.parse(line) as { message?: { content: string }; done?: boolean }
        if (chunk.message?.content) {
          accumulated += chunk.message.content
          const words = accumulated.split(/\s+/).filter(Boolean).length
          onProgress(Math.min(words / targetWords, 0.99))
        }
        if (chunk.done) { onProgress(1); return accumulated }
      } catch { /* ignore malformed chunk */ }
    }
  }
  return accumulated
}

// Single dispatch — used by both generation and title-only fallback.
function callLLM(
  setup: Pick<Setup, 'useLocal' | 'provider' | 'ollamaModel'>,
  system: string,
  user: string,
  signal?: AbortSignal,
  onProgress?: (ratio: number) => void,
  targetWords?: number,
): Promise<string> {
  if (setup.useLocal) {
    if (onProgress)
      return callOllamaStreaming(setup.ollamaModel || MODELS.ollamaDefault, system, user, onProgress, signal, targetWords)
    return callOllama(setup.ollamaModel || MODELS.ollamaDefault, system, user, signal)
  }
  if (setup.provider === 'claude')
    return callClaude(system, user, signal)
  return callOpenAI(system, user, signal)
}

// Last-resort title repair — targets only the title without re-generating the story.
async function generateTitleOnly(firstSentence: string, setup: Setup): Promise<string> {
  const system = 'You write short story titles. Reply with ONLY the title — 2 to 5 words, a complete phrase, no punctuation at the end. Nothing else.'
  const user   = `Opening sentence of a teen short story:\n"${firstSentence}"\n\nWrite the title.`
  try {
    const raw     = await callLLM(setup, system, user)
    const cleaned = raw.trim().replace(/^["'*]+|["'*]+$/g, '').trim()
    if (cleaned && !TRAILING_CONNECTOR.test(cleaned)) return cleaned
  } catch { /* fall through */ }
  return "Tonight's Story"
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function generateStory(params: {
  setup: Setup
  mode: 'parent' | 'teen'
  interview?: ParentInterview
  theme?: string
  signal?: AbortSignal
  onInputSanitized?: () => void
  onProgress?: (ratio: number) => void
}): Promise<{ title: string; content: string }> {
  const { setup, mode, theme, signal } = params

  let interview = params.interview
  if (mode === 'parent' && interview) {
    const fields: (keyof ParentInterview)[] = ['moment', 'whoNote', 'emotionNote', 'destination']
    let wasFlagged = false
    const cleaned = { ...interview }
    for (const field of fields) {
      const val = cleaned[field]
      if (typeof val === 'string') {
        const result = sanitizeInput(val)
        if (result.wasFlagged) { wasFlagged = true; (cleaned as Record<string, unknown>)[field] = result.text }
      }
    }
    if (wasFlagged) { interview = cleaned; params.onInputSanitized?.() }
  }

  const userPrompt = mode === 'parent' && interview
    ? buildParentPrompt(setup, interview)
    : buildTeenPrompt(setup, theme || 'Just somewhere else')

  const safetyOpts = { useLocal: setup.useLocal, provider: setup.provider }

  const targetWords = setup.storyStyle === 'panchatantra' ? 900 : 1200

  for (let attempt = 0; attempt < 3; attempt++) {
    const progressFn = params.onProgress
      ? (r: number) => params.onProgress!(attempt === 0 ? r : r * 0.9 + 0.05)
      : undefined
    const raw = await callLLM(setup, getSystemPrompt(setup.storyStyle || 'modern'), userPrompt, signal, progressFn, targetWords)

    const { safe } = await checkSafetySmart(raw, safetyOpts)
    if (!safe) {
      if (attempt === 2) throw new Error("The story contained content that isn't appropriate for this app. Please try again.")
      continue
    }

    const parsed = parseResponse(raw)
    if (!isTitleComplete(parsed.title, parsed.content)) {
      if (attempt < 2) continue
      const firstSentence = parsed.content.split(/(?<=[.!?])\s/)[0].trim()
      return { ...parsed, title: await generateTitleOnly(firstSentence, setup) }
    }

    return parsed
  }

  throw new Error('Story generation failed.')
}
