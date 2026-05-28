<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()
let guestLoading = $state(false)

const continueAsGuest = async () => {
	guestLoading = true
	try { await auth.signInAsGuest(); await goto('/m') }
	catch { guestLoading = false }
}
</script>

<div class="page">
	<img src="/logo-wordmark.png" alt="Sippy" class="wordmark" />

	<div class="hero">
		<div class="badge">
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C10 7 7 9 7 13a5 5 0 0010 0c0-4-3-6-5-11z" fill="#004566"/></svg>
			Smart coaster · Bluetooth ready
		</div>
		<h1>Know every sip.</h1>
		<p class="body-text">Sippy tracks your water intake automatically — no logging, just drink.</p>
	</div>

	<div class="ctas">
		<a href="/m/signup" class="btn-primary">Create account</a>
		<a href="/m/login" class="btn-ghost">Sign in</a>
		<button class="btn-guest" onclick={continueAsGuest} disabled={guestLoading}>
			{guestLoading ? 'Loading…' : 'Continue as guest'}
		</button>
	</div>

	<p class="hint">
		<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
		No app install · Works in your browser
	</p>

	<a href="/" class="switch-desktop">
		<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
		Switch to desktop view
	</a>
</div>

<svelte:head><title>Sippy</title></svelte:head>

<style>
.page {
	min-height: 100dvh;
	background: var(--warm-bg);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 24px 32px;
	gap: 0;
	font-family: 'DM Sans', system-ui, sans-serif;
}

.wordmark { height: 48px; width: auto; margin-bottom: 36px; }

.hero { text-align: center; margin-bottom: 36px; }

.badge {
	display: inline-flex; align-items: center; gap: 6px;
	padding: 5px 12px; border-radius: 20px;
	background: var(--teal-light); color: var(--teal-text);
	font-size: 12px; font-weight: 500; margin-bottom: 18px;
}

h1 {
	font-size: 48px; font-weight: 600; letter-spacing: -2px;
	line-height: 1.05; margin: 0 0 14px; color: var(--warm-text);
}

.body-text {
	font-size: 16px; line-height: 1.6;
	color: var(--warm-text-secondary); margin: 0; max-width: 300px;
}

.ctas {
	width: 100%; max-width: 340px;
	display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;
}

.btn-primary {
	height: 56px; border-radius: 14px;
	background: var(--teal-primary); color: #fff; border: none;
	font-size: 18px; font-weight: 600; font-family: inherit;
	display: flex; align-items: center; justify-content: center;
	text-decoration: none; cursor: pointer; transition: background 0.15s;
}
.btn-primary:hover { background: var(--teal-dark); }

.btn-ghost {
	height: 56px; border-radius: 14px;
	background: var(--warm-surface); color: var(--warm-text);
	border: 1px solid var(--warm-border);
	font-size: 18px; font-weight: 500; font-family: inherit;
	display: flex; align-items: center; justify-content: center;
	text-decoration: none; cursor: pointer; transition: border-color 0.15s, color 0.15s;
}
.btn-ghost:hover { border-color: var(--teal-primary); color: var(--teal-primary); }

.btn-guest {
	background: none; border: none; font-size: 15px; font-weight: 500;
	color: var(--warm-text-secondary); cursor: pointer; font-family: inherit;
	padding: 6px 0; text-decoration: underline; text-decoration-color: var(--warm-border);
}
.btn-guest:hover { color: var(--teal-primary); }
.btn-guest:disabled { opacity: 0.5; cursor: not-allowed; }

.hint {
	display: flex; align-items: center; gap: 6px;
	font-size: 13px; color: var(--warm-text-tertiary); margin: 0 0 32px;
}

.switch-desktop {
	display: inline-flex; align-items: center; gap: 5px;
	font-size: 12px; color: var(--warm-text-tertiary);
	text-decoration: none; padding: 6px 12px; border-radius: 8px;
	border: 0.5px solid var(--warm-border); background: var(--warm-surface);
}
.switch-desktop:hover { color: var(--teal-primary); border-color: var(--teal-primary); }
</style>
