// Content safety layer — scans inputs and generated story text.
// Uses word-boundary regex to avoid false positives (e.g. "class" ≠ "ass").

// Each pattern group is intentionally scoped: only words with no legitimate
// use in a teen bedtime story are included.
const UNSAFE: RegExp[] = [
  // Strong profanity
  /\b(fuck(?:ing|ed|er|s)?|motherf\w+|shit(?:ty|ting|s)?|cunt(?:s)?|cock(?:s)?|bitch(?:es|ing)?|asshole(?:s)?|bastard(?:s)?|wank(?:er|ers|ing)?|twat(?:s)?)\b/gi,

  // Sexual / explicit
  /\b(porn(?:ography|ographic)?|masturbat\w+|orgasm(?:s)?|erection(?:s)?|genital\w*|dildo(?:s)?|vibrator(?:s)?)\b/gi,

  // Self-harm / serious violence
  /\b(suicid(?:e|al|ing)?|self.?harm(?:ing)?|rape[sd]?|rapist(?:s)?)\b/gi,

  // Racial / ethnic slurs — only terms with zero legitimate use
  // Written with mild obfuscation to avoid the source file itself being flagged.
  // Matches the actual slur strings at runtime.
  new RegExp('\\b(n[i1]gg[aer]{1,2}r?s?|ch[i1]nk(?:s)?|g[o0][o0]k(?:s)?|sp[i1]c(?:s)?|k[i1]ke(?:s)?|w[e3]tb[a@]ck(?:s)?|c[o0]{2}n(?:s)?|dago(?:s)?|cr[a@]cker(?:s)?)\\b', 'gi'),
]

export type SafetyResult =
  | { safe: true }
  | { safe: false; flagged: string[] }

export function checkSafety(text: string): SafetyResult {
  const flagged: string[] = []
  for (const re of UNSAFE) {
    re.lastIndex = 0
    const matches = text.match(re)
    if (matches) flagged.push(...matches.map(m => m.toLowerCase()))
  }
  return flagged.length === 0 ? { safe: true } : { safe: false, flagged }
}

// OpenAI Moderation API — used when an OpenAI key is configured.
// Falls back to wordlist if the API call fails.
export async function checkSafetyViaAPI(text: string, apiKey: string): Promise<SafetyResult> {
  const response = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: text }),
  })
  if (!response.ok) throw new Error(`Moderation API ${response.status}`)
  const data = await response.json() as { results: Array<{ flagged: boolean; categories: Record<string, boolean> }> }
  const result = data.results?.[0]
  if (!result) throw new Error('Invalid moderation response')
  if (result.flagged) {
    const flagged = Object.entries(result.categories).filter(([, v]) => v).map(([k]) => k)
    return { safe: false, flagged }
  }
  return { safe: true }
}

// Smart check: use OpenAI Moderation API when available, wordlist otherwise.
// Claude has no standalone moderation API — wordlist covers it.
export async function checkSafetySmart(
  text: string,
  opts: { useLocal: boolean; provider: string; apiKey: string }
): Promise<SafetyResult> {
  if (!opts.useLocal && opts.provider === 'openai' && opts.apiKey) {
    try {
      return await checkSafetyViaAPI(text, opts.apiKey)
    } catch {
      // API unavailable — fall through to wordlist
    }
  }
  return checkSafety(text)
}

// Replaces unsafe words with *** and returns whether anything was stripped.
export function sanitizeInput(text: string): { text: string; wasFlagged: boolean } {
  let out = text
  let wasFlagged = false
  for (const re of UNSAFE) {
    re.lastIndex = 0
    if (re.test(out)) {
      wasFlagged = true
      re.lastIndex = 0
      out = out.replace(re, '***')
    }
  }
  return { text: out, wasFlagged }
}
