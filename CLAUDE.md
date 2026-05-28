# CLAUDE.md

Single source of truth for all Claude agents working in this repo. Read this first.

---

## Two servers — do not confuse them

| Server | Command | Port | What it is |
|---|---|---|---|
| SvelteKit app | `pnpm dev` (in repo root) | **5175** | The real app. All Svelte edits show here. |
| Static HTML site | `cd "Hydration App" && npm run dev` | **5273** | Design reference only. Read it; don't edit it. |

Changes to `.svelte` files **never** affect port 5273, and vice versa.

---

## Viewing the app on a phone

Open Chrome DevTools (`F12`) → device-toolbar icon (top-left) or `Ctrl+Shift+M`. Pick "iPhone 12" or type a custom size (e.g. `390 × 844`). The SvelteKit app at `http://localhost:5176` reflows immediately.

To test on a real Android device:
```bash
pnpm build && npx cap sync android && npx cap open android
```
(Requires Android Studio.)

---

## Default target

**All code changes go to `src/` only.**
Do not edit files under `Hydration App/` unless explicitly asked — it is read-only design reference.

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

**No green anywhere** (UI accent). Exception: password-strength "Strong" indicator uses `#16a34a` — that is intentional and not a brand color.

**Font:** DM Sans only (Google Fonts, weights 400/500/600/700). Loaded in `src/app.html`.

### Logo files

Both PNGs have **transparent backgrounds** — no white or beige box. Do not add `border-radius` in CSS.

| File | Use |
|---|---|
| `static/logo-icon.png` | Navbar drop mark (28 px), welcome splash, favicons |
| `static/logo-wordmark.png` | Auth split-panel dark header — `filter: brightness(0) invert(1)` makes it white |
| `Hydration App/app/logo-icon.png` | Mirror for the static site |
| `Hydration App/app/logo-wordmark.png` | Mirror for the static site |

**Source originals (never edit):**

| File | What it is |
|---|---|
| `Hydration App/uploads/Sipopy new app logo.png` | App icon source |
| `Hydration App/uploads/Sippy new main logo.png` | Wordmark source |

**Regenerate transparent PNGs** after uploading new logo assets:
```bash
node scripts/remove-bg.mjs
```

---

## SvelteKit app (`src/`)

**Target:** Android via Capacitor. SvelteKit builds to `build/`; Capacitor serves it as a WebView.

**Commands:**
```bash
pnpm dev          # HMR dev server → http://localhost:5175
pnpm build        # production build → build/
pnpm check        # svelte-check type checking
pnpm lint         # biome lint
pnpm format       # biome format --write
```

**Adapter:** `@sveltejs/adapter-static` with `fallback: 'index.html'` (SPA mode).

### Routes

| Route | Page | Notes |
|---|---|---|
| `/welcome` | Landing — centered hero, feature cards, footer | Public. "Continue as guest" signs in anonymously. |
| `/login` | Sign in — 50/50 split panel (dark left, form right) | Public. `novalidate` + JS validation. Guest button. |
| `/signup` | Create account — same split panel + password strength bar | Public. `novalidate` + full inline validation. |
| `/` | Dashboard — hero %, 4-col stat grid, reminder + scale cards | Auth-gated. |
| `/history` | Weekly bar chart + session list | Auth-gated. |
| `/profile` | Avatar, streak, stat cards, linked scale info | Auth-gated. |
| `/settings` | Goals, reminders, scale, account — per-section save | Auth-gated. Max-width 920px. |

### Layout & navigation

Shell lives in `src/routes/+layout.svelte`. Unauthenticated visits to auth-gated routes redirect to `/welcome`.

**Top navbar:** 64 px sticky, three zones: Logo mark + "Sippy" wordmark | Nav tabs with teal underline on active | ConnectionPill + AvatarPill.

**Footer:** rendered inside `.app-content` on all authenticated pages — `© 2026 Sippy · Built by the Sippy team · v1.0`.

### Auth (`src/lib/auth.svelte.ts`)

Firebase Auth + Firestore profile. Singleton: `Auth.getInstance()`.

| Method / getter | What it does |
|---|---|
| `login(email, password)` | `signInWithEmailAndPassword`. Maps Firebase error codes to user-friendly messages. |
| `register(email, password)` | `createUserWithEmailAndPassword`. |
| `signInAsGuest()` | `signInAnonymously`. Creates a local-only Guest profile — no Firestore write. |
| `logout()` | Signs out, clears profile cache. |
| `deleteAccount()` | `deleteUser(currentUser)`. Clears cache. Redirects caller to `/welcome`. |
| `sendPasswordReset(email)` | Sends Firebase password-reset email. |
| `isLoggedIn` | `true` for both real and anonymous users. |
| `isAnonymous` | `true` for guest (anonymous) sessions. |
| `streakDays` | Day-streak count from Firestore profile. Uses **local calendar date** (`Intl.DateTimeFormat('en-CA')`), not UTC. |

**Profile fields:** `name`, `email`, `avatarInitials`, `streakDays`, `lastActiveDate`.
Anonymous users get `name: 'Guest', avatarInitials: 'GU', streakDays: 0`.

### Form validation rules

All auth forms use `novalidate` to suppress browser-native popups. JS validates on submit:

**Login:**
1. Empty email → "Please enter your email address."
2. Invalid format → "Please enter a valid email address."
3. Empty password → "Please enter your password."
4. Firebase `INVALID_CREDENTIALS` → error box with sign-up link.

**Signup:**
1. Empty / invalid email → message shown.
2. Empty / short password → message shown.
3. Not all 3 strength reqs met → "Your password does not meet all the requirements yet."
4. Confirm empty or mismatched → inline "Passwords do not match." below the confirm field (live).
5. Firebase `EMAIL_IN_USE` → error box with sign-in link.

**Password strength bar** (signup): 4-segment bar, red → amber → green (`#16a34a`). Three reqs: 6+ chars, uppercase, special symbol.

### Settings page (`/settings`)

Five sections, each with its own **per-section save block** (dashed border top, amber "Unsaved changes" / teal "Saved" status, Discard + Save buttons):

| Section | Controls |
|---|---|
| Goals | NumberStepper for daily target (100 ml step) and hourly target (10 ml step) |
| Reminders | Adaptive toggle + LED color (6 swatches, hex text input with live preview, "Add hex" button, "Test LED") |
| Scale | Reference weight input + Tare / Calibrate buttons + collapsible advanced thresholds + debug toggle |
| Account | Sign out button + Delete account (2-step confirm → Firebase `deleteUser`) |

### Scale (`src/lib/scale.svelte.ts`)

Sip-tracking engine. All settings persisted via `persistedState('li.beeb.hydration.v2.<key>', default)`.

- **Debug logging** defaults to `import.meta.env.DEV` (off in production builds).
- **State machine:** `tracking_off → no_cup_detected → cup_settling → cup_placed → cup_lifted`
- **Sip fires** when cup returns with weight delta > `sipThresholdG`.
- **Loop:** 350 ms `setInterval` in `Scale.init()`.

### History (`src/lib/history.svelte.ts`)

Session history persisted to localStorage + Firestore (`users/{uid}/sessions`). On logout, both in-memory state and localStorage cache are cleared to prevent data leaking to the next user.

### BLE (`src/lib/bt.svelte.ts`)

Web Bluetooth + `@capacitor-community/bluetooth-le`. Commands: `tare`, `cal:{g}`, `led:{r},{g},{b}`, `led:off`. Calibration weight clamped to `Math.round(Math.max(1, Math.min(9999, value)))` before building the command string.

**Protocol (ESP32):**
- Weight Scale service `0x181d` + Battery `0x180f`
- Custom NUS control service `6e400001-...` — JSON status RX, text TX

**Icons:** `unplugin-icons` + `@iconify-json/mingcute`. Import: `import IconName from 'virtual:icons/mingcute/icon-name'`.

**Styling:** Tailwind v4 + DaisyUI v5 ("light" theme overridden). CSS variables in `src/app.css`. Components use scoped `<style>` blocks — no hardcoded hex.

---

## Security & bug status

See `TEST-REPORT.md` in the repo root for the full audit (20 findings). Summary of open items requiring external action:

1. **Firebase config in source** — move to `$env/static/public` SvelteKit env vars; verify Firestore rules restrict `users/{uid}` to the owning user.
2. **Firestore rules** — ensure `users/{uid}/sessions` write requires `request.auth.uid == uid`.
3. **Password reset rate-limit** — add a 60 s client-side cooldown after a successful send.
4. **CSP header/meta** — add before any web-hosted deployment.
5. **Terms / Privacy Policy pages** — required before public distribution.

---

## Static HTML site (`Hydration App/`) — design reference only

Plain HTML + React 18 via Babel CDN. No build step.

**Run:** `cd "Hydration App" && npm run dev` → `http://localhost:5273`

**Live pages:** `index.html` (landing), `signin.html`, `signup.html`, `dashboard.html`, `settings.html`

**Key design files:**
- `app/theme.js` — color tokens (`window.HS`)
- `app/components.jsx` — `AppNavbar`, `AvatarPill`, `ConnectionPill`, `Logo`
- `app/dashboard.jsx` — hero card, stat grid, reminder + scale card layout
- `app/settings.jsx` — per-section save, NumberStepper, LED swatches, Toggle

---

## No automated tests

Verify changes by running `pnpm dev` and opening `http://localhost:5175` (or the port shown in terminal output).
