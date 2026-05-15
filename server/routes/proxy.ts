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

proxy.all('/ollama/*', async (c) => {
  const suffix = '/' + c.req.param('*')
  const method = c.req.method
  const res = await fetch(`${config.ollamaUrl}${suffix}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method !== 'GET' ? await c.req.text() : undefined,
  })
  const data = await res.json()
  return c.json(data, res.status as any)
})
