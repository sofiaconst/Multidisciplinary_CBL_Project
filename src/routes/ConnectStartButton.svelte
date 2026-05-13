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
  <div class="btn btn-primary btn-outline btn-sm sm:btn-md pointer-events-none">
    <Check class="h-6 w-6" /> Connected
  </div>
{:else if scale.bt.enabled}
  <button type="button" class="btn btn-warning btn-sm sm:btn-md" onclick={connect}>
    <Link class="h-6 w-6" /> Connect scale
  </button>
{:else}
  <div class="alert alert-error">
    <Cross class="h-6 w-6" />
    <span>
      Bluetooth not available. Try enabling Bluetooth or switching to a
      <a class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#browser_compatibility">
        supported browser
      </a>
    </span>
  </div>
{/if}
