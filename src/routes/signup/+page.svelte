<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()

let email = $state('')
let password = $state('')
let confirm = $state('')
let error = $state('')
let loading = $state(false)

const passwordLong = $derived(password.length >= 6)
const passwordsMatch = $derived(password === confirm && confirm.length > 0)

const handleSignUp = async (e: Event) => {
	e.preventDefault()
	error = ''
	if (!passwordLong) { error = 'Password must be at least 6 characters.'; return }
	if (!passwordsMatch) { error = 'Passwords do not match.'; return }
	loading = true
	try {
		await auth.register(email, password)
		await goto('/')
	} catch (err: unknown) {
		const msg = (err as Error).message ?? ''
		error = msg === 'EMAIL_IN_USE' ? 'EMAIL_IN_USE' : (msg || 'Sign up failed. Try again.')
	} finally {
		loading = false
	}
}
</script>

<div class="page">
	<div class="brand-panel">
		<a href="/login" class="back-link">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4L6 10l6 6"/></svg>
			Back
		</a>
		<img src="/logo-icon.png" alt="Sippy" class="brand-logo" />
		<div class="brand-name">Sippy</div>
		<p class="brand-tagline">Track every sip.<br/>No manual logging.</p>
	</div>

	<div class="form-panel">
		<h1>Create account</h1>
		<p class="form-sub">Start tracking your hydration today.</p>

		<form onsubmit={handleSignUp}>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" required />
			</div>
			<div class="field">
				<label for="password">Password</label>
				<input id="password" type="password" bind:value={password} placeholder="Create a password" autocomplete="new-password" required />
			</div>
			<div class="field">
				<label for="confirm">Confirm password</label>
				<input id="confirm" type="password" bind:value={confirm} placeholder="Repeat your password" autocomplete="new-password" required />
			</div>

			<div class="requirements">
				<div class="req" class:met={passwordLong}>
					<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
						{#if passwordLong}<path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
						{:else}<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>{/if}
					</svg>
					At least 6 characters
				</div>
				<div class="req" class:met={passwordsMatch}>
					<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
						{#if passwordsMatch}<path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
						{:else}<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>{/if}
					</svg>
					Passwords match
				</div>
			</div>

			{#if error === 'EMAIL_IN_USE'}
				<div class="error-box">
					<div class="error-title">An account with this email already exists.</div>
					<div class="error-hint"><a href="/login" class="inline-link">Sign in instead</a> or use a different email.</div>
				</div>
			{:else if error}
				<div class="error-msg">{error}</div>
			{/if}

			<button type="submit" class="primary-btn" disabled={loading}>
				{loading ? 'Creating account…' : 'Create account'}
			</button>

			<div class="signin-row">
				Already have an account? <a href="/login" class="text-link">Sign in</a>
			</div>
		</form>
	</div>
</div>

<svelte:head>
	<title>Sign up — Sippy</title>
</svelte:head>

<style>
.page {
	min-height: 100dvh;
	background: var(--warm-bg);
	display: flex;
	flex-direction: column;
}

.brand-panel {
	background: var(--teal-dark);
	padding: 32px 28px 28px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	position: relative;
}

.back-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: rgba(255,255,255,0.75);
	font-size: 13px;
	font-weight: 500;
	text-decoration: none;
	margin-bottom: 10px;
	transition: color 0.15s;
}
.back-link:hover { color: #fff; }

.brand-logo {
	width: 44px;
	height: 44px;
	border-radius: 11px;
	object-fit: contain;
	margin-bottom: 2px;
}

.brand-name {
	font-size: 20px;
	font-weight: 700;
	color: #fff;
}

.brand-tagline {
	font-size: 14px;
	color: rgba(255,255,255,0.72);
	margin: 0;
	line-height: 1.5;
}

.form-panel {
	flex: 1;
	background: var(--warm-surface);
	padding: 28px 28px 36px;
}

h1 {
	font-size: 20px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0 0 4px;
}

.form-sub {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0 0 22px;
}

.field { margin-bottom: 13px; }

label {
	display: block;
	font-size: 13px;
	font-weight: 500;
	color: var(--warm-text-secondary);
	margin-bottom: 5px;
}

input {
	width: 100%;
	padding: 10px 12px;
	border: 1px solid var(--warm-border);
	border-radius: 8px;
	background: var(--warm-bg);
	color: var(--warm-text);
	font-size: 15px;
	outline: none;
	box-sizing: border-box;
	transition: border-color 0.15s;
}
input:focus { border-color: var(--teal-primary); }

.requirements {
	display: flex;
	flex-direction: column;
	gap: 5px;
	margin-bottom: 14px;
}

.req {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	color: var(--warm-text-tertiary);
	transition: color 0.15s;
}
.req.met { color: var(--teal-primary); }

.error-box {
	background: #fee2e2;
	border: 1px solid #fca5a5;
	border-radius: 8px;
	padding: 10px 12px;
	margin-bottom: 13px;
}
.error-title { font-size: 13px; font-weight: 600; color: #dc2626; }
.error-hint  { font-size: 12px; color: #7f1d1d; margin-top: 4px; }
.inline-link { color: var(--teal-primary); font-weight: 600; text-decoration: underline; }
.error-msg   { font-size: 13px; color: #ef4444; margin-bottom: 12px; }

.primary-btn {
	width: 100%;
	padding: 13px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s;
}
.primary-btn:hover:not(:disabled) { background: var(--teal-dark); }
.primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.signin-row {
	text-align: center;
	font-size: 13px;
	color: var(--warm-text-secondary);
	margin-top: 14px;
}
.text-link { color: var(--teal-primary); font-weight: 600; text-decoration: none; margin-left: 4px; }
.text-link:hover { text-decoration: underline; }
</style>
