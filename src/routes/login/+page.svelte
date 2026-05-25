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
	<div class="login-card">
		<div class="login-header">
			<div class="logo-circle">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
					<path d="M12 6v6l4 2" />
				</svg>
			</div>
			<h1>Hydr8 Scale</h1>
			<p>{showForgot ? 'Reset your password' : 'Sign in to your account'}</p>
		</div>

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

<style>
.login-page {
	min-height: 100dvh;
	background: var(--warm-bg);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
}

.login-card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 16px;
	padding: 32px 28px;
	width: 100%;
	max-width: 380px;
}

.login-header {
	text-align: center;
	margin-bottom: 28px;
}

.logo-circle {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: var(--teal-light);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 12px;
	color: var(--teal-primary);
}

.logo-circle svg {
	width: 28px;
	height: 28px;
}

h1 {
	font-size: 20px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0 0 6px;
}

p {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0;
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
	padding: 12px;
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
	margin-top: 14px;
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
