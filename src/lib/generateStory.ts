import type { Setup, ParentInterview } from '../types'

const SYSTEM_PROMPT = `You are a children's author specializing in stories for teens aged 10–16.
You write with emotional intelligence, not didacticism.
You never preach. You never use the word "lesson".
You show, you don't tell.
The story must feel like fiction, not therapy.
Output format: Start with a story title on line 1, then two blank lines, then the story. Plain prose, no headers, no chapter labels, no asterisks or markdown. 600–900 words.`

function buildParentPrompt(setup: Setup, interview: ParentInterview): string {
  const emotionsStr = interview.emotions.join(', ')
  const friendsStr = setup.friends.join(', ')
  return `Write a story with the following context:
- Main character name: ${setup.name}
- Character appearance and personality: ${setup.characterSketch || 'a typical teen'}
- Friend names who appear in the story: ${friendsStr || 'none specified'}
- What happened today: ${interview.moment}
- Who was involved: ${interview.whoNote || interview.whoWasThere.join(', ')}
- How they felt: ${emotionsStr} — ${interview.emotionNote}
- Emotional destination: ${interview.destination}
- Story length: 600–900 words`
}

function buildTeenPrompt(setup: Setup, theme: string): string {
  const friendsStr = setup.friends.join(', ')
  return `Write a story with the following context:
- Main character name: ${setup.name}
- Character appearance and personality: ${setup.characterSketch || 'a typical teen'}
- Friend names who appear in the story: ${friendsStr || 'none specified'}
- Theme: ${theme}
- The story should naturally explore this theme without naming it directly
- Emotional destination: a hopeful, warm resolution that fits the theme
- Story length: 600–900 words`
}

function parseResponse(text: string): { title: string; content: string } {
  const lines = text.trim().split('\n')
  let title = lines[0].trim()
  // Strip leading "Title:" if present
  title = title.replace(/^title:\s*/i, '')
  // Find where actual content starts (skip blank lines after title)
  let contentStart = 1
  while (contentStart < lines.length && lines[contentStart].trim() === '') {
    contentStart++
  }
  const content = lines.slice(contentStart).join('\n').trim()
  return { title, content }
}

async function callClaude(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message || `Claude API error: ${response.status}`)
  }
  const data = await response.json() as { content: Array<{ text: string }> }
  return data.content[0].text
}

async function callOpenAI(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message || `OpenAI API error: ${response.status}`)
  }
  const data = await response.json() as { choices: Array<{ message: { content: string } }> }
  return data.choices[0].message.content
}

async function callOllama(ollamaUrl: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const url = ollamaUrl.replace(/\/$/, '') + '/api/generate'
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1',
      prompt: systemPrompt + '\n\n' + userPrompt,
      stream: false,
    }),
  })
  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`)
  }
  const data = await response.json() as { response: string }
  return data.response
}

export async function generateStory(params: {
  setup: Setup
  mode: 'parent' | 'teen'
  interview?: ParentInterview
  theme?: string
  onProgress?: (text: string) => void
}): Promise<{ title: string; content: string }> {
  const { setup, mode, interview, theme } = params

  const userPrompt = mode === 'parent' && interview
    ? buildParentPrompt(setup, interview)
    : buildTeenPrompt(setup, theme || 'Just somewhere else')

  let rawText: string

  if (setup.useLocal) {
    rawText = await callOllama(setup.ollamaUrl || 'http://localhost:11434', SYSTEM_PROMPT, userPrompt)
  } else if (setup.provider === 'claude') {
    rawText = await callClaude(setup.apiKey, SYSTEM_PROMPT, userPrompt)
  } else {
    rawText = await callOpenAI(setup.apiKey, SYSTEM_PROMPT, userPrompt)
  }

  return parseResponse(rawText)
}
