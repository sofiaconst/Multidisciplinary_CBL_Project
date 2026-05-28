# Sippy — Hydration Tracking App

A smart hydration coaster app. Sippy connects to a Bluetooth scale coaster, detects every sip automatically, and shows you real-time progress toward your daily water goal — no manual logging.

---

## Quick start

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- [pnpm](https://pnpm.io) — `npm install -g pnpm`

### Install & run

```bash
# Clone the repo, then:
pnpm install
pnpm dev
```

The terminal will print two URLs when it starts:

```
  ➜  Local:    http://localhost:5173/
  ➜  Network:  http://192.168.x.x:5173/   ← your machine's local IP
```

> **Port note:** Vite tries port `5173` first. If that port is already in use (e.g. another dev server is running), it automatically picks the next free port (`5174`, `5175`, …). Always check the terminal output for the actual port.

---

## Accessing the app

### Desktop view

Open **`http://localhost:5173/`** in any browser on your computer.

- Full sidebar navigation at the top
- Split-panel auth pages (dark left panel + form on the right)
- A **"Phone view"** link in the footer switches you to the mobile layout

### Phone view — same computer browser

Open **`http://localhost:5173/m/`** in your browser and use DevTools device emulation:

1. Press `F12` to open DevTools
2. Click the **device-toolbar icon** (📱) in the top-left of the DevTools panel, or press `Ctrl+Shift+M`
3. Select a phone preset (e.g. **iPhone 12**, **Pixel 7**) or type a custom size like `390 × 844`
4. Navigate to `http://localhost:5173/m/`

### Phone view — physical phone or tablet

Your phone and computer must be on the **same WiFi network**.

1. Find the **Network URL** printed in the terminal (e.g. `http://192.168.1.42:5173`)
2. Type that address into your phone's browser
3. Go to `/m/` for the phone-optimised layout: `http://192.168.1.42:5173/m/`

> **Permission denied?** Windows Firewall may be blocking the port. Run this in an elevated PowerShell (right-click → "Run as administrator"):
> ```powershell
> netsh advfirewall firewall add rule name="Sippy Dev" dir=in action=allow protocol=TCP localport=5173
> ```
> If the port changed (e.g. to 5174), replace `5173` with whichever port the terminal showed.

---

## App structure

| URL | What you see |
|---|---|
| `/` | Desktop dashboard |
| `/history` | Desktop history |
| `/profile` | Desktop profile |
| `/settings` | Desktop settings |
| `/login` | Sign in (split panel) |
| `/signup` | Create account (split panel) |
| `/welcome` | Landing page |
| `/m/` | **Phone dashboard** |
| `/m/history` | Phone history |
| `/m/profile` | Phone profile |
| `/m/settings` | Phone settings |
| `/m/login` | Phone sign in |
| `/m/signup` | Phone sign up |
| `/m/welcome` | Phone landing |

Both `/` and `/m/` share the same Firebase auth session and scale state — logging in on one automatically logs you in on the other.

---

## Switching between views

| From | To | How |
|---|---|---|
| Desktop | Phone view | Click **"Phone view"** link in the page footer |
| Phone | Desktop view | Tap **"Desktop"** button in the top bar |

---

## Design reference site (port 5273)

A separate static HTML site lives in `Hydration App/` — it's the visual design reference used when building the SvelteKit app. It is **not** the deliverable.

```bash
cd "Hydration App"
npm install
npm run dev     # opens at http://localhost:5273
```

---

## Building for Android

```bash
pnpm build                  # production build → build/
npx cap sync android        # sync to Android project
npx cap open android        # open Android Studio
```

Requires Android Studio and the Android SDK.

---

## Project layout

```
src/
  routes/
    +layout.svelte       Desktop shell (top navbar, footer)
    +page.svelte         Desktop dashboard
    history/             Desktop history
    profile/             Desktop profile
    settings/            Desktop settings
    login/               Sign in
    signup/              Create account
    welcome/             Landing page
    m/                   ← Phone view (all pages mirrored here)
  lib/
    auth.svelte.ts       Firebase Auth + guest mode + streak tracking
    scale.svelte.ts      Sip-detection engine (BLE + state machine)
    bt.svelte.ts         Bluetooth LE wrapper
    history.svelte.ts    Session history (Firestore + localStorage)
    firebase.ts          Firebase app config
  app.css                CSS variables + Tailwind/DaisyUI theme
  app.html               HTML shell (DM Sans font, meta tags)

static/
  logo-icon.png          Drop mark (transparent PNG)
  logo-wordmark.png      "sippy" wordmark (transparent PNG)

scripts/
  remove-bg.mjs          Regenerates transparent logos from uploads/

Hydration App/           Design reference — do not edit
TEST-REPORT.md           Security & bug audit (20 findings)
CLAUDE.md                Developer context for AI agents
```
