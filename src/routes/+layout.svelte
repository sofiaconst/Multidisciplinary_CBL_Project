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
	page.url.pathname === '/login' || page.url.pathname === '/signup'
)

$effect(() => {
	if (!auth.loading && !auth.isLoggedIn && !isPublicPage) {
		void goto('/login')
	}
})
</script>

{#if auth.loading && !isPublicPage}
	<div class="splash">
		<div class="splash-dot"></div>
	</div>
{:else if isPublicPage}
	{@render children()}
{:else}
	<div class="app-shell">
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
