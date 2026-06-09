<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()
let guestLoading = $state(false)
let guestError = $state('')

const continueAsGuest = async () => {
	guestLoading = true
	guestError = ''
	try {
		await auth.signInAsGuest()
		await goto('/')
	} catch (err: unknown) {
		guestLoading = false
		const code = (err as { code?: string }).code ?? ''
		if (code === 'auth/operation-not-allowed') {
			guestError = 'Guest access is not enabled. Please create an account.'
		} else {
			guestError = 'Could not sign in as guest. Please try again.'
		}
	}
}
</script>

<div class="page">
	<!-- Top-right corner arc -->
	<svg class="swirl swirl-tr" style="top:0;right:0;" width="320" height="320" viewBox="0 0 320 320" fill="none" aria-hidden="true">
		<circle cx="320" cy="0" r="138" stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="320" cy="0" r="160" stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="320" cy="0" r="182" stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="320" cy="0" r="204" stroke="var(--teal-primary)" stroke-width="2.5"/>
	</svg>
	<!-- Ring 5b — bottom-left corner-pinned arc -->
	<svg class="swirl swirl-bl" style="bottom:0;left:0;" width="240" height="240" viewBox="0 0 240 240" fill="none" aria-hidden="true">
		<circle cx="0" cy="240" r="72"  stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="0" cy="240" r="86"  stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="0" cy="240" r="100" stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="0" cy="240" r="114" stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="0" cy="240" r="128" stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="0" cy="240" r="142" stroke="var(--teal-primary)" stroke-width="2.5"/>
		<circle cx="0" cy="240" r="156" stroke="var(--teal-primary)" stroke-width="2.5"/>
	</svg>
	<!-- Nav -->
	<nav class="nav">
		<a href="/welcome" class="brand">
			<img src="/logo-icon.png" alt="" class="brand-mark" />
			<span class="brand-name">Sippy</span>
		</a>
		<div class="nav-actions">
			<a href="/login" class="ghost-btn">Sign in</a>
			<a href="/signup" class="teal-btn">Get started</a>
		</div>
	</nav>

	<!-- Hero — centered single column, coaster mockup decorative on wide screens -->
	<section class="hero">
		<div class="hero-inner">
			<img src="/logo-wordmark.png" alt="Sippy" class="wordmark" />

			<div class="badge">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C10 7 7 9 7 13a5 5 0 0010 0c0-4-3-6-5-11z" fill="#004566"/></svg>
				Smart coaster · Bluetooth ready
			</div>

			<h1>Know every&nbsp;sip.</h1>

			<p class="hero-body">
				Sippy tracks your water intake automatically — no manual logging, just drink.
				Your smart coaster does the rest.
			</p>

			<div class="cta-stack">
				<a href="/signup" class="btn-primary-lg">Create account</a>
				<a href="/login" class="btn-ghost-lg">Sign in</a>
				<button type="button" class="btn-guest" onclick={continueAsGuest} disabled={guestLoading}>
					{guestLoading ? 'Loading…' : 'Continue as guest'}
				</button>
				{#if guestError}
					<p class="guest-error">{guestError}</p>
				{/if}
			</div>

			<p class="hint">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
				No app install · Works in your browser
			</p>
		</div>

		<!-- Decorative coaster mockup — hidden on small screens -->
		<div class="mockup-wrap" aria-hidden="true">
			<!-- Ring 5a — sonar pulse behind coaster -->
			<svg class="sonar-pulse" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation-duration:2s;" width="680" height="680" viewBox="0 0 680 680" fill="none" aria-hidden="true">
				<circle cx="340" cy="340" r="56"  stroke="var(--teal-primary)" stroke-width="3.4" opacity="1"/>
				<circle cx="340" cy="340" r="88"  stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.9"/>
				<circle cx="340" cy="340" r="120" stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.8"/>
				<circle cx="340" cy="340" r="152" stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.7"/>
				<circle cx="340" cy="340" r="184" stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.6"/>
				<circle cx="340" cy="340" r="216" stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.5"/>
				<circle cx="340" cy="340" r="248" stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.4"/>
				<circle cx="340" cy="340" r="280" stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.3"/>
				<circle cx="340" cy="340" r="312" stroke="var(--teal-primary)" stroke-width="3.4" opacity="0.2"/>
			</svg>
			<div class="mockup">
				<div class="mockup-grid"></div>
				<div class="cup">
					<div class="cup-water"></div>
					<div class="cup-label">glass · 240ml</div>
				</div>
				<div class="coaster-base">
					<span class="coaster-key">weight</span>
					<span class="coaster-val">412 g</span>
				</div>
				<div class="ble-pill">
					<span class="ble-dot"></span>
					connected
				</div>
			</div>
		</div>
	</section>

	<!-- Feature cards -->
	<section class="features">
		<div class="feature-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
				</div>
				<div class="feature-title">Automatic sip detection</div>
				<div class="feature-body">Senses every cup pickup and refill from millisecond weight changes.</div>
			</div>
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
				</div>
				<div class="feature-title">Real-time dashboard</div>
				<div class="feature-body">Live stats update the instant the coaster detects a change.</div>
			</div>
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
				</div>
				<div class="feature-title">Smart reminders</div>
				<div class="feature-body">Adaptive nudges that learn your pace — never naggy.</div>
			</div>
		</div>
	</section>

	<footer class="site-footer">
		<span>© 2026 Sippy</span>
		<span>Built by the Sippy team · v1.0</span>
	</footer>
</div>

<svelte:head>
	<title>Sippy — Know every sip</title>
</svelte:head>

<style>
@keyframes hsPulse {
	0%   { box-shadow: 0 0 0 0 rgba(0,135,189,0.55); }
	70%  { box-shadow: 0 0 0 8px rgba(0,135,189,0); }
	100% { box-shadow: 0 0 0 0 rgba(0,135,189,0); }
}

@keyframes sonarBreath {
	0%, 100% { opacity: 0.10; }
	50%       { opacity: 0.24; }
}

.sonar-pulse {
	animation: sonarBreath 4s ease-in-out infinite;
}

@keyframes swirlPulseTR { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.20; } }
@keyframes swirlPulseBL { 0%, 100% { opacity: 0.13; } 50% { opacity: 0.30; } }

.swirl-tr { animation: swirlPulseTR 5s ease-in-out infinite 2s; animation-fill-mode: backwards; }
.swirl-bl { animation: swirlPulseBL 6s ease-in-out infinite 0.5s; animation-fill-mode: backwards; }

.page {
	background: var(--warm-bg);
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	font-family: 'DM Sans', system-ui, sans-serif;
	color: var(--warm-text);
	position: relative;
	overflow: clip;
}

.swirl {
	position: absolute;
	pointer-events: none;
}

/* ── Nav ── */
.nav {
	height: 60px;
	background: var(--warm-surface);
	border-bottom: 0.5px solid var(--warm-border);
	display: flex;
	align-items: center;
	padding: 0 24px;
	gap: 16px;
	position: sticky;
	top: 0;
	z-index: 20;
}

.brand {
	display: flex;
	align-items: center;
	gap: 9px;
	text-decoration: none;
	flex: 1;
}
.brand-mark { width: 26px; height: 26px; object-fit: contain; }
.brand-name { font-size: 16px; font-weight: 700; color: var(--warm-text); letter-spacing: -0.2px; }

.nav-actions { display: flex; align-items: center; gap: 8px; }

/* ── Hero ── */
.hero {
	position: relative;
	z-index: 1;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 64px;
	padding: 56px 32px 48px;
	max-width: 1200px;
	margin: 0 auto;
	width: 100%;
	box-sizing: border-box;
}

.hero-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	max-width: 560px;
	flex: 1;
}

.wordmark {
	height: 72px;
	width: auto;
	margin-bottom: 28px;
}

.badge {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 5px 12px;
	border-radius: 20px;
	background: var(--teal-light);
	color: var(--teal-text);
	font-size: 13px;
	font-weight: 500;
	margin-bottom: 22px;
}

h1 {
	font-size: 58px;
	line-height: 1.05;
	font-weight: 600;
	letter-spacing: -2px;
	margin: 0 0 20px;
	color: var(--warm-text);
}

.hero-body {
	font-size: 18px;
	line-height: 1.6;
	color: var(--warm-text-secondary);
	margin: 0 0 36px;
	max-width: 440px;
}

/* Stacked CTA column */
.cta-stack {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 12px;
	width: 100%;
	max-width: 340px;
	margin-bottom: 22px;
}

.btn-primary-lg {
	height: 54px;
	border-radius: 14px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	font-size: 17px;
	font-weight: 600;
	font-family: inherit;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	transition: background 0.15s;
}
.btn-primary-lg:hover { background: var(--teal-dark); }

.btn-ghost-lg {
	height: 54px;
	border-radius: 14px;
	background: var(--warm-surface);
	color: var(--warm-text);
	border: 1px solid var(--warm-border);
	font-size: 17px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	transition: border-color 0.15s, color 0.15s;
}
.btn-ghost-lg:hover { border-color: var(--teal-primary); color: var(--teal-primary); }

.btn-guest {
	background: none;
	border: none;
	font-size: 15px;
	font-weight: 500;
	color: var(--warm-text-secondary);
	cursor: pointer;
	font-family: inherit;
	padding: 6px 0;
	text-decoration: underline;
	text-decoration-color: var(--warm-border);
	transition: color 0.15s;
}
.btn-guest:hover { color: var(--teal-primary); }
.btn-guest:disabled { opacity: 0.5; cursor: not-allowed; }

.guest-error {
	font-size: 13px;
	color: #b91c1c;
	text-align: center;
	margin: 0;
}

.hint {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 7px;
	font-size: 13px;
	color: var(--warm-text-tertiary);
	margin: 0;
}

/* Nav buttons */
.teal-btn {
	height: 38px; padding: 0 16px; border-radius: 12px;
	background: var(--teal-primary); color: #fff; border: none;
	font-size: 14px; font-weight: 600; font-family: inherit;
	cursor: pointer; display: inline-flex; align-items: center;
	text-decoration: none; transition: background 0.15s;
}
.teal-btn:hover { background: var(--teal-dark); }

.ghost-btn {
	height: 38px; padding: 0 14px; border-radius: 12px;
	background: transparent; color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	font-size: 14px; font-weight: 500; font-family: inherit;
	cursor: pointer; display: inline-flex; align-items: center;
	text-decoration: none; transition: border-color 0.15s;
}
.ghost-btn:hover { border-color: var(--teal-primary); color: var(--teal-primary); }

/* ── Coaster mockup (hidden on narrow screens) ── */
.mockup-wrap {
	display: none;
	flex-shrink: 0;
}

@media (min-width: 860px) {
	.mockup-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 380px;
		position: relative;
	}
}

.mockup {
	position: relative;
	width: 100%;
	aspect-ratio: 1;
	background: linear-gradient(180deg, var(--teal-light) 0%, var(--warm-bg) 100%);
	border: 0.5px solid var(--warm-border);
	border-radius: 24px;
	overflow: hidden;
}
.mockup-grid {
	position: absolute; inset: 0;
	background-image: repeating-linear-gradient(45deg, rgba(30,90,138,0.05) 0 8px, transparent 8px 16px);
}
.cup {
	position: absolute; left: 50%; top: 30%; transform: translateX(-50%);
	width: 38%; height: 40%;
	background: #fff; border: 0.5px solid var(--warm-border);
	border-radius: 12% 12% 22% 22% / 6% 6% 18% 18%;
	box-shadow: inset 0 -16px 0 0 var(--teal-light);
}
.cup-water {
	position: absolute; left: 8px; right: 8px; bottom: 8px; height: 55%;
	background: var(--teal-primary);
	border-radius: 0 0 14% 14% / 0 0 30% 30%; opacity: 0.75;
}
.cup-label {
	position: absolute; top: 14px; left: 0; right: 0;
	text-align: center; font-size: 11px;
	color: var(--warm-text-tertiary); font-family: ui-monospace, monospace;
}
.coaster-base {
	position: absolute; left: 50%; bottom: 14%; transform: translateX(-50%);
	width: 60%; height: 14%; background: #fff; border: 0.5px solid var(--warm-border);
	border-radius: 50%; display: flex; align-items: center;
	justify-content: space-between; padding: 0 24px; box-sizing: border-box;
}
.coaster-key { font-size: 10px; color: var(--warm-text-tertiary); font-family: ui-monospace, monospace; }
.coaster-val { font-size: 12px; color: var(--teal-dark); font-family: ui-monospace, monospace; font-variant-numeric: tabular-nums; font-weight: 600; }
.ble-pill {
	position: absolute; top: 16px; right: 16px;
	display: flex; align-items: center; gap: 6px; padding: 4px 8px 4px 6px;
	border-radius: 20px; background: var(--warm-surface);
	border: 0.5px solid var(--warm-border); font-size: 11px; color: var(--warm-text-secondary);
}
.ble-dot {
	width: 6px; height: 6px; border-radius: 50%;
	background: var(--teal-primary);
	box-shadow: 0 0 0 0 rgba(0,135,189,0.55);
	animation: hsPulse 1.6s ease-out infinite; flex-shrink: 0;
}

/* ── Features ── */
.features {
	position: relative;
	z-index: 1;
	padding: 8px 24px 56px;
	max-width: 1200px;
	margin: 0 auto;
	width: 100%;
	box-sizing: border-box;
}

.feature-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 14px;
}

@media (min-width: 600px) {
	.feature-grid { grid-template-columns: repeat(3, 1fr); }
}

.feature-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 24px;
}
.feature-icon {
	width: 40px; height: 40px; border-radius: 12px;
	background: var(--teal-light); color: var(--teal-dark);
	display: grid; place-items: center; margin-bottom: 14px;
}
.feature-title { font-weight: 600; font-size: 15px; margin-bottom: 6px; }
.feature-body { font-size: 14px; color: var(--warm-text-secondary); line-height: 1.55; }

/* ── Footer ── */
.site-footer {
	position: relative;
	z-index: 2;
	padding: 20px 24px;
	background: var(--warm-bg);
	border-top: 1px solid rgba(0, 0, 0, 0.08);
	display: flex;
	justify-content: space-between;
	font-size: 12px;
	color: var(--warm-text-tertiary);
}

/* ── Responsive adjustments ── */
@media (max-width: 860px) {
	.hero {
		grid-template-columns: 1fr;
		padding: 48px 24px 40px;
	}
	.hero-right { display: none; }
	.hero-left { align-items: center; text-align: center; }
	.cta-row { justify-content: center; }
	.hero-tag { justify-content: center; }
}

@media (max-width: 480px) {
	h1 { font-size: 44px; letter-spacing: -1.5px; }
	.hero-body { font-size: 16px; }
	.wordmark { height: 56px; }
	.nav { padding: 0 16px; }
}
</style>
