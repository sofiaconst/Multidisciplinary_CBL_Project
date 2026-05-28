# CLAUDE.md

Single source of truth for all Claude agents working in this repo. Read this first.

---

## Two servers — do not confuse them

| Server | Command | Port | What it is |
|---|---|---|---|
| SvelteKit app | `pnpm dev` (in `hydration-scale-app/`) | **5175** | The real app. All Svelte edits show here. |
| Static HTML site | `cd "Hydration App" && npm run dev` | **5273** | Design reference. Vite serves the 5-page static site. |

Changes to `.svelte` files **never** affect port 5273, and vice versa. The Hydration App folder is the visual reference; the SvelteKit `src/` folder is the deliverable.

---

## Viewing the app on a phone

Open Chrome DevTools (`F12`), click the device-toolbar icon (top-left of DevTools panel), or press `Ctrl+Shift+M`. Select a preset like "iPhone 12" or type a custom size (e.g. `390 × 844`). The SvelteKit app at `http://localhost:5176` reflows to that viewport immediately.

To test on a real Android device: `pnpm build && npx cap sync android && npx cap open android` (requires Android Studio).

## Default target

All code changes go to the SvelteKit app (`src/`) only.
Do not edit files under `Hydration App/` unless explicitly asked.
`Hydration App/` is read-only design reference.

---

## Brand

**App name:** Sippy (never "Hydr8" — that name is retired)

| Token | Hex | CSS variable | Use |
|---|---|---|---|
| Primary | `#0087BD` | `--teal-primary` | Buttons, accents, progress fills |
| Dark | `#005C82` | `--teal-dark` | Hero panels, gradients, hover states |
| Mid tint | `#7FC3DE` | `--teal-mid` | Connected pill border, highlights |
| Light tint | `#E0F2FA` | `--teal-light` | Badges, soft backgrounds |
| Text on light blue | `#004566` | `--teal-text` | Accessible text on teal-light surfaces |
| Warm bg | `#F1EFE8` | `--warm-bg` | Page background |
| Surface | `#FFFFFF` | `--warm-surface` | Cards, navbar |
| Border | `#D3D1C7` | `--warm-border` | Card/input borders |
| Text primary | `#2C2C2A` | `--warm-text` | Body text |
| Text secondary | `#5F5E5A` | `--warm-text-secondary` | Labels, descriptions |
| Text tertiary | `#888780` | `--warm-text-tertiary` | Hints, stat sub-labels |
| Amber bg | `#FAEEDA` | `--amber-bg` | Reminder alert background |
| Amber border | `#FAC775` | `--amber-border` | Reminder alert border |
| Amber text | `#854F0B` | `--amber-text` | Reminder alert text |

**No green anywhere.** Banned: `#1d9e75`, `#059669`, any `green-*` Tailwind class.

**Font:** DM Sans only (Google Fonts, weights 400/500/600/700). Loaded in `src/app.html`.

### Logo files

Both logo PNGs have **transparent backgrounds** (no white or beige box). Do not add `border-radius` in CSS — there is no rounded-square container to clip.

| File | Use |
|---|---|
| `static/logo-icon.png` | Navbar mark (28 px drop mark), welcome splash, favicons |
| `static/logo-wordmark.png` | Auth split-panel dark header — rendered with `filter: brightness(0) invert(1)` to appear white on teal |
| `Hydration App/app/logo-icon.png` | Mirror of `static/logo-icon.png` for the static site |
| `Hydration App/app/logo-wordmark.png` | Mirror of `static/logo-wordmark.png` for the static site |

**Source originals** (never edit these, they're inputs to the processing script):

| Upload file | What it is |
|---|---|
| `Hydration App/uploads/Sipopy new app logo.png` | App icon source (drop mark in rounded square) |
| `Hydration App/uploads/Sippy new main logo.png` | Wordmark source ("sippy" text, white bg) |

**To regenerate transparent PNGs** (e.g. after uploading new logo assets):
```bash
node scripts/remove-bg.mjs
```
The script reads from uploads, strips backgrounds (saturation-cut for the icon, white-matte for the wordmark), and writes to both `static/` and `Hydration App/app/`.

---

## SvelteKit app (`src/`)

**Target:** Android via Capacitor. SvelteKit builds to `build/`; Capacitor serves it as a WebView.

**Commands:**
```bash
pnpm dev               # dev server with HMR → http://localhost:5175
pnpm build             # production build → build/
pnpm check             # svelte-check type checking
pnpm lint              # biome lint
pnpm format            # biome format --write
npx cap sync android   # after pnpm build — syncs to Android project
npx cap open android   # open Android Studio
```

**Adapter:** `@sveltejs/adapter-static` with `fallback: 'index.html'` (SPA mode).

### Layout and navigation

The app shell lives in `src/routes/+layout.svelte`. Authenticated pages render inside a sticky top navbar + scrollable content area — **no BottomNav** (removed).

**Top navbar (`app-nav`):** 64px, sticky, `--warm-surface` background, `0.5px solid --warm-border` bottom border. Three zones:
- **Left:** Logo mark (`static/logo-icon.png`, 28px, radius 7px) + "Sippy" wordmark (15px, weight 700)
- **Center:** Nav tabs with active tab underline (2px `--teal-primary`, `bottom: -22px`)
- **Right:** ConnectionPill + AvatarPill

**ConnectionPill:** When offline — surface bg, `--warm-border` border, `--warm-text-tertiary` dot. When connected — `--teal-light` bg, `0.5px solid --teal-mid` border, `--teal-text` text, animated `--teal-primary` dot.

**AvatarPill:** Pill-shaped `<a href="/profile">`, height 36, padding `0 12px 0 4px`, border-radius 20px, `0.5px solid --warm-border`, `--warm-surface` bg. Contains a 28px circle (initials, `--teal-light` bg, `--teal-text` color, font-size 11, weight 600) + name text (13px, weight 500, `--warm-text`).

**Auth page back arrows** (login/signup only — not on main app pages):
```svelte
<a href="/welcome" class="back-link">
  <svg viewBox="0 0 20 20" ...><path d="M12 4L6 10l6 6"/></svg>
  Back
</a>
```

### Routes

| Route | Page | Max-width |
|---|---|---|
| `/` | Dashboard — hero gradient, 4-col stat grid, reminder + scale cards | 1180px |
| `/history` | Weekly bar chart + session list | 1180px |
| `/profile` | Avatar, streak, stat cards, linked scale info | 1180px |
| `/settings` | Goals, reminders, calibration, sign out | **920px** |
| `/login` | Dark brand panel + sign-in form | full width |
| `/signup` | Dark brand panel + create account form | full width |
| `/welcome` | Onboarding splash (logo + Sign in / Create account CTAs) | full width |

### State — singleton pattern with Svelte 5 runes

- `Scale` (`src/lib/scale.svelte.ts`) — sip-tracking engine. All persisted settings via `persistedState('li.beeb.hydration.v2.<key>', default)`. Read/write via `.current`.
- `Bluetooth` (`src/lib/bt.svelte.ts`) — BLE wrapper (Web Bluetooth + `@capacitor-community/bluetooth-le`). Commands: `tare`, `cal:{g}`, `led:{r},{g},{b}`, `led:off`.
- `Auth` (`src/lib/auth.svelte.ts`) — Firebase Auth + Firestore profile, streak tracking.
- `History` (`src/lib/history.svelte.ts`) — session history, persisted to localStorage.

**Scale tracking loop:** 350 ms `setInterval` in `Scale.init()`. State machine: `tracking_off → no_cup_detected → cup_settling → cup_placed → cup_lifted`. Sip fires when cup returns with weight delta > `sipThresholdG`.

**BLE protocol (ESP32):**
- Standard Weight Scale `0x181d` + Battery `0x180f` — weight notifications, battery reads
- Custom NUS control service `6e400001-...` — JSON status RX, text commands TX

**Icons:** `unplugin-icons` + `@iconify-json/mingcute`. Import: `import IconName from 'virtual:icons/mingcute/icon-name'`.

**Styling:** Tailwind v4 + DaisyUI v5 ("light" theme overridden). CSS variables defined in `src/app.css`. All components use scoped `<style>` blocks with those variables — no hardcoded hex.

---

## Static HTML site (`Hydration App/`) — design reference only

Plain HTML + React 18 via Babel Standalone CDN. No build step. **Do not port features here; use it only to read design intent and copy visual specs into Svelte.**

**Run:** `npx serve -p 5273` (from repo root, serves `Hydration App/` folder)

**Live pages:**

| File | Screen |
|---|---|
| `index.html` | Landing — split hero |
| `signin.html` | Auth — dark split panel |
| `signup.html` | Auth — dark split panel |
| `dashboard.html` | Dashboard — hero progress + stat grid |
| `settings.html` | Settings — scrollable, per-section save |

**Key files to read when matching design:**
- `app/theme.js` — all color tokens (`window.HS`)
- `app/components.jsx` — `AppNavbar`, `AvatarPill`, `ConnectionPill`, `StreakPill`, `Logo`
- `app/dashboard.jsx` — hero card, stat grid, reminder card layout
- `app/settings.jsx` — form layout, card structure, max-width 920

**Conventions:** Colors via `HS.*` — never hardcode hex. DM Sans only. Icons via `<Icon name="..." />` (Iconify CDN, mingcute set).

---

## No automated tests

There are no test suites. Verify changes by running `pnpm dev` and opening `http://localhost:5175`.
