<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()

let email       = $state('')
let password    = $state('')
let confirm     = $state('')
let showPwd     = $state(false)
let showConfirm = $state(false)
let error       = $state('')
let loading     = $state(false)

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const reqs = [
	{ test: (p: string) => p.length >= 6, label: 'At least 6 characters' },
	{ test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
	{ test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special symbol' },
]
const metCount = $derived(reqs.filter(r => r.test(password)).length)
const allMet   = $derived(metCount === reqs.length)
const pwdMatch = $derived(password === confirm && confirm.length > 0)
const barColor = $derived(metCount === 0 ? '#D9D9D2' : metCount === 1 ? '#A32D2D' : metCount === 2 ? '#D88742' : '#16a34a')
const barFill  = $derived([0,1,2,4][metCount])
const barLabel = $derived(['Add a password','Weak','Almost there','Strong'][metCount])

const handleSignUp = async (e: Event) => {
	e.preventDefault(); error = ''
	if (!email.trim())        { error = 'Please enter your email address.'; return }
	if (!isValidEmail(email)) { error = 'Please enter a valid email address.'; return }
	if (!password)            { error = 'Please choose a password.'; return }
	if (password.length < 6)  { error = 'Password must be at least 6 characters.'; return }
	if (!allMet)              { error = 'Password does not meet all requirements yet.'; return }
	if (!confirm)             { error = 'Please confirm your password.'; return }
	if (!pwdMatch)            { error = 'Passwords do not match.'; return }
	loading = true
	try { await auth.register(email, password); await goto('/m') }
	catch (err: unknown) {
		const msg = (err as Error).message ?? ''
		error = msg === 'EMAIL_IN_USE' ? 'EMAIL_IN_USE' : (msg || 'Sign up failed. Try again.')
	} finally { loading = false }
}
</script>

<div class="page">
	<div class="header">
		<a href="/m/welcome" class="back">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4L6 10l6 6"/></svg>
			Back
		</a>
		<img src="/logo-wordmark.png" alt="Sippy" class="wordmark" />
		<p class="tagline">Track every sip. No manual logging.</p>
	</div>

	<div class="form-card">
		<h1>Create your account</h1>
		<p class="form-sub">Takes ten seconds.</p>

		<form novalidate onsubmit={handleSignUp}>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" />
			</div>

			<div class="field">
				<label for="password">Password</label>
				<div class="pwd-wrap">
					<input id="password" type={showPwd ? 'text' : 'password'} bind:value={password} placeholder="Create a password" autocomplete="new-password" />
					<button type="button" class="eye" onclick={() => showPwd = !showPwd}>
						{#if showPwd}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
						{:else}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{/if}
					</button>
				</div>
				{#if password.length > 0}
					<div class="strength">
						<div class="bars">{#each [0,1,2,3] as i}<span class="bar" style="background:{i<barFill?barColor:'#E6E4DC'}"></span>{/each}</div>
						<div class="smeta"><span style="color:{barColor};font-weight:500">{barLabel}</span><span class="muted">{metCount}/3</span></div>
						<ul class="reqs">
							{#each reqs as req}{@const ok=req.test(password)}
								<li class:met={ok}>
									{#if ok}<span class="rdot rok"><svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="#004566"/></svg></span>
									{:else}<span class="rdot roff"></span>{/if}
									{req.label}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<div class="field">
				<label for="confirm">Confirm password</label>
				<div class="pwd-wrap">
					<input id="confirm" type={showConfirm ? 'text' : 'password'} bind:value={confirm} placeholder="Repeat your password" autocomplete="new-password" />
					<button type="button" class="eye" onclick={() => showConfirm = !showConfirm}>
						{#if showConfirm}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
						{:else}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{/if}
					</button>
				</div>
				{#if confirm.length > 0 && !pwdMatch}<span class="ferr">Passwords do not match.</span>
				{:else if confirm.length > 0 && pwdMatch}<span class="fok">Passwords match.</span>{/if}
			</div>

			{#if error === 'EMAIL_IN_USE'}
				<div class="err-box"><strong>Email already in use.</strong><span><a href="/m/login" class="il">Sign in instead</a>.</span></div>
			{:else if error}<div class="err-msg">{error}</div>{/if}

			<button type="submit" class="btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
			<p class="footer-link">Already have an account? <a href="/m/login" class="il">Sign in</a></p>
		</form>
	</div>
</div>

<svelte:head><title>Create account · Sippy</title></svelte:head>

<style>
.page { min-height: 100dvh; background: var(--warm-bg); display: flex; flex-direction: column; font-family: 'DM Sans', system-ui, sans-serif; }
.header { background: var(--teal-dark); padding: 24px 24px 20px; display: flex; flex-direction: column; gap: 10px; position: relative; overflow: hidden; flex-shrink: 0; }
.header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 80%, rgba(0,135,189,0.22) 0, transparent 40%); pointer-events: none; }
.back { display: inline-flex; align-items: center; gap: 4px; width: fit-content; color: rgba(255,255,255,0.72); font-size: 14px; font-weight: 500; text-decoration: none; position: relative; z-index: 1; }
.wordmark { height: 30px; width: auto; filter: brightness(0) invert(1); position: relative; z-index: 1; }
.tagline { font-size: 14px; color: rgba(255,255,255,0.72); margin: 0; position: relative; z-index: 1; }
.form-card { flex: 1; background: var(--warm-surface); padding: 24px 24px 48px; }
h1 { font-size: 22px; font-weight: 600; letter-spacing: -0.4px; margin: 0 0 4px; color: var(--warm-text); }
.form-sub { font-size: 14px; color: var(--warm-text-secondary); margin: 0 0 20px; }
form { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 14px; font-weight: 500; color: var(--warm-text-secondary); }
input[type='email'], input[type='password'], input[type='text'] {
	width: 100%; height: 52px; padding: 0 14px; border: 1px solid var(--warm-border); border-radius: 12px;
	background: var(--warm-bg); color: var(--warm-text); font-size: 16px; font-family: inherit;
	outline: none; box-sizing: border-box; transition: border-color 0.12s, box-shadow 0.12s;
}
input:focus { border-color: var(--teal-primary); box-shadow: 0 0 0 3px var(--teal-light); }
.pwd-wrap { position: relative; }
.pwd-wrap input { padding-right: 52px; }
.eye { position: absolute; right: 0; top: 0; width: 52px; height: 52px; border: none; background: transparent; display: grid; place-items: center; cursor: pointer; color: var(--warm-text-tertiary); }
.strength { display: flex; flex-direction: column; gap: 6px; }
.bars { display: flex; gap: 4px; }
.bar { flex: 1; height: 4px; border-radius: 4px; transition: background 0.2s; }
.smeta { display: flex; justify-content: space-between; font-size: 12px; }
.muted { color: var(--warm-text-tertiary); }
.reqs { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.reqs li { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--warm-text-tertiary); }
.reqs li.met { color: var(--warm-text-secondary); }
.rdot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; display: grid; place-items: center; }
.rok { background: var(--teal-light); }
.roff { border: 1px solid var(--warm-border); }
.ferr { font-size: 13px; color: #ef4444; }
.fok { font-size: 13px; color: #16a34a; font-weight: 500; }
.err-box { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
.err-box strong { color: #dc2626; font-weight: 600; }
.err-box span { color: #7f1d1d; font-size: 13px; }
.err-msg { font-size: 14px; color: #ef4444; }
.il { color: var(--teal-text); font-weight: 600; text-decoration: none; }
.btn-primary { width: 100%; height: 56px; background: var(--teal-primary); color: #fff; border: none; border-radius: 14px; font-size: 17px; font-weight: 600; font-family: inherit; cursor: pointer; transition: background 0.15s; margin-top: 4px; }
.btn-primary:hover:not(:disabled) { background: var(--teal-dark); }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
.footer-link { text-align: center; font-size: 15px; color: var(--warm-text-secondary); margin: 0; }
</style>
