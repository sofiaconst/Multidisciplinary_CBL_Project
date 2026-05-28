<script lang="ts">
import '../../app.css'
import { Auth } from '$lib/auth.svelte'
import { Scale } from '$lib/scale.svelte'
import { browser } from '$app/environment'
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

const tabs = [
	{ label: 'Home',     href: '/m',          match: (p: string) => p === '/m' },
	{ label: 'History',  href: '/m/history',   match: (p: string) => p === '/m/history' },
	{ label: 'Profile',  href: '/m/profile',   match: (p: string) => p === '/m/profile' },
	{ label: 'Settings', href: '/m/settings',  match: (p: string) => p === '/m/settings' },
]
</script>

{#if isPublic}
	{@render children()}
{:else if auth.loading || !auth.isLoggedIn}
	<div class="splash">
		<span class="splash-dot"></span>
	</div>
{:else}
	<div class="shell">
		<!-- Top bar -->
		<header class="topbar">
			<a href="/m" class="topbar-brand">
				<img src="/logo-icon.png" alt="" class="topbar-logo" />
				<span class="topbar-name">Sippy</span>
			</a>
			<a href="/" class="view-toggle" title="Switch to desktop view">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
				Desktop
			</a>
		</header>

		<!-- Scrollable content -->
		<main class="content">
			{@render children()}
		</main>

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
	background: var(--warm-bg);
}

/* ── Top bar ── */
.topbar {
	height: 52px;
	background: var(--warm-surface);
	border-bottom: 0.5px solid var(--warm-border);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 18px;
	flex-shrink: 0;
	position: sticky;
	top: 0;
	z-index: 20;
}
.topbar-brand {
	display: flex; align-items: center; gap: 8px; text-decoration: none;
}
.topbar-logo { width: 24px; height: 24px; object-fit: contain; }
.topbar-name { font-size: 16px; font-weight: 700; color: var(--warm-text); letter-spacing: -0.2px; }

.view-toggle {
	display: inline-flex; align-items: center; gap: 5px;
	font-size: 12px; font-weight: 500; color: var(--warm-text-secondary);
	text-decoration: none; padding: 5px 10px; border-radius: 8px;
	border: 0.5px solid var(--warm-border); background: var(--warm-bg);
	transition: color 0.15s, border-color 0.15s;
}
.view-toggle:hover { color: var(--teal-primary); border-color: var(--teal-primary); }

/* ── Content ── */
.content {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	/* Extra bottom padding so last card clears the bottom nav on all devices */
	padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* ── Bottom nav ── */
.bottom-nav {
	background: var(--warm-surface);
	border-top: 0.5px solid var(--warm-border);
	display: flex;
	align-items: stretch;
	flex-shrink: 0;
	/* 64px nav + safe area for iPhone home indicator */
	padding-bottom: env(safe-area-inset-bottom, 0px);
}
.tab {
	flex: 1;
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
