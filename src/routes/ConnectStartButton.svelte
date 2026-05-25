<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import Link from 'virtual:icons/mingcute/link-line'
import Cross from 'virtual:icons/mingcute/close-circle-line'
import Check from 'virtual:icons/mingcute/check-circle-fill'
import toast from 'svelte-french-toast'
import { browser } from '$app/environment'

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
			body: JSON.stringify({ type, source: 'connect_button', sessionId, ...payload }),
			keepalive: true,
		})
	} catch (err) {
		console.error('connect button log failed', err)
	}
}

const connect = async () => {
	try {
		await logClientEvent('connect_button_clicked')
		await scale.bt.connect()
		await logClientEvent('connect_button_completed')
	} catch (e) {
		console.error(e)
		const error = e as Error
		await logClientEvent('connect_button_error', { message: error.message, stack: error.stack })
		toast.error(`Bluetooth Error: ${error.message}`)
	}
}
</script>

{#if scale.bt.enabled && scale.bt.connected}
	<div class="ble-pill connected">
		<Check width="18" height="18" /> Connected
	</div>
{:else if scale.bt.enabled}
	<button type="button" class="ble-btn" onclick={connect}>
		<Link width="18" height="18" /> Connect scale
	</button>
{:else}
	<div class="ble-error">
		<Cross width="18" height="18" style="flex-shrink:0" />
		<span>
			Bluetooth not available. Try enabling Bluetooth or switching to a
			<a class="ble-link" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#browser_compatibility">
				supported browser
			</a>
		</span>
	</div>
{/if}

<style>
.ble-pill {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	padding: 10px 20px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
}

.ble-pill.connected {
	background: var(--teal-light);
	color: var(--teal-dark);
	border: 1px solid var(--teal-primary);
}

.ble-btn {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	padding: 10px 20px;
	background: var(--amber-bg);
	color: var(--amber-text);
	border: 1px solid var(--amber-border);
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s;
}

.ble-btn:hover {
	background: var(--amber-border);
}

.ble-error {
	display: flex;
	align-items: flex-start;
	gap: 10px;
	padding: 12px 16px;
	background: #fee2e2;
	border: 1px solid #fca5a5;
	border-radius: 8px;
	font-size: 13px;
	color: #dc2626;
	max-width: 340px;
}

.ble-link {
	color: var(--teal-primary);
	text-decoration: underline;
}
</style>
