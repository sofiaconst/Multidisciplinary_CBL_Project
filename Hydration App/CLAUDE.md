# CLAUDE.md — Sippy project instructions

Persistent context for any Claude (terminal / Claude Code / Anthropic Console) working in this repo. Read me first.

## What this project is

A static multi-page website for **Sippy**, a smart hydration coaster. No build step, no framework install — plain HTML + React (loaded from CDN via Babel Standalone). Runs on any static host or `python3 -m http.server`.

## Brand assets

| File | Use case |
| --- | --- |
| `app/logo-icon.png` | App icon — favicon, mobile app icon, splash screens, the small mark next to the wordmark in the navbar |
| `app/logo-wordmark.png` | Full "sippy" lockup (drop-with-smile as the 's') — used wherever the brand needs to feel like the marketing identity: auth split-panel header, footer hero, splash pages |

Rules:
- The **standalone icon** is what shows in the OS / browser tab / phone home screen. Don't put the wordmark in a favicon — too small to read.
- The **wordmark** is reserved for surfaces that introduce the brand (auth, landing hero, splash). Don't repeat it inside the app chrome where the small navbar mark is enough.
- Don't recolor the brand assets. If you need a dark-mode variant, the `<Logo dark>` prop inverts the wordmark via CSS filter — use that instead of editing the PNG.

## Brand

| Token | Hex | Where it's used |
| --- | --- | --- |
| `teal` (primary) | **`#0087BD`** | Buttons, accents, brand wordmark |
| `tealDark` | `#005C82` | Dark hero panel (auth split), hero gradient |
| `tealLight` | `#E0F2FA` | Badges, soft backgrounds |
| `tealMid` | `#7FC3DE` | Borders, highlights |
| `tealText` | `#004566` | Text on light-blue backgrounds |
| Background | `#F1EFE8` | Page background (warm off-white) |
| Body text | `#2C2C2A` | Primary text |
| Secondary text | `#5F5E5A` | Subdued text |

**All colors come from `app/theme.js`.** Don't hardcode hex values in components — read `HS.teal`, `HS.tealDark`, etc.

**Typography**: DM Sans (loaded from Google Fonts). 400 / 500 / 600 weights only.

## Live pages (the deployed website)

These are the **only** pages served by the site. Every other `.html` / `.jsx` at the repo root or under `export/` is legacy design-exploration material — **do not load it from the live pages**.

| URL | File | Variation chosen | Notes |
| --- | --- | --- | --- |
| `/` | `index.html` | **Landing — Variation A** (split hero) | Hero image on the right, CTAs on the left. Three feature cards below. |
| `/signin.html` | `signin.html` | **Auth — Variation B** (dark split panel) | Dark `#005C82` panel left with marketing list, white form right. |
| `/signup.html` | `signup.html` | **Auth — Variation B** (dark split panel) | Same shell as sign in. Includes password strength bar. |
| `/dashboard.html` | `dashboard.html` | **Logged-in — Variation C** (hero progress + stat grid) | Big % progress card with blue gradient, 4 stat tiles, reminder + scale cards. |
| `/settings.html` | `settings.html` | **Settings — Variation B** (scrollable, all sections) | All settings on one scrollable page. **Tweak**: `saveMode` toggles between *per-section save* (each card has its own Save button, the default) and *sticky single save bar* at the bottom. |

When the user asks for **"variation A/B/C"** of a screen, the canonical reference is the exploration file in the repo root with the same screen name (`Landing Page.html`, `Sign In and Create Account.html`, `Logged-in Dashboard.html`, `Settings Page.html`). Those files render all variations side-by-side on a design canvas; the chosen one is listed in the table above.

## File layout

```
.
├── index.html              # landing entry
├── signin.html             # sign in entry
├── signup.html             # create account entry
├── dashboard.html          # logged-in dashboard entry
├── settings.html           # settings entry
├── app/
│   ├── theme.js            # color tokens — single source of truth
│   ├── components.jsx      # Logo, PublicNavbar, AppNavbar, Footer, button styles, Icon
│   ├── landing.jsx         # Landing A page component
│   ├── auth.jsx            # Auth B (SignInPage + SignUpPage)
│   ├── dashboard.jsx       # Logged-in C
│   ├── settings.jsx        # Settings B + per-section save tweak
│   └── tweaks-panel.jsx    # Floating tweak shell (host protocol + form controls)
├── README.md               # user-facing readme (run / deploy)
└── CLAUDE.md               # this file
```

**Exploration files** (legacy, do not load from live site, useful as reference for unbuilt screens):
- `Landing Page.html`, `Sign In and Create Account.html`, `Guest Dashboard.html`, `Logged-in Dashboard.html`, `Settings Page.html`, `History Page.html` — each wraps the matching `*-variations.jsx` / `*-page.jsx` / `*-dashboard.jsx` file in a `DesignCanvas` to compare A/B/C side-by-side.
- `design-canvas.jsx` — the design-canvas shell used by those exploration files only.
- `export/` — bundled standalone snapshots from before the website conversion. Out of date; ignore.

## How to add a new page

1. Pick the variation from the matching exploration file (e.g. for History, use `History Page.html` → choose A, B, or C). If the user hasn't specified one yet, **ask** before writing code.
2. Create `app/<page>.jsx` with the page component. Reuse `AppNavbar`, `Footer`, `tealBtn`, `ghostBtn`, `Icon`, `Logo` from `app/components.jsx`. Read all colors from `HS` (imported via `window.HS` in `app/theme.js`).
3. Create `<page>.html` at the repo root — copy the structure from any existing entry (e.g. `dashboard.html`). Include the React CDN scripts, then `app/theme.js`, then `app/components.jsx`, then your new JSX, then a `ReactDOM.createRoot` render call.
4. Add the page to the navbar in `app/components.jsx` (`PublicNavbar` for guest pages, `AppNavbar` for logged-in pages).
5. Cross-link from existing pages with plain `<a href="<page>.html">` — no client-side router.

## How to add a Tweak

We use the floating Tweaks panel in `app/tweaks-panel.jsx`. Pattern:

```jsx
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "myKnob": "small" }/*EDITMODE-END*/;

function MyPage() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <>
      <div style={{ fontSize: t.myKnob === 'small' ? 14 : 18 }}>...</div>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakRadio
            label="Size"
            value={t.myKnob}
            options={[{ value: 'small', label: 'Small' }, { value: 'large', label: 'Large' }]}
            onChange={(v) => setTweak('myKnob', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
```

The `EDITMODE` block must be valid JSON. There must be exactly one per HTML entry's root JS file. The host rewrites it on disk when the user changes a knob.

## Conventions

- **HTML at root, JSX in `app/`.** Never put a page JSX next to its HTML at root — keep the entry HTML thin and the component in `app/`.
- **No build step.** All JSX runs through Babel Standalone in the browser. Don't add bundler/TypeScript/Vite/etc. without an explicit request.
- **No emojis in UI.** Use `mingcute` icons via the existing `<Icon name="..." />` (Iconify CDN).
- **No new fonts.** DM Sans only.
- **No new color palettes.** If a new accent is genuinely needed, add it to `app/theme.js` and reference it through `HS`.
- **Reuse, don't duplicate.** Before writing a new card / button / pill, check `app/components.jsx` and the existing page JSXs for the pattern.
- **Validation in forms.** Match the pattern in `app/auth.jsx`: controlled inputs, inline error banner, fake-async submit redirect.

## Running

```bash
# from repo root
npm install
npm run dev
# open http://localhost:5173
```

Vite serves each HTML entry as its own page route (multi-page setup in `vite.config.js`). React + Babel still load from CDN — Vite doesn't transpile the JSX itself, the browser does. That keeps the project no-build at the component level: edit `app/*.jsx`, refresh, see changes immediately.

For a production build: `npm run build` writes to `dist/`. Deploy that anywhere static.

## Out of scope unless asked

- Real auth backend / API
- Mobile-specific layouts (the live website is desktop-first; mobile variations exist in `*-variations.jsx` exploration files but are not wired into the live pages)
- PWA / offline / service worker
- Build pipeline
- E2E tests
