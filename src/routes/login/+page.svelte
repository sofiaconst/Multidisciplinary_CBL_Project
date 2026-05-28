<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()

let email = $state('')
let password = $state('')
let showPwd = $state(false)
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
	if (!email) { error = 'Enter your email address above first.'; return }
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

<div class="page">
	<!-- Left dark panel -->
	<div class="brand-panel">
		<div class="panel-bg"></div>
		<div class="panel-content">
			<a href="/welcome" class="back-link">
				<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4L6 10l6 6"/></svg>
				Back
			</a>
			<div class="panel-wordmark">
				<img src="/logo-wordmark.png" alt="Sippy" class="wordmark-img" />
			</div>
			<div class="panel-foot">
				<div class="panel-headline">The scale watches.<br />You drink.<br />We do the rest.</div>
				<p class="panel-sub">An account saves your history, sets a personal goal, and unlocks adaptive reminders.</p>
				<ul class="panel-list">
					{#each ['Daily, weekly, and yearly history', 'Personalized hydration target', 'Adaptive reminders tuned to your pace', 'Multi-device sync (BLE + browser)'] as item}
						<li>
							<span class="check-dot">
								<svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="#004566"/></svg>
							</span>
							{item}
						</li>
					{/each}
				</ul>
			</div>
			<div class="panel-copy">© 2026 Sippy</div>
		</div>
	</div>

	<!-- Right form panel -->
	<div class="form-panel">
		<div class="form-inner">
			<div class="form-head">
				<h1>{showForgot ? 'Reset password' : 'Welcome back'}</h1>
				<p class="form-sub">{showForgot ? "We'll email you a reset link." : 'Sign in to see your hydration history.'}</p>
			</div>

			<form onsubmit={showForgot ? (e) => { e.preventDefault(); void handleForgotPassword() } : handleSignIn}>
				<div class="field">
					<label for="email">Email</label>
					<input id="email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" required />
				</div>

				{#if !showForgot}
					<div class="field">
						<label for="password">Password</label>
						<div class="pwd-wrap">
							<input
								id="password"
								type={showPwd ? 'text' : 'password'}
								bind:value={password}
								placeholder="Enter your password"
								autocomplete="current-password"
								required
							/>
							<button type="button" class="eye-btn" onclick={() => showPwd = !showPwd} aria-label={showPwd ? 'Hide' : 'Show'}>
								{#if showPwd}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
								{:else}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
								{/if}
							</button>
						</div>
						<div class="forgot-row">
							<button type="button" class="text-link" onclick={() => { showForgot = true; error = ''; success = '' }}>Forgot password?</button>
						</div>
					</div>
				{/if}

				{#if error === 'INVALID_CREDENTIALS'}
					<div class="error-box">
						<div class="error-title">Incorrect email or password.</div>
						<div class="error-hint">Don't have an account yet? <a href="/signup" class="inline-link">Sign up here</a></div>
					</div>
				{:else if error}
					<div class="error-msg">{error}</div>
				{/if}
				{#if success}
					<div class="success-msg">{success}</div>
				{/if}

				<button type="submit" class="primary-btn" disabled={loading}>
					{loading ? (showForgot ? 'Sending…' : 'Signing in…') : (showForgot ? 'Send reset email' : 'Sign in')}
				</button>

				{#if showForgot}
					<button type="button" class="text-link center" onclick={() => { showForgot = false; error = ''; success = '' }}>Back to sign in</button>
				{:else}
					<div class="divider"><span></span><span class="divider-label">or</span><span></span></div>
					<a href="/" class="ghost-btn">Continue as guest</a>
					<div class="signup-row">Don't have an account? <a href="/signup" class="inline-link">Create one</a></div>
				{/if}
			</form>
		</div>
	</div>
</div>

<svelte:head>
	<title>Sign in · Sippy</title>
</svelte:head>

<style>
.page {
	min-height: 100dvh;
	display: grid;
	grid-template-columns: minmax(0,1fr) minmax(0,1fr);
	background: var(--warm-bg);
}

/* ── Left dark panel ── */
.brand-panel {
	background: var(--teal-dark);
	position: relative;
	overflow: hidden;
}

.panel-bg {
	position: absolute;
	inset: 0;
	background-image:
		radial-gradient(circle at 20% 80%, rgba(0,135,189,0.22) 0, transparent 40%),
		radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0, transparent 35%);
	pointer-events: none;
}

.panel-content {
	position: relative;
	z-index: 1;
	height: 100%;
	padding: 56px 48px;
	display: flex;
	flex-direction: column;
	gap: 0;
}

.back-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: rgba(255,255,255,0.72);
	font-size: 13px;
	font-weight: 500;
	text-decoration: none;
	margin-bottom: 28px;
	transition: color 0.15s;
}
.back-link:hover { color: #fff; }

.panel-wordmark {
	margin-bottom: 32px;
}

.wordmark-img {
	height: 32px;
	width: auto;
	display: block;
	filter: brightness(0) invert(1);
}

.panel-foot {
	margin-top: auto;
}

.panel-headline {
	font-size: 32px;
	font-weight: 500;
	line-height: 1.15;
	letter-spacing: -0.6px;
	color: #fff;
	margin-bottom: 14px;
	max-width: 360px;
}

.panel-sub {
	font-size: 15px;
	line-height: 1.55;
	color: rgba(255,255,255,0.78);
	margin: 0 0 28px;
	max-width: 380px;
}

.panel-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
	font-size: 14px;
	color: rgba(255,255,255,0.92);
}

.panel-list li {
	display: flex;
	align-items: center;
	gap: 10px;
}

.check-dot {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: var(--teal-primary);
	display: grid;
	place-items: center;
	flex-shrink: 0;
}

.panel-copy {
	margin-top: 40px;
	font-size: 12px;
	color: rgba(255,255,255,0.6);
}

/* ── Right form panel ── */
.form-panel {
	background: var(--warm-surface);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 64px 48px;
}

.form-inner {
	width: 100%;
	max-width: 380px;
}

.form-head {
	margin-bottom: 28px;
}

h1 {
	font-size: 26px;
	font-weight: 500;
	letter-spacing: -0.5px;
	margin: 0 0 4px;
	color: var(--warm-text);
}

.form-sub {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0;
}

form {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

label {
	font-size: 13px;
	font-weight: 500;
	color: var(--warm-text-secondary);
}

input[type='email'],
input[type='password'],
input[type='text'] {
	width: 100%;
	height: 44px;
	padding: 0 12px;
	border: 0.5px solid var(--warm-border);
	border-radius: 10px;
	background: var(--warm-surface);
	color: var(--warm-text);
	font-size: 14px;
	font-family: inherit;
	outline: none;
	box-sizing: border-box;
	transition: border-color 0.12s, box-shadow 0.12s;
}

input:focus {
	border-color: var(--teal-primary);
	box-shadow: 0 0 0 3px var(--teal-light);
}

.pwd-wrap {
	position: relative;
	display: flex;
	align-items: center;
}

.pwd-wrap input {
	padding-right: 40px;
}

.eye-btn {
	position: absolute;
	right: 0;
	width: 40px;
	height: 44px;
	border: none;
	background: transparent;
	display: grid;
	place-items: center;
	cursor: pointer;
	color: var(--warm-text-tertiary);
	padding: 0;
}

.forgot-row {
	display: flex;
	justify-content: flex-end;
	margin-top: 4px;
}

.error-box {
	background: #fee2e2;
	border: 0.5px solid #fca5a5;
	border-radius: 10px;
	padding: 10px 12px;
}
.error-title { font-size: 13px; font-weight: 600; color: #dc2626; }
.error-hint  { font-size: 12px; color: #7f1d1d; margin-top: 4px; }
.error-msg   { font-size: 13px; color: #ef4444; }
.success-msg { font-size: 13px; color: var(--teal-primary); }

.inline-link {
	color: var(--teal-text);
	font-weight: 500;
	text-decoration: none;
}
.inline-link:hover { text-decoration: underline; }

.primary-btn {
	width: 100%;
	height: 44px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	border-radius: 12px;
	font-size: 15px;
	font-weight: 600;
	font-family: inherit;
	cursor: pointer;
	transition: background 0.15s;
}
.primary-btn:hover:not(:disabled) { background: var(--teal-dark); }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.divider {
	display: flex;
	align-items: center;
	gap: 10px;
	color: var(--warm-text-tertiary);
	font-size: 12px;
}
.divider span:first-child,
.divider span:last-child {
	flex: 1;
	height: 1px;
	background: var(--warm-border);
}

.ghost-btn {
	width: 100%;
	height: 44px;
	background: transparent;
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	border-radius: 12px;
	font-size: 15px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	transition: border-color 0.15s;
}
.ghost-btn:hover { border-color: var(--teal-primary); color: var(--teal-primary); }

.signup-row {
	text-align: center;
	font-size: 13px;
	color: var(--warm-text-secondary);
	margin-top: 2px;
}

.text-link {
	background: none;
	border: none;
	color: var(--warm-text-secondary);
	font-size: 13px;
	cursor: pointer;
	padding: 0;
	font-family: inherit;
	text-decoration: none;
	transition: color 0.15s;
}
.text-link:hover { color: var(--teal-primary); }
.text-link.center { display: block; text-align: center; width: 100%; }
</style>
