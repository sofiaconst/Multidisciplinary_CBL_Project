<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import toast from 'svelte-french-toast'
import { Toaster } from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth  = Auth.getInstance()

const goalPct = $derived(
	scale.dailyTargetIntake.current > 0
		? Math.min(100, (scale.consumedMl / scale.dailyTargetIntake.current) * 100)
		: 0
)
const isSipDue = $derived(scale.reminderStatus === 'sip_due')
const fmtMl    = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const fmtMin   = (ms: number | null) => ms === null ? '—' : `${Math.max(1, Math.round(ms / 60000))} m`

const tare = async () => {
	try { await scale.bt.tareScale() }
	catch (err) { toast.error(`Tare failed: ${(err as Error).message}`) }
}
</script>

<div class="page">

	<!-- Greeting row -->
	<div class="greeting">
		<div>
			<p class="greeting-time">{auth.greeting}</p>
			<h1 class="greeting-name">{auth.user?.name ?? ''}</h1>
		</div>
		<span class="streak">
			<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 2C7 6 5 8 5 11a5 5 0 0010 0c0-3-2-5-5-9z" fill="#f59e0b"/></svg>
			{auth.streakDays} day streak
		</span>
	</div>

	<!-- Hero progress card -->
	<div class="hero">
		<div class="hero-orbs"></div>
		<p class="hero-label">TODAY</p>
		<div class="hero-pct">{Math.round(goalPct)}<span class="hero-sign">%</span></div>
		<p class="hero-ml">{fmtMl(scale.consumedMl)} / {fmtMl(scale.dailyTargetIntake.current)} ml</p>
		<div class="hero-track">
			<div class="hero-fill" style="width:{goalPct}%"></div>
		</div>
	</div>

	<!-- 2 × 2 stat grid -->
	<div class="stats">
		<div class="stat">
			<span class="stat-name">Sips today</span>
			<span class="stat-val">{scale.sipCount}</span>
		</div>
		<div class="stat">
			<span class="stat-name">Consumed</span>
			<span class="stat-val">{fmtMl(scale.consumedMl)}<small>ml</small></span>
		</div>
		<div class="stat">
			<span class="stat-name">Avg sip</span>
			<span class="stat-val">{scale.averageSipSizeMl.toFixed(0)}<small>ml</small></span>
		</div>
		<div class="stat">
			<span class="stat-name">Next sip</span>
			<span class="stat-val">{fmtMin(scale.nextSipDueInMs)}</span>
		</div>
	</div>

	<!-- Reminder card -->
	<div class="card reminder" class:sip-due={isSipDue}>
		<div class="reminder-icon" class:amber={isSipDue}>
			<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
		</div>
		<div class="reminder-body">
			<p class="reminder-title">
				{#if scale.reminderStatus === 'sip_due'}Time to drink
				{:else if scale.reminderStatus === 'on_track'}Next reminder
				{:else if scale.reminderStatus === 'target_reached'}Hourly target reached
				{:else}Reminders off{/if}
			</p>
			<p class="reminder-desc">
				{#if scale.reminderStatus === 'sip_due'}Drink now · you're overdue
				{:else if scale.reminderStatus === 'on_track'}In {fmtMin(scale.nextSipDueInMs)} · adaptive pacing
				{:else if scale.reminderStatus === 'target_reached'}Great job this hour!
				{:else}Enable reminders in Settings{/if}
			</p>
		</div>
		<span class="reminder-aside">{fmtMl(scale.consumedThisHourMl)}&nbsp;/&nbsp;{fmtMl(scale.hourlyTargetIntake.current)}&nbsp;ml/hr</span>
	</div>

	<!-- Live scale card (only when connected) -->
	{#if scale.bt.connected}
		<div class="card scale-card">
			<div class="scale-head">
				<svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="var(--teal-dark)" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
				<span class="scale-lbl">Live scale reading</span>
				<span class="live-pill"><span class="live-dot"></span>live</span>
			</div>
			<div class="scale-reading">
				<span class="scale-weight">{scale.bt.currentWeight.toFixed(1)}</span>
				<span class="scale-unit">g</span>
				<span class="cup-lbl">cup detected</span>
			</div>
			<button class="tare-btn" onclick={tare} disabled={scale.bt.calibrationBusy}>
				<svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
				Tare scale
			</button>
		</div>
	{/if}

</div>

<Toaster />
<svelte:head><title>Dashboard · Sippy</title></svelte:head>

<style>
@keyframes pulse {
	0%,100% { box-shadow: 0 0 0 0 rgba(0,135,189,0.5); }
	70%      { box-shadow: 0 0 0 7px rgba(0,135,189,0); }
}

.page {
	padding: 20px 16px 36px;
	display: flex;
	flex-direction: column;
	gap: 14px;
}

/* Greeting */
.greeting {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 12px;
}
.greeting-time {
	font-size: 14px;
	color: var(--warm-text-tertiary);
	margin: 0 0 2px;
}
h1.greeting-name {
	font-size: 26px;
	font-weight: 600;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	margin: 0;
}
.streak {
	flex-shrink: 0;
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: 13px;
	font-weight: 600;
	color: #854f0b;
	background: #faeeda;
	border: 0.5px solid #fac775;
	border-radius: 20px;
	padding: 6px 14px;
	margin-top: 4px;
}

/* Hero */
.hero {
	border-radius: 22px;
	padding: 32px 20px 24px;
	background: linear-gradient(135deg, var(--teal-dark) 0%, #2a7ab9 55%, var(--teal-primary) 100%);
	color: #fff;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
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
	font-size: 12px;
	color: rgba(255,255,255,0.75);
	text-transform: uppercase;
	letter-spacing: 1.2px;
	margin: 0 0 12px;
}
.hero-pct {
	position: relative;
	font-size: 80px;
	font-weight: 600;
	letter-spacing: -4px;
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
	height: 10px;
	background: rgba(255,255,255,0.22);
	border-radius: 20px;
	overflow: hidden;
}
.hero-fill {
	height: 100%;
	background: #fff;
	border-radius: 20px;
	min-width: 6px;
	transition: width 600ms cubic-bezier(.2,.7,.3,1);
}

/* Stats 2×2 */
.stats {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}
.stat {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 18px 16px;
	display: flex;
	flex-direction: column;
	gap: 6px;
}
.stat-name {
	font-size: 13px;
	color: var(--warm-text-secondary);
	font-weight: 500;
}
.stat-val {
	font-size: 30px;
	font-weight: 600;
	letter-spacing: -0.8px;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}
.stat-val small {
	font-size: 15px;
	font-weight: 400;
	color: var(--warm-text-secondary);
	letter-spacing: 0;
}

/* Cards base */
.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 20px;
}

/* Reminder */
.reminder {
	display: flex;
	align-items: center;
	gap: 14px;
	transition: background 0.25s, border-color 0.25s;
}
.reminder.sip-due {
	background: #faeeda;
	border-color: #fac775;
}
.reminder-icon {
	width: 48px; height: 48px;
	border-radius: 14px;
	background: var(--teal-light);
	color: var(--teal-dark);
	display: grid; place-items: center;
	flex-shrink: 0;
}
.reminder-icon.amber {
	background: rgba(133,79,11,0.12);
	color: #854f0b;
}
.reminder-body { flex: 1; min-width: 0; }
.reminder-title {
	font-size: 13px;
	font-weight: 600;
	color: var(--warm-text-secondary);
	margin: 0 0 4px;
}
.reminder.sip-due .reminder-title { color: #854f0b; }
.reminder-desc {
	font-size: 15px;
	color: var(--warm-text);
	margin: 0;
	line-height: 1.4;
}
.reminder.sip-due .reminder-desc { color: #854f0b; }
.reminder-aside {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	text-align: right;
	flex-shrink: 0;
	line-height: 1.4;
}

/* Scale card */
.scale-card { display: flex; flex-direction: column; gap: 12px; }
.scale-head {
	display: flex;
	align-items: center;
	gap: 8px;
}
.scale-lbl {
	flex: 1;
	font-size: 14px;
	font-weight: 500;
	color: var(--warm-text-secondary);
}
.live-pill {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: 12px;
	font-weight: 600;
	color: var(--teal-dark);
}
.live-dot {
	width: 6px; height: 6px;
	border-radius: 50%;
	background: var(--teal-primary);
	animation: pulse 1.6s ease-out infinite;
}
.scale-reading {
	display: flex;
	align-items: baseline;
	gap: 6px;
}
.scale-weight {
	font-size: 48px;
	font-weight: 600;
	letter-spacing: -1.5px;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}
.scale-unit {
	font-size: 20px;
	font-weight: 400;
	color: var(--warm-text-secondary);
}
.cup-lbl {
	font-size: 13px;
	color: var(--warm-text-tertiary);
	margin-left: 4px;
}
.tare-btn {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	height: 44px;
	padding: 0 18px;
	border-radius: 12px;
	background: var(--warm-bg);
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	font-size: 15px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	align-self: flex-start;
	transition: border-color 0.15s;
}
.tare-btn:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.tare-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
