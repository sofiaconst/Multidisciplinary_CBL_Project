<script lang="ts">
import '../app.css'
import { Bluetooth } from '$lib/bt.svelte'
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import { demo } from '$lib/demo.svelte'
import DemoPanel from '$lib/DemoPanel.svelte'
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/state'

const { children } = $props()

Scale.init(Bluetooth.getInstance())
const auth = Auth.getInstance()
const scale = Scale.getInstance()

const sessionId = browser ? `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` : 'server'

const logClientEvent = async (type: string, payload: Record<string, unknown> = {}) => {
	if (!browser) return
	try {
		void fetch('/api/tracking-log', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ type, source: 'client', sessionId, ...payload }),
			keepalive: true,
		})
	} catch (err) {
		console.error('client log failed', err)
	}
}

if (browser) {
	void logClientEvent('page_loaded', { href: window.location.href, userAgent: navigator.userAgent })
	window.addEventListener('error', (e) => {
		void logClientEvent('window_error', { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno })
	})
	window.addEventListener('unhandledrejection', (e) => {
		const reason = e.reason instanceof Error ? { message: e.reason.message, stack: e.reason.stack } : { value: String(e.reason) }
		void logClientEvent('unhandled_rejection', reason)
	})
}

const isPublicPage = $derived(
	page.url.pathname === '/login' ||
	page.url.pathname === '/signup' ||
	page.url.pathname === '/welcome'
)

// All /m/* routes are handled entirely by src/routes/m/+layout.svelte
const isMobilePage = $derived(page.url.pathname.startsWith('/m'))

$effect(() => {
	if (!auth.loading && !auth.isLoggedIn && !isPublicPage && !isMobilePage) {
		void goto('/welcome')
	}
})

const navTabs = [
	{ label: 'Dashboard', href: '/' },
	{ label: 'History', href: '/history' },
	{ label: 'Profile', href: '/profile' },
	{ label: 'Settings', href: '/settings' },
]
</script>

{#if isPublicPage || isMobilePage}
	{@render children()}
{:else if auth.loading || !auth.isLoggedIn}
	<div class="splash">
		<div class="splash-dot"></div>
	</div>
{:else}
	{#if demo.panelOpen}<DemoPanel />{/if}

	<div class="app-shell">
		<!-- Background rings — fixed to viewport, visible on all authenticated pages -->
		<svg class="bg-ring bg-ring-a" style="top:-150px;right:-120px;" width="380" height="380" viewBox="0 0 380 380" fill="none" aria-hidden="true">
			<circle cx="190" cy="190" r="22"  stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="190" cy="190" r="44"  stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="190" cy="190" r="66"  stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="190" cy="190" r="88"  stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="190" cy="190" r="110" stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="190" cy="190" r="132" stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="190" cy="190" r="154" stroke="var(--teal-primary)" stroke-width="3"/>
		</svg>
		<svg class="bg-ring bg-ring-b" style="bottom:0;left:0;" width="600" height="600" viewBox="0 0 600 600" fill="none" aria-hidden="true">
			<circle cx="0" cy="600" r="180" stroke="var(--teal-primary)" stroke-width="2.5"/>
			<circle cx="0" cy="600" r="215" stroke="var(--teal-primary)" stroke-width="2.5"/>
			<circle cx="0" cy="600" r="250" stroke="var(--teal-primary)" stroke-width="2.5"/>
			<circle cx="0" cy="600" r="285" stroke="var(--teal-primary)" stroke-width="2.5"/>
			<circle cx="0" cy="600" r="320" stroke="var(--teal-primary)" stroke-width="2.5"/>
			<circle cx="0" cy="600" r="355" stroke="var(--teal-primary)" stroke-width="2.5"/>
			<circle cx="0" cy="600" r="390" stroke="var(--teal-primary)" stroke-width="2.5"/>
		</svg>
		<svg class="bg-ring bg-ring-c" style="bottom:0;right:0;" width="600" height="600" viewBox="0 0 600 600" fill="none" aria-hidden="true">
			<circle cx="600" cy="600" r="130" stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="600" cy="600" r="195" stroke="var(--teal-primary)" stroke-width="3"/>
			<circle cx="600" cy="600" r="260" stroke="var(--teal-primary)" stroke-width="3"/>
		</svg>
		<!-- Snap-exact navbar -->
		<nav class="app-nav">
			<a href="/" class="nav-brand">
				<img src="/logo-icon.png" alt="Sippy" class="nav-logo" />
				<span class="nav-name">Sippy</span>
			</a>
			<div class="nav-tabs">
				{#each navTabs as tab}
					<a
						href={tab.href}
						class="nav-tab"
						class:nav-tab-active={page.url.pathname === tab.href}
					>{tab.label}</a>
				{/each}
			</div>
			<div class="nav-right">
				<div class="conn-pill" class:conn-pill-on={scale.bt.connected}>
					<span class="conn-dot"></span>
					{scale.bt.connected ? 'Scale connected' : 'Scale offline'}
				</div>
				<a href="/profile" class="avatar-pill">
					<span class="avatar-circle">
						{#if auth.user?.avatarImageUrl}
							<img src={auth.user.avatarImageUrl} alt="" class="avatar-circle-img" />
						{:else}
							{auth.user?.avatarInitials ?? '?'}
						{/if}
					</span>
					<span class="avatar-name">{auth.user?.name ?? ''}</span>
				</a>
			</div>
		</nav>
		<div class="app-content">
			{@render children()}
			<footer class="app-footer">
				<span>© 2026 Sippy</span>
				<span>Built by the Sippy team · v1.0</span>
				{#if demo.active}
					<button class="demo-active-btn" onclick={() => demo.panelOpen = true}>DEMO ON</button>
				{:else}
					<button class="demo-idle-btn" onclick={() => { demo.active = true; demo.panelOpen = true }}>Test mode</button>
				{/if}
			</footer>
		</div>
	</div>
{/if}

<style>
.app-shell {
	display: flex;
	flex-direction: column;
	min-height: 100dvh;
	background: var(--warm-bg);
}

/* ── Navbar ── */
.app-nav {
	height: 64px;
	background: var(--warm-surface);
	border-bottom: 0.5px solid var(--warm-border);
	display: flex;
	align-items: center;
	padding: 0 32px;
	gap: 32px;
	position: sticky;
	top: 0;
	z-index: 20;
	flex-shrink: 0;
}

.nav-brand {
	display: flex;
	align-items: center;
	gap: 10px;
	text-decoration: none;
	flex-shrink: 0;
}

.nav-logo {
	width: 28px;
	height: 28px;
	object-fit: contain;
}

.nav-name {
	font-size: 15px;
	font-weight: 700;
	color: var(--warm-text);
	letter-spacing: -0.2px;
}

.nav-tabs {
	flex: 1;
	display: flex;
	justify-content: center;
	gap: 28px;
}

.nav-tab {
	font-size: 14px;
	color: var(--warm-text-secondary);
	text-decoration: none;
	font-weight: 400;
	position: relative;
	padding-bottom: 2px;
}

.nav-tab.nav-tab-active {
	color: var(--warm-text);
	font-weight: 500;
}

.nav-tab.nav-tab-active::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: -22px;
	height: 2px;
	border-radius: 2px;
	background: var(--teal-primary);
}

.nav-right {
	display: flex;
	align-items: center;
	gap: 10px;
	flex-shrink: 0;
}

.conn-pill {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px 10px;
	border-radius: 20px;
	border: 0.5px solid var(--warm-border);
	background: var(--warm-surface);
	font-size: 12px;
	color: var(--warm-text-secondary);
	font-weight: 500;
}

.conn-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--warm-text-tertiary);
	flex-shrink: 0;
}

.conn-pill.conn-pill-on {
	border-color: var(--teal-mid);
	background: var(--teal-light);
	color: var(--teal-text);
}

.conn-pill.conn-pill-on .conn-dot {
	background: var(--teal-primary);
}

.avatar-pill {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	height: 36px;
	padding: 0 12px 0 4px;
	border-radius: 20px;
	border: 0.5px solid var(--warm-border);
	background: var(--warm-surface);
	text-decoration: none;
	flex-shrink: 0;
}

.avatar-circle {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: var(--teal-light);
	color: var(--teal-text);
	display: grid;
	place-items: center;
	font-size: 11px;
	font-weight: 600;
	flex-shrink: 0;
	overflow: hidden;
}

.avatar-circle-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.avatar-name {
	font-size: 13px;
	color: var(--warm-text);
	font-weight: 500;
}

/* ── Content ── */
.app-content {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	display: flex;
	flex-direction: column;
}

/* ── Background rings ── */
@keyframes ringPulseA { 0%, 100% { opacity: 0.06; } 50% { opacity: 0.15; } }
@keyframes ringPulseB { 0%, 100% { opacity: 0.13; } 50% { opacity: 0.30; } }
@keyframes ringPulseC { 0%, 100% { opacity: 0.09; } 50% { opacity: 0.24; } }

.bg-ring {
	position: fixed;
	pointer-events: none;
	z-index: 0;
}
.bg-ring-a { animation: ringPulseA 5s ease-in-out infinite; }
.bg-ring-b { animation: ringPulseB 6s ease-in-out infinite 1.5s; animation-fill-mode: backwards; }
.bg-ring-c { animation: ringPulseC 5.5s ease-in-out infinite 3s; animation-fill-mode: backwards; }

/* ── Footer ── */
.app-footer {
	position: relative;
	z-index: 2;
	margin-top: auto;
	padding: 24px 32px;
	background: var(--warm-bg);
	border-top: 1px solid rgba(0, 0, 0, 0.08);
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
	color: var(--warm-text-tertiary);
	font-family: 'DM Sans', system-ui, sans-serif;
}


.demo-idle-btn {
	display: inline-flex; align-items: center; gap: 5px;
	height: 26px; padding: 0 10px; border-radius: 20px;
	background: var(--warm-bg); border: 0.5px solid var(--warm-border);
	color: var(--warm-text-tertiary); font-size: 11px; font-weight: 500;
	font-family: inherit; cursor: pointer; outline: none;
	-webkit-tap-highlight-color: transparent;
}
.demo-active-btn {
	display: inline-flex; align-items: center; gap: 5px;
	height: 26px; padding: 0 10px; border-radius: 20px;
	background: var(--teal-light); border: 1px solid var(--teal-primary);
	color: var(--teal-dark); font-size: 11px; font-weight: 700;
	font-family: inherit; cursor: pointer; outline: none;
	-webkit-tap-highlight-color: transparent;
}

/* ── Splash ── */
.splash {
	height: 100dvh;
	background: var(--warm-bg);
	display: flex;
	align-items: center;
	justify-content: center;
}

.splash-dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: var(--teal-primary);
	animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 1; transform: scale(1); }
	50% { opacity: 0.4; transform: scale(0.8); }
}
</style>
