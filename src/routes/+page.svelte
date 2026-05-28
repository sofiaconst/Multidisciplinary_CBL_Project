<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import ConnectStartButton from './ConnectStartButton.svelte'
import { Toaster } from 'svelte-french-toast'
import toast from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth = Auth.getInstance()

const formatMinutes = (ms: number | null) => {
	if (ms === null) return '—'
	return `${Math.max(1, Math.round(ms / 60000))} m`
}

const goalPct = $derived(
	scale.dailyTargetIntake.current > 0
		? Math.min(100, (scale.consumedMl / scale.dailyTargetIntake.current) * 100)
		: 0,
)

const isSipDue = $derived(scale.reminderStatus === 'sip_due')

const fmtMl = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const tare = async () => {
	try {
		await scale.bt.tareScale()
	} catch (err) {
		toast.error(`Tare failed: ${(err as Error).message}`)
	}
}
</script>

<div class="page">
	<main class="content">
		<!-- Greeting strip -->
		<div class="greeting-strip">
			<div>
				<div class="greeting-sub">{auth.greeting}</div>
				<div class="greeting-name">{auth.user?.name ?? ''}</div>
			</div>
			<div class="streak-pill">
				<svg viewBox="0 0 20 20" fill="none" width="14" height="14"><path d="M10 2C7 6 5 8 5 11a5 5 0 0010 0c0-3-2-5-5-9z" fill="#f59e0b"/></svg>
				{auth.streakDays} day streak
			</div>
		</div>

		<!-- Hero progress card -->
		<div class="hero">
			<div class="hero-orbs"></div>
			<div class="hero-today">TODAY</div>
			<div class="hero-pct">
				{Math.round(goalPct)}<span class="hero-pct-sign">%</span>
			</div>
			<div class="hero-ml">
				{fmtMl(scale.consumedMl)} / {fmtMl(scale.dailyTargetIntake.current)} ml
			</div>
			<div class="hero-bar">
				<div class="hero-fill" style="width: {goalPct}%"></div>
			</div>
		</div>

		<!-- 4-column stat grid -->
		<div class="stat-grid">
			<div class="stat-card">
				<div class="stat-top">
					<svg viewBox="0 0 24 24" fill="none" width="14" height="14" color="var(--warm-text-tertiary)"><path d="M12 3C9 7.5 6 10 6 14a6 6 0 0012 0c0-4-3-6.5-6-11z" fill="currentColor" opacity=".2"/><path d="M12 3C9 7.5 6 10 6 14a6 6 0 0012 0c0-4-3-6.5-6-11z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
					Sips
				</div>
				<div class="stat-val">{scale.sipCount}</div>
				<div class="stat-sub">today</div>
			</div>
			<div class="stat-card">
				<div class="stat-top">
					<svg viewBox="0 0 24 24" fill="none" width="14" height="14" color="var(--warm-text-tertiary)"><rect x="7" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M9 9V7a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
					Consumed
				</div>
				<div class="stat-val">{fmtMl(scale.consumedMl)} <span class="stat-unit">ml</span></div>
				<div class="stat-sub">vs goal</div>
			</div>
			<div class="stat-card">
				<div class="stat-top">
					<svg viewBox="0 0 24 24" fill="none" width="14" height="14" color="var(--warm-text-tertiary)"><rect x="3" y="15" width="4" height="6" rx="1" fill="currentColor" opacity=".25"/><rect x="10" y="10" width="4" height="11" rx="1" fill="currentColor" opacity=".25"/><rect x="17" y="5" width="4" height="16" rx="1" fill="currentColor" opacity=".25"/><rect x="3" y="15" width="4" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="10" y="10" width="4" height="11" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="17" y="5" width="4" height="16" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
					Avg sip
				</div>
				<div class="stat-val">{scale.averageSipSizeMl.toFixed(0)} <span class="stat-unit">ml</span></div>
				<div class="stat-sub">last 7 days</div>
			</div>
			<div class="stat-card">
				<div class="stat-top">
					<svg viewBox="0 0 24 24" fill="none" width="14" height="14" color="var(--warm-text-tertiary)"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					Next sip
				</div>
				<div class="stat-val">{formatMinutes(scale.nextSipDueInMs)}</div>
				<div class="stat-sub">adaptive pace</div>
			</div>
		</div>

		<!-- Reminder + Scale row -->
		<div class="lower-grid">
			<div class="card reminder-card" class:sip-due={isSipDue}>
				<div class="card-icon-wrap" class:icon-amber={isSipDue}>
					<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="card-body">
					<div class="card-title">
						{#if scale.reminderStatus === 'sip_due'}Time to drink
						{:else if scale.reminderStatus === 'on_track'}Next reminder
						{:else if scale.reminderStatus === 'target_reached'}Hourly target reached
						{:else}Reminders off{/if}
					</div>
					<div class="card-desc">
						{#if scale.reminderStatus === 'sip_due'}Drink now
						{:else if scale.reminderStatus === 'on_track'}In {formatMinutes(scale.nextSipDueInMs)} · adaptive pacing
						{:else if scale.reminderStatus === 'target_reached'}Great job this hour!
						{:else}&nbsp;{/if}
					</div>
				</div>
				<div class="card-aside">{fmtMl(scale.consumedThisHourMl)} / {fmtMl(scale.hourlyTargetIntake.current)} ml this hour</div>
			</div>

			{#if scale.bt.connected}
				<div class="card scale-card">
					<div class="scale-header">
						<svg viewBox="0 0 24 24" fill="none" width="16" height="16" color="var(--teal-dark)"><rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
						<span class="scale-label">Live scale reading</span>
						<span class="live-pill">
							<span class="live-dot"></span>
							live
						</span>
					</div>
					<div class="scale-reading">
						<div class="scale-weight">{scale.bt.currentWeight.toFixed(1)} <span class="stat-unit">g</span></div>
						<span class="cup-label">cup detected</span>
					</div>
					<div class="scale-actions">
						<button type="button" class="tare-btn" onclick={tare} disabled={scale.bt.calibrationBusy}>
							<svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
							Tare
						</button>
					</div>
				</div>
			{:else}
				<div class="card connect-card">
					<ConnectStartButton />
				</div>
			{/if}
		</div>
	</main>
</div>

<Toaster />

<svelte:head>
	<title>Dashboard · Sippy</title>
</svelte:head>

<style>
.page {
	background: var(--warm-bg);
	min-height: 100%;
}

.content {
	width: 100%;
	max-width: 1180px;
	margin: 0 auto;
	padding: 28px 24px 56px;
	display: flex;
	flex-direction: column;
	gap: 18px;
	box-sizing: border-box;
}

/* Greeting */
.greeting-strip {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	padding: 4px 0;
}

.greeting-sub {
	font-size: 13px;
	color: var(--warm-text-tertiary);
	margin-bottom: 2px;
}

.greeting-name {
	font-size: 26px;
	font-weight: 500;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	line-height: 1.1;
}

.streak-pill {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	font-weight: 500;
	color: #854f0b;
	background: #faeeda;
	border: 0.5px solid #fac775;
	border-radius: 20px;
	padding: 5px 14px;
	flex-shrink: 0;
}

/* Hero */
.hero {
	border-radius: 20px;
	padding: 36px 32px;
	background: linear-gradient(135deg, var(--teal-dark) 0%, #2a7ab9 60%, var(--teal-primary) 100%);
	color: #fff;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.hero-orbs {
	position: absolute;
	inset: 0;
	background-image:
		radial-gradient(circle at 18% 75%, rgba(255,255,255,0.12) 0, transparent 35%),
		radial-gradient(circle at 85% 20%, rgba(255,255,255,0.08) 0, transparent 35%);
	pointer-events: none;
}

.hero-today {
	position: relative;
	font-size: 13px;
	color: rgba(255,255,255,0.78);
	margin-bottom: 14px;
	text-transform: uppercase;
	letter-spacing: 0.8px;
}

.hero-pct {
	position: relative;
	font-size: 88px;
	font-weight: 500;
	letter-spacing: -3px;
	line-height: 1;
	margin-bottom: 6px;
	font-variant-numeric: tabular-nums;
}

.hero-pct-sign {
	font-size: 36px;
	color: rgba(255,255,255,0.6);
}

.hero-ml {
	position: relative;
	font-size: 16px;
	color: rgba(255,255,255,0.88);
	margin-bottom: 22px;
	font-variant-numeric: tabular-nums;
}

.hero-bar {
	position: relative;
	width: 100%;
	max-width: 480px;
	height: 10px;
	background: rgba(255,255,255,0.20);
	border-radius: 20px;
	overflow: hidden;
}

.hero-fill {
	height: 100%;
	background: #fff;
	border-radius: 20px;
	min-width: 4px;
	transition: width 600ms cubic-bezier(.2,.7,.3,1);
}

/* Stat grid */
.stat-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
}

.stat-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 18px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.stat-top {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: var(--warm-text-tertiary);
}

.stat-val {
	font-size: 28px;
	font-weight: 500;
	letter-spacing: -0.6px;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}

.stat-unit {
	font-size: 14px;
	font-weight: 400;
	color: var(--warm-text-secondary);
}

.stat-sub {
	font-size: 12px;
	color: var(--warm-text-tertiary);
}

/* Lower row */
.lower-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 14px;
}

.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 22px;
}

.reminder-card {
	display: flex;
	align-items: center;
	gap: 14px;
	transition: background 0.3s, border-color 0.3s;
}

.reminder-card.sip-due {
	background: #faeeda;
	border-color: #fac775;
}

.card-icon-wrap {
	width: 48px;
	height: 48px;
	border-radius: 14px;
	background: var(--teal-light);
	color: var(--teal-dark);
	display: grid;
	place-items: center;
	flex-shrink: 0;
}

.card-icon-wrap.icon-amber {
	background: rgba(133,79,11,0.12);
	color: #854f0b;
}

.card-body {
	flex: 1;
	min-width: 0;
}

.card-title {
	font-size: 13px;
	font-weight: 500;
	color: var(--warm-text-secondary);
	margin-bottom: 4px;
}

.reminder-card.sip-due .card-title {
	color: #854f0b;
}

.card-desc {
	font-size: 15px;
	color: var(--warm-text);
	line-height: 1.4;
}

.reminder-card.sip-due .card-desc {
	color: #854f0b;
}

.card-aside {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	text-align: right;
	flex-shrink: 0;
}

.scale-card {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.scale-header {
	display: flex;
	align-items: center;
	gap: 8px;
}

.scale-label {
	font-size: 13px;
	color: var(--warm-text-secondary);
	font-weight: 500;
	flex: 1;
}

.live-pill {
	margin-left: auto;
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: 11px;
	color: var(--teal-dark);
	font-weight: 600;
}

.live-dot {
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background: var(--teal-primary);
	box-shadow: 0 0 0 0 rgba(0,135,189,0.55);
	animation: scalePulse 1.6s ease-out infinite;
}

@keyframes scalePulse {
	0%   { box-shadow: 0 0 0 0 rgba(0,135,189,0.55); }
	70%  { box-shadow: 0 0 0 6px rgba(0,135,189,0); }
	100% { box-shadow: 0 0 0 0 rgba(0,135,189,0); }
}

.scale-reading {
	display: flex;
	align-items: baseline;
	gap: 12px;
}

.scale-weight {
	font-size: 38px;
	font-weight: 500;
	letter-spacing: -1px;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}

.cup-label {
	font-size: 12px;
	color: var(--warm-text-tertiary);
}

.scale-actions {
	display: flex;
	gap: 8px;
	margin-top: 4px;
}

.tare-btn {
	height: 34px;
	padding: 0 12px;
	background: transparent;
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	border-radius: 12px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	font-family: inherit;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	transition: border-color 0.15s;
}
.tare-btn:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.tare-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.connect-card {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
