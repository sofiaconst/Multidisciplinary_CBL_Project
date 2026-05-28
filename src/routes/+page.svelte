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
		<div class="badges">
			<div class="streak-badge">🔥 {auth.streakDays}d streak</div>
			<div class="ble-badge" class:ble-connected={scale.bt.connected}>
				<span class="ble-dot"></span>
				{scale.bt.connected ? 'Scale connected' : 'Offline'}
			</div>
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
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-label">Sips</div>
			<div class="stat-value">{scale.sipCount}</div>
			<div class="stat-sub">today</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Consumed</div>
			<div class="stat-value">{scale.consumedMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-sub">vs goal</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Avg sip</div>
			<div class="stat-value">{scale.averageSipSizeMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-sub">last 7 days</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Next sip</div>
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
	align-items: flex-start;
	justify-content: space-between;
	padding: 12px 0 4px;
}

.greeting-label {
	font-size: 12px;
	color: var(--warm-text-secondary);
}

.greeting-name {
	font-size: 22px;
	font-weight: 700;
	color: var(--warm-text);
	letter-spacing: -0.3px;
}

.badges {
	display: flex;
	flex-direction: column;
	gap: 5px;
	align-items: flex-end;
}

.streak-badge {
	font-size: 12px;
	font-weight: 600;
	color: var(--amber-text);
	background: var(--amber-bg);
	border: 1px solid var(--amber-border);
	border-radius: 20px;
	padding: 3px 10px;
}

.ble-badge {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 12px;
	font-weight: 500;
	color: var(--warm-text-tertiary);
	background: var(--warm-bg);
	border: 1px solid var(--warm-border);
	border-radius: 20px;
	padding: 3px 10px;
}

.ble-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--warm-border);
	flex-shrink: 0;
}

.ble-badge.ble-connected {
	color: var(--teal-dark);
	background: var(--teal-light);
	border-color: var(--teal-primary);
}

.ble-badge.ble-connected .ble-dot {
	background: var(--teal-primary);
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
.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.stat-card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 14px;
	padding: 14px 16px;
}

.stat-label {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	margin-bottom: 6px;
}

.stat-value {
	font-size: 26px;
	font-weight: 700;
	color: var(--warm-text);
	line-height: 1;
	font-variant-numeric: tabular-nums;
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
	margin-top: 4px;
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
