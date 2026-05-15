# Lamplight — Technical Reference

## Architecture

Lamplight is a React SPA served by a Hono server. The server does three things: PIN auth, AI proxy (injecting credentials), and static file serving. **The browser never holds an API key.**

```
╔══════════════════════════════════════════════════════════════╗
║                    HOME NETWORK                              ║
║                                                              ║
║   📱 Her phone          💻 Your laptop (port 3000)           ║
║   ┌─────────────┐       ┌──────────────────────────────┐    ║
║   │             │  WiFi │                              │    ║
║   │   Browser   │──────▶│  🟠 Hono Server              │    ║
║   │             │       │                              │    ║
║   │  React SPA  │       │  /login    → PIN screen      │    ║
║   │             │       │  /logout   → clear session   │    ║
║   │  IndexedDB  │       │  /health   → { ok: true }    │    ║
║   │  (stories)  │       │  /api/proxy/* → AI calls     │    ║
║   │             │       │  /*        → serve dist/     │    ║
║   └─────────────┘       └──────────┬───────────────────┘    ║
║                                    │                         ║
╚════════════════════════════════════│═════════════════════════╝
                                     │ internet
                         ┌───────────┼───────────┐
                         ▼           ▼           ▼
                    🟣 Anthropic  🟢 OpenAI  🔵 Ollama
                    Claude API   GPT-4o     (local)
```

---

## Request flow

```
Browser                    Hono Server                   AI Provider
  │                             │                              │
  │── POST /api/proxy/ollama ──▶│                              │
  │   { model, messages }       │── POST /api/chat ───────────▶│
  │                             │   + Authorization header     │
  │                             │◀── NDJSON stream ────────────│
  │                             │   (parsed, last line taken)  │
  │◀── JSON response ───────────│                              │
  │                             │                              │
```

---

## Authentication

```
 User visits app
        │
        ▼
 ┌─────────────────┐     No session     ┌──────────────────┐
 │  Auth Middleware │───────────────────▶│   /login page    │
 └─────────────────┘                    │   (PIN prompt)   │
        │ Valid session cookie           └────────┬─────────┘
        │                                        │ POST /login
        ▼                                        ▼
 ┌─────────────────┐              ┌──────────────────────────┐
 │   App serves    │◀─────────────│  timingSafeEqual(pin)    │
 │   normally      │  Set cookie  │  randomBytes(32) token   │
 └─────────────────┘              │  stored in memory Set    │
                                  └──────────────────────────┘
```

- Cookie: `lamplight_session`, `httpOnly`, `SameSite=Lax`, 1-year max-age
- Sessions live in memory — cleared on server restart (intentional, home network)
- API requests without session → `401`; browser requests → redirect to `/login`

---

## AI Proxy endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                    /api/proxy/*                                 │
├──────────────────────────┬──────────────────────────────────────┤
│ POST /anthropic          │ → api.anthropic.com/v1/messages      │
│                          │   + x-api-key header                 │
├──────────────────────────┼──────────────────────────────────────┤
│ POST /openai/chat        │ → api.openai.com/v1/chat/completions │
│                          │   + Authorization: Bearer ...        │
├──────────────────────────┼──────────────────────────────────────┤
│ POST /openai/images      │ → api.openai.com/v1/images/...       │
├──────────────────────────┼──────────────────────────────────────┤
│ POST /openai/moderations │ → api.openai.com/v1/moderations      │
├──────────────────────────┼──────────────────────────────────────┤
│ ALL  /ollama/*           │ → $OLLAMA_BASE_URL + path            │
│                          │   NDJSON → parsed → last line        │
└──────────────────────────┴──────────────────────────────────────┘
```

Missing key → `503` (not a key leak). Client sends only the request body.

---

## Story generation pipeline

```
  Parent fills interview          Teen picks theme
         │                               │
         └──────────────┬────────────────┘
                        ▼
              ┌─────────────────┐
              │  Build prompt   │  ← profile + answers/theme
              │  (prompt.ts)    │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
         ┌───▶│   Call LLM      │  up to 3 attempts
         │    │  /api/proxy/*   │
         │    └────────┬────────┘
         │             │
         │    ┌────────▼────────┐
         │    │  Safety check   │  OpenAI moderation (cloud)
         │    │  (safety.ts)    │  word-list heuristic (local)
         │    └────────┬────────┘
         │             │ unsafe → retry
         │    ┌────────▼────────┐
         │    │  Parse response │  title + content
         │    │  Title valid?   │
         │    └────────┬────────┘
         └─────────────┘ bad title → retry
                       │ 3 attempts exhausted + bad title
                       ▼
              ┌─────────────────┐
              │  Title repair   │  send only first sentence
              │  (fallback)     │  ask for 2–5 word title
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Story ready ✓  │
              └─────────────────┘
```

---

## Illustration pipeline

```
  Story appears on screen
         │
         │  (non-blocking — user reads immediately)
         │
         ▼
  ┌──────────────────────────────┐
  │  Background task starts      │
  │  AbortController (30s limit) │
  └──────────┬───────────────────┘
             │
      ┌──────┴──────┐
      │             │
  Claude?       OpenAI?
      │             │
      ▼             ▼
  SVG prompt   DALL-E image
  → inline SVG  → data URL
      │             │
      └──────┬──────┘
             │
      ┌──────▼──────────────────┐
      │  historyIdsRef guard    │  story still exists?
      │  (not deleted mid-gen)  │
      └──────┬──────────────────┘
             │ yes
             ▼
      ┌──────────────┐
      │  Save to     │
      │  IndexedDB   │
      │  → appears   │
      └──────────────┘
```

---

## Client state machine

```
┌─────────────────────────────────────────────────────────┐
│                   AppState (useReducer)                  │
│                                                         │
│  screen ──────────────────────────────────────────────┐ │
│  (onb-welcome → onb-profile → onb-llm → home → ...)  │ │
│                                                       │ │
│  setup ─────── name, provider, ollamaModel, themes    │ │
│  interview ──── Q1–Q4 answers (cleared after story)   │ │
│  history ─────── Story[]  ◀──▶  IndexedDB             │ │
│  profiles ────── Profile[] ◀──▶  IndexedDB            │ │
│  currentStory ── Story being read                     │ │
│                                                       │ │
│  Reducer default: never  (exhaustiveness enforced) ◀──┘ │
└─────────────────────────────────────────────────────────┘
```

Screens are a string union (`Screen` type). No router library — the `screen` key drives a `switch` in `App.tsx`.

---

## Theming system

```
  App themes (4)              Reader themes (3)
  ──────────────              ─────────────────
  cream     🟤 warm           cream   ☀️ light parchment
  sepia     🟫 editorial      sepia   🌙 dark warm
  midnight  ⬛ dark           midnight ⬛ pure dark
  editorial 📰 structured
       │                            │
       ▼                            ▼
  [data-theme="..."]        --reader-sepia-bg
  on <html>                 --reader-sepia-bg2
       │                    etc. (CSS vars)
       ▼
  var(--bg), var(--ink)     Applied independently
  var(--accent), etc.       so reader ≠ app theme
```

---

## Dev vs production

```
  DEVELOPMENT (npm run dev)          PRODUCTION (npm start)
  ─────────────────────────          ──────────────────────
  Vite  :5173  ──┐                   Hono :3000
  Hono  :3000  ◀─┘ proxy            ├── serves dist/
                                     ├── /api/proxy/*
  Vite proxies:                      └── PIN auth
  /api    → :3000
  /login  → :3000                   Access:
  /logout → :3000                   localhost:3000     (you)
  /health → :3000                   lamplight.local:3000 (family)
```

---

## Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `APP_PIN` | ✅ Yes | — | PIN to enter the app |
| `PORT` | No | `3000` | Server port |
| `ANTHROPIC_API_KEY` | If using Claude | — | Anthropic API |
| `OPENAI_API_KEY` | If using OpenAI | — | OpenAI API |
| `OLLAMA_BASE_URL` | If using Ollama | `http://localhost:11434` | Ollama endpoint |

Only set keys for the provider you use. Others can be omitted.

---

## Key dependencies

| Package | What it does |
|---|---|
| `hono` | Server framework (fast, TypeScript-native) |
| `@hono/node-server` | Node.js adapter for Hono |
| `react` + `react-dom` | UI |
| `idb` | IndexedDB with a promise API |
| `dotenv` | Loads `.env` into `process.env` |
| `vite` | Build tool + dev server |
| `tsx` | Runs TypeScript directly (server) |
| `concurrently` | Runs Vite + Hono together in dev |

---

## TypeScript setup

Two separate configs, two separate compilation targets:

```
tsconfig.json          (root, project references)
├── tsconfig.app.json  (client — bundler mode, DOM lib, jsx)
└── server/
    └── tsconfig.json  (server — NodeNext, node types, no jsx)
```

```bash
npx tsc --noEmit    # check both
npm run build       # tsc -b then vite build
```
