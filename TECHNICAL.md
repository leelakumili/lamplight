# Lamplight — Technical Reference

## Architecture overview

Lamplight is a React SPA served by a lightweight Hono server. The server handles three things: PIN authentication, proxying AI API calls (adding server-side credentials), and serving the built client files. The client never sees an API key.

```
Her phone (browser)
       │
       │  HTTP over home Wi-Fi
       ▼
  Hono server  (your laptop, port 3000)
  ├── GET /login          → PIN screen HTML
  ├── POST /login         → validates PIN, sets session cookie
  ├── POST /logout        → clears session
  ├── GET /health         → { ok: true }
  ├── /api/proxy/*        → forwards to Anthropic / OpenAI / Ollama
  │                         (injects API keys from .env)
  └── /*                  → serves dist/ (React SPA)

  React SPA (runs in browser)
  ├── All AI calls → /api/proxy/*  (never direct to provider)
  ├── Story/settings storage → IndexedDB (device-local)
  └── Auth state → lamplight_session cookie (httpOnly)
```

---

## Authentication

PIN auth uses a timing-safe comparison (`crypto.timingSafeEqual`) to prevent timing attacks. On success the server mints a 32-byte random hex token, stores it in an in-memory `Set`, and sets it as an `httpOnly` `SameSite=Lax` cookie with a 1-year max-age.

The auth middleware runs on every request except `/login`, `/logout`, and `/health`. Browser requests without a valid session cookie are redirected to `/login`. API requests return `401`.

Sessions are in-memory — they clear when the server restarts. This is intentional: the family is on a home network, restarting is rare, and it avoids any session store complexity.

---

## Proxy layer

`server/routes/proxy.ts` exposes four endpoints:

| Endpoint | Forwards to |
|---|---|
| `POST /api/proxy/anthropic` | `https://api.anthropic.com/v1/messages` |
| `POST /api/proxy/openai/chat` | `https://api.openai.com/v1/chat/completions` |
| `POST /api/proxy/openai/images` | `https://api.openai.com/v1/images/generations` |
| `POST /api/proxy/openai/moderations` | `https://api.openai.com/v1/moderations` |
| `ALL /api/proxy/ollama/*` | `$OLLAMA_BASE_URL` + path suffix |

The server adds the `Authorization` / `x-api-key` header. The client sends only the request body. If a key is not configured in `.env`, the endpoint returns `503` rather than leaking a missing-key error.

---

## State machine

`App.tsx` uses a single `useReducer` with a discriminated-union action type. The reducer's `default` branch is typed as `never` — TypeScript enforces exhaustiveness at compile time, so adding a new action without a case is a build error.

Screen navigation is a string enum (`Screen` type in `types.ts`). There is no router library — the screen key is part of the reducer state, and `App.tsx` renders the matching component with a `switch`.

---

## Client data flow

```
useReducer (AppState)
    │
    ├── screen         → which component renders
    ├── setup          → user config (name, provider, ollamaModel, etc.)
    ├── interview      → parent Q&A answers (cleared after story generates)
    ├── history        → Story[] (mirrored to IndexedDB)
    ├── currentStory   → Story being read
    └── profiles       → Profile[] (multi-profile support)
```

IndexedDB (via `idb`) stores `setup`, `history`, and `profiles`. Reads happen once on app mount; writes happen on every relevant action via `useEffect`.

---

## Story generation

`src/lib/generateStory.ts` runs up to 3 attempts:

1. Build the prompt (`src/lib/prompt.ts`) from the active profile + interview answers or theme.
2. Call the LLM via `/api/proxy/*`.
3. Run a content safety check (`src/lib/safety.ts`) on the raw response.
4. Parse the response into `{ title, content }`.
5. Validate the title is a complete phrase (`isTitleComplete`). If not, ask the LLM for a title-only repair pass.

If all 3 attempts fail the safety check, throw. If the title is still incomplete after attempt 3, fall back to `generateTitleOnly` which sends only the opening sentence and asks for a 2–5 word title.

---

## Illustration generation

`src/lib/illustration.ts` runs in the background after the story reaches the reading screen — it never blocks story delivery.

- **Claude provider** → `POST /api/proxy/anthropic` — generates an SVG description, renders as inline SVG
- **OpenAI provider** → `POST /api/proxy/openai/images` — returns a data URL image

An `AbortController` with a 30-second timeout (`ILLUSTRATION_TIMEOUT_MS`) cancels the request if it takes too long. A `historyIdsRef` guard in `App.tsx` prevents writing an illustration to a story that was deleted while it was generating.

---

## Content safety

`src/lib/safety.ts` provides two modes:

- **Cloud providers** — calls `/api/proxy/openai/moderations` to run OpenAI's moderation API on the generated story text
- **Local (Ollama)** — uses a short heuristic word-list check (no external call)

`SafetyResult` is a discriminated union:
```typescript
type SafetyResult = { safe: true } | { safe: false; flagged: string[] }
```

---

## Theming

Four app themes (`cream`, `sepia`, `midnight`, `editorial`) are applied via a `data-theme` attribute on `<html>`. All colours are CSS custom properties (`var(--token)`). The reader has its own independent theme (cream / sepia / midnight) applied via a second set of CSS vars (`--reader-sepia-bg`, etc.) so the reader theme can differ from the app theme.

---

## Development proxy

In `npm run dev`, Vite proxies these paths to the Hono server on port 3000:

```
/api     → http://localhost:3000
/login   → http://localhost:3000
/logout  → http://localhost:3000
/health  → http://localhost:3000
```

This means the dev client at `localhost:5173` behaves identically to production — same auth flow, same proxy endpoints.

---

## Key dependencies

| Package | Role |
|---|---|
| `react` + `react-dom` | UI |
| `hono` | Server framework |
| `@hono/node-server` | Node.js adapter for Hono |
| `dotenv` | `.env` loading |
| `idb` | IndexedDB wrapper |
| `vite` | Build tool + dev server |
| `tsx` | TypeScript server runner (dev + production) |
| `concurrently` | Runs Vite + Hono together in dev |

---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `APP_PIN` | Yes | — | PIN to access the app |
| `PORT` | No | `3000` | Server port |
| `ANTHROPIC_API_KEY` | If using Claude | — | Anthropic API key |
| `OPENAI_API_KEY` | If using OpenAI | — | OpenAI API key |
| `OLLAMA_BASE_URL` | If using Ollama | `http://localhost:11434` | Ollama server URL |

Only set the keys for the provider you use. Unused keys can be omitted from `.env`.

---

## TypeScript configuration

Two `tsconfig` files:

- `tsconfig.json` — client (Vite, `bundler` module resolution, `DOM` lib, `jsx: react-jsx`)
- `server/tsconfig.json` — server (`NodeNext` module resolution, `node` types, no JSX)

Run `npx tsc --noEmit` to check both. The build script (`npm run build`) runs `tsc -b` (project references) before Vite.
