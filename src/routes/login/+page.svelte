<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()

let email = $state('')
let password = $state('')
let error = $state('')
let success = $state('')
let loading = $state(false)
let showForgot = $state(false)

const handleSignIn = async (e: Event) => {
	e.preventDefault()
	error = ''
	success = ''
	loading = true
	try {
		await auth.login(email, password)
		await goto('/')
	} catch (err: unknown) {
		const msg = (err as Error).message ?? ''
		if (msg === 'INVALID_CREDENTIALS') {
			error = 'INVALID_CREDENTIALS'
		} else if (msg.includes('too-many-requests')) {
			error = 'Too many attempts. Try again later.'
		} else {
			error = msg || 'Sign in failed. Try again.'
		}
	} finally {
		loading = false
	}
}

const handleForgotPassword = async () => {
	error = ''
	success = ''
	if (!email) {
		error = 'Enter your email address above first.'
		return
	}
	loading = true
	try {
		await auth.sendPasswordReset(email)
		success = 'Password reset email sent. Check your inbox.'
		showForgot = false
	} catch {
		error = 'Could not send reset email. Check the address and try again.'
	} finally {
		loading = false
	}
}
</script>

<div class="login-page">
	<div class="brand-panel">
		<a href="/welcome" class="back-link">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4L6 10l6 6"/></svg>
			Back
		</a>
		<img src="/logo-icon.png" alt="Sippy" class="brand-logo" />
		<div class="brand-name">Sippy</div>
		<p class="brand-tagline">The scale watches.<br/>You drink. We do the rest.</p>
	</div>

	<div class="form-panel">
		<h1>{showForgot ? 'Reset password' : 'Welcome back'}</h1>
		<p class="form-sub">{showForgot ? 'We\'ll email you a reset link.' : 'Sign in to see your hydration history.'}</p>

		<form onsubmit={showForgot ? (e) => { e.preventDefault(); void handleForgotPassword() } : handleSignIn}>
			<div class="field">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					autocomplete="email"
					required
				/>
			</div>

			{#if !showForgot}
				<div class="field">
					<label for="password">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Enter your password"
						autocomplete="current-password"
						required
					/>
				</div>
			{/if}

			{#if error === 'INVALID_CREDENTIALS'}
				<div class="error-box">
					<div class="error-title">Incorrect email or password.</div>
					<div class="error-hint">
						Don't have an account yet?
						<a href="/signup" class="inline-link">Sign up here</a>
					</div>
				</div>
			{:else if error}
				<div class="error-msg">{error}</div>
			{/if}

			{#if success}
				<div class="success-msg">{success}</div>
			{/if}

			<button type="submit" class="primary-btn" disabled={loading}>
				{#if loading}
					{showForgot ? 'Sending…' : 'Signing in…'}
				{:else}
					{showForgot ? 'Send reset email' : 'Sign in'}
				{/if}
			</button>

			<div class="row-links">
				<button
					type="button"
					class="text-link"
					onclick={() => { showForgot = !showForgot; error = ''; success = '' }}
				>
					{showForgot ? 'Back to sign in' : 'Forgot password?'}
				</button>
				{#if !showForgot}
					<a href="/signup" class="text-link">Create account</a>
				{/if}
			</div>
		</form>
	</div>
</div>

<svelte:head>
	<title>Sign in · Sippy</title>
</svelte:head>

<style>
.login-page {
	min-height: 100dvh;
	background: var(--warm-bg);
	display: flex;
	flex-direction: column;
}

.brand-panel {
	background: var(--teal-dark);
	padding: 40px 28px 32px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
}

.back-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: rgba(255,255,255,0.75);
	font-size: 13px;
	font-weight: 500;
	text-decoration: none;
	margin-bottom: 12px;
	transition: color 0.15s;
}
.back-link:hover { color: #fff; }

.brand-logo {
	width: 48px;
	height: 48px;
	border-radius: 12px;
	object-fit: contain;
	margin-bottom: 4px;
}

.brand-name {
	font-size: 22px;
	font-weight: 700;
	color: #fff;
	letter-spacing: -0.3px;
}

.brand-tagline {
	font-size: 15px;
	color: rgba(255,255,255,0.75);
	margin: 0;
	line-height: 1.5;
}

.form-panel {
	flex: 1;
	background: var(--warm-surface);
	padding: 32px 28px 40px;
}

h1 {
	font-size: 22px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0 0 4px;
}

.form-sub {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0 0 28px;
}

.field {
	margin-bottom: 16px;
}

label {
	display: block;
	font-size: 13px;
	font-weight: 500;
	color: var(--warm-text-secondary);
	margin-bottom: 6px;
}

input {
	width: 100%;
	padding: 11px 12px;
	border: 1px solid var(--warm-border);
	border-radius: 8px;
	background: var(--warm-bg);
	color: var(--warm-text);
	font-size: 15px;
	outline: none;
	box-sizing: border-box;
	transition: border-color 0.15s;
}

input:focus {
	border-color: var(--teal-primary);
}

.error-box {
	background: #fee2e2;
	border: 1px solid #fca5a5;
	border-radius: 8px;
	padding: 10px 12px;
	margin-bottom: 14px;
}

.error-title {
	font-size: 13px;
	font-weight: 600;
	color: #dc2626;
}

.error-hint {
	font-size: 12px;
	color: #7f1d1d;
	margin-top: 4px;
}

.inline-link {
	color: var(--teal-primary);
	font-weight: 600;
	text-decoration: underline;
}

.error-msg {
	font-size: 13px;
	color: #ef4444;
	margin-bottom: 12px;
}

.success-msg {
	font-size: 13px;
	color: var(--teal-primary);
	margin-bottom: 12px;
}

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

.primary-btn:hover:not(:disabled) {
	background: var(--teal-dark);
}

.primary-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.row-links {
	display: flex;
	justify-content: space-between;
	margin-top: 16px;
}

.text-link {
	background: none;
	border: none;
	color: var(--warm-text-secondary);
	font-size: 13px;
	cursor: pointer;
	padding: 0;
	text-decoration: none;
}

.text-link:hover {
	color: var(--teal-primary);
}
</style>
