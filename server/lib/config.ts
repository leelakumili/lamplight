import 'dotenv/config'

function get(key: string, fallback?: string): string {
  const val = process.env[key]
  if (!val && fallback === undefined) throw new Error(`Missing required env var: ${key}`)
  return val ?? fallback!
}

export const config = {
  port:         parseInt(process.env.PORT || '3000', 10),
  pin:          get('APP_PIN'),
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? '',
  openaiKey:    process.env.OPENAI_API_KEY ?? '',
  ollamaUrl:    process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
}
