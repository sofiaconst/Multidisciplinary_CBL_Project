<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { History } from '$lib/history.svelte'
import { Scale } from '$lib/scale.svelte'

const auth    = Auth.getInstance()
const history = History.getInstance()
const scale   = Scale.getInstance()

let editing  = $state(false)
let draft    = $state('')

function startEdit() {
	draft   = auth.user?.name ?? ''
	editing = true
}
async function saveName(e: Event) {
	e.preventDefault()
	const v = draft.trim()
	if (v) await auth.updateName(v)
	editing = false
}
</script>

<div class="page">

	<!-- Identity card -->
	<div class="identity-card">
		<div class="avatar">{auth.user?.avatarInitials ?? '?'}</div>

		{#if auth.isAnonymous}
			<h2 class="name">Guest</h2>
			<a href="/m/signup?back=/m/profile" class="guest-hint">
				Create an account for more personalization
			</a>
		{:else if editing}
			<form class="name-form" onsubmit={saveName}>
				<input
					class="name-input"
					bind:value={draft}
					maxlength="40"
					autofocus
					placeholder="Your name"
				/>
				<div class="name-form-btns">
					<button type="button" class="btn-cancel" onclick={() => editing = false}>Cancel</button>
					<button type="submit" class="btn-save">Save</button>
				</div>
			</form>
		{:else}
			<button class="name-btn" onclick={startEdit}>
				<h2 class="name">{auth.user?.name ?? '—'}</h2>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
			</button>
			{#if auth.user?.email}
				<p class="email">{auth.user.email}</p>
			{/if}
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
	gap: 14px;
}

/* Identity */
.identity-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 28px 20px 22px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	text-align: center;
	overflow: hidden;
}
.avatar {
	width: 76px;
	height: 76px;
	border-radius: 50%;
	background: var(--teal-primary);
	color: #fff;
	display: grid;
	place-items: center;
	font-size: 28px;
	font-weight: 700;
	margin-bottom: 6px;
	flex-shrink: 0;
}

/* Tap-to-edit name (authenticated) */
.name-btn {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	background: none;
	border: none;
	cursor: pointer;
	padding: 2px 6px;
	border-radius: 8px;
	color: var(--warm-text);
	transition: background 0.15s;
}
.name-btn:hover { background: var(--warm-bg); }
h2.name {
	font-size: 22px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.name-btn svg { color: var(--warm-text-tertiary); flex-shrink: 0; }

/* Inline edit form */
.name-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	width: 100%;
	max-width: 260px;
}
.name-input {
	width: 100%;
	height: 44px;
	border: 1.5px solid var(--teal-primary);
	border-radius: 10px;
	background: var(--warm-bg);
	color: var(--warm-text);
	font-size: 16px;
	font-family: inherit;
	font-weight: 500;
	text-align: center;
	outline: none;
	padding: 0 12px;
}
.name-form-btns {
	display: flex;
	gap: 8px;
	width: 100%;
}
.btn-cancel {
	flex: 1; height: 38px; border-radius: 9px;
	background: var(--warm-bg); border: 0.5px solid var(--warm-border);
	color: var(--warm-text-secondary); font-size: 14px; font-weight: 500;
	font-family: inherit; cursor: pointer;
}
.btn-save {
	flex: 1; height: 38px; border-radius: 9px;
	background: var(--teal-primary); border: none;
	color: #fff; font-size: 14px; font-weight: 600;
	font-family: inherit; cursor: pointer;
}

/* Guest hint */
.guest-hint {
	font-size: 12px;
	color: var(--teal-primary);
	text-decoration: none;
	margin: 2px 0 0;
	text-align: center;
	line-height: 1.5;
}
.guest-hint:hover { text-decoration: underline; }

.email {
	font-size: 13px;
	color: var(--warm-text-secondary);
	margin: 0;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.streak-pill {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: 12px;
	font-weight: 600;
	color: var(--teal-dark);
	background: var(--teal-light);
	border: 1px solid var(--teal-primary);
	border-radius: 20px;
	padding: 5px 13px;
	margin-top: 4px;
	white-space: nowrap;
}

/* Stats */
.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
}
.stat-card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 20px 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	overflow: hidden;
}
.stat-val {
	font-size: 30px;
	font-weight: 600;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
	line-height: 1;
}
.stat-val small {
	font-size: 14px;
	font-weight: 400;
	color: var(--warm-text-secondary);
}
.stat-lbl {
	font-size: 12px;
	color: var(--warm-text-secondary);
	font-weight: 500;
}

/* Scale card */
.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 20px;
	overflow: hidden;
}
.section-label {
	font-size: 11px;
	font-weight: 700;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.06em;
	margin: 0 0 14px;
}
.scale-status-row {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
}
.scale-dot {
	width: 9px; height: 9px; border-radius: 50%;
	background: var(--warm-text-tertiary); flex-shrink: 0;
}
.scale-dot.dot-on { background: var(--teal-primary); }
.scale-status-text {
	font-size: 14px; font-weight: 600; color: var(--warm-text-secondary);
	min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.scale-status-text.connected { color: var(--teal-primary); }
.scale-details {
	display: flex; flex-direction: column;
	border: 0.5px solid var(--warm-border); border-radius: 10px; overflow: hidden;
}
.detail-row {
	display: flex; justify-content: space-between; align-items: center;
	padding: 11px 12px; border-bottom: 0.5px solid var(--warm-border); gap: 8px;
}
.detail-row:last-child { border-bottom: none; }
.detail-key {
	font-size: 13px; color: var(--warm-text-secondary);
	min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.detail-val {
	font-size: 13px; font-weight: 600; color: var(--warm-text);
	font-variant-numeric: tabular-nums; flex-shrink: 0;
}
</style>
