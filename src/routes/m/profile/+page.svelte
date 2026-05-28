<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { History } from '$lib/history.svelte'
import { Scale } from '$lib/scale.svelte'

const auth    = Auth.getInstance()
const history = History.getInstance()
const scale   = Scale.getInstance()
</script>

<div class="page">

	<!-- Identity card -->
	<div class="identity-card">
		<div class="avatar">{auth.user?.avatarInitials ?? '?'}</div>
		<h2 class="name">{auth.user?.name ?? '—'}</h2>
		{#if auth.user?.email}
			<p class="email">{auth.user.email}</p>
		{/if}
		<span class="streak-pill">
			<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2C7 6 5 8 5 11a5 5 0 0010 0c0-3-2-5-5-9z" fill="#f59e0b"/></svg>
			{auth.streakDays} day streak
		</span>
	</div>

	<!-- Summary stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-val">{history.totalSessions}</span>
			<span class="stat-lbl">Sessions</span>
		</div>
		<div class="stat-card">
			<span class="stat-val">{history.averageDailyMl.toFixed(0)}<small>ml</small></span>
			<span class="stat-lbl">Daily avg</span>
		</div>
	</div>

	<!-- Linked scale -->
	<div class="card">
		<p class="section-label">Linked scale</p>
		<div class="scale-status-row">
			<div class="scale-dot" class:dot-on={scale.bt.connected}></div>
			<span class="scale-status-text" class:connected={scale.bt.connected}>
				{scale.bt.connected ? 'Scale connected' : 'Scale not connected'}
			</span>
		</div>
		{#if scale.bt.connected}
			<div class="scale-details">
				<div class="detail-row">
					<span class="detail-key">Battery</span>
					<span class="detail-val">{scale.bt.batteryLevel != null ? scale.bt.batteryLevel + '%' : 'Unknown'}</span>
				</div>
				<div class="detail-row">
					<span class="detail-key">Calibration factor</span>
					<span class="detail-val">{scale.bt.calibrationFactor.toFixed(3)}</span>
				</div>
			</div>
		{/if}
	</div>

</div>

<svelte:head><title>Profile · Sippy</title></svelte:head>

<style>
.page {
	padding: 20px 16px 40px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

/* Identity */
.identity-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 28px 20px 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	text-align: center;
}
.avatar {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: var(--teal-primary);
	color: #fff;
	display: grid;
	place-items: center;
	font-size: 28px;
	font-weight: 700;
	margin-bottom: 4px;
}
h2.name {
	font-size: 22px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0;
}
.email {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0;
}
.streak-pill {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	font-weight: 600;
	color: var(--teal-dark);
	background: var(--teal-light);
	border: 1px solid var(--teal-primary);
	border-radius: 20px;
	padding: 6px 14px;
	margin-top: 4px;
}

/* Stats */
.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}
.stat-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}
.stat-val {
	font-size: 34px;
	font-weight: 700;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}
.stat-val small {
	font-size: 16px;
	font-weight: 400;
	color: var(--warm-text-secondary);
}
.stat-lbl {
	font-size: 13px;
	color: var(--warm-text-secondary);
	font-weight: 500;
}

/* Scale card */
.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 20px;
}
.section-label {
	font-size: 12px;
	font-weight: 700;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.06em;
	margin: 0 0 14px;
}
.scale-status-row {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 14px;
}
.scale-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: var(--warm-text-tertiary);
	flex-shrink: 0;
}
.scale-dot.dot-on { background: var(--teal-primary); }
.scale-status-text {
	font-size: 15px;
	font-weight: 600;
	color: var(--warm-text-secondary);
}
.scale-status-text.connected { color: var(--teal-primary); }
.scale-details {
	display: flex;
	flex-direction: column;
	gap: 0;
	border: 0.5px solid var(--warm-border);
	border-radius: 12px;
	overflow: hidden;
}
.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 14px;
	border-bottom: 0.5px solid var(--warm-border);
}
.detail-row:last-child { border-bottom: none; }
.detail-key {
	font-size: 14px;
	color: var(--warm-text-secondary);
}
.detail-val {
	font-size: 14px;
	font-weight: 600;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
}
</style>
