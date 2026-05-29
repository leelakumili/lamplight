# Lamplight — Claude Code Guide

Personalized bedtime story app for teens. React SPA + Hono server. Parent enters what happened at school; AI generates a story with the teen as protagonist.

## Dev commands

```bash
npm run dev        # Vite (5173) + Hono (3000) with hot reload
npm run build      # production build → dist/
npm start          # run production server
npm run type-check # tsc --noEmit
npm run lint       # eslint
```

## Key source locations

| What | Where |
|---|---|
| Server entry | `server/index.ts` |
| Server config / env | `server/lib/config.ts` |
| AI proxy routes | `server/routes/proxy.ts` |
| Reading screen | `src/screens/Reading.tsx` |
| TTS logic | `src/lib/tts.ts` |
| Story generation prompt | `src/lib/prompt.ts` |
| Shared types | `src/types.ts` |

## Read-aloud voices

Two modes — ElevenLabs (cloud) and Web Speech API (on-device). Both live in `src/lib/tts.ts`.

**There are two voice UI surfaces in `Reading.tsx` — both must be updated together when adding/changing voices:**

1. **Header toggle button** (~line 300) — cycles through all personas on tap, shows current voice name as a pill label
2. **Settings sheet voice grid** (~line 730) — 2×2 grid with label + sub-description per voice

Current personas: `bella` | `lily` | `woman` | `man`

| Persona | Label | Engine | ElevenLabs voice ID |
|---|---|---|---|
| `bella` | Bella | ElevenLabs | `EXAVITQu4vr4xnSDxMaL` |
| `lily` | Lily | ElevenLabs | `pFZP5JQG7iQjIQuC4Bku` |
| `woman` | Soft | Web Speech API | — |
| `man` | Deep | Web Speech API | — |

ElevenLabs audio flows through `/api/proxy/elevenlabs/tts` (key never reaches browser). Pause/resume uses `HTMLAudioElement` (stored in `audioRef`). Web Speech API uses `SpeechSynthesisUtterance` (stored in `utteranceRef`). Both refs must be stopped/cleared on page change, back navigation, and unmount.

## Environment variables

| Variable | Purpose |
|---|---|
| `APP_PIN` | PIN to enter the app (required) |
| `PORT` | Server port (default 3000) |
| `ANTHROPIC_API_KEY` | Claude API |
| `OPENAI_API_KEY` | OpenAI API |
| `OLLAMA_BASE_URL` | Ollama endpoint (default http://localhost:11434) |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS — free tier at elevenlabs.io |

## Documentation checklist

When making any notable change, update:
- `CLAUDE.md` — dev-facing reference (this file)
- `TECHNICAL.md` — architecture, data flows, env vars table
- `README.md` — user-facing setup steps (only if setup/config changed)
