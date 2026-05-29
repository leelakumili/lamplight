import { Hono } from 'hono'
import { config } from '../lib/config'

export const proxy = new Hono()

proxy.post('/anthropic', async (c) => {
  if (!config.anthropicKey) return c.json({ error: 'Anthropic API key not configured on server' }, 503)
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':          config.anthropicKey,
      'anthropic-version':  '2023-06-01',
      'content-type':       'application/json',
    },
    body: await c.req.text(),
  })
  const data = await res.json()
  return c.json(data, res.status as any)
})

proxy.post('/openai/chat', async (c) => {
  if (!config.openaiKey) return c.json({ error: 'OpenAI API key not configured on server' }, 503)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.openaiKey}`, 'Content-Type': 'application/json' },
    body: await c.req.text(),
  })
  const data = await res.json()
  return c.json(data, res.status as any)
})

proxy.post('/openai/images', async (c) => {
  if (!config.openaiKey) return c.json({ error: 'OpenAI API key not configured on server' }, 503)
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.openaiKey}`, 'Content-Type': 'application/json' },
    body: await c.req.text(),
  })
  const data = await res.json()
  return c.json(data, res.status as any)
})

proxy.post('/openai/moderations', async (c) => {
  if (!config.openaiKey) return c.json({ error: 'OpenAI API key not configured on server' }, 503)
  const res = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.openaiKey}`, 'Content-Type': 'application/json' },
    body: await c.req.text(),
  })
  const data = await res.json()
  return c.json(data, res.status as any)
})

proxy.post('/elevenlabs/tts', async (c) => {
  if (!config.elevenLabsKey) return c.json({ error: 'ElevenLabs API key not configured on server' }, 503)
  const { voiceId, text } = await c.req.json() as { voiceId: string; text: string }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key':   config.elevenLabsKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })
  if (!res.ok) return c.json({ error: 'ElevenLabs request failed' }, res.status as any)
  return c.body(res.body as ReadableStream, 200, { 'Content-Type': 'audio/mpeg' })
})

proxy.all('/ollama/*', async (c) => {
  const suffix = c.req.path.replace(/^\/api\/proxy\/ollama/, '')
  const method = c.req.method
  const bodyText = method !== 'GET' ? await c.req.text() : undefined

  let isStreaming = false
  if (bodyText) {
    try { isStreaming = (JSON.parse(bodyText) as { stream?: boolean }).stream === true } catch { /* ignore */ }
  }

  console.log(`[ollama] ${method} ${config.ollamaUrl}${suffix} stream=${isStreaming}`)
  const res = await fetch(`${config.ollamaUrl}${suffix}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: bodyText,
  })

  if (isStreaming && res.body) {
    // Use c.body() so @hono/node-server correctly pipes the ReadableStream
    return c.body(res.body as ReadableStream, res.status as any, {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
      'X-Accel-Buffering': 'no',
    })
  }

  const text = await res.text()
  // Ollama may return NDJSON (one object per line) even with stream:false.
  // Parse the last non-empty line which contains the complete response.
  const lines = text.split('\n').filter(l => l.trim())
  const last  = lines[lines.length - 1] ?? '{}'
  try {
    return c.json(JSON.parse(last), res.status as any)
  } catch {
    return c.text(text, res.status as any)
  }
})
