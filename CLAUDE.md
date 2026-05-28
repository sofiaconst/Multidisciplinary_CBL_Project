# CLAUDE.md

Single source of truth for all Claude agents working in this repo. Read this first.

---

## Brand

**App name:** Sippy (never "Hydr8" — that name is retired)

| Token | Hex | Use |
|---|---|---|
| Primary | `#0087BD` | Buttons, accents, progress fills |
| Dark | `#005C82` | Hero panels, gradients, hover states |
| Light tint | `#E0F2FA` | Badges, soft backgrounds |
| Warm bg | `#F1EFE8` | Page background |

CSS variable names: `--teal-primary`, `--teal-dark`, `--teal-light`, `--warm-bg`, `--warm-surface`, `--warm-border`, `--warm-text`, `--warm-text-secondary`, `--warm-text-tertiary`.

**No green colors anywhere.** All of these are banned: `#1d9e75`, `#059669`, any `green-*` Tailwind classes.

### Logo files

| File | Use |
|---|---|
| `static/logo-icon.png` (SvelteKit) / `Hydration App/app/logo-icon.png` (HTML site) | Favicon, Android icon, navbar mark, small surfaces |
| `Hydration App/app/logo-wordmark.png` | Auth split-panel, landing hero, splash — full "Sippy" lockup only |

Source: `Hydration App/uploads/Sipopy new app logo.png` (icon) and `Hydration App/uploads/Sippy new main logo.png` (wordmark).

---

## This repo contains two separate apps

### 1. SvelteKit mobile app (`src/`)

**Target:** Android via Capacitor. SvelteKit builds to `build/`; Capacitor serves it as a WebView.

**Commands:**
```bash
pnpm dev        # dev server (HMR)
pnpm build      # production build → build/
pnpm check      # svelte-check type checking
pnpm lint       # biome lint
pnpm format     # biome format --write
npx cap sync android   # after pnpm build
npx cap open android   # open Android Studio
```

**Adapter:** `@sveltejs/adapter-static` with `fallback: 'index.html'` (SPA mode).

**State — singleton pattern with Svelte 5 runes:**
- `Scale` (`src/lib/scale.svelte.ts`) — sip-tracking engine, all persisted settings via `persistedState('li.beeb.hydration.v2.<key>', default)`. Read/write via `.current`.
- `Bluetooth` (`src/lib/bt.svelte.ts`) — BLE wrapper (Web Bluetooth + `@capacitor-community/bluetooth-le`). Commands: `tare`, `cal:{g}`, `led:{r},{g},{b}`, `led:off`.
- `Auth` (`src/lib/auth.svelte.ts`) — user identity, streak, persisted to localStorage.
- `History` (`src/lib/history.svelte.ts`) — session history, persisted to localStorage.

**Routing:** `+layout.svelte` initializes singletons, runs auth guard (`$effect` → `/login`). Authenticated pages wrap in app shell with `BottomNav` (Home / History / Profile / Settings).

**Scale tracking loop:** 350 ms `setInterval` in `Scale.init()`. State machine: `tracking_off → no_cup_detected → cup_settling → cup_placed → cup_lifted`. Sip fires when cup returns with weight delta > `sipThresholdG`.

**BLE protocol (ESP32):**
- Standard Weight Scale `0x181d` + Battery `0x180f` — weight notifications, battery reads
- Custom NUS control service `6e400001-...` — JSON status RX, text commands TX

**Icons:** `unplugin-icons` + `@iconify-json/mingcute`. Import: `import IconName from 'virtual:icons/mingcute/icon-name'`.

**Styling:** Tailwind v4 + DaisyUI v5 ("light" theme). CSS variables in `src/app.css`. Components use `<style>` blocks with those variables.

**Navigation — back arrows:** All non-home pages have a back button in the top-left:
```svelte
<a href="/" class="back-btn">
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2"
       stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
    <path d="M12 4L6 10l6 6"/>
  </svg>
</a>
```
CSS: `width:34px; height:34px; border-radius:10px; background:var(--teal-light); color:var(--teal-dark)`. Hover: `background:var(--teal-primary); color:#fff`.

**Routes:**
- `/` — Dashboard (hero gradient card, stat grid, sip controls)
- `/history` — Weekly bar chart + session list
- `/profile` — Avatar, streak, stats, linked scale card
- `/settings` — Goals, reminders (LED color, adaptive), calibration, sign out
- `/login` — Split: dark brand panel + form (back → `/welcome`)
- `/signup` — Split: dark brand panel + form (back → `/login`)
- `/welcome` — Onboarding splash

---

### 2. Static HTML site (`Hydration App/`)

Plain HTML + React 18 via Babel Standalone CDN. No build step.

**Run:** `npx serve -p 5273` from `Hydration App/` (or `python3 -m http.server 5273`)

**Live pages:**

| File | Screen |
|---|---|
| `index.html` | Landing — Variation A (split hero) |
| `signin.html` | Auth — Variation B (dark split panel) |
| `signup.html` | Auth — Variation B (dark split panel) |
| `dashboard.html` | Dashboard — Variation C (hero progress + stat grid) |
| `settings.html` | Settings — Variation B (scrollable, per-section save) |

**File layout:**
```
Hydration App/
├── index.html, signin.html, signup.html, dashboard.html, settings.html
├── app/
│   ├── theme.js          — color tokens (window.HS), single source of truth
│   ├── components.jsx    — Logo, PublicNavbar, AppNavbar, Footer, tealBtn, ghostBtn, Icon
│   ├── landing.jsx       — Landing A
│   ├── auth.jsx          — Auth B (SignInPage + SignUpPage) — has back arrow → index.html
│   ├── dashboard.jsx     — Dashboard C
│   ├── settings.jsx      — Settings B
│   └── tweaks-panel.jsx  — Floating tweak shell
└── uploads/              — Source logo assets (do not modify)
```

**Exploration files** (legacy, do not link from live pages, keep as reference):
- `Landing Page.html`, `Sign In and Create Account.html`, `Guest Dashboard.html`, `Logged-in Dashboard.html`, `Settings Page.html`, `History Page.html`, `Sign In and Create Account.html`
- `export/` — old snapshots, ignore

**Conventions:**
- All colors via `HS.*` from `app/theme.js` — never hardcode hex in components
- DM Sans font only (Google Fonts)
- Icons via `<Icon name="..." />` (Iconify CDN, mingcute set)
- No build pipeline — Babel Standalone in browser

---

## No automated tests

There are no test suites. Verify changes by running the dev server.
