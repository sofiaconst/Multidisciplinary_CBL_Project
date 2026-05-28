<script lang="ts">
import '../app.css'
import { Bluetooth } from '$lib/bt.svelte'
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/state'
import BottomNav from './BottomNav.svelte'

const { children } = $props()

Scale.init(Bluetooth.getInstance())
const auth = Auth.getInstance()
const scale = Scale.getInstance()

const sessionId = browser ? `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` : 'server'

const logClientEvent = async (type: string, payload: Record<string, unknown> = {}) => {
	if (!browser) {
		return
	}
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
	void logClientEvent('page_loaded', {
		href: window.location.href,
		userAgent: navigator.userAgent,
	})
	window.addEventListener('error', (event) => {
		void logClientEvent('window_error', {
			message: event.message,
			filename: event.filename,
			lineno: event.lineno,
			colno: event.colno,
		})
	})
	window.addEventListener('unhandledrejection', (event) => {
		const reason =
			event.reason instanceof Error
				? { message: event.reason.message, stack: event.reason.stack }
				: { value: String(event.reason) }
		void logClientEvent('unhandled_rejection', reason)
	})
}

const isPublicPage = $derived(
	page.url.pathname === '/login' ||
	page.url.pathname === '/signup' ||
	page.url.pathname === '/welcome'
)

$effect(() => {
	if (!auth.loading && !auth.isLoggedIn && !isPublicPage) {
		void goto('/welcome')
	}
})
</script>

{#if isPublicPage}
	{@render children()}
{:else if auth.loading || !auth.isLoggedIn}
	<div class="splash">
		<div class="splash-dot"></div>
	</div>
{:else}
	<div class="app-shell">
		<header class="app-header">
			<div class="header-brand">
				<img src="/logo-icon.png" alt="Sippy" class="header-logo" />
				<span class="header-name">Sippy</span>
			</div>
			<div class="header-right">
				<div class="header-ble" class:header-ble-on={scale.bt.connected}>
					<span class="header-ble-dot"></span>
					{scale.bt.connected ? 'Scale connected' : 'Offline'}
				</div>
				<div class="header-avatar">{auth.user?.avatarInitials ?? '?'}</div>
			</div>
		</header>
		<div class="app-content">
			{@render children()}
		</div>
		<BottomNav />
	</div>
{/if}

<style>
.app-shell {
	display: flex;
	flex-direction: column;
	height: 100dvh;
	background: var(--warm-bg);
}

.app-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	height: 52px;
	background: var(--warm-surface);
	border-bottom: 1px solid var(--warm-border);
	flex-shrink: 0;
}

.header-brand {
	display: flex;
	align-items: center;
	gap: 8px;
}

.header-logo {
	width: 28px;
	height: 28px;
	border-radius: 7px;
	object-fit: contain;
}

.header-name {
	font-size: 16px;
	font-weight: 700;
	color: var(--warm-text);
	letter-spacing: -0.3px;
}

.header-right {
	display: flex;
	align-items: center;
	gap: 8px;
}

.header-ble {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 11px;
	font-weight: 500;
	color: var(--warm-text-tertiary);
	background: var(--warm-bg);
	border: 1px solid var(--warm-border);
	border-radius: 20px;
	padding: 4px 10px;
}

.header-ble-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--warm-border);
	flex-shrink: 0;
}

.header-ble.header-ble-on {
	color: var(--teal-dark);
	background: var(--teal-light);
	border-color: var(--teal-primary);
}

.header-ble.header-ble-on .header-ble-dot {
	background: var(--teal-primary);
}

.header-avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: var(--teal-primary);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	font-weight: 700;
	flex-shrink: 0;
}

.app-content {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

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
