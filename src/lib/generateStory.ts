import type { Setup, ParentInterview } from '../types'

const SYSTEM_PROMPT = `You are a literary author writing short fiction for teens aged 10–16.

YOUR FIRST SENTENCE must drop the reader into a moment already happening — an action, a sound, a feeling. It must never describe who anyone is or what they look like.

FORBIDDEN — never write any of these:
- A character list or introduction: "Avyanna, with her long hair, sat..." / "There were five friends: Avyanna, Ivy..."
- Appearance labels: "the tall one", "the short one", "the quiet one", "the smallest", "the one with wavy hair"
- Race, ethnicity, nationality, body type, height, skin tone — of any character
- Direct retelling of the situation you were given — change the setting, the scene, the surface entirely
- Therapy language: "she realized", "she understood", "the lesson was", "she learned"
- Preaching or moralizing of any kind

GOOD OPENING (do this):
  The rehearsal ran twenty minutes over, and by the time Avyanna stepped outside, the parking lot was empty except for Paavani sitting on the curb eating chips.

BAD OPENING (never do this):
  In the heart of the park, five friends gathered. Avyanna, with her long dark hair, sat on a bench. Ivy, the jokester, and Lily, the quiet one, were nearby.

STORY STRUCTURE — follow this arc:
1. Open mid-scene. Character in motion. World specific and textured.
2. Something hard happens or lands. Show it; don't editorialize.
3. A small turn — an unexpected moment, a different angle, a quiet interior shift.
4. Resolution — the emotional destination, not a plot solution.
5. One closing sentence. A feeling, not a moral.

CRAFT — this separates a memorable story from a forgettable one:
- Names are just names. Do not attach labels to them.
- Friends enter scenes because the scene needs them, not to be introduced.
- Use specific sensory detail: the smell of a gym bag, the sound of a chair scraping tile, a pencil eraser worn to nothing. Not "she felt nervous" — "her knee wouldn't stop bouncing."
- Vary sentence rhythm deliberately. Short sentences land hard. Longer ones carry the reader through a moment that hasn't resolved yet, letting them feel the weight of waiting alongside the character. Alternate them.
- Include one image or line that stays with the reader after the story ends — something small and true that holds the whole feeling.
- Surprise the reader once. Not a plot twist — an unexpected detail, a line of dialogue, a moment they didn't see coming but immediately recognise as real.
- Dialogue sounds like actual teens: incomplete sentences, subject changes mid-thought, things left unsaid on purpose.
- 1200–1500 words. Develop each beat fully. Do not rush.

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

Write 1200–1500 words. Develop each scene fully. Do not rush. The story should feel pulled from a shelf — textured, specific, real. No moralizing.`
}

// Strip phrases that could introduce racial/ethnic framing into the prompt.
// The model should never receive identity descriptors — only personality/habit details.
const IDENTITY_PATTERN = /\b(indian|chinese|japanese|korean|filipino|hispanic|latino|latina|latinx|black|white|asian|african|caucasian|mixed.?race|biracial|multiracial|american|european|descent|heritage|ethnicity|ethnic|nationality|race|tall|short|thin|fat|skinny|chubby|petite|towering|tiny|small|big|wavy.?hair|curly.?hair|straight.?hair|long.?hair|short.?hair|medium.?hair)\b/gi

function sanitizeSketch(sketch: string): string {
  return sketch.replace(IDENTITY_PATTERN, '').replace(/\s{2,}/g, ' ').trim()
}

function parseResponse(text: string): { title: string; content: string } {
  const lines = text.trim().split('\n')
  let title = lines[0].trim()

  // Strip common model prefixes
  title = title.replace(/^(title|story title|title:)\s*/i, '').replace(/^\*+|\*+$/g, '').trim()

  // If the "title" is a full sentence (>8 words or >60 chars), the model
  // used the opening line as a title. Extract a short poetic title from
  // the first few meaningful words instead and keep the full line in content.
  const wordCount = title.split(/\s+/).length
  if (wordCount > 8 || title.length > 60) {
    // Derive a short title: first 4–5 words, trim trailing punctuation
    const shortTitle = title.split(/\s+/).slice(0, 5).join(' ').replace(/[,;:.!?]+$/, '')
    // Put the full opening line back into the content
    const content = lines.join('\n').trim()
    return { title: shortTitle, content }
  }

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
      max_tokens: 2500,
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
  const url = ollamaUrl.replace(/\/$/, '') + '/api/chat'
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'mistral',
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })
  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} — check that the model name matches 'ollama list' exactly`)
  }
  const data = await response.json() as { message: { content: string } }
  return data.message.content
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
