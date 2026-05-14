import type { Setup, ParentInterview } from '../types'

const SYSTEM_PROMPT = `You are a literary author who writes short fiction for teens aged 10–16.

YOUR CORE JOB: Transform a real emotional situation into a fictional story that lets the reader feel understood — without ever feeling like they're being talked about or studied.

RULES — follow every one of these without exception:

1. TRANSFORM, don't transcribe. The situation you are given is source material, not a script. Change the setting, the metaphor, the surface details. The emotional truth stays; the literal facts do not. If a parent writes "she was left out at lunch," your story might be about a long bus ride, a rehearsal that went wrong, or a late afternoon in the library — not a cafeteria scene.

2. NEVER mention race, ethnicity, nationality, or skin tone. Do not describe characters by their heritage, background, or where their family is from. A character's name is just their name. Physical descriptions, if any, are neutral and incidental — a detail of hair, a habit of chewing a pencil, the way someone walks — never markers of identity.

3. NEVER repeat the parent's or teen's input back as dialogue or narration. The input is private context; the story is a new thing.

4. USE the five-beat story arc:
   a. Setup — character in a specific, textured scene. Friends named naturally. World established.
   b. The hard moment — the emotional reality lands. No editorializing. Show it, don't label it.
   c. A turn — something small shifts. An unexpected moment, a different angle, an interior move.
   d. Resolution — the emotional destination is reached. Not a fix. A feeling.
   e. A closing line — one sentence. Not a moral. A feeling the reader carries out of the story.

5. WRITE with restraint. No preaching. No therapy language. No "she realized," "she understood," "the lesson was." Trust the scene to do the work.

6. The story must feel like fiction pulled from a shelf — not generated, not engineered, not written for a purpose. The teen should never know it was made for them.

7. Length: 600–900 words. Plain prose. No chapter headers, no section breaks, no asterisks or markdown.

Output format: Story title on line 1. Two blank lines. Then the story. Nothing else.`

function buildParentPrompt(setup: Setup, interview: ParentInterview): string {
  const emotionsStr = interview.emotions.length > 0 ? interview.emotions.join(', ') : 'unspecified'
  const friendsStr = setup.friends.length > 0 ? setup.friends.join(', ') : 'none'
  const whoNote = interview.whoNote?.trim() || interview.whoWasThere.join(', ') || 'unspecified'
  const emotionNote = interview.emotionNote?.trim() || ''
  const sketch = sanitizeSketch(setup.characterSketch || '')

  return `Use the following as source material — transform it into original fiction, do not retell it.

MAIN CHARACTER
Name: ${setup.name}
${sketch ? `Personality / details (use sparingly for texture, never as identity markers): ${sketch}` : ''}

FRIENDS WHO APPEAR IN THE STORY (use these names naturally — they are just names)
${friendsStr}

WHAT HAPPENED (this is private parent context — reshape it entirely, do not quote or paraphrase it)
${interview.moment}

WHO WAS INVOLVED
${whoNote}

HOW THE CHARACTER FELT
${emotionsStr}${emotionNote ? `\nAdditional note: ${emotionNote}` : ''}

WHERE THE STORY SHOULD LEAVE THE READER (emotional destination — not a plot instruction)
${interview.destination}

Remember: change the surface, keep the emotional core. The teen will read this as a normal bedtime story.`
}

function buildTeenPrompt(setup: Setup, theme: string): string {
  const friendsStr = setup.friends.length > 0 ? setup.friends.join(', ') : 'none'
  const sketch = sanitizeSketch(setup.characterSketch || '')

  return `Write an original short story for a teen using the following as your brief.

MAIN CHARACTER
Name: ${setup.name}
${sketch ? `Personality / details (use as light texture only, never as identity labels): ${sketch}` : ''}

FRIENDS WHO APPEAR IN THE STORY (names only — do not describe or label them)
${friendsStr}

EMOTIONAL THEME (do not name this theme in the story — let the situation carry it)
${theme}

EMOTIONAL DESTINATION
A warm, quiet resolution. The character doesn't solve the problem — they find a way to hold it differently.

Write a story that feels pulled from a shelf. Textured, specific, real. No moralizing.`
}

// Strip phrases that could introduce racial/ethnic framing into the prompt.
// The model should never receive identity descriptors — only personality/habit details.
const IDENTITY_PATTERN = /\b(indian|chinese|japanese|korean|hispanic|latino|latina|latinx|black|white|asian|african|caucasian|mixed.?race|biracial|multiracial|descent|heritage|ethnicity|ethnic|nationality|race)\b/gi

function sanitizeSketch(sketch: string): string {
  return sketch.replace(IDENTITY_PATTERN, '').replace(/\s{2,}/g, ' ').trim()
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

async function callOllama(ollamaUrl: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const url = ollamaUrl.replace(/\/$/, '') + '/api/generate'
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'mistral',
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
    rawText = await callOllama(setup.ollamaUrl || 'http://localhost:11434', setup.ollamaModel || 'mistral', SYSTEM_PROMPT, userPrompt)
  } else if (setup.provider === 'claude') {
    rawText = await callClaude(setup.apiKey, SYSTEM_PROMPT, userPrompt)
  } else {
    rawText = await callOpenAI(setup.apiKey, SYSTEM_PROMPT, userPrompt)
  }

  return parseResponse(rawText)
}
