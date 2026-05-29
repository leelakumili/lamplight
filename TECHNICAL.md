# Lamplight — Technical Reference

## Architecture

Lamplight is a React SPA served by a Hono server. The server does three things: PIN auth, AI proxy (injecting credentials), and static file serving. **The browser never holds an API key.**

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "tertiaryColor": "#2e2218", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "clusterBkg": "#2e2218", "titleColor": "#e9dfc9", "edgeLabelBackground": "#2a201a", "fontFamily": "ui-serif, Georgia, serif"}}}%%
graph LR
    A["📱 Her phone\nBrowser / React SPA"] -->|WiFi| B["💻 Your laptop :3000\nHono Server"]
    B --> C["🟣 Anthropic\nClaude API"]
    B --> D["🟢 OpenAI\nGPT-4o"]
    B --> E["🔵 Ollama\nLocal model"]
    B -->|"IndexedDB\nstories"| A

    style A fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style B fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
    style C fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style D fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style E fill:#2a201a,stroke:#7c5c38,color:#c9a96e
```

---

## Request flow

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
sequenceDiagram
    participant B as Browser
    participant H as Hono Server
    participant O as Ollama / AI

    B->>H: POST /api/proxy/ollama { model, messages }
    H->>O: POST /api/chat + stream:true
    O-->>H: NDJSON token stream
    H-->>B: stream pass-through
    Note over B: onProgress counts words,<br/>updates ring (0 → 100%)
```

---

## Authentication

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
flowchart TD
    A[User visits app] --> B{Valid session\ncookie?}
    B -->|No| C["/login\nPIN prompt"]
    B -->|Yes| D[App served normally]
    C -->|POST /login| E["timingSafeEqual(pin)\nrandomBytes(32) token"]
    E --> F[Set httpOnly cookie\nSameSite=Lax]
    F --> D

    style A fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style B fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
    style C fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style D fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style E fill:#3a2c1e,stroke:#7c5c38,color:#c9a96e
    style F fill:#2a201a,stroke:#7c5c38,color:#c9a96e
```

**Cookie:** `lamplight_session`, `httpOnly`, `SameSite=Lax`, 1-year max-age  
Sessions live in memory — cleared on server restart (intentional, home network)  
API requests without session → `401`; browser requests → redirect to `/login`

---

## AI Proxy endpoints

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
graph LR
    subgraph proxy["  /api/proxy/*  "]
        A["POST /anthropic"] --> B["api.anthropic.com\n/v1/messages"]
        C["POST /openai/chat"] --> D["api.openai.com\n/v1/chat/completions"]
        E["POST /openai/images"] --> F["api.openai.com\n/v1/images/..."]
        G["POST /openai/moderations"] --> H["api.openai.com\n/v1/moderations"]
        I["ALL /ollama/*"] --> J["$OLLAMA_BASE_URL\n+ path suffix"]
    end

    style proxy fill:#2e2218,stroke:#c9a96e,color:#e9dfc9
    style A fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style B fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style C fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style D fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style E fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style F fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style G fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style H fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style I fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style J fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
```

Missing key → `503` (not a key leak). Client sends only the request body.

---

## Story generation pipeline

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
flowchart TD
    A["Parent fills interview"] --> C
    B["Teen picks theme"] --> C
    C["Build prompt\nprompt.ts"] --> D
    D["Call LLM\n/api/proxy/*\nup to 3 attempts"] --> E
    E{"Safety\ncheck"} -->|unsafe| D
    E -->|safe| F{"Title\nvalid?"}
    F -->|bad, attempt < 3| D
    F -->|bad, 3 attempts exhausted| G["Title repair\nfirst sentence only\n→ 2–5 word title"]
    F -->|good| H["✓ Story ready"]
    G --> H

    style A fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style B fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style C fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
    style D fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
    style E fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style F fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style G fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style H fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
```

---

## Streaming progress (Ollama)

When `useLocal` is true, story generation uses `stream: true` so the Loading screen can show real progress.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
sequenceDiagram
    participant C as Client
    participant P as Proxy
    participant O as Ollama

    C->>P: POST /api/proxy/ollama { stream:true }
    P->>O: POST /api/chat { stream:true }
    loop NDJSON token chunks
        O-->>P: { message: { content: "..." } }
        P-->>C: chunk passed through
        Note over C: count words / targetWords<br/>→ onProgress(ratio)<br/>→ ring fills
    end
    O-->>P: { done: true }
    P-->>C: final chunk
    Note over C: ring reaches 100%
```

---

## Illustration pipeline

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
flowchart TD
    A["Story appears on screen\n(user reads immediately)"] --> B
    B["Background task\nAbortController 30s"] --> C{Provider?}
    C -->|Claude| D["SVG prompt\n→ inline SVG"]
    C -->|OpenAI| E["DALL-E prompt\n→ data URL"]
    D --> F
    E --> F{"Story still\nexists?"}
    F -->|deleted mid-gen| G["Discard"]
    F -->|yes| H["Save to IndexedDB\n→ appears in reader"]

    style A fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style B fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
    style C fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style D fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style E fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style F fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style G fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style H fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
```

---

## Client state machine

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
stateDiagram-v2
    [*] --> onb-welcome
    onb-welcome --> onb-profile
    onb-profile --> onb-llm
    onb-llm --> home
    home --> parent-q1
    home --> teen-themes
    home --> settings
    parent-q1 --> parent-q2
    parent-q2 --> parent-q3
    parent-q3 --> parent-q4
    parent-q4 --> loading
    teen-themes --> loading
    loading --> reading
    reading --> after-story
    after-story --> home
    after-story --> loading
    settings --> home
```

State is a string union (`Screen` type). No router library — the `screen` key drives a `switch` in `App.tsx`.

---

## Post-story reflection

After finishing a story the `after-story` screen runs a two-phase flow:

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
flowchart TD
    A["after-story screen\n(Phase 1)"] --> B{"Reflection\nalready set?"}
    B -->|no — new story| C["Show 3 reflection cards\n felt-right / felt-okay / didnt-fit"]
    B -->|yes — revisiting| E
    C --> D["Tap saves reflection\nto IndexedDB immediately"]
    D --> E["Phase 2: action cards\n Save · One more · Good night"]
    E --> F["Home or regenerate"]

    style A fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style B fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
    style C fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style D fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style E fill:#3a2c1e,stroke:#c9a96e,color:#e9dfc9
    style F fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
```

`Story.reflection` is an optional `'felt-right' | 'felt-okay' | 'didnt-fit'` field. It is persisted to IndexedDB on tap — before any navigation — so a fast swipe-away still records it.

---

## Read-aloud voice selection

Read-aloud supports two modes: **ElevenLabs** (cloud, higher quality) and **Web Speech API** (on-device, no key required). Both are implemented in `src/lib/tts.ts`.

### ElevenLabs voices (Bella & Lily)

Routed through a server-side proxy at `/api/proxy/elevenlabs/tts` so the API key is never exposed to the browser. Requires `ELEVENLABS_API_KEY` in `.env`.

| Voice | ElevenLabs voice ID | Character |
|---|---|---|
| Bella | `EXAVITQu4vr4xnSDxMaL` | Warm & friendly |
| Lily | `pFZP5JQG7iQjIQuC4Bku` | Bright & lively |

Uses `eleven_turbo_v2` model (low latency). Audio is streamed as `audio/mpeg`, played via `HTMLAudioElement`. Pause/resume is handled via `audio.pause()` / `audio.play()`.

### Web Speech API voices (Soft & Deep, on-device fallback)

**The Chrome/Android empty-voices bug:** `speechSynthesis.getVoices()` returns `[]` on the first call in Chrome until the `voiceschanged` event fires. `getVoicesReady()` handles this with a one-time listener.

**Voice priority order (woman / Soft persona):**

| Priority | Voice name | Platform |
|---|---|---|
| 1 | Ava (Enhanced) | macOS / iOS |
| 2 | Samantha (Enhanced) | macOS / iOS |
| 3 | Samantha | macOS / iOS |
| 4 | Microsoft Aria Online | Windows |
| 5 | Microsoft Jenny Online | Windows |
| 6 | Google UK English Female | Android Chrome |

Man / Deep persona follows the same pattern with Daniel / Tom / Fred / Microsoft Guy.

**Bedtime pacing settings:**

| Parameter | Value | vs. browser default |
|---|---|---|
| `rate` | `0.78` | Slower — more soothing |
| `pitch` | `0.92` | Slightly lower — warmer |
| `volume` | `0.90` | Slightly pulled back |

Voice persona (woman / man) is session-only state in `Reading.tsx` — not persisted.

---

## Theming system

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
graph TD
    subgraph app["App themes (4)"]
        A1[cream — warm parchment]
        A2[sepia — editorial brown]
        A3[midnight — deep dark]
        A4[editorial — structured]
    end
    subgraph reader["Reader themes (3)"]
        R1[cream — light]
        R2[sepia — dark warm]
        R3[midnight — pure dark]
    end
    app --> AT["data-theme on html\n→ var(--bg), var(--ink)\nvar(--accent), etc."]
    reader --> RT["CSS vars scoped to\n.reader element\nApplied independently"]

    style app fill:#2e2218,stroke:#c9a96e,color:#e9dfc9
    style reader fill:#2e2218,stroke:#7c5c38,color:#c9a96e
    style AT fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style RT fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style A1 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style A2 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style A3 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style A4 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style R1 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style R2 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style R3 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
```

---

## Dev vs production

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#2a201a", "primaryTextColor": "#e9dfc9", "primaryBorderColor": "#c9a96e", "lineColor": "#c9a96e", "secondaryColor": "#1a1512", "background": "#1a1512", "mainBkg": "#2a201a", "nodeBorder": "#c9a96e", "fontFamily": "ui-serif, Georgia, serif"}}}%%
graph LR
    subgraph dev["npm run dev"]
        V["Vite :5173"] -->|proxy /api, /login| HH["Hono :3000"]
    end
    subgraph prod["npm start"]
        HP["Hono :3000"]
        HP --- S1["serves dist/"]
        HP --- S2["/api/proxy/*"]
        HP --- S3["PIN auth"]
    end
    prod --> L1["localhost:3000\n(you)"]
    prod --> L2["lamplight.local:3000\n(family on WiFi)"]

    style dev fill:#2e2218,stroke:#c9a96e,color:#e9dfc9
    style prod fill:#2e2218,stroke:#7c5c38,color:#c9a96e
    style V fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style HH fill:#2a201a,stroke:#c9a96e,color:#e9dfc9
    style HP fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style S1 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style S2 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style S3 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style L1 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
    style L2 fill:#2a201a,stroke:#7c5c38,color:#c9a96e
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
| `ELEVENLABS_API_KEY` | If using Bella/Lily voices | — | ElevenLabs TTS — free tier at elevenlabs.io |

Only set keys for the providers you use. Others can be omitted.

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
