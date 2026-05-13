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
	return `${Math.max(1, Math.round(ms / 60000))} min`
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
		<div class="avatar">{auth.user.current?.avatarInitials ?? '?'}</div>
		<div class="greeting-text">
			<div class="greeting-label">{auth.greeting}</div>
			<div class="greeting-name">{auth.user.current?.name ?? ''}</div>
		</div>
		<div class="badges">
			<div class="streak-badge">{auth.streakDays.current}d streak</div>
			<div class="ble-badge" class:ble-connected={scale.bt.connected}>
				{scale.bt.connected ? 'Connected' : 'Offline'}
			</div>
		</div>
	</div>

	<!-- Daily goal progress -->
	<div class="card">
		<div class="card-row">
			<span class="card-label">Daily Goal</span>
			<span class="goal-pct">{goalPct.toFixed(0)}%</span>
		</div>
		<div class="progress-track">
			<div class="progress-fill" style="width: {goalPct}%"></div>
		</div>
		<div class="goal-values">{scale.consumedMl.toFixed(0)} / {scale.dailyTargetIntake.current.toFixed(0)} ml</div>
	</div>

	<!-- Stats grid -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-value">{scale.sipCount}</div>
			<div class="stat-label">Sips</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{scale.consumedMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-label">Consumed</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{scale.averageSipSizeMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-label">Avg sip</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{formatMinutes(scale.nextSipDueInMs)}</div>
			<div class="stat-label">Next sip in</div>
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
	<title>Hydration Scale</title>
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
	gap: 12px;
	padding: 12px 0 4px;
}

.avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: var(--teal-primary);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	font-weight: 700;
	flex-shrink: 0;
}

.greeting-text {
	flex: 1;
}

.greeting-label {
	font-size: 12px;
	color: var(--warm-text-secondary);
}

.greeting-name {
	font-size: 16px;
	font-weight: 600;
	color: var(--warm-text);
}

.badges {
	display: flex;
	flex-direction: column;
	gap: 4px;
	align-items: flex-end;
}

.streak-badge {
	font-size: 11px;
	font-weight: 600;
	color: var(--teal-dark);
	background: var(--teal-light);
	border: 1px solid var(--teal-primary);
	border-radius: 20px;
	padding: 2px 8px;
}

.ble-badge {
	font-size: 11px;
	font-weight: 600;
	color: var(--warm-text-tertiary);
	background: var(--warm-bg);
	border: 1px solid var(--warm-border);
	border-radius: 20px;
	padding: 2px 8px;
}

.ble-badge.ble-connected {
	color: var(--teal-dark);
	background: var(--teal-light);
	border-color: var(--teal-primary);
}

.card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 12px;
	padding: 16px;
}

.card-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.card-label {
	font-size: 12px;
	font-weight: 500;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.goal-pct {
	font-size: 14px;
	font-weight: 700;
	color: var(--teal-primary);
}

.progress-track {
	height: 8px;
	background: var(--warm-bg);
	border-radius: 99px;
	overflow: hidden;
	margin-bottom: 6px;
}

.progress-fill {
	height: 100%;
	background: var(--teal-primary);
	border-radius: 99px;
	transition: width 0.4s ease;
	min-width: 2px;
}

.goal-values {
	font-size: 13px;
	color: var(--warm-text-secondary);
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.stat-card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 12px;
	padding: 14px 16px;
}

.stat-value {
	font-size: 24px;
	font-weight: 700;
	color: var(--warm-text);
	line-height: 1.1;
}

.stat-unit {
	font-size: 13px;
	font-weight: 400;
	color: var(--warm-text-secondary);
	margin-left: 2px;
}

.stat-label {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	margin-top: 2px;
}

.reminder-card {
	border-color: var(--warm-border);
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

.scale-card {
}

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
