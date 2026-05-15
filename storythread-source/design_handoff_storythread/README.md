# Handoff: Storythread — PWA UX

## Overview
Storythread is a Progressive Web App that generates personalized bedtime stories for teens (ages 10–16). It has two distinct user surfaces in one app:

- **Parent Mode** — A tired adult at 9pm answers four short, guided questions about what happened in their teen's day. The story is generated privately and given to the teen at bedtime as a normal story. The teen never knows it was engineered around their day.
- **Teen Mode** — The teen opens the app and picks a theme from a curated menu (e.g. "left out", "someone was mean", "friend drama"). Their name and saved friend names auto-populate into the story. The teen never sees any freeform input field.

The app is **mobile-first (390px)**, **local-first** (the LLM is provided by the user via API key or local Ollama), and intentionally **not gamified** — no streaks, badges, scores, or notifications.

## About the Design Files
The files in this bundle are **design references created in HTML/JSX** — prototypes built with React inline in HTML, presented inside iOS device frames on a Figma-style pan/zoom canvas. They show intended look, layout, copy, and interaction, **not production code to ship**.

The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, SwiftUI, native iOS/Android, etc.) using its established patterns and component library. If no codebase exists yet, the recommended stack is **React + Vite + Tailwind for the PWA shell**, since this is the natural environment for a typography-heavy mobile-first installable web app. Service worker, manifest, and offline reading caching are out of scope of these mocks.

## Fidelity
**High-fidelity.** Final colors, typography (Newsreader serif + DM Sans + IBM Plex Mono), spacing, copy, and interaction patterns are pixel-deliberate. Recreate pixel-perfect using the codebase's primitives.

Two exceptions where the design is intentionally a placeholder:
- **Illustrations** in the reading view are striped/gradient placeholder zones — they need real scene-based art (school hallways, bedrooms at night, park benches). Never character portraits. Slot the real art into the `<Scene>` and `<ImmersiveScene>` regions.
- **Icons** are minimal hand-drawn paths in `tokens.jsx → Icon()`. Replace with the target codebase's icon library (Lucide, Heroicons, SF Symbols, etc.) using the same names: `moon, sparkle, chevR, chevL, plus, x, book, cog, home, heart, user, text, minus, check, eye`.

## Screens / Views

### 0. Cover poster (canvas only)
A one-pane summary on the design canvas. Not an app screen.

---

### 1. Onboarding — 3 screens

#### 1a · Welcome (`OnbWelcome`)
- **Purpose:** First impression. Sets tone.
- **Layout:** Cream background. Small amber→ember gradient app glyph top-left (56×56, 18px radius). 40px down: kicker "STORYTHREAD" (uppercase, .2em tracking). Display headline: *"A new story, just for tonight."* — "just for tonight" italic in ember. Serif body paragraph beneath. Primary button "Begin setup" pinned to bottom + secondary text button "I already have an account."
- **Copy:** Headline + body verbatim in `screens-onboarding.jsx`.
- **Interaction:** Tap "Begin setup" → 1b. No animation needed; standard route push.

#### 1b · Profile + Friends + Character (`OnbProfile`)
- **Purpose:** Capture the teen's name, friend names (up to 5), and a 2–3 sentence character sketch.
- **Layout:** Top bar = back chevron + 3-dot step progress + 34px spacer. Kicker "Step 2 of 3" + serif headline "Who is the story for?" + serif sub. Three labeled fields: name (single-line input), friends (chips + dashed "+ add" affordance), character sketch (multiline textarea-style card, 96px min height). Primary "Continue" button at bottom.
- **Edge cases:** Friend list is **capped at 5**. If user tries to add a 6th, gently push back ("That's plenty. You can always change these later."). Character sketch is optional but recommended; if blank, show a sample placeholder.

#### 1c · Story engine (`OnbLLM`)
- **Purpose:** Configure which LLM generates stories. The app does not run its own model.
- **Layout:** Cloud/Local segmented toggle. Below: Provider dropdown row (Claude Sonnet by default), API key input (masked). Below the form: a reassurance card with eye icon — "What you tell us about your teen never leaves your device." Primary "Finish setup" button.
- **Edge cases:** If "Local (Ollama)" selected, hide the API key field and show a localhost connection field (`http://localhost:11434`). Test connection on blur. Show inline error if unreachable.

---

### 2. Home (`ScreenHome`)
- **Purpose:** Two unambiguous entry points + recent stories.
- **Layout:**
  - Top bar: app glyph (left) + settings cog (right).
  - Greeting block: small day/time label + serif "Good evening."
  - **Tonight's Story card** (parent entry) — full-width, midnight gradient (`#2c3158 → #15182a`), amber moon glyph bleeding off bottom-right at 18% opacity. Kicker "FOR THE PARENT" in amber-soft, serif title "Tonight's story", small description "Four quiet questions about Iris's day. Then a story by bedtime.", and "Start ›" CTA.
  - **Make my story card** (teen entry) — cream-3 background, slightly shorter, ember sparkle glyph bleeding off bottom. Kicker "FOR IRIS", "Make my story", "Pick something that fits how the day went."
  - **Recent stories list** — 3 rows max in preview. Each row: book-spine thumbnail (amber→ember vertical gradient, 38×48px), serif title, sans subtitle (day · minutes · emotional destination), chevron.
- **Edge cases:** If there are zero recent stories, hide the entire "Recent stories" section (no empty-state copy needed — this is not a habit app, absence of history is normal).
- **Interaction:** Tap Tonight's Story → 3a. Tap Make my story → 4a. Tap a recent row → 6 (reading view) for that story.

---

### 3. Parent Mode — 4-question interview

Header pattern shared across all four:
- Back chevron (left) · 4-dot progress (center) · "Skip" link (right, ink50)
- Below: amber kicker "Question N of 4"
- Serif prompt (`PromptCard`) — 26px, line-height 1.22, letter-spacing -0.01em

#### 3a · Q1 · The moment (`ParentQ1`)
- **Prompt:** "What was the moment that stuck with you about Iris's day?"
- **Input:** Single freeform textarea card (cream-2, 1px ink-15 border, 180px min height, 16px serif body inside).
- **Reassurance line below the field** — small sans, ink50: "Whatever you write stays on this device. The story will reshape it, not repeat it."

#### 3b · Q2 · Who was there (`ParentQ2`)
- **Prompt:** "Who was around today — for better or worse?"
- **Input:** Row of friend chips (loaded from settings). Tapping a chip toggles "active" (ink-bg, cream text). The chip's name is also live-inserted as a styled inline pill inside the textarea below, so the parent can write a sentence with the names already typographically marked.
- **Textarea:** Same style as Q1 but ~140px min height.

#### 3c · Q3 · How she carried it (`ParentQ3`)
- **Prompt:** "How did she seem to be carrying it?"
- **Input:** 9 emotion chips in a flex-wrap grid. Multi-select (`Left out`, `Frustrated`, `Embarrassed`, `Quiet`, `Worried`, `Tired`, `Proud`, `Confused`, `Hurt`). Below: optional freeform note ("Anything else? Optional"). Italic serif placeholder reads "A note, a phrase she used, anything…"

#### 3d · Q4 · Emotional destination (`ParentQ4`)
- **Prompt:** "Where should the story leave her?"
- **Input:** **2-column grid of 6 destination cards.** Each card: serif title (18px) + sans description (11.5px).
  - Hopeful · "A lighter ending. Things shift."
  - Understood · "Someone sees her clearly."
  - Brave · "She steps toward, not away."
  - Confident · "Her own voice gets louder."
  - Calm · "The day quiets and softens."
  - Empowered · "She chooses what comes next."
- **Selected state:** Ink background, cream text, amber-soft check pill (18×18) top-right.
- **Single-select.** Primary button "Write her story" with sparkle icon. Sub-label "Takes about 20 seconds."
- **Interaction:** On submit → 5 (loading).

---

### 4. Teen Mode

#### 4a · Theme picker (`TeenThemes`)
- **Purpose:** Teen-facing entry to story generation.
- **Layout:** Back chevron. Kicker "For Iris · Tonight". Serif headline "What's the *story about?*" — "story about?" italic ember. Sub: "Pick whatever's closest. You can change the ending later." Then a **2-column grid of 8 cards**:

| Title | Subtitle | Mark | Hue |
|---|---|---|---|
| Left out | When no one saved you a seat. | arc | sage |
| Someone was mean | A line that didn't leave your head. | crack | ember |
| Friend drama | Things shifted and you can feel it. | knot | amber |
| Misunderstood | You meant one thing. They heard another. | echo | dusk |
| Too much noise | Your head needs the volume down. | wave | sage |
| A small win | Something good. Worth a real story. | spark | amber |
| Tomorrow looms | A thing on the calendar you're bracing for. | horizon | dusk |
| Just somewhere else | No prompt. Take me out of today. | door | ember |

- **Marks** are abstract geometric SVGs (defined in `screens-teen.jsx → Mark()`) — deliberately not childish illustrations or emoji. Render at 26×26, 1.6px stroke, hue per card.
- **CRITICAL:** No freeform input. Ever. The teen surface must not expose a text box.
- **Interaction:** Tap card → 5 (loading) with theme + saved settings as input.

---

### 5. Loading (`StoryLoading`)
- **Purpose:** Make a 15–30 second wait feel calm and inevitable instead of anxious.
- **Layout:** Midnight background. Centered "breathing dot": 120×120 radial gradient (amber-soft → ember) with a 24px inset solid amber core. Breathing animation:
  ```css
  @keyframes st-breath {
    0%,100% { transform: scale(1);    opacity: .7; }
    50%     { transform: scale(1.08); opacity:  1; }
  }
  /* 4.5s, ease-in-out, infinite */
  ```
- Kicker "WRITING" in amber-soft. Serif copy: "Lining up the streetlamps, *finding the right way in…*" Sub-copy: "This usually takes about twenty seconds. There's no need to wait — we'll let you know."
- **Edge cases:** If generation > 45s, swap the second line to "Still going. The good ones take a minute." If it fails, return to home with a soft toast — not a modal.

---

### 6. Reading view

The brief specifies **dark mode as the default for reading**. Light mode is also implemented as a user-toggleable theme.

Two layout strategies are designed, both work — choose one or expose both:

#### 6a · Typography-led (`ReadingDark` / `ReadingLight` / `ReadingWithControls`)
- **Layout:** Reads like a literary novel. Top chrome: back chevron · "STORYTHREAD" kicker (centered, .2em tracking) · type-sheet trigger (Aa icon).
- **Body:** Story title (30px serif). Chapter kicker (11.5px, .16em, ember/amber). First paragraph has a drop cap (italic ember/amber-soft, 3.3× font-size, line-height 0.88, float-left).
- **Inline scene illustration** — full-width 150px striped placeholder, every ~3 paragraphs. Real implementation slots scene art here.
- **Footer:** Page number (2-digit padded) · thin progress track filled in amber-soft/ember · total page count. Font: IBM Plex Mono 11px.
- **Type sheet (open state):** Bottom sheet (24px radius) with three sections — font size (dot selector 14/16/18/20/22), theme (Cream/Sepia/Midnight pills with color swatch + selected ring in amber-soft), font family (Newsreader / Sans toggle).

#### 6b · Immersive scene + card (`ReadingImmersiveDark` / `ReadingImmersiveLight`)
- Inspired by picture-book layouts, **adapted for teens** — moodier scene gradient, no character portrait, editorial type.
- **Layout:** Full-bleed `ImmersiveScene` background (layered gradients + soft glow + silhouetted horizon shapes + ground stripe + vignette). Top chrome is three frosted-glass pills (back · chapter label · type sheet). Bottom: a cream rounded card (22px radius) with italic ember chapter label + serif body paragraph + footer row (mono page counter + dot progress).

#### 6c · After the story (`AfterStory`)
- **Purpose:** A private check-in that replaces what a kids' app would call an "activity sheet."
- **Layout:** Midnight background. Back chevron, kicker "THE END" in amber-soft, serif "How did that land?", sub: "Just for you. No one sees this. No streaks, no scores — only a way to mark the night."
- **Three soft-card options** (single-select, no follow-up form):
  - "That felt right." → Save it
  - "Something else." → Write another (loops back into theme picker or interview, depending on which mode generated this story)
  - "Just done." → Close the book
- **Footer:** Mono kicker "NOTHING TRACKED · NOTHING SHARED". Means it. Do not write this anywhere except a local cache used to inform the next generation.

---

### 7. Settings (`ScreenSettings`)
- **Purpose:** Edit one-time setup. Never prompt the user for name/friends again after onboarding.
- **Layout:** Standard iOS-style grouped settings list on cream. Groups:
  1. **Reader profile** — Name · Age (rows with right-aligned values)
  2. **Friends** — chips grid inside the group card, with a `+ add` chip. Right side of group header shows "5 / 5".
  3. **Character sketch** — paragraph display + "Edit sketch" link (ember).
  4. **Story engine** — Provider · API key · Use local model (toggle)
  5. **Reading** — Default font size · Dark mode on open (toggle)
- **Footer:** Centered "Storythread · v0.4 · local-first".

---

## Interactions & Behavior

### Navigation
- Forward routes use a 200ms slide-in from right (standard PWA pattern).
- Back chevron always returns to the previous route. Never strands the user.
- Tab bar / bottom nav: **none.** Home is the only hub; everything else is modal-like.

### Animation policy
- Be conservative. The product is calm.
- Drop cap / first paragraph: instant. No "fade in story" — that fights the reading vibe.
- Loading breath: 4.5s loop, ease-in-out, only on the loading screen.
- Theme picker cards: 100ms scale 0.97 on tap-down. Release → route.
- Chip toggles: no animation, just instant state swap.

### Form validation
- Name in onboarding: required, 1–24 chars.
- Friend names: 1–24 chars each, no dupes, max 5.
- API key: format-validate against provider (sk-ant- for Claude, sk- for OpenAI, etc.). Never block the user with modal — show inline.

### Persistence
- All settings + recent stories live **locally only** (IndexedDB).
- Parent inputs are NEVER persisted past the moment the story is generated. The interview clears on completion.
- The teen never reads parent inputs back out, by construction.

### Responsive
- 390px is the **primary** width. Designs target this exactly.
- Up to ~430px: the same layout breathes — center the content max-width 430px.
- Above 430px (tablet/desktop): show the phone-width column centered with a soft cream background letterbox. Do **not** redesign for desktop. This is a phone app.

### Accessibility
- Body text minimum 16px in reading view (default 18px). Font size sheet goes 14→22.
- Contrast ratios: paper-D on midnight is ~10:1. Cream on midnight is fine. Amber on cream is **not** AA — use ember for amber-on-cream copy, reserve amber for backgrounds and accent ornaments.
- All chevron/icon buttons have minimum 44×44 tap targets even when the visible glyph is smaller.

---

## State Management

```
AppState {
  setup: { name, age, friends[], characterSketch, provider, apiKey, useLocal }
  history: Story[]            // recent stories, local only
  currentMode: 'parent' | 'teen' | null
  currentInterview: {         // wiped on submit
    moment, whoWasThere, emotions[], note, destination
  }
  currentTheme: ThemeKey | null
  currentStory: { title, chapters[], generatedAt }
  reader: { fontSize, theme: 'cream'|'sepia'|'midnight', fontFamily }
}
```

State transitions:
- `setup` is hydrated on app open from IndexedDB. If empty → onboarding.
- Submitting interview or theme → `generating` → on success → `currentStory` set + `history` prepended + reader open.
- After story `AfterStory` selection persists nothing except (optionally) a soft tag on the saved `Story` for "felt right" / "wanted another."

---

## Design Tokens

### Colors

```js
// Light surfaces (input flows)
cream    : #faf4e8
cream2   : #f3ead8
cream3   : #ebdfc7
ink      : #1f1b16
ink70    : #3e3830
ink50    : #76705f
ink30    : #b2aa97
ink15    : #dfd5bd

// Dark surfaces (reader, loading)
mid      : #15182a    // midnight base
mid2     : #1c2138
mid3     : #262c47
paperD   : #e9dfc9    // cream-on-dark body text
paperD70 : rgba(233,223,201,0.66)
paperD30 : rgba(233,223,201,0.32)

// Accents — sparingly
amber    : #c9924a    // primary brand accent
amberSoft: #e5b574    // amber on dark surfaces, drop caps
ember    : #a35d3a    // warmer secondary, amber-on-cream copy
sage     : #6e8579    // calm chip
dusk     : #4a4d6b    // muted blue
```

### Typography

| Family | Use | Weights | Source |
|---|---|---|---|
| Newsreader | All story body + display headlines + chapter titles | 300–700, italic too | Google Fonts |
| DM Sans | UI labels, buttons, sublabels, list values | 400 / 500 / 600 | Google Fonts |
| IBM Plex Mono | Page numbers, "nothing tracked" microcopy, kicker timestamps | 400 / 500 | Google Fonts |

**Scale:** 11, 12, 13, 15, 16, 18, 22, 26, 28, 30, 38

**Conventions:**
- **Display headlines** — Newsreader 28–38, letter-spacing -0.015em to -0.025em, line-height 1.05–1.15
- **Story body** — Newsreader 18 (default), line-height 1.65, `text-wrap: pretty`
- **Italics** carry emphasis and emotional shifts; use ember/amber-soft for italicized fragments in display lines
- **Kickers** — DM Sans 11, weight 500, letter-spacing .16–.20em, uppercase, ink50 or amber-soft
- **Body UI** — DM Sans 14.5–15
- **Microcopy** — IBM Plex Mono 10–11, letter-spacing .12–.16em

### Spacing scale
`4 · 8 · 12 · 16 · 22 · 28 · 36 · 48` — use these only; no arbitrary numbers.

### Corner radii
| Token | Value | Use |
|---|---|---|
| xs | 6px | inputs (single-line) |
| sm | 10px | chips |
| md | 14px | fields, settings rows |
| lg | 18px | feature cards |
| xl | 22px | bottom sheets, reading cards |

### Elevation
- `flat` — `0 1px 3px rgba(0,0,0,0.06)`
- `card` — `0 8px 24px rgba(0,0,0,0.08)`
- `sheet` — `0 30px 60px rgba(0,0,0,0.18)` (light) / `0 30px 80px rgba(0,0,0,0.5)` (dark)

---

## Assets

- **Fonts:** Newsreader, DM Sans, IBM Plex Mono — Google Fonts, free.
- **Icons:** placeholders defined in `tokens.jsx`. Replace with target codebase's icon library on implementation. Names used: `moon, sparkle, chevR, chevL, plus, x, book, cog, home, heart, user, text, minus, check, eye`.
- **Illustrations:** Scene-based placeholders only. Final implementation needs real art for:
  - Reading view inline scene illustrations (full-width, ~150–200px)
  - Immersive reading full-bleed scenes
  - Suggested subjects: school hallway at end of day, bedroom by lamplight, park bench, kitchen at dinner, bus seat, locker bay. Never character portraits — let the teen imagine themselves.
- **No emoji.** No mascots. No badges.

---

## Files

The design lives in:

```
Storythread Design.html       # Entry — assembles the canvas
design-canvas.jsx             # Pan/zoom canvas wrapper (presentation only)
ios-frame.jsx                 # iPhone device frame (presentation only)
tokens.jsx                    # Colors, fonts, Icon, Pill, Chip, Input, Scene, helpers
screens-onboarding.jsx        # Welcome, Profile, LLM
screens-home.jsx              # Home + Settings
screens-parent.jsx            # 4-question interview
screens-teen.jsx              # Theme picker + Loading
screens-reading.jsx           # Typography-led reading (dark / light / type sheet)
screens-reading-v2.jsx        # Immersive reading + After-the-story
screens-system.jsx            # Design system foundation cards (presentation only)
```

The `design-canvas.jsx`, `ios-frame.jsx`, and `screens-system.jsx` files are **canvas presentation chrome** — they exist only to display the designs side-by-side. Do not port them; they have no place in the shipped app.

---

## The 3 Principles to Never Break

1. **The story is the product.** Every UI choice defers to the reading experience. If a feature would compete with the prose for attention, it doesn't belong on the page.
2. **Quiet, not clinical.** No streaks, badges, notifications, or scores. No therapy framing, no clinical language. Warmth comes from typography, restraint, and copy that sounds like a person.
3. **The teen never knows it was engineered.** Parent inputs leave no trace in the teen-facing surface. Stories arrive plainly. Reflection is private, never shared back upstream.
