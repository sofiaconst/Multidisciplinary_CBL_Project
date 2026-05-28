# Sippy — Website

A static multi-page website for the Sippy smart coaster. Converted from the original app/prototype repo into a deployable site.

## Pages

| Path             | Screen                                  | Variation used |
| ---------------- | --------------------------------------- | -------------- |
| `index.html`     | Landing / Home                          | **A** · Split hero |
| `signin.html`    | Sign in                                 | **B** · Split panel |
| `signup.html`    | Create account                          | **B** · Split panel |
| `dashboard.html` | Logged-in dashboard                     | **C** · Card grid w/ hero progress |
| `settings.html`  | Settings (scrollable + per-section save) | **B** · Scrollable |

Pages cross-link with real `<a href>` navigation — clicking *Create account* on the landing page goes to `signup.html`, signing in lands on `dashboard.html`, etc. The sign-in / sign-up forms include real validation and a fake submit that redirects to the dashboard.

## Brand color

Primary color is **`#0087BD`** (deep sky blue), with derived dark / light / mid variants defined in `app/theme.js`. Change it there to re-skin everything in one place.

```js
// app/theme.js
teal:      '#0087BD',  // primary
tealDark:  '#005C82',  // headers, hero gradient, auth panel
tealLight: '#E0F2FA',  // backgrounds, badges
tealMid:   '#7FC3DE',  // borders
tealText:  '#004566',  // accessible text on light blue
```

## Tweaks

Open `settings.html`, toggle **Tweaks** in the toolbar, and you'll see the *Save behavior* segmented control:

- **Per-section** (default): every settings card has its own Save button — independent save per area.
- **Single bar**: a sticky bar at the bottom that batches *all* unsaved changes into one Save action.

The tweak persists to disk by rewriting the `EDITMODE` block in `app/settings.jsx`.

## Installation

Follow these steps to set up and run the app:

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Open the project folder.

```bash
cd sippy
```

3. Install dependencies.

```bash
npm install
```

If the project uses pnpm instead, run:

```bash
pnpm install
```

## Run Locally

Start the local development server:

```bash
npm run dev
```

If that does not work, try:

```bash
pnpm dev
```

Open the local URL shown in the terminal. Usually it is:

```
http://localhost:5173
```

Keep the terminal open while using the app.

## Stop the Local Server

In the terminal where the server is running, press `Ctrl + C`.

## Production build

```bash
npm run build
npm run preview
```

The static output is written to `dist/` and can be deployed to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, nginx, etc.).

## File layout

```
.
├── index.html              # landing
├── signin.html             # sign in
├── signup.html             # create account
├── dashboard.html          # logged-in dashboard
├── settings.html           # settings + tweak
├── app/
│   ├── theme.js            # shared color tokens
│   ├── components.jsx      # navbar, footer, icons, button styles
│   ├── landing.jsx         # Landing A
│   ├── auth.jsx            # Auth B (sign in + create account)
│   ├── dashboard.jsx       # Logged-in C
│   ├── settings.jsx        # Settings B + per-section save
│   └── tweaks-panel.jsx    # Tweaks shell (host protocol + form controls)
└── README.md
```

The legacy design-canvas exploration files (`landing-variations.jsx`, `auth-variations.jsx`, etc.) are still in the repo root if you want to reference other variations later — they're not loaded by any of the website pages.
