# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # dev server (or: bun run dev --host 127.0.0.1 --port 4173)
pnpm build            # production build → build/
pnpm check            # svelte-check type checking
pnpm lint             # biome lint
pnpm format           # biome format --write
```

After `pnpm build`, sync to Android and open Android Studio:
```bash
npx cap sync android
npx cap open android
```

There are no automated tests.

## Architecture

**Target:** Android mobile app via Capacitor. The SvelteKit app is compiled to static files (`build/`) which Capacitor serves as the WebView.

**Adapter:** `@sveltejs/adapter-static` with `fallback: 'index.html'` (SPA mode). All routes are prerendered; `+layout.ts` sets `prerender = true`.

**State management — singleton pattern with Svelte 5 runes:**

All stateful logic lives in `.svelte.ts` singletons in `src/lib/`:
- `Scale` (`scale.svelte.ts`) — core sip-tracking engine. Owns all persisted settings via `persistedState(key, default)` from `svelte-persisted-state`. Initialized once via `Scale.init(bluetooth)` in the root layout, then accessed everywhere via `Scale.getInstance()`.
- `Bluetooth` (`bt.svelte.ts`) — Web Bluetooth / `@capacitor-community/bluetooth-le` wrapper. Handles BLE connection, weight notifications, battery, LED control, tare, and calibration commands.
- `Auth` (`auth.svelte.ts`) — user identity and streak tracking, persisted to localStorage.
- `History` (`history.svelte.ts`) — session history (`Session[]`), persisted to localStorage.

Persisted state pattern: `foo = persistedState('li.beeb.hydration.v2.foo', defaultValue)` — read/write via `foo.current`.

**Routing & auth guard:**

`+layout.svelte` runs `Scale.init(Bluetooth.getInstance())` and `Auth.getInstance()` at module level (runs once). A `$effect` redirects to `/login` if `auth.isLoggedIn` is false and the current path is not `/login`. The layout wraps authenticated pages in an app shell with `BottomNav` at the bottom.

**Scale tracking loop:**

`Scale.init()` sets up a `setInterval` (350 ms) via a `$effect` that reacts to `bluetooth.connected`. The loop calls `processTracking(weight, now)` which runs a state machine: `tracking_off → no_cup_detected → cup_settling → cup_placed → cup_lifted`. Sip detection happens when the cup returns after a lift and the weight delta exceeds `sipThresholdG`. Reminder pacing (`updateReminderState`) calculates next-sip timing from the hourly target and average sip size history.

**BLE protocol:**

The ESP32 firmware exposes two BLE services:
- Standard Weight Scale (`0x181d`) + Battery (`0x180f`) — weight notifications, battery reads
- Custom NUS-style control service (`6e400001-...`) — JSON status RX, text commands TX (`tare`, `cal:{g}`, `led:{r},{g},{b}`, `led:off`)

**Icons:** `unplugin-icons` with `@iconify-json/mingcute`. Import as `import IconName from 'virtual:icons/mingcute/icon-name'`.

**Styling:** Tailwind v4 + DaisyUI v5 (warm "light" theme). Custom CSS variables (`--warm-bg`, `--teal-primary`, `--amber-bg`, etc.) defined in `src/app.css`. New components use CSS variables directly in `<style>` blocks; existing components use DaisyUI utility classes.

**Event logging:** `POST /api/tracking-log` appends NDJSON to `runtime-logs/tracking.ndjson`. The layout and `ConnectStartButton` fire events for page load, errors, and BLE connection lifecycle.
