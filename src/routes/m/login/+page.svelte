<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()

let email       = $state('')
let password    = $state('')
let showPwd     = $state(false)
let error       = $state('')
let success     = $state('')
let loading     = $state(false)
let guestLoading = $state(false)
let showForgot  = $state(false)

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const handleSignIn = async (e: Event) => {
	e.preventDefault(); error = ''; success = ''
	if (!email.trim())       { error = 'Please enter your email address.'; return }
	if (!isValidEmail(email)){ error = 'Please enter a valid email address.'; return }
	if (!password)           { error = 'Please enter your password.'; return }
	loading = true
	try { await auth.login(email, password); await goto('/m') }
	catch (err: unknown) {
		const msg = (err as Error).message ?? ''
		if (msg === 'INVALID_CREDENTIALS') error = 'INVALID_CREDENTIALS'
		else if (msg.includes('too-many-requests')) error = 'Too many attempts. Try again later.'
		else error = msg || 'Sign in failed. Try again.'
	} finally { loading = false }
}

const handleForgot = async (e: Event) => {
	e.preventDefault(); error = ''; success = ''
	if (!email.trim())        { error = 'Enter your email first.'; return }
	if (!isValidEmail(email)) { error = 'Please enter a valid email address.'; return }
	loading = true
	try { await auth.sendPasswordReset(email); success = 'Reset email sent. Check your inbox.'; showForgot = false }
	catch { error = 'Could not send reset email. Try again.' }
	finally { loading = false }
}

const signInAsGuest = async () => {
	guestLoading = true
	try { await auth.signInAsGuest(); await goto('/m') }
	catch { guestLoading = false }
}
</script>

<div class="page">
	<div class="header">
		<a href="/m/welcome" class="back">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4L6 10l6 6"/></svg>
			Back
		</a>
		<img src="/logo-wordmark.png" alt="Sippy" class="wordmark" />
		<p class="tagline">The scale watches. You drink. We do the rest.</p>
	</div>

	<div class="form-card">
		<h1>{showForgot ? 'Reset password' : 'Welcome back'}</h1>
		<p class="form-sub">{showForgot ? "We'll email you a reset link." : 'Sign in to your Sippy account.'}</p>

		<form novalidate onsubmit={showForgot ? handleForgot : handleSignIn}>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" />
			</div>
			{#if !showForgot}
				<div class="field">
					<label for="password">Password</label>
					<div class="pwd-wrap">
						<input id="password" type={showPwd ? 'text' : 'password'} bind:value={password} placeholder="Your password" autocomplete="current-password" />
						<button type="button" class="eye" onclick={() => showPwd = !showPwd}>
							{#if showPwd}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
							{:else}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{/if}
						</button>
					</div>
					<button type="button" class="link-btn" onclick={() => { showForgot = true; error = ''; success = '' }}>Forgot password?</button>
				</div>
			{/if}

			{#if error === 'INVALID_CREDENTIALS'}
				<div class="err-box"><strong>Incorrect email or password.</strong><span>No account? <a href="/m/signup" class="il">Sign up</a></span></div>
			{:else if error}<div class="err-msg">{error}</div>
			{/if}
			{#if success}<div class="ok-msg">{success}</div>{/if}

			<button type="submit" class="btn-primary" disabled={loading}>
				{loading ? (showForgot ? 'Sending…' : 'Signing in…') : (showForgot ? 'Send reset email' : 'Sign in')}
			</button>

			{#if showForgot}
				<button type="button" class="link-btn center" onclick={() => { showForgot = false; error = ''; success = '' }}>← Back to sign in</button>
			{:else}
				<div class="divider"><span></span><span class="or">or</span><span></span></div>
				<button type="button" class="btn-ghost" disabled={guestLoading} onclick={signInAsGuest}>{guestLoading ? 'Loading…' : 'Continue as guest'}</button>
				<p class="footer-link">No account? <a href="/m/signup" class="il">Create one</a></p>
			{/if}
		</form>
	</div>
</div>

<svelte:head><title>Sign in · Sippy</title></svelte:head>

<style>
.page {
	min-height: 100dvh; background: var(--warm-bg);
	display: flex; flex-direction: column;
	font-family: 'DM Sans', system-ui, sans-serif;
}

.header {
	background: var(--teal-dark); padding: 28px 24px 24px;
	display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden;
}
.header::before {
	content: ''; position: absolute; inset: 0;
	background: radial-gradient(circle at 20% 80%, rgba(0,135,189,0.22) 0, transparent 40%);
	pointer-events: none;
}
.back {
	display: inline-flex; align-items: center; gap: 4px; width: fit-content;
	color: rgba(255,255,255,0.72); font-size: 14px; font-weight: 500;
	text-decoration: none; position: relative; z-index: 1;
}
.wordmark { height: 32px; width: auto; filter: brightness(0) invert(1); position: relative; z-index: 1; }
.tagline { font-size: 15px; color: rgba(255,255,255,0.75); margin: 0; position: relative; z-index: 1; }

.form-card {
	flex: 1; background: var(--warm-surface);
	padding: 28px 24px 40px;
}

h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.4px; margin: 0 0 6px; color: var(--warm-text); }
.form-sub { font-size: 15px; color: var(--warm-text-secondary); margin: 0 0 24px; }

form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 14px; font-weight: 500; color: var(--warm-text-secondary); }

input[type='email'], input[type='password'], input[type='text'] {
	width: 100%; height: 52px; padding: 0 14px;
	border: 1px solid var(--warm-border); border-radius: 12px;
	background: var(--warm-bg); color: var(--warm-text);
	font-size: 16px; font-family: inherit; outline: none; box-sizing: border-box;
	transition: border-color 0.12s, box-shadow 0.12s;
}
input:focus { border-color: var(--teal-primary); box-shadow: 0 0 0 3px var(--teal-light); }

.pwd-wrap { position: relative; }
.pwd-wrap input { padding-right: 52px; }
.eye {
	position: absolute; right: 0; top: 0; width: 52px; height: 52px;
	border: none; background: transparent; display: grid; place-items: center;
	cursor: pointer; color: var(--warm-text-tertiary);
}

.link-btn {
	background: none; border: none; color: var(--teal-text);
	font-size: 13px; font-weight: 500; cursor: pointer; padding: 0;
	font-family: inherit; text-align: left;
}
.link-btn.center { text-align: center; width: 100%; }

.err-box {
	background: #fee2e2; border: 1px solid #fca5a5; border-radius: 12px;
	padding: 12px 14px; display: flex; flex-direction: column; gap: 4px;
	font-size: 14px;
}
.err-box strong { color: #dc2626; font-weight: 600; }
.err-box span { color: #7f1d1d; font-size: 13px; }
.err-msg { font-size: 14px; color: #ef4444; }
.ok-msg  { font-size: 14px; color: var(--teal-primary); }
.il { color: var(--teal-text); font-weight: 600; text-decoration: none; }

.btn-primary {
	width: 100%; height: 56px; background: var(--teal-primary); color: #fff;
	border: none; border-radius: 14px; font-size: 17px; font-weight: 600;
	font-family: inherit; cursor: pointer; transition: background 0.15s;
}
.btn-primary:hover:not(:disabled) { background: var(--teal-dark); }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

.divider { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--warm-text-tertiary); }
.divider span:first-child, .divider span:last-child { flex: 1; height: 1px; background: var(--warm-border); }

.btn-ghost {
	width: 100%; height: 56px; background: transparent; color: var(--warm-text);
	border: 1px solid var(--warm-border); border-radius: 14px;
	font-size: 17px; font-weight: 500; font-family: inherit;
	cursor: pointer; transition: border-color 0.15s, color 0.15s;
}
.btn-ghost:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

.footer-link { text-align: center; font-size: 15px; color: var(--warm-text-secondary); margin: 0; }
</style>
