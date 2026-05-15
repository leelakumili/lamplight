import type { Story, Setup } from '../types'
import { MODELS } from './constants'

function safeDestination(raw: string): string {
  return raw.replace(/[^a-zA-Z\s]/g, '').trim().slice(0, 40)
}

function buildDallEPrompt(story: Story): string {
  const dest = safeDestination(story.destination)
  const mood = dest
    ? `evoking a feeling of "${dest}"`
    : story.mode === 'teen' ? 'wonder and quiet discovery' : 'warmth and gentle resolution'
  return (
    `Soft, dreamy watercolor illustration for a teen bedtime story titled "${story.title}", ` +
    `${mood}. A quiet atmospheric scene with no people, no faces, no text. ` +
    `Warm muted palette, gentle lamplight or moonlight. Painterly book illustration style.`
  )
}

function buildSVGPrompt(story: Story): string {
  return (
    `Generate a minimal SVG illustration (viewBox="0 0 400 240") for a bedtime story ` +
    `titled "${story.title}". Use 5–8 soft abstract shapes suggesting mood and setting. ` +
    `No people, no faces, no text. Warm muted colours. ` +
    `Output ONLY the raw <svg> element — no explanation, no code fences.`
  )
}

async function urlToDataURI(url: string): Promise<string> {
  const res  = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader    = new FileReader()
    reader.onload   = () => resolve(reader.result as string)
    reader.onerror  = reject
    reader.readAsDataURL(blob)
  })
}

async function generateWithDallE(story: Story, signal: AbortSignal): Promise<string | null> {
  const res = await fetch('/api/proxy/openai/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODELS.openaiImage, prompt: buildDallEPrompt(story), n: 1, size: '1024x1024', quality: 'standard' }),
    signal,
  })
  if (!res.ok) return null
  const data = await res.json() as { data: Array<{ url: string }> }
  const url  = data.data?.[0]?.url
  if (!url) return null
  return urlToDataURI(url)
}

async function generateWithClaudeSVG(story: Story, signal: AbortSignal): Promise<string | null> {
  const res = await fetch('/api/proxy/anthropic', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODELS.claudeHaiku,
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildSVGPrompt(story) }],
    }),
    signal,
  })
  if (!res.ok) return null
  const data  = await res.json() as { content: Array<{ text: string }> }
  const raw   = data.content?.[0]?.text ?? ''
  const match = raw.match(/<svg[\s\S]*?<\/svg>/i)
  if (!match) return null
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(match[0])}`
}

export async function generateIllustration(story: Story, setup: Setup, signal: AbortSignal): Promise<string | null> {
  if (setup.useLocal) return null
  if (setup.provider === 'openai') return generateWithDallE(story, signal)
  if (setup.provider === 'claude') return generateWithClaudeSVG(story, signal)
  return null
}
