<!-- Landing page — matches static site index.html (Variation A: split hero) -->

<div class="page">
	<!-- Public nav -->
	<nav class="pub-nav">
		<a href="/" class="brand">
			<img src="/logo-icon.png" alt="" class="brand-mark" />
			<span class="brand-name">Sippy</span>
		</a>
		<div class="nav-actions">
			<a href="/login" class="ghost-btn">Sign in</a>
			<a href="/signup" class="teal-btn">Create account</a>
		</div>
	</nav>

	<!-- Split hero -->
	<section class="hero-section">
		<div class="hero-left">
			<div class="wordmark-wrap">
				<img src="/logo-wordmark.png" alt="Sippy" class="wordmark" />
			</div>
			<div class="badge">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C10 7 7 9 7 13a5 5 0 0010 0c0-4-3-6-5-11z" fill="#004566"/></svg>
				Smart coaster · Bluetooth ready
			</div>
			<h1>Know every sip.</h1>
			<p class="hero-body">
				The Sippy coaster tracks your water intake automatically.
				No manual logging. Just drink.
			</p>
			<div class="cta-row">
				<a href="/signup" class="teal-btn-lg">Create account</a>
				<a href="/login" class="ghost-btn-lg">Try as guest</a>
			</div>
			<div class="hero-tag">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
				No app install · Works in your browser
			</div>
		</div>

		<div class="hero-right">
			<!-- CoasterMockup -->
			<div class="mockup">
				<div class="mockup-grid"></div>
				<!-- Cup -->
				<div class="cup">
					<div class="cup-water"></div>
					<div class="cup-label">glass · 240ml</div>
				</div>
				<!-- Coaster base -->
				<div class="coaster-base">
					<span class="coaster-key">weight</span>
					<span class="coaster-val">412 g</span>
				</div>
				<!-- BLE pill -->
				<div class="ble-pill">
					<span class="ble-dot"></span>
					connected
				</div>
			</div>
		</div>
	</section>

	<!-- Feature cards -->
	<section class="features-section">
		<div class="feature-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
				</div>
				<div class="feature-title">Automatic sip detection</div>
				<div class="feature-body">Senses every cup pickup and refill from millisecond weight changes.</div>
			</div>
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
				</div>
				<div class="feature-title">Real-time tracking</div>
				<div class="feature-body">Live dashboard updates the instant the coaster sees a change.</div>
			</div>
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
				</div>
				<div class="feature-title">Smart reminders</div>
				<div class="feature-body">Adaptive nudges that learn your pace — never naggy.</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="site-footer">
		<span>© 2026 Sippy</span>
		<span>Built by the Sippy team · v1.0</span>
	</footer>
</div>

<svelte:head>
	<title>Sippy</title>
</svelte:head>

<style>
@keyframes hsPulse {
	0%   { box-shadow: 0 0 0 0 rgba(0,135,189,0.55); }
	70%  { box-shadow: 0 0 0 8px rgba(0,135,189,0); }
	100% { box-shadow: 0 0 0 0 rgba(0,135,189,0); }
}

.page {
	background: var(--warm-bg);
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	font-family: 'DM Sans', system-ui, sans-serif;
	color: var(--warm-text);
}

/* ── Nav ── */
.pub-nav {
	height: 64px;
	background: var(--warm-surface);
	border-bottom: 0.5px solid var(--warm-border);
	display: flex;
	align-items: center;
	padding: 0 32px;
	gap: 32px;
	position: sticky;
	top: 0;
	z-index: 20;
}

.brand {
	display: flex;
	align-items: center;
	gap: 10px;
	text-decoration: none;
	flex: 1;
}

.brand-mark {
	width: 28px;
	height: 28px;
	border-radius: 7px;
	object-fit: contain;
}

.brand-name {
	font-size: 15px;
	font-weight: 700;
	color: var(--warm-text);
	letter-spacing: -0.2px;
}

.nav-actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

/* ── Hero ── */
.hero-section {
	max-width: 1280px;
	margin: 0 auto;
	padding: 72px 32px 56px;
	display: grid;
	grid-template-columns: minmax(0,1fr) minmax(0,1fr);
	gap: 56px;
	align-items: center;
	width: 100%;
	box-sizing: border-box;
}

.hero-left {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.wordmark-wrap {
	margin-bottom: 28px;
}

.wordmark {
	height: 60px;
	width: auto;
	display: block;
}

.badge {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px 10px;
	border-radius: 20px;
	background: var(--teal-light);
	color: var(--teal-text);
	font-size: 12px;
	font-weight: 500;
	margin-bottom: 20px;
}

h1 {
	font-size: 56px;
	line-height: 1.05;
	font-weight: 500;
	letter-spacing: -1.5px;
	margin: 0 0 20px;
}

.hero-body {
	font-size: 18px;
	line-height: 1.55;
	color: var(--warm-text-secondary);
	margin: 0 0 32px;
	max-width: 460px;
}

.cta-row {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	margin-bottom: 28px;
}

.hero-tag {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	color: var(--warm-text-tertiary);
}

/* ── Buttons ── */
.teal-btn {
	height: 36px;
	padding: 0 16px;
	border-radius: 12px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	font-size: 14px;
	font-weight: 600;
	font-family: inherit;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	text-decoration: none;
	transition: background 0.15s;
}
.teal-btn:hover { background: var(--teal-dark); }

.ghost-btn {
	height: 36px;
	padding: 0 14px;
	border-radius: 12px;
	background: transparent;
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	font-size: 14px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	text-decoration: none;
	transition: border-color 0.15s;
}
.ghost-btn:hover { border-color: var(--teal-primary); color: var(--teal-primary); }

.teal-btn-lg {
	height: 48px;
	padding: 0 22px;
	border-radius: 12px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	font-size: 15px;
	font-weight: 600;
	font-family: inherit;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	text-decoration: none;
	transition: background 0.15s;
}
.teal-btn-lg:hover { background: var(--teal-dark); }

.ghost-btn-lg {
	height: 48px;
	padding: 0 20px;
	border-radius: 12px;
	background: transparent;
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	font-size: 15px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	text-decoration: none;
	transition: border-color 0.15s;
}
.ghost-btn-lg:hover { border-color: var(--teal-primary); color: var(--teal-primary); }

/* ── Coaster Mockup ── */
.hero-right {
	display: flex;
	align-items: center;
	justify-content: center;
}

.mockup {
	position: relative;
	aspect-ratio: 1 / 1;
	width: 100%;
	max-width: 420px;
	background: linear-gradient(180deg, var(--teal-light) 0%, var(--warm-bg) 100%);
	border: 0.5px solid var(--warm-border);
	border-radius: 24px;
	overflow: hidden;
}

.mockup-grid {
	position: absolute;
	inset: 0;
	background-image: repeating-linear-gradient(45deg, rgba(30,90,138,0.05) 0 8px, transparent 8px 16px);
}

.cup {
	position: absolute;
	left: 50%;
	top: 30%;
	transform: translateX(-50%);
	width: 38%;
	height: 40%;
	background: #fff;
	border: 0.5px solid var(--warm-border);
	border-radius: 12% 12% 22% 22% / 6% 6% 18% 18%;
	box-shadow: inset 0 -16px 0 0 var(--teal-light);
}

.cup-water {
	position: absolute;
	left: 8px;
	right: 8px;
	bottom: 8px;
	height: 55%;
	background: var(--teal-primary);
	border-radius: 0 0 14% 14% / 0 0 30% 30%;
	opacity: 0.75;
}

.cup-label {
	position: absolute;
	top: 14px;
	left: 0;
	right: 0;
	text-align: center;
	font-size: 11px;
	color: var(--warm-text-tertiary);
	font-family: ui-monospace, SFMono-Regular, monospace;
}

.coaster-base {
	position: absolute;
	left: 50%;
	bottom: 14%;
	transform: translateX(-50%);
	width: 60%;
	height: 14%;
	background: #fff;
	border: 0.5px solid var(--warm-border);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24px;
	box-sizing: border-box;
}

.coaster-key {
	font-size: 10px;
	color: var(--warm-text-tertiary);
	font-family: ui-monospace, monospace;
}

.coaster-val {
	font-size: 12px;
	color: var(--teal-dark);
	font-family: ui-monospace, monospace;
	font-variant-numeric: tabular-nums;
	font-weight: 600;
}

.ble-pill {
	position: absolute;
	top: 16px;
	right: 16px;
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 4px 8px 4px 6px;
	border-radius: 20px;
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	font-size: 11px;
	color: var(--warm-text-secondary);
}

.ble-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--teal-primary);
	box-shadow: 0 0 0 0 rgba(0,135,189,0.55);
	animation: hsPulse 1.6s ease-out infinite;
	flex-shrink: 0;
}

/* ── Features ── */
.features-section {
	max-width: 1280px;
	margin: 0 auto;
	padding: 24px 32px 72px;
	width: 100%;
	box-sizing: border-box;
}

.feature-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0,1fr));
	gap: 16px;
}

.feature-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 24px;
}

.feature-icon {
	width: 36px;
	height: 36px;
	border-radius: 10px;
	background: var(--teal-light);
	color: var(--teal-dark);
	display: grid;
	place-items: center;
	margin-bottom: 16px;
}

.feature-title {
	font-weight: 500;
	font-size: 15px;
	margin-bottom: 6px;
}

.feature-body {
	font-size: 13.5px;
	color: var(--warm-text-secondary);
	line-height: 1.55;
}

/* ── Footer ── */
.site-footer {
	margin-top: auto;
	padding: 24px 32px;
	border-top: 0.5px solid var(--warm-border);
	display: flex;
	justify-content: space-between;
	font-size: 12px;
	color: var(--warm-text-tertiary);
}
</style>
