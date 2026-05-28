<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()

let email = $state('')
let password = $state('')
let confirm = $state('')
let showPwd = $state(false)
let showConfirm = $state(false)
let error = $state('')
let loading = $state(false)

const reqs = [
	{ test: (p: string) => p.length >= 6, label: 'At least 6 characters' },
	{ test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
	{ test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special symbol' },
]

const metCount = $derived(reqs.filter((r) => r.test(password)).length)
const passwordsMatch = $derived(password === confirm && confirm.length > 0)

const strengthColor = $derived(
	metCount === 0 ? '#D9D9D2'
	: metCount === 1 ? '#A32D2D'
	: metCount === 2 ? '#D88742'
	: '#16a34a'
)
const strengthLabel = $derived(['Add a password', 'Weak', 'Almost there', 'Strong'][metCount])
const strengthFill = $derived([0, 1, 2, 4][metCount])

const handleSignUp = async (e: Event) => {
	e.preventDefault()
	error = ''
	if (!email.includes('@') || !email.includes('.')) { error = 'Please enter a valid email address.'; return }
	if (password.length < 6) { error = 'Password must be at least 6 characters.'; return }
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
	<!-- Left dark panel (same as login) -->
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
				<h1>Create your account</h1>
				<p class="form-sub">Start tracking sip-by-sip — takes ten seconds.</p>
			</div>

			<form onsubmit={handleSignUp}>
				<div class="field">
					<label for="email">Email</label>
					<input id="email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" required />
				</div>

				<div class="field">
					<label for="password">Password</label>
					<div class="pwd-wrap">
						<input
							id="password"
							type={showPwd ? 'text' : 'password'}
							bind:value={password}
							placeholder="Create a password"
							autocomplete="new-password"
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
					<!-- Strength bar -->
					<div class="strength">
						<div class="strength-bars">
							{#each [0,1,2,3] as i}
								<span class="bar" style="background: {i < strengthFill ? strengthColor : '#E6E4DC'}"></span>
							{/each}
						</div>
						<div class="strength-meta">
							<span>{strengthLabel}</span>
							<span class="strength-count">{metCount}/3</span>
						</div>
						<ul class="req-list">
							{#each reqs as req}
								{@const ok = req.test(password)}
								<li class:met={ok}>
									{#if ok}
										<span class="req-dot req-dot-ok">
											<svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="#004566"/></svg>
										</span>
									{:else}
										<span class="req-dot req-dot-off"></span>
									{/if}
									{req.label}
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<div class="field">
					<label for="confirm">Confirm password</label>
					<div class="pwd-wrap">
						<input
							id="confirm"
							type={showConfirm ? 'text' : 'password'}
							bind:value={confirm}
							placeholder="Repeat your password"
							autocomplete="new-password"
							required
						/>
						<button type="button" class="eye-btn" onclick={() => showConfirm = !showConfirm} aria-label={showConfirm ? 'Hide' : 'Show'}>
							{#if showConfirm}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
							{:else}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
							{/if}
						</button>
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

				<p class="terms">
					By signing up you agree to our <a href="#" class="inline-link">Terms</a> and <a href="#" class="inline-link">Privacy Policy</a>.
				</p>

				<div class="signin-row">
					Already have an account? <a href="/login" class="inline-link">Sign in</a>
				</div>
			</form>
		</div>
	</div>
</div>

<svelte:head>
	<title>Create account · Sippy</title>
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

.panel-wordmark { margin-bottom: 32px; }

.wordmark-img {
	height: 32px;
	width: auto;
	display: block;
	filter: brightness(0) invert(1);
}

.panel-foot { margin-top: auto; }

.panel-headline {
	font-size: 32px;
	font-weight: 500;
	line-height: 1.15;
	letter-spacing: -0.6px;
	color: #fff;
	margin-bottom: 14px;
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
	padding: 48px 48px;
	overflow-y: auto;
}

.form-inner {
	width: 100%;
	max-width: 380px;
}

.form-head { margin-bottom: 24px; }

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
.pwd-wrap input { padding-right: 40px; }

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

/* Strength bar */
.strength {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 8px;
}

.strength-bars {
	display: flex;
	gap: 4px;
}

.bar {
	flex: 1;
	height: 4px;
	border-radius: 4px;
	transition: background 0.2s;
}

.strength-meta {
	display: flex;
	justify-content: space-between;
	font-size: 11px;
	color: var(--warm-text-tertiary);
}

.strength-count { font-variant-numeric: tabular-nums; }

.req-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.req-list li {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: var(--warm-text-tertiary);
	transition: color 0.15s;
}
.req-list li.met { color: var(--warm-text-secondary); }

.req-dot {
	width: 14px;
	height: 14px;
	border-radius: 50%;
	flex-shrink: 0;
	display: grid;
	place-items: center;
}
.req-dot-ok { background: var(--teal-light); }
.req-dot-off { border: 1px solid var(--warm-border); }

/* Errors / success */
.error-box {
	background: #fee2e2;
	border: 0.5px solid #fca5a5;
	border-radius: 10px;
	padding: 10px 12px;
}
.error-title { font-size: 13px; font-weight: 600; color: #dc2626; }
.error-hint  { font-size: 12px; color: #7f1d1d; margin-top: 4px; }
.error-msg   { font-size: 13px; color: #ef4444; }

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

.terms {
	font-size: 11px;
	color: var(--warm-text-tertiary);
	margin: 0;
	line-height: 1.5;
	text-align: center;
}

.signin-row {
	text-align: center;
	font-size: 13px;
	color: var(--warm-text-secondary);
}
</style>
