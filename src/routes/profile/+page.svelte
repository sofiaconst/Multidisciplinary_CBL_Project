<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { History } from '$lib/history.svelte'
import { Scale } from '$lib/scale.svelte'

const auth = Auth.getInstance()
const history = History.getInstance()
const scale = Scale.getInstance()
</script>

<div class="page">
	<div class="page-header">
		<h1>Profile</h1>
	</div>

	<!-- Avatar + user info -->
	<div class="card identity-card">
		<div class="avatar-large">{auth.user?.avatarInitials ?? '?'}</div>
		<div class="identity-name">{auth.user?.name ?? '—'}</div>
		<div class="identity-email">{auth.user?.email ?? '—'}</div>
		<div class="streak-pill">{auth.streakDays} day streak</div>
	</div>

	<!-- Stats -->
	<div class="stats-row">
		<div class="card stat-card">
			<div class="stat-value">{history.totalSessions}</div>
			<div class="stat-label">Sessions</div>
		</div>
		<div class="card stat-card">
			<div class="stat-value">{history.averageDailyMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-label">Daily avg</div>
		</div>
	</div>

	<!-- Linked scale card -->
	<div class="card">
		<div class="section-label">Linked scale</div>
		<div class="scale-row">
			<div>
				<div class="scale-status" class:connected={scale.bt.connected}>
					{scale.bt.connected ? 'Connected' : 'Not connected'}
				</div>
				{#if scale.bt.connected}
					<div class="scale-detail">Battery: {scale.bt.batteryLevel}%</div>
					<div class="scale-detail">Factor: {scale.bt.calibrationFactor.toFixed(3)}</div>
				{/if}
			</div>
			<button type="button" class="qr-btn" disabled>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
					<rect x="3" y="3" width="7" height="7" rx="1" />
					<rect x="14" y="3" width="7" height="7" rx="1" />
					<rect x="3" y="14" width="7" height="7" rx="1" />
					<rect x="5" y="5" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
					<rect x="16" y="5" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
					<rect x="5" y="16" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
					<path d="M14 14h3v2h-3z M17 14h3v3h-2M14 17h2v3h-2M18 18v3" />
				</svg>
				Scan QR
			</button>
		</div>
	</div>
</div>

<svelte:head>
	<title>Profile — Hydr8 Scale</title>
</svelte:head>

<style>
.page {
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.page-header {
	padding: 8px 0 4px;
}

.page-header h1 {
	font-size: 22px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0;
}

.card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 12px;
	padding: 16px;
}

.identity-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 6px;
	padding: 24px 16px;
}

.avatar-large {
	width: 72px;
	height: 72px;
	border-radius: 50%;
	background: var(--teal-primary);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	font-weight: 700;
	margin-bottom: 4px;
}

.identity-name {
	font-size: 18px;
	font-weight: 700;
	color: var(--warm-text);
}

.identity-email {
	font-size: 13px;
	color: var(--warm-text-secondary);
}

.streak-pill {
	margin-top: 4px;
	font-size: 12px;
	font-weight: 600;
	color: var(--teal-dark);
	background: var(--teal-light);
	border: 1px solid var(--teal-primary);
	border-radius: 20px;
	padding: 3px 12px;
}

.stats-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.stat-card {
	text-align: center;
	padding: 16px;
}

.stat-value {
	font-size: 26px;
	font-weight: 700;
	color: var(--warm-text);
}

.stat-unit {
	font-size: 14px;
	font-weight: 400;
	color: var(--warm-text-secondary);
}

.stat-label {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	margin-top: 2px;
}

.section-label {
	font-size: 12px;
	font-weight: 600;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-bottom: 12px;
}

.scale-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
}

.scale-status {
	font-size: 14px;
	font-weight: 600;
	color: var(--warm-text-secondary);
}

.scale-status.connected {
	color: var(--teal-primary);
}

.scale-detail {
	font-size: 12px;
	color: var(--warm-text-secondary);
	margin-top: 2px;
}

.qr-btn {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 14px;
	background: var(--warm-bg);
	color: var(--warm-text-secondary);
	border: 1px solid var(--warm-border);
	border-radius: 8px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
}

.qr-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
</style>
