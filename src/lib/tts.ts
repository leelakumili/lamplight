import type { MutableRefObject } from 'react'

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
export const TTS_RATE   = 0.78
export const TTS_PITCH  = 0.92
export const TTS_VOLUME = 0.9

export type VoicePersona = 'woman' | 'man' | 'bella' | 'lily'

// ElevenLabs pre-made voice IDs
const ELEVENLABS_VOICES: Record<'bella' | 'lily', string> = {
  bella: 'EXAVITQu4vr4xnSDxMaL',
  lily:  'pFZP5JQG7iQjIQuC4Bku',
}

export function isElevenLabsPersona(p: VoicePersona): p is 'bella' | 'lily' {
  return p === 'bella' || p === 'lily'
}

export async function speakWithElevenLabs(
  text: string,
  persona: 'bella' | 'lily',
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  onEnd: () => void,
  onError: () => void,
): Promise<void> {
  // Stop any prior audio
  if (audioRef.current) {
    audioRef.current.pause()
    audioRef.current = null
  }

  const res = await fetch('/api/proxy/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voiceId: ELEVENLABS_VOICES[persona], text }),
  })

  if (!res.ok) { onError(); return }

  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)
  const audio = new Audio(url)
  audioRef.current = audio
  audio.onended = () => { URL.revokeObjectURL(url); onEnd() }
  audio.onerror = () => { URL.revokeObjectURL(url); onError() }
  audio.play()
}

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
  const preferred = persona === 'man' ? MAN_VOICES : WOMAN_VOICES
  for (const name of preferred) {
    const match = voices.find(v => v.name === name)
    if (match) return match
  }
  const hint = persona === 'man' ? 'male' : 'female'
  return (
    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(hint)) ??
    voices.find(v => v.lang.startsWith('en')) ??
    voices[0]
  )
}
