<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import { demo } from '$lib/demo.svelte'
import QRScanner from '$lib/QRScanner.svelte'
import toast from 'svelte-french-toast'
import { Toaster } from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth  = Auth.getInstance()

// When demo mode is on, all display values come from the demo store
const d = $derived(demo.active ? {
	consumedMl:         demo.consumedMl,
	target:             demo.dailyTargetMl,
	sipCount:           demo.sipCount,
	avgSipMl:           demo.avgSipMl,
	nextSipInMs:        demo.nextSipInMs,
	consumedThisHourMl: demo.consumedThisHourMl,
	hourlyTarget:       demo.hourlyTargetMl,
	reminderStatus:     demo.reminderStatus,
} : {
	consumedMl:         scale.consumedMl,
	target:             scale.dailyTargetIntake.current,
	sipCount:           scale.sipCount,
	avgSipMl:           scale.averageSipSizeMl,
	nextSipInMs:        scale.nextSipDueInMs,
	consumedThisHourMl: scale.consumedThisHourMl,
	hourlyTarget:       scale.hourlyTargetIntake.current,
	reminderStatus:     scale.reminderStatus,
})

const rawPct   = $derived(d.target > 0 ? (d.consumedMl / d.target) * 100 : 0)
const goalPct  = $derived(Math.min(100, rawPct))
const overGoal = $derived(rawPct > 100)
const overMl   = $derived(Math.max(0, Math.round(d.consumedMl - d.target)))
const isSipDue = $derived(d.reminderStatus === 'sip_due')
const fmtMl    = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const fmtMin   = (ms: number | null) => ms === null ? '—' : `${Math.max(1, Math.round(ms / 60000))} m`

const reminderValue = $derived.by(() => {
	if (d.reminderStatus === 'sip_due')       return 'Drink now!'
	if (d.reminderStatus === 'on_track')       return `In ${fmtMin(d.nextSipInMs)}`
	if (d.reminderStatus === 'target_reached') return 'Goal hit!'
	return 'Off'
})
const reminderSub = $derived.by(() => {
	if (d.reminderStatus === 'sip_due') return 'Overdue'
	if (d.reminderStatus === 'on_track') return `${fmtMl(d.consumedThisHourMl)} / ${fmtMl(d.hourlyTarget)} ml/hr`
	return 'Enable in Settings'
})

let showQR = $state(false)

const tare = async () => {
	try { await scale.bt.tareScale() }
	catch (err) { toast.error(`Tare failed: ${(err as Error).message}`) }
}
const connectScale = async () => {
	try { await scale.bt.connect() }
	catch (err) { toast.error(`Connect failed: ${(err as Error).message}`) }
}
const onQRScan = async (result: string) => {
	showQR = false
	try {
		await scale.bt.connectById(result.trim())
		toast.success('Scale connected!')
	} catch (err) {
		toast.error(`Could not connect: ${(err as Error).message}`)
	}
}
</script>

{#if showQR}
	<QRScanner onScan={onQRScan} onClose={() => showQR = false} />
{/if}

<div class="page">

	<!-- Greeting row -->
	<div class="greeting">
		<div class="greeting-text">
			<p class="greeting-time">{auth.greeting}</p>
			<h1 class="greeting-name">{auth.user?.name ?? ''}</h1>
		</div>
		<span class="streak">
			<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2C7 6 5 8 5 11a5 5 0 0010 0c0-3-2-5-5-9z" fill="#f59e0b"/></svg>
			{auth.streakDays}d
		</span>
	</div>

	<!-- Hero progress card — grows to fill available space -->
	<div class="hero" class:hero-over={overGoal}>
		<div class="hero-orbs"></div>
		<p class="hero-label">TODAY</p>
		<div class="hero-pct">{Math.round(rawPct)}<span class="hero-sign">%</span></div>
		<p class="hero-ml">{fmtMl(d.consumedMl)} / {fmtMl(d.target)} ml</p>
		<div class="hero-track">
			<div class="hero-fill" style="width:{goalPct}%"></div>
			{#if overGoal}<span class="hero-overflow-dot"></span>{/if}
		</div>
		{#if overGoal}
			<div class="hero-badge">
				<svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
				Goal crushed! +{fmtMl(overMl)} ml extra
			</div>
		{/if}
	</div>

	<!-- 2 × 2 stat grid -->
	<div class="stats">
		<div class="stat">
			<div class="stat-head">Sips today</div>
			<span class="stat-val">{d.sipCount}</span>
			<span class="stat-sub">recorded today</span>
		</div>
		<div class="stat">
			<div class="stat-head">Consumed</div>
			<span class="stat-val">{fmtMl(d.consumedMl)}<small>ml</small></span>
			<span class="stat-sub">of {fmtMl(d.target)} ml goal</span>
		</div>
		<div class="stat">
			<div class="stat-head">Avg sip</div>
			<span class="stat-val">{d.avgSipMl.toFixed(0)}<small>ml</small></span>
			<span class="stat-sub">per sip</span>
		</div>
		<div class="stat">
			<div class="stat-head">Next sip</div>
			<span class="stat-val">{fmtMin(d.nextSipInMs)}</span>
			<span class="stat-sub">adaptive pace</span>
		</div>
	</div>

	<!-- 2 × 1 info row: reminder + scale -->
	<div class="info-row">

		<!-- Reminder -->
		<div class="info-card" class:info-amber={isSipDue}>
			<div class="info-icon" class:icon-amber={isSipDue}>
				<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
			</div>
			<p class="info-label">Reminder</p>
			<p class="info-value" class:value-amber={isSipDue}>{reminderValue}</p>
			<p class="info-sub">{reminderSub}</p>
		</div>

		<!-- Scale -->
		<div class="info-card">
			{#if scale.bt.connected}
				<div class="info-icon icon-teal">
					<svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
				</div>
				<p class="info-label">Scale</p>
				<p class="info-value">{scale.bt.currentWeight.toFixed(1)}<small>g</small></p>
				<button class="tare-mini" onclick={tare} disabled={scale.bt.calibrationBusy}>Tare</button>
			{:else}
				<div class="info-icon icon-dim">
					<svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 2l20 20"/><path d="M8.5 4.5A7 7 0 0119 15M5 7a7 7 0 009.5 9.5"/></svg>
				</div>
				<p class="info-label">Scale</p>
				<p class="info-value dim">Not paired</p>
				<div class="connect-btns">
					<button class="conn-btn" onclick={connectScale}>Pair</button>
					<button class="conn-btn qr-btn" onclick={() => showQR = true}>
						<svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
						QR
					</button>
				</div>
			{/if}
		</div>

	</div>

</div>

<Toaster />
<svelte:head><title>Dashboard · Sippy</title></svelte:head>

<style>
.page {
	padding: 20px 16px 24px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	box-sizing: border-box;
	min-height: calc(100dvh - 60px - env(safe-area-inset-bottom, 0px));
}

/* ── Greeting ── */
.greeting {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 10px;
	flex-shrink: 0;
}
.greeting-text { min-width: 0; overflow: hidden; }
.greeting-time {
	font-size: 13px;
	color: var(--warm-text-tertiary);
	margin: 0 0 2px;
}
h1.greeting-name {
	font-size: 24px;
	font-weight: 600;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.streak {
	flex-shrink: 0;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 13px;
	font-weight: 600;
	color: #854f0b;
	background: #faeeda;
	border: 0.5px solid #fac775;
	border-radius: 20px;
	padding: 6px 13px;
	margin-top: 4px;
	white-space: nowrap;
}

/* ── Hero — grows to fill available space ── */
.hero {
	border-radius: 22px;
	padding: 28px 22px 24px;
	background: linear-gradient(135deg, var(--teal-dark) 0%, #2a7ab9 55%, var(--teal-primary) 100%);
	color: #fff;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;          /* fills remaining space between greeting and stats */
	min-height: 170px;
}
.hero-orbs {
	position: absolute; inset: 0;
	background-image:
		radial-gradient(circle at 15% 80%, rgba(255,255,255,0.14) 0, transparent 38%),
		radial-gradient(circle at 85% 18%, rgba(255,255,255,0.08) 0, transparent 35%);
	pointer-events: none;
}
.hero-label {
	position: relative;
	font-size: 11px;
	color: rgba(255,255,255,0.75);
	text-transform: uppercase;
	letter-spacing: 1.2px;
	margin: 0 0 12px;
}
.hero-pct {
	position: relative;
	font-size: 80px;
	font-weight: 600;
	letter-spacing: -3px;
	line-height: 1;
	margin-bottom: 8px;
	font-variant-numeric: tabular-nums;
}
.hero-sign {
	font-size: 32px;
	color: rgba(255,255,255,0.55);
	letter-spacing: 0;
}
.hero-ml {
	position: relative;
	font-size: 15px;
	color: rgba(255,255,255,0.85);
	margin: 0 0 20px;
	font-variant-numeric: tabular-nums;
}
.hero-track {
	position: relative;
	width: 100%;
	height: 8px;
	background: rgba(255,255,255,0.22);
	border-radius: 20px;
	overflow: visible;
}
.hero-fill {
	height: 100%;
	background: #fff;
	border-radius: 20px;
	min-width: 6px;
	transition: width 600ms cubic-bezier(.2,.7,.3,1);
}
/* Pulsing dot that appears at the right end of a full bar */
.hero-overflow-dot {
	position: absolute;
	right: -5px; top: 50%;
	transform: translateY(-50%);
	width: 18px; height: 18px;
	border-radius: 50%;
	background: rgba(255,255,255,0.95);
	animation: overflow-pulse 1.4s ease-out infinite;
}
@keyframes overflow-pulse {
	0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.6); }
	70%  { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
	100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
}
/* Congratulatory badge */
.hero-badge {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: 12px;
	font-weight: 600;
	color: rgba(255,255,255,0.95);
	background: rgba(255,255,255,0.18);
	border: 1px solid rgba(255,255,255,0.3);
	border-radius: 20px;
	padding: 5px 12px;
	margin-top: 12px;
}
/* Slightly brighter gradient when over goal */
.hero.hero-over {
	background: linear-gradient(135deg, #004d6e 0%, #0077a8 50%, #00a3d9 100%);
}

/* ── Stats 2×2 ── */
.stats {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
	flex-shrink: 0;
}
.stat {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 16px 12px;
	display: flex;
	flex-direction: column;
	gap: 6px;
	overflow: hidden;
	min-width: 0;
}
.stat-head {
	font-size: 11px;
	font-weight: 500;
	color: var(--warm-text-tertiary);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.stat-val {
	font-size: 28px;
	font-weight: 600;
	letter-spacing: -0.8px;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}
.stat-val small {
	font-size: 13px;
	font-weight: 400;
	color: var(--warm-text-secondary);
	letter-spacing: 0;
}
.stat-sub {
	display: block;
	font-size: 11px;
	color: var(--warm-text-tertiary);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* ── Info row 2×1 ── */
.info-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
	flex-shrink: 0;
}
.info-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 18px 16px;
	display: flex;
	flex-direction: column;
	gap: 5px;
	overflow: hidden;
	transition: background 0.2s, border-color 0.2s;
}
.info-card.info-amber {
	background: var(--amber-bg);
	border-color: var(--amber-border);
}
.info-icon {
	width: 38px; height: 38px;
	border-radius: 12px;
	background: var(--teal-light);
	color: var(--teal-dark);
	display: grid; place-items: center;
	margin-bottom: 6px;
	flex-shrink: 0;
}
.info-icon.icon-amber { background: rgba(133,79,11,0.12); color: #854f0b; }
.info-icon.icon-teal  { background: var(--teal-light);    color: var(--teal-dark); }
.info-icon.icon-dim   { background: var(--warm-bg);        color: var(--warm-text-tertiary); }
.info-label {
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--warm-text-tertiary);
	margin: 0;
}
.info-value {
	font-size: 22px;
	font-weight: 600;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 1.2;
}
.info-value small {
	font-size: 14px;
	font-weight: 400;
	color: var(--warm-text-secondary);
}
.info-value.value-amber { color: #854f0b; }
.info-value.dim { color: var(--warm-text-tertiary); font-size: 16px; font-weight: 500; }
.info-sub {
	font-size: 11px;
	color: var(--warm-text-tertiary);
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.tare-mini {
	margin-top: 6px;
	height: 32px;
	padding: 0 14px;
	border-radius: 9px;
	background: var(--warm-bg);
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	font-size: 13px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	align-self: flex-start;
	transition: border-color 0.15s;
}
.tare-mini:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.tare-mini:disabled { opacity: 0.4; cursor: not-allowed; }

.connect-btns {
	display: flex;
	gap: 6px;
	margin-top: 6px;
}
.conn-btn {
	flex: 1;
	height: 32px;
	border-radius: 9px;
	background: var(--warm-bg);
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	font-size: 13px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	transition: border-color 0.15s, color 0.15s;
}
.conn-btn:hover { border-color: var(--teal-primary); color: var(--teal-primary); }
.qr-btn { flex: 0 0 auto; padding: 0 12px; }
</style>
