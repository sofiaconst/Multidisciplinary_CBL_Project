<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import ConnectStartButton from './ConnectStartButton.svelte'
import { Toaster } from 'svelte-french-toast'
import toast from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth = Auth.getInstance()

const reminderLabels = {
	reminders_off: 'Reminders off',
	target_reached: 'Hourly target reached',
	on_track: 'Reminder in',
	sip_due: 'Take a sip',
}

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

const tare = async () => {
	try {
		await scale.bt.tareScale()
	} catch (err) {
		toast.error(`Tare failed: ${(err as Error).message}`)
	}
}
</script>

<div class="page">
	<!-- Greeting bar -->
	<div class="greeting-bar">
		<div>
			<div class="greeting-label">{auth.greeting}</div>
			<div class="greeting-name">{auth.user?.name ?? ''}</div>
		</div>
		<div class="streak-badge">
			<svg viewBox="0 0 20 20" fill="none" width="13" height="13"><path d="M10 2C7 6 5 8 5 11a5 5 0 0010 0c0-3-2-5-5-9z" fill="#f59e0b"/></svg>
			{auth.streakDays} day streak
		</div>
	</div>

	<!-- Hero progress card -->
	<div class="hero-card">
		<div class="hero-bg-orbs"></div>
		<div class="hero-label">TODAY</div>
		<div class="hero-pct">
			{Math.round(goalPct)}<span class="hero-pct-sign">%</span>
		</div>
		<div class="hero-ml">
			{scale.consumedMl.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} / {scale.dailyTargetIntake.current.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ml
		</div>
		<div class="hero-track">
			<div class="hero-fill" style="width: {goalPct}%"></div>
		</div>
	</div>

	<!-- Stats row -->
	<div class="stats-row">
		<div class="stat-card">
			<div class="stat-icon-label">
				<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 3C9 7.5 6 10 6 14a6 6 0 0012 0c0-4-3-6.5-6-11z" fill="currentColor" opacity=".25"/><path d="M12 3C9 7.5 6 10 6 14a6 6 0 0012 0c0-4-3-6.5-6-11z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
				Sips
			</div>
			<div class="stat-value">{scale.sipCount}</div>
			<div class="stat-sub">today</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon-label">
				<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="6" y="8" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
				Consumed
			</div>
			<div class="stat-value">{scale.consumedMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-sub">vs goal</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon-label">
				<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="3" y="16" width="4" height="5" rx="1" fill="currentColor" opacity=".3"/><rect x="10" y="11" width="4" height="10" rx="1" fill="currentColor" opacity=".3"/><rect x="17" y="6" width="4" height="15" rx="1" fill="currentColor" opacity=".3"/><rect x="3" y="16" width="4" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="10" y="11" width="4" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="17" y="6" width="4" height="15" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
				Avg sip
			</div>
			<div class="stat-value">{scale.averageSipSizeMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-sub">last 7 days</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon-label">
				<svg viewBox="0 0 24 24" fill="none" width="14" height="14"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
				Next sip
			</div>
			<div class="stat-value">{formatMinutes(scale.nextSipDueInMs)}</div>
			<div class="stat-sub">adaptive pace</div>
		</div>
	</div>

	<!-- Reminder card -->
	<div class="card reminder-card" class:sip-due={isSipDue}>
		<div class="reminder-row">
			<div>
				<div class="reminder-title">{reminderLabels[scale.reminderStatus]}</div>
				<div class="reminder-sub">
					{scale.reminderStatus === 'on_track'
						? formatMinutes(scale.nextSipDueInMs)
						: scale.reminderStatus === 'sip_due'
							? 'Drink now'
							: scale.reminderStatus === 'target_reached'
								? 'Great job this hour!'
								: ''}
				</div>
			</div>
			<div class="reminder-hour">
				{scale.consumedThisHourMl.toFixed(0)} / {scale.hourlyTargetIntake.current.toFixed(0)} ml this hour
			</div>
		</div>
	</div>

	<!-- Scale reading or connect button -->
	{#if scale.bt.connected}
		<div class="card scale-card">
			<div class="scale-row">
				<div>
					<div class="card-label">Scale reading</div>
					<div class="scale-weight">{scale.bt.currentWeight.toFixed(1)}<span class="stat-unit">g</span></div>
				</div>
				<button type="button" class="tare-btn" onclick={tare} disabled={scale.bt.calibrationBusy}>
					Tare
				</button>
			</div>
		</div>
	{:else}
		<div class="connect-wrap">
			<ConnectStartButton />
		</div>
	{/if}
</div>

<Toaster />

<svelte:head>
	<title>Sippy</title>
</svelte:head>

<style>
.page {
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.greeting-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 0 2px;
}

.greeting-label {
	font-size: 12px;
	color: var(--warm-text-secondary);
	margin-bottom: 2px;
}

.greeting-name {
	font-size: 22px;
	font-weight: 700;
	color: var(--warm-text);
	letter-spacing: -0.3px;
}

.streak-badge {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 12px;
	font-weight: 600;
	color: var(--amber-text);
	background: var(--amber-bg);
	border: 1px solid var(--amber-border);
	border-radius: 20px;
	padding: 4px 12px;
	flex-shrink: 0;
}

/* Hero gradient card */
.hero-card {
	border-radius: 20px;
	padding: 28px 24px 22px;
	background: linear-gradient(135deg, var(--teal-dark) 0%, #2a7ab9 60%, var(--teal-primary) 100%);
	color: #fff;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.hero-bg-orbs {
	position: absolute;
	inset: 0;
	background-image:
		radial-gradient(circle at 18% 75%, rgba(255,255,255,0.12) 0, transparent 35%),
		radial-gradient(circle at 85% 20%, rgba(255,255,255,0.08) 0, transparent 35%);
	pointer-events: none;
}

.hero-label {
	position: relative;
	font-size: 12px;
	color: rgba(255,255,255,0.75);
	text-transform: uppercase;
	letter-spacing: 1px;
	margin-bottom: 8px;
}

.hero-pct {
	position: relative;
	font-size: 76px;
	font-weight: 500;
	letter-spacing: -3px;
	line-height: 1;
	margin-bottom: 6px;
	font-variant-numeric: tabular-nums;
}

.hero-pct-sign {
	font-size: 32px;
	color: rgba(255,255,255,0.6);
}

.hero-ml {
	position: relative;
	font-size: 15px;
	color: rgba(255,255,255,0.85);
	margin-bottom: 18px;
	font-variant-numeric: tabular-nums;
}

.hero-track {
	position: relative;
	width: 100%;
	height: 6px;
	background: rgba(255,255,255,0.25);
	border-radius: 99px;
	overflow: hidden;
}

.hero-fill {
	height: 100%;
	background: rgba(255,255,255,0.9);
	border-radius: 99px;
	transition: width 0.4s ease;
	min-width: 3px;
}

/* Stats */
.stats-row {
	display: flex;
	gap: 8px;
	overflow-x: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
	padding-bottom: 2px;
}

.stats-row::-webkit-scrollbar {
	display: none;
}

.stat-card {
	flex: 0 0 calc(50% - 4px);
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 14px 16px;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.stat-icon-label {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	color: var(--warm-text-tertiary);
}

.stat-value {
	font-size: 26px;
	font-weight: 500;
	color: var(--warm-text);
	line-height: 1;
	font-variant-numeric: tabular-nums;
	letter-spacing: -0.5px;
}

.stat-unit {
	font-size: 13px;
	font-weight: 400;
	color: var(--warm-text-secondary);
	margin-left: 2px;
}

.stat-sub {
	font-size: 11px;
	color: var(--warm-text-tertiary);
}

/* Reminder */
.card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 14px;
	padding: 16px;
}

.card-label {
	font-size: 12px;
	font-weight: 500;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.reminder-card {
	transition: background 0.2s, border-color 0.2s;
}

.reminder-card.sip-due {
	background: var(--amber-bg);
	border-color: var(--amber-border);
}

.reminder-card.sip-due .reminder-title {
	color: var(--amber-text);
}

.reminder-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
}

.reminder-title {
	font-size: 15px;
	font-weight: 600;
	color: var(--warm-text);
}

.reminder-sub {
	font-size: 13px;
	color: var(--warm-text-secondary);
	margin-top: 2px;
}

.reminder-hour {
	font-size: 12px;
	color: var(--warm-text-secondary);
	text-align: right;
	flex-shrink: 0;
}

/* Scale */
.scale-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.scale-weight {
	font-size: 28px;
	font-weight: 700;
	color: var(--warm-text);
	margin-top: 4px;
}

.tare-btn {
	padding: 8px 20px;
	background: var(--teal-light);
	color: var(--teal-dark);
	border: 1px solid var(--teal-primary);
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s;
}

.tare-btn:hover {
	background: var(--teal-primary);
	color: #fff;
}

.tare-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.connect-wrap {
	display: flex;
	justify-content: center;
	padding: 8px 0;
}
</style>
