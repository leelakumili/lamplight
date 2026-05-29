// Warm, calm voice selection for bedtime story read-aloud.
// The Web Speech API returns [] on first call in Chrome — we wait for voiceschanged.
// Voice names are platform-specific; we prefer in priority order and fall back gracefully.

const WOMAN_VOICES = [
  'Ava (Enhanced)',
  'Samantha (Enhanced)',
  'Samantha',
  'Karen (Enhanced)',
  'Karen',
  'Moira',
  'Microsoft Aria Online (Natural)',
  'Microsoft Aria Online',
  'Microsoft Jenny Online (Natural)',
  'Microsoft Jenny Online',
  'Google UK English Female',
]

const MAN_VOICES = [
  'Daniel (Enhanced)',
  'Daniel',
  'Tom (Enhanced)',
  'Tom',
  'Fred',
  'Microsoft Guy Online (Natural)',
  'Microsoft Guy Online',
  'Google UK English Male',
]

// Bedtime pacing: slower rate and slightly lower pitch produce a calmer, warmer delivery.
export const TTS_RATE  = 0.78
export const TTS_PITCH = 0.92
export const TTS_VOLUME = 0.9

export type VoicePersona = 'woman' | 'man'

export function getVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  if (!window.speechSynthesis) return Promise.resolve([])
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) return resolve(voices)
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      () => resolve(window.speechSynthesis.getVoices()),
      { once: true },
    )
  })
}

export function pickVoice(
  persona: VoicePersona,
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  const preferred = persona === 'woman' ? WOMAN_VOICES : MAN_VOICES
  for (const name of preferred) {
    const match = voices.find(v => v.name === name)
    if (match) return match
  }
  // Generic fallback — any English voice with a gender hint in the name
  const hint = persona === 'woman' ? 'female' : 'male'
  return (
    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(hint)) ??
    voices.find(v => v.lang.startsWith('en')) ??
    voices[0]
  )
}
