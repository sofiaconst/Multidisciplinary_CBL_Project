# Sippy — Apply these changes prompt for Claude Code

Paste the prompt below into Claude Code (running in this repo's root) to bring an older clone of the project up to the current state. The repo already contains everything Claude Code needs — this file is just the human-readable instruction.

---

> Read `CLAUDE.md` to understand the project. Then verify that the following are all true; fix anything that isn't:
>
> **1. Brand name is "Sippy" everywhere.**
> Search the repo for any lingering "Hydration Scale", "Hydr8", or "Sipply" strings. They should all read "Sippy". Update titles, footers, copy, page meta, and the `Logo` component's wordmark text.
>
> **2. Brand color is `#0087BD`.**
> Source of truth is `app/theme.js`. All other places that hardcode color (favicon SVGs, pulse animation rgba in each HTML head, exploration files) must match.
> - `teal` (primary) `#0087BD`
> - `tealDark` `#005C82`
> - `tealLight` `#E0F2FA`
> - `tealMid` `#7FC3DE`
> - `tealText` `#004566`
>
> **3. Real logo assets are used.**
> Two PNGs live in `app/`:
> - `app/logo-icon.png` — drop-with-smile in a rounded square. Used as: favicon (every HTML entry's `<link rel="icon">` and `<link rel="apple-touch-icon">`), the small mark in `PublicNavbar` / `AppNavbar` (via the default `<Logo>` component).
> - `app/logo-wordmark.png` — the full "sippy" wordmark. Used as: the dark auth split-panel header (via `<Logo wordmarkOnly dark>`). Use it anywhere else the brand identity should feel marketing-grade (splash screens, hero of marketing pages).
>
> Do NOT recolor or re-render either logo. If a dark-mode wordmark is needed, the `<Logo dark wordmarkOnly>` prop inverts it via CSS filter — use that.
>
> **4. Five live pages with the chosen variations.**
> | URL | File | Variation |
> | --- | --- | --- |
> | `/` | `index.html` | Landing — **A** (split hero) |
> | `/signin.html` | `signin.html` | Auth — **B** (dark split panel) |
> | `/signup.html` | `signup.html` | Auth — **B** (dark split panel, with password strength bar) |
> | `/dashboard.html` | `dashboard.html` | Logged-in — **C** (hero progress + stat grid) |
> | `/settings.html` | `settings.html` | Settings — **B** (scrollable, all sections). Includes a Tweak `saveMode` that toggles between per-section save (default) and a single sticky save bar. |
>
> Each `.html` at root is a thin entry that loads `app/theme.js`, `app/components.jsx`, the page's JSX, and renders the corresponding `<Landing>` / `<SignInPage>` / `<SignUpPage>` / `<Dashboard>` / `<Settings>` component. Cross-page navigation uses plain `<a href>` (no client-side router).
>
> **5. Conventions.**
> - Plain HTML + React via Babel CDN — no build step, no `package.json`, no TypeScript.
> - HTML entries at repo root; JSX components in `app/`.
> - All colors read from `HS` (the global exported by `app/theme.js`). No hardcoded hex inside components.
> - Typography: **DM Sans** (Google Fonts), weights 400 / 500 / 600 only. No other fonts.
> - No emojis in UI. Use `<Icon name="..." />` (mingcute via Iconify CDN).
> - Mocked sign-in/sign-up — validates inline, redirects to `dashboard.html` on submit.
> - Tweaks panel uses `app/tweaks-panel.jsx` and the `EDITMODE-BEGIN`/`EDITMODE-END` JSON marker pattern.
>
> **6. Runs locally with Vite.**
> `npm install`, then `npm run dev` — opens at <http://localhost:5173>. `npm run build` writes a production build to `dist/`. `vite.config.js` declares the multi-page input (index, signin, signup, dashboard, settings). React + Babel still load from CDN inside each HTML; Vite doesn't process the JSX — the browser does. No `package.json` dependencies on React itself.
>
> When you've verified or fixed each item, summarize what was already correct vs. what you changed.

---

After Claude Code finishes, run `npm install && npm run dev` and open <http://localhost:5173>.
