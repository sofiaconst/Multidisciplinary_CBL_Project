<script lang="ts">
import { page } from '$app/state'

const tabs = [
	{ href: '/', label: 'Home' },
	{ href: '/history', label: 'History' },
	{ href: '/profile', label: 'Profile' },
	{ href: '/settings', label: 'Settings' },
]
</script>

<nav>
	{#each tabs as tab}
		<a href={tab.href} class:active={page.url.pathname === tab.href} aria-label={tab.label}>
			{#if tab.href === '/'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
					<path d="M9 21V12h6v9" />
				</svg>
			{:else if tab.href === '/history'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M18 20V10M12 20V4M6 20v-6" />
				</svg>
			{:else if tab.href === '/profile'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
					<circle cx="12" cy="7" r="4" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="3" />
					<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
				</svg>
			{/if}
			<span>{tab.label}</span>
		</a>
	{/each}
</nav>

<style>
nav {
	display: flex;
	background: var(--warm-surface);
	border-top: 1px solid var(--warm-border);
	height: 64px;
	padding-bottom: env(safe-area-inset-bottom, 0px);
}

a {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3px;
	text-decoration: none;
	color: var(--warm-text-tertiary);
	font-size: 10px;
	font-weight: 500;
	transition: color 0.15s;
}

a.active {
	color: var(--teal-primary);
}

svg {
	width: 22px;
	height: 22px;
}
</style>
