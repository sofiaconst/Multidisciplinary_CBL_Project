<script lang="ts">
import '../../app.css'
import { Auth } from '$lib/auth.svelte'
import { Scale } from '$lib/scale.svelte'
import { demo } from '$lib/demo.svelte'
import DemoPanel from '$lib/DemoPanel.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/state'

const { children } = $props()

const scale = Scale.getInstance()
Scale.init(scale.bt)
const auth = Auth.getInstance()

const publicRoutes = ['/m/welcome', '/m/login', '/m/signup']
const isPublic = $derived(publicRoutes.includes(page.url.pathname))

$effect(() => {
	if (!auth.loading && !auth.isLoggedIn && !isPublic) {
		void goto('/m/login')
	}
})

$effect(() => {
	// Block pinch-zoom — Safari ignores the viewport meta since iOS 10
	const block = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault() }
	document.addEventListener('touchstart', block, { passive: false })
	return () => document.removeEventListener('touchstart', block)
})

const tabs = [
	{ label: 'Home',     href: '/m',          match: (p: string) => p === '/m' },
	{ label: 'History',  href: '/m/history',   match: (p: string) => p === '/m/history' },
	{ label: 'Profile',  href: '/m/profile',   match: (p: string) => p === '/m/profile' },
	{ label: 'Settings', href: '/m/settings',  match: (p: string) => p === '/m/settings' },
]

let touchX = 0
let touchY = 0

function onTouchStart(e: TouchEvent) {
	touchX = e.touches[0].clientX
	touchY = e.touches[0].clientY
}
function onTouchEnd(e: TouchEvent) {
	const dx = e.changedTouches[0].clientX - touchX
	const dy = e.changedTouches[0].clientY - touchY
	if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.8) {
		const idx = tabs.findIndex(t => t.match(page.url.pathname))
		if (idx < 0) return
		if (dx < 0 && idx < tabs.length - 1) void goto(tabs[idx + 1].href)
		if (dx > 0 && idx > 0) void goto(tabs[idx - 1].href)
	}
}
</script>

{#if isPublic}
	{@render children()}
{:else if auth.loading || !auth.isLoggedIn}
	<div class="splash">
		<span class="splash-dot"></span>
	</div>
{:else}
	<div class="shell">
		<main class="content" ontouchstart={onTouchStart} ontouchend={onTouchEnd}>
			{@render children()}
		</main>

		<!-- Demo mode panel -->
		{#if demo.panelOpen}
			<DemoPanel />
		{/if}

		<!-- Demo trigger button — sits above the bottom nav -->
		<div class="demo-strip">
			{#if demo.active}
				<button class="demo-active-btn" onclick={() => demo.panelOpen = true}>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 14H11v-2h2v2zm0-4H11V8h2v4z"/></svg>
					DEMO ON
				</button>
			{:else}
				<button class="demo-idle-btn" onclick={() => { demo.active = true; demo.panelOpen = true }}>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
					Test
				</button>
			{/if}
		</div>

		<!-- Bottom nav -->
		<nav class="bottom-nav">
			{#each tabs as tab}
				{@const active = tab.match(page.url.pathname)}
				<a href={tab.href} class="tab" class:tab-active={active}>
					{#if tab.label === 'Home'}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
					{:else if tab.label === 'History'}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
					{:else if tab.label === 'Profile'}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
					{:else}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
					{/if}
					<span class="tab-label">{tab.label}</span>
				</a>
			{/each}
		</nav>
	</div>
{/if}

<style>
*, *::before, *::after { box-sizing: border-box; }

.shell {
	display: flex;
	flex-direction: column;
	height: 100dvh;
	width: 100%;
	max-width: 100vw;
	overflow: hidden;
	background: var(--warm-bg);
	touch-action: pan-y; /* allows vertical scroll, blocks pinch-zoom */
}

/* ── Demo strip ── */
.demo-strip {
	display: flex;
	justify-content: flex-end;
	padding: 4px 12px 2px;
	background: var(--warm-bg);
	flex-shrink: 0;
}
.demo-idle-btn {
	display: inline-flex; align-items: center; gap: 5px;
	height: 26px; padding: 0 10px; border-radius: 20px;
	background: var(--warm-bg); border: 0.5px solid var(--warm-border);
	color: var(--warm-text-tertiary); font-size: 11px; font-weight: 500;
	font-family: inherit; cursor: pointer;
	outline: none; -webkit-tap-highlight-color: transparent;
}
.demo-active-btn {
	display: inline-flex; align-items: center; gap: 5px;
	height: 26px; padding: 0 10px; border-radius: 20px;
	background: var(--teal-light); border: 1px solid var(--teal-primary);
	color: var(--teal-dark); font-size: 11px; font-weight: 700;
	font-family: inherit; cursor: pointer;
	outline: none; -webkit-tap-highlight-color: transparent;
}

/* ── Content ── */
.content {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* ── Bottom nav ── */
.bottom-nav {
	background: var(--warm-surface);
	border-top: 0.5px solid var(--warm-border);
	display: flex;
	justify-content: center;
	align-items: stretch;
	flex-shrink: 0;
	padding-bottom: env(safe-area-inset-bottom, 0px);
}
.tab {
	flex: 1;
	max-width: 90px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	padding: 10px 0;
	text-decoration: none;
	color: var(--warm-text-tertiary);
	transition: color 0.15s;
	min-height: 60px;
}
.tab.tab-active { color: var(--teal-primary); }
.tab-label { font-size: 11px; font-weight: 500; }

/* ── Splash ── */
.splash {
	height: 100dvh; display: flex; align-items: center; justify-content: center;
	background: var(--warm-bg);
}
.splash-dot {
	width: 10px; height: 10px; border-radius: 50%;
	background: var(--teal-primary);
	animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
	0%, 100% { opacity: 1; transform: scale(1); }
	50% { opacity: 0.4; transform: scale(0.8); }
}
</style>
