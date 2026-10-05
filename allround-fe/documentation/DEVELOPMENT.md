# Allround — Development Documentation

A collection of small browser minigames built as a full-stack web dev
playground. This document tracks the app's evolution: original scaffold,
project history (from git), and the current UI/feature overhaul.

---

## 1. What the app is

**Allround** is a Vue 3 single-page app hosting several minigames
(Typewright, Aimlab, Quick Maths, Chimp Test), styled after the flat,
theme-driven aesthetic of typing-test sites, with a runtime theme engine
supporting 16 color themes. It is containerized with Docker (nginx) and
additionally deployable as static assets to Cloudflare via wrangler.

### Stack

| Layer     | Tech                                                        |
| --------- | ----------------------------------------------------------- |
| Framework | Vue 3 (Composition API, `<script setup>`)                   |
| Language  | TypeScript                                                  |
| Build     | Vite 7 (dev), vue-tsc + vite build (production)             |
| Styling   | Tailwind CSS v4 + scoped CSS + CSS custom properties        |
| UI kit    | reka-ui primitives (shadcn-style local components in `ui/`) |
| Icons     | lucide-vue-next                                             |
| Routing   | vue-router (history mode)                                   |
| Deploy    | Docker multi-stage (node:20-alpine → nginx:alpine), Cloudflare static assets |

---

## 2. Project history (before the current overhaul)

From the git log, in chronological order (oldest first). The project
began as the default Vite + Vue scaffold (`vue create`-era files like
`HelloWorld.vue`, Vite/Vue logos on the About page) and evolved through:

1. **Scaffold & basics** — Vite/Vue/TS app created (`9c49f68` era),
   Tailwind + shadcn-style UI components added, caret/color palette work.
2. **TS-config-based theme file** (`e578746`) — theming moved to a
   typed theme definition list applied at runtime.
3. **Monkeytype typing test** — a clone of monkeytype.com: word bank
   fetched from the monkeytype GitHub repo, time/words modes, live WPM,
   result overlay. Later fixes: caret behavior, wordbank fetched from
   the GitHub raw URL instead of a dev proxy (`a5ffe15`).
4. **Aimlab** — gridshot-style aim trainer with time/target modes
   (`261b36e`, `b3f08bf`), session stats, finish overlay.
5. **Deployment** — Dockerfile (multi-stage nginx), docker-compose
   service on host port 1000, plus wrangler.toml for Cloudflare static
   asset deployment with SPA fallback (`665b548`, `f907654`,
   `65bd175`). Restart policy later changed to `unless-stopped`
   (`ea4de46`).

---

## 3. Current overhaul (this working session)

Everything below is **uncommitted** in the working tree (per the
developer's request, no git actions were performed).

### 3.1 Typewright (renamed from Monkeytype)

- **Renamed** throughout: page, components folder
  (`components/projects/typewright/`), route (`/projects/typewright`),
  navbar/home references, localStorage keys (`typewright-*`), browser
  tab title. The word bank still comes from the monkeytypegame GitHub
  repo (data source only).
- **Sidebar toolbar** — the horizontal mode toolbar became a vertical
  rail on desktop (≥1024px): mode toggle (Hourglass/Type icons for
  time/words) above a divider, then durations (10/30/60/180) or word
  counts (1/10/25/50/100). Below 1024px it remains the horizontal pill.
- **Layout grid** — game pages use a 3-column grid
  `rail | content | equal-spacer`; the spacer counterweights the rail
  so game content centers on the true page axis. Content width is
  capped to match the Aimlab page (max-w-7xl + responsive padding), so
  the rail sits at the same x position on every game page.
- **Vertical rhythm** — title pinned at top; words anchor high
  (top-leaning, aligned with the rail); refresh button pinned to the
  bottom of the column via `margin-top: auto`. Live stats (WPM /
  countdown) appear in the free space between, so nothing shifts when
  they appear mid-run.
- **Typing box** — fixed heights replaced with `max-height` so short
  word lists shrink to fit (fixes lopsided vertical balance); the
  scrollTop line-window behavior is unchanged.
- **Wordbank fetch** — now retries up to 3 times with backoff
  (raw.githubusercontent is occasionally flaky).

### 3.2 Aimlab

- Same **sidebar rail** with mode icons (Timer/Crosshair for
  time/target) and durations/counts below; same counterweighted grid,
  top-leaning rail, lowered title.
- **Arena** capped at `min(90%, 44rem)` of the column so the topmost
  target row has breathing room below the title.

### 3.3 Quick Maths (new game)

- Double-digit addition/subtraction problems (e.g. `97 + 45`);
  subtraction never negative.
- **Question stack UI** (as specified): starts with 3 rows, grows to a
  5-row window; the active question always sits in the center row with
  a typed-answer box + blinking caret; each answered question slides up
  (answer shown), the next slides to center, a new one enters from the
  bottom; the oldest row exits through a fade at the top. Top and
  bottom rows fade via a CSS mask gradient on the stack viewport.
- Input: digits 0-9 (no leading zeros, max 3), Backspace, Enter/Space
  to submit. Wrong answers shake + flash error color and don't advance.
- Modes: time (10/30/60/120s) or fixed problem count (10/25/50/100),
  selected in the sidebar (Timer/Hash icons). Live "solved" stat and
  countdown; result overlay with solved / accuracy / wrong / per-minute.
- Own component set in `components/maths/` (Toolbar, QuestionStack,
  LiveStats, ResultOverlay); localStorage-persisted settings
  (`quickmaths-*`).

### 3.4 Chimp Test (new game)

A Human Benchmark-style working memory game:

- 8×5 grid; N numbered squares (start 4) placed on **random** cells —
  empty cells are not rendered (only numbered squares visible).
- **Memorize phase**: numbers visible until the player clicks square
  `1`; all others then hide.
- **Recall phase**: click squares in ascending order; correct clicks
  reveal their number (accent tint), wrong clicks flash red, cost a
  life, and reset the round at the same count with new positions.
- Round cleared → count +1. **Screen flash** (full-viewport accent
  tint, ~0.55s) confirms each cleared round. Lives shown as hearts
  (filled/lost); zero lives → game-over overlay (numbers reached,
  rounds cleared).
- Sidebar controls: starting count (4/6/8/10) and lives (1/3/5),
  persisted (`chimps-*`).
- Own component set in `components/chimps/` (Toolbar, ChimpBoard,
  LiveStats, ResultOverlay).

### 3.5 Home page

- **`[EFFCT]` brand title retained** — two-tone brackets, blinking
  block-caret over the E (original design, deliberately kept), with a
  small "pick your game" tagline.
- **Project cards redesigned**: data-driven from `projectList.ts`
  (name, path, description, icon); each card shows the game's icon in
  a tinted tile, centered name/description, subtle surface tint
  (4% text-color mix), 1px border. Hover: accent border + icon tint,
  2px lift, arrow reveal in the top-right corner — replacing the old
  2px hard borders and full color-invert.
- Grid is `auto-fill` — future games need only one `projectList.ts`
  entry.

### 3.6 About page

- Rewritten from the Vite/Vue default: intro paragraph, game list
  (rows reusing `projectList.ts` data), and a tech-stack chip row.
  Same hover language as the rest of the app.

### 3.7 Navigation bar

- Restyled to a quiet reference design: two-tone "Allround" wordmark,
  uppercase letter-spaced links (HOME / PROJECTS / ABOUT), ghost-pill
  Login/Sign Up buttons, circular settings icon button, no bottom
  border — instead a subtle surface tint (6% text-color mix) with
  rounded corners (floating rounded bar).
- **Dropdown hover fixed** — shared `DropdownMenuItem` highlighted
  with the shadcn `--accent` variable (mapped to the theme's color2),
  producing inconsistent solid-color highlights. Navbar usage now
  overrides with a 12% focus-color tint + matching text color.
- Mobile menu behavior unchanged; auth buttons follow the ghost-pill
  style.

### 3.8 Theme engine & contrast fixes

- **Audited all 16 themes + default palette** with a WCAG contrast
  script (text ≥ 4.5:1, headings/accents ≥ 3:1). 12 of 17 failed
  (e.g. bubblegum text 1.43:1, peachy 1.57:1, default
  black-on-dark-gray 1.93:1).
- **Corrected palettes** for carbon, blue, calsonic, deep-space, mizu,
  strawberry, vscode, botanical, taro, peachy, forest, bubblegum, and
  the `:root` defaults — each keeping its identity but readable.
- **Bubblegum** went through several iterations at the developer's
  direction: dark raspberry background with original pastels → candy
  pink background → final white-ish (`#fff5fa`) background with
  pink-raspberry text `#c94a88`, bubblegum pink headings `#e94d93`,
  teal accent `#12a186`; the developer hand-tuned the final values.
- Theme definition type gained an optional `swatch` field (brighter
  preview dots for Settings); currently unused after the hand-tuning.
- `--theme-bg` is now applied to the `:root`/html background (was
  hardcoded `#242424`), fixing a black bar visible when zoomed past
  the 100dvh app shell.

### 3.9 Cleanup

- Deleted unused empty `components/data/monkeytype.ts`.
- `components/header/Navbar.vue` is unused (dead code, not imported
  anywhere) — labels updated for consistency; candidate for deletion.

---

## 4. Architecture notes

```
allround-fe/src/
├── main.ts                  # app bootstrap; loads persisted theme
├── routes.ts                # vue-router; title = "<route> | Allround"
├── style.css                # Tailwind + theme CSS vars + shadcn tokens
├── App.vue                  # shell: TopNavBar + router-view
├── pages/
│   ├── Home.vue             # [EFFCT] title + project cards
│   ├── About.vue            # intro + games + tech chips
│   ├── Typewright.vue       # typing test (game logic lives here)
│   ├── Aimlab.vue           # aim trainer (game logic lives here)
│   ├── QuickMaths.vue       # math sprint (game logic lives here)
│   └── ChimpTest.vue        # memory game (game logic lives here)
├── views/
│   └── Settings.vue         # theme picker (swatch dots)
└── components/
    ├── header/TopNavBar.vue # app nav (Navbar.vue is dead code)
    ├── projects/
    │   ├── projectList.ts   # single source of truth for games
    │   ├── themes.ts        # 16 theme definitions + helpers
    │   ├── theme.ts         # apply/persist theme via localStorage
    │   └── typewright/      # Toolbar, GameContainer, LiveStats, ResultOverlay
    ├── aimlab/              # AimArena, Toolbar
    ├── maths/               # Toolbar, QuestionStack, LiveStats, ResultOverlay
    ├── chimps/              # Toolbar, ChimpBoard, LiveStats, ResultOverlay
    └── ui/                  # shadcn-style primitives (reka-ui)
```

**Conventions established during the overhaul**

- Game pages share a layout: page title top-center, 3-column
  counterweight grid, 4rem sidebar rail (top-leaning), refresh pinned
  bottom, `max-w-7xl`-aligned content width.
- Sidebars are vertical rails ≥1024px and horizontal pills below; mode
  toggles use lucide icons with `aria-label`/`title`.
- Theme colors flow only through `--theme-*` CSS variables; derived
  surfaces use `color-mix()` percentages of theme colors so every
  theme adapts automatically.
- Game settings persist in `localStorage` under `<game>-*` keys.
- Adding a new game = page + `components/<game>/` set + route +
  `projectList.ts` entry (icon included).

---

## 5. Deployment

- **Docker**: `docker-compose.yml` at repo root builds `allround-fe`
  and serves on host port 1000 (`restart: unless-stopped`).
- **Cloudflare**: `wrangler.toml` serves `./dist` with SPA
  `not_found_handling`.
- Dev server: `npm run dev` (Vite). Note: the served build on port
  1000 only updates when the image is rebuilt.
