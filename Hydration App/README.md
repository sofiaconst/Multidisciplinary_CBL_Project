# Hydration Scale — Website

A static multi-page website for the Hydration Scale smart coaster. Converted from the original app/prototype repo into a deployable site.

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

Open `settings.html`. A small floating **Tweaks** button appears in the bottom-right corner — click it to open the Tweaks panel and switch the *Save behavior*:

- **Per-section** (default): every settings card has its own Save button — independent save per section.
- **Single bar**: a sticky bar at the bottom collects all unsaved changes into one Save action.

The segmented toggle updates the live page instantly (React state). When running inside the design-tool host the panel also supports `__activate_edit_mode` / `__deactivate_edit_mode` postMessage events and rewrites the `EDITMODE` block in `app/settings.jsx` to persist the choice on disk.

## Running locally

This is a pure static site — no build step.

### Option 1 · Python (recommended, ships with macOS / Linux)

```bash
python3 -m http.server --bind 127.0.0.1 3000
```

Open <http://localhost:3000>.

### Option 2 · Node

```bash
npx serve .
# or:
npx http-server -p 3000
```

### Option 3 · VS Code

Install the *Live Server* extension and right-click `index.html` → *Open with Live Server*.

> The pages load React + Babel from a CDN, so you need an internet connection on first load (browser caches them after).

## Deploying to a domain

Because the site is just static HTML/JS, you can drop the entire repo on any static host:

- **Netlify** — drag-and-drop the folder onto <https://app.netlify.com/drop>, then add a custom domain in *Site settings → Domain management*.
- **Vercel** — `vercel deploy` from the repo root.
- **GitHub Pages** — push to a repo, enable Pages in *Settings → Pages*, pick the `main` branch / root, point your domain's DNS to `yourname.github.io`.
- **Cloudflare Pages** — connect the repo, *no build command*, output directory `/`.
- **Your own server (nginx)** — copy the folder to `/var/www/hydration-scale` and serve as static files.

There is no server-side code — the sign-in / sign-up are mocked client-side and just redirect to the dashboard. Wire them to a real auth backend when you're ready.

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
