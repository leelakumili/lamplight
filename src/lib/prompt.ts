import type { Setup, ParentInterview } from '../types'

// Strip phrases that could introduce racial/ethnic framing into the prompt.
const IDENTITY_PATTERN = /\b(indian|chinese|japanese|korean|filipino|hispanic|latino|latina|latinx|black|white|asian|african|caucasian|mixed.?race|biracial|multiracial|american|european|descent|heritage|ethnicity|ethnic|nationality|race|tall|short|thin|fat|skinny|chubby|petite|towering|tiny|small|big|wavy.?hair|curly.?hair|straight.?hair|long.?hair|short.?hair|medium.?hair)\b/gi

export function sanitizeSketch(sketch: string): string {
  return sketch.replace(IDENTITY_PATTERN, '').replace(/\s{2,}/g, ' ').trim()
}

export const SYSTEM_PROMPT = `You are a literary author writing short fiction for teens aged 10–16.

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

OUTPUT FORMAT — follow exactly, every time:
Line 1: The story title — 2 to 5 words. A complete, standalone phrase. Never a sentence fragment.
  GOOD: "The Weight of Afternoon" · "Something Borrowed" · "After Practice" · "What She Kept"
  BAD:  "The scent of chlorine and" · "She had always been" · "A tangle of"
Line 2: blank
Line 3: blank
Line 4 onward: the story text.
Output nothing else — no "Here is the story", no explanation, no code fences.`

export function buildParentPrompt(setup: Setup, interview: ParentInterview): string {
  const emotionsStr = interview.emotions.length > 0 ? interview.emotions.join(', ') : 'unspecified'
  const friendsStr  = setup.friends.length > 0 ? setup.friends.join(', ') : 'none'
  const whoNote     = interview.whoNote?.trim() || interview.whoWasThere.join(', ') || 'unspecified'
  const emotionNote = interview.emotionNote?.trim() || ''
  const sketch      = sanitizeSketch(setup.characterSketch || '')

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

export function buildTeenPrompt(setup: Setup, theme: string): string {
  const friendsStr = setup.friends.length > 0 ? setup.friends.join(', ') : 'none'
  const sketch     = sanitizeSketch(setup.characterSketch || '')

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
