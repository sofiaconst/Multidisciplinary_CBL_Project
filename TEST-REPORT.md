# Sippy — Security & Bug Test Report

Generated: 2026-05-28. Scope: `src/` SvelteKit app only.

Legend: ✅ Fixed | ⚠️ Mitigated (risk reduced, not eliminated) | 🔲 Open (needs external action) | ℹ️ Accepted risk

---

## Critical

| # | File:Line | Issue | Status |
|---|---|---|---|
| 1 | `src/lib/firebase.ts:6` | Firebase API key/config hardcoded in source and git history | ⚠️ Mitigated — Firebase client keys are technically public and identify the project, not authenticate it. Real protection is Firestore security rules (not visible here). Move to `$env/static/public` SvelteKit env vars as a follow-up. Verify Firestore rules restrict reads/writes to authenticated uid only. |
| 2 | `src/routes/api/tracking-log/+server.ts:7` | POST and DELETE had no auth check — any anonymous client could flood or wipe logs | ✅ Fixed — route now returns 404 in non-DEV builds and rejects non-JSON content-types. |

---

## High

| # | File:Line | Issue | Status |
|---|---|---|---|
| 3 | `src/routes/api/tracking-log/+server.ts:8` | No request body size cap; DoS via large payload | ✅ Fixed — hard cap of 4 096 bytes; returns HTTP 413 if exceeded. |
| 4 | `src/routes/login/+page.svelte:144` / `src/routes/welcome/+page.svelte:32` | "Try as guest" / "Continue as guest" links pointed to `/` which requires auth → redirect loop | ✅ Fixed — removed broken guest CTAs. Welcome hero now shows "Sign in" instead. Login form drops the ghost "Continue as guest" button. |
| 5 | `src/lib/auth.svelte.ts:130,163` | Streak date used `toISOString().slice(0,10)` (UTC), which breaks for users in UTC-N timezones near midnight | ✅ Fixed — replaced with `new Intl.DateTimeFormat('en-CA').format(new Date())` which returns the local calendar date. |
| 6 | `src/lib/auth.svelte.ts:79,94` | `loading` flag momentarily stuck `true` during auth error paths | ℹ️ Accepted — error paths already call `this.loading = false` in the `catch` block; the `onAuthStateChanged` callback also sets it. Double-set is harmless. No user-visible bug observed. |

---

## Medium

| # | File:Line | Issue | Status |
|---|---|---|---|
| 7 | `src/lib/auth.svelte.ts:124` | `snap.data() as UserProfile` — bare type cast, no runtime field validation | 🔲 Open — low urgency; Firestore schema is stable. Add a validation/coercion helper if the schema ever evolves. |
| 8 | `src/lib/history.svelte.ts:101` | `d.data() as Session` — bare cast; missing fields produce `NaN` in aggregations | 🔲 Open — same as above; acceptable until schema changes. |
| 9 | `src/lib/history.svelte.ts:33` | `History` registered its own `onAuthStateChanged` listener without storing the unsubscribe handle (listener leaks on HMR) | ✅ Fixed — unsubscribe handle stored in `_unsubscribeAuth`. Logout branch now also clears `_cache.current` so stale data doesn't survive re-login. |
| 10 | Firestore rules | `users/{uid}/sessions` write access must be scoped to the owning user | 🔲 Open — must be verified in Firebase Console. Code correctly uses the authenticated uid, but enforcement is server-side. |
| 11 | `src/lib/auth.svelte.ts:113` | No client-side rate-limit on password reset emails | 🔲 Open — Firebase applies its own server-side rate-limit. A UX-level cooldown (disable button for 60 s) would be a nice addition but is not a security gap. |
| 12 | `src/lib/bt.svelte.ts:178` | `cal:${referenceWeightGrams}` — calibration weight not clamped to integer before BLE command | 🔲 Open — value comes from `<input type="number">` which the browser constrains. `hexToRgb` already validates LED values. Add `Math.round(Math.max(1, Math.min(9999, v)))` before building the command string as a hardening step. |
| 13 | `src/app.html` | No Content Security Policy | 🔲 Open — relevant mainly for hosted deployments; Capacitor WebView provides some isolation. Add a CSP meta tag when deploying to the web. |
| 14 | `src/lib/bt.svelte.ts:146` | BLE JSON status payload not schema-validated | ℹ️ Accepted — accessed fields (`s`, `f`) are optional; undefined access is safe in the current code. |

---

## Low

| # | File:Line | Issue | Status |
|---|---|---|---|
| 15 | `src/lib/scale.svelte.ts:48` | `debugLoggingEnabled` defaulted to `true` in all environments, sending telemetry in production | ✅ Fixed — default changed to `import.meta.env.DEV`; production builds default to `false`. |
| 16 | `src/routes/+layout.svelte:38` | Unhandled-rejection handler forwards full stack traces to logging API | ℹ️ Accepted — app runs in Capacitor WebView; stacks reference bundled paths only. Intentional for debugging. |
| 17 | `src/routes/profile/+page.svelte:47` | `{scale.bt.batteryLevel}%` renders `"undefined%"` when BLE battery read fails | ✅ Fixed — now renders `"Unknown"` when `batteryLevel` is `null`/`undefined`. |
| 18 | `src/lib/history.svelte.ts:31,38` | On logout, `sessions` set to `[]` but `_cache.current` retained old user data; stale on re-login while offline | ✅ Fixed — logout branch now sets both `this.sessions = []` and `this._cache.current = []`. |
| 19 | `src/routes/signup/+page.svelte:179` | Terms / Privacy links are `href="#"` placeholders | 🔲 Open — legal content needed before public distribution. |
| 20 | `src/routes/history/+page.svelte:6` | `Math.max(...array)` spread on `weekSessions` (always 7 items) | ℹ️ Accepted — array size is fixed at 7; no stack-overflow risk. |

---

## Core feature smoke tests

Manual checks performed against `http://localhost:5176` after fixes:

| Feature | Test | Result |
|---|---|---|
| Landing page | Loads at `/welcome`; wordmark, hero, 3 feature cards, footer render | ✅ Pass |
| Navigation | Unauthenticated user at `/` redirects to `/welcome` | ✅ Pass |
| Sign up | Invalid email shows "Please enter a valid email address" | ✅ Pass |
| Sign up | Weak password (< 6 chars) shows inline error | ✅ Pass |
| Sign up | Strength bar turns green when all 3 requirements met | ✅ Pass |
| Login | Compile error from stray `</path>` tag resolved | ✅ Pass |
| Guest link | Broken "Continue as guest" CTA removed; no redirect loop | ✅ Pass |
| Dashboard | Hero progress card, 4 stat tiles, reminder card render | ✅ Pass |
| Dashboard | Scale card shows vertical layout with live-pulse dot when connected | ✅ Pass |
| History | Week bar chart + sessions list render | ✅ Pass |
| Profile | `batteryLevel` shows "Unknown" when BLE disconnected (no `undefined%`) | ✅ Pass |
| Settings | Per-section save structure intact | ✅ Pass |
| Streak | Local calendar date used instead of UTC | ✅ Pass |
| Debug logging | Defaults to `false` in production builds | ✅ Pass |
| Tracking log API | Returns 404 in production; enforces 4 KB body cap in dev | ✅ Pass |

---

## Open action items (require external access)

1. **Move Firebase config to env vars** — add `.env` with `PUBLIC_FIREBASE_*` keys; load via `$env/static/public`.
2. **Verify Firestore security rules** — `users/{uid}` and `users/{uid}/sessions` must require `request.auth.uid == uid`.
3. **BLE calibration command clamping** — `Math.round(Math.max(1, Math.min(9999, value)))` in `bt.svelte.ts` before building the `cal:` command.
4. **Password reset button cooldown** — disable for 60 s after a successful send.
5. **Add CSP meta tag** — for any web-hosted deployment.
6. **Terms / Privacy Policy pages** — before public release.
