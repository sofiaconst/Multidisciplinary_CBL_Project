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
		<div class="name">{auth.user?.name ?? '—'}</div>
		<div class="email">{auth.user?.email ?? ''}</div>
		<div class="streak-pill">
			<svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M10 2C7 6 5 8 5 11a5 5 0 0010 0c0-3-2-5-5-9z" fill="#f59e0b"/></svg>
			{auth.streakDays} day streak
		</div>
	</div>

	<!-- Stats -->
	<div class="stats-row">
		<div class="stat-card">
			<div class="stat-val">{history.totalSessions}</div>
			<div class="stat-label">Sessions</div>
		</div>
		<div class="stat-card">
			<div class="stat-val">{history.averageDailyMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-label">Daily avg</div>
		</div>
	</div>

	<!-- Linked scale -->
	<div class="card">
		<div class="section-label">Linked scale</div>
		<div class="scale-row">
			<div>
				<div class="scale-status" class:connected={scale.bt.connected}>
					{scale.bt.connected ? 'Connected' : 'Not connected'}
				</div>
				{#if scale.bt.connected}
					<div class="scale-detail">Battery: {scale.bt.batteryLevel != null ? scale.bt.batteryLevel + '%' : 'Unknown'}</div>
					<div class="scale-detail">Factor: {scale.bt.calibrationFactor.toFixed(3)}</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<svelte:head><title>Profile · Sippy</title></svelte:head>

<style>
.page { padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 16px; }

.identity-card {
	background: var(--warm-surface); border: 0.5px solid var(--warm-border);
	border-radius: 14px; padding: 24px 16px;
	display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center;
}
.avatar {
	width: 72px; height: 72px; border-radius: 50%;
	background: var(--teal-primary); color: #fff;
	display: grid; place-items: center;
	font-size: 24px; font-weight: 700; margin-bottom: 4px;
}
.name { font-size: 18px; font-weight: 700; color: var(--warm-text); }
.email { font-size: 13px; color: var(--warm-text-secondary); }
.streak-pill {
	display: inline-flex; align-items: center; gap: 5px;
	font-size: 12px; font-weight: 600; color: var(--teal-dark);
	background: var(--teal-light); border: 1px solid var(--teal-primary);
	border-radius: 20px; padding: 4px 12px; margin-top: 4px;
}

.stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stat-card { background: var(--warm-surface); border: 0.5px solid var(--warm-border); border-radius: 14px; padding: 18px; text-align: center; }
.stat-val { font-size: 28px; font-weight: 700; color: var(--warm-text); }
.stat-unit { font-size: 14px; font-weight: 400; color: var(--warm-text-secondary); }
.stat-label { font-size: 12px; color: var(--warm-text-tertiary); margin-top: 2px; }

.card { background: var(--warm-surface); border: 0.5px solid var(--warm-border); border-radius: 14px; padding: 18px; }
.section-label { font-size: 11px; font-weight: 600; color: var(--warm-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
.scale-row { display: flex; justify-content: space-between; align-items: center; }
.scale-status { font-size: 14px; font-weight: 600; color: var(--warm-text-secondary); }
.scale-status.connected { color: var(--teal-primary); }
.scale-detail { font-size: 12px; color: var(--warm-text-secondary); margin-top: 2px; }
</style>
