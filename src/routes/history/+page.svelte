<script lang="ts">
import { History } from '$lib/history.svelte'

const history = History.getInstance()

const weekMax = $derived(Math.max(...history.weekSessions.map((s) => s.consumedMl), 100))

const getDayLabel = (dateStr: string) => {
	return new Date(dateStr).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3)
}

const formatDate = (dateStr: string) => {
	return new Date(dateStr).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

const goalPct = (session: ReturnType<typeof history.weekSessions>[0]) => {
	if (session.goalMl === 0) return 0
	return Math.min(100, Math.round((session.consumedMl / session.goalMl) * 100))
}
</script>

<div class="page">
	<div class="page-header">
		<a href="/" class="back-btn">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4L6 10l6 6"/></svg>
		</a>
		<div>
			<h1>History</h1>
			<p>{history.totalSessions} sessions recorded</p>
		</div>
	</div>

	<!-- Weekly bar chart -->
	<div class="card">
		<div class="section-label">This week</div>
		<div class="chart">
			{#each history.weekSessions as session, i}
				{@const isToday = i === 6}
				{@const pct = weekMax > 0 ? (session.consumedMl / weekMax) * 100 : 0}
				<div class="chart-col">
					<div class="chart-bar-wrap">
						<div
							class="chart-bar"
							style="height: {Math.max(pct, 2)}%; background: {isToday
								? 'var(--teal-primary)'
								: 'var(--warm-border)'}; border: 1px solid {isToday ? 'var(--teal-dark)' : 'var(--warm-border)'}"
						></div>
					</div>
					<div class="chart-label" class:today={isToday}>{getDayLabel(session.date)}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Session list -->
	<div class="card">
		<div class="section-label">All sessions</div>
		{#if history.sessions.length === 0}
			<div class="empty">No sessions yet. Start tracking to record your hydration.</div>
		{:else}
			<div class="session-list">
				{#each [...history.sessions].reverse() as session}
					{@const pct = goalPct(session)}
					<div class="session-item">
						<div class="session-left">
							<div class="session-date">{formatDate(session.date)}</div>
							<div class="session-stats">{session.sipCount} sips &middot; {session.consumedMl.toFixed(0)} ml</div>
						</div>
						<div
							class="goal-badge"
							class:badge-success={pct >= 100}
							class:badge-warning={pct >= 50 && pct < 100}
							class:badge-error={pct < 50}
						>
							{pct}%
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<svelte:head>
	<title>History — Sippy</title>
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
	display: flex;
	align-items: center;
	gap: 10px;
}

.back-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 34px;
	height: 34px;
	border-radius: 10px;
	background: var(--teal-light);
	color: var(--teal-dark);
	text-decoration: none;
	flex-shrink: 0;
	transition: background 0.15s;
}
.back-btn:hover { background: var(--teal-primary); color: #fff; }

.page-header h1 {
	font-size: 22px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0 0 2px;
}

.page-header p {
	font-size: 13px;
	color: var(--warm-text-secondary);
	margin: 0;
}

.card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 12px;
	padding: 16px;
}

.section-label {
	font-size: 12px;
	font-weight: 600;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-bottom: 12px;
}

.chart {
	display: flex;
	gap: 6px;
	height: 120px;
	align-items: flex-end;
}

.chart-col {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
}

.chart-bar-wrap {
	flex: 1;
	width: 100%;
	display: flex;
	align-items: flex-end;
}

.chart-bar {
	width: 100%;
	border-radius: 4px 4px 0 0;
	min-height: 3px;
	transition: height 0.3s ease;
}

.chart-label {
	font-size: 11px;
	color: var(--warm-text-tertiary);
	margin-top: 4px;
}

.chart-label.today {
	color: var(--teal-primary);
	font-weight: 700;
}

.empty {
	font-size: 14px;
	color: var(--warm-text-tertiary);
	text-align: center;
	padding: 20px 0;
}

.session-list {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.session-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 0;
	border-bottom: 1px solid var(--warm-bg);
}

.session-item:last-child {
	border-bottom: none;
}

.session-date {
	font-size: 14px;
	font-weight: 600;
	color: var(--warm-text);
}

.session-stats {
	font-size: 12px;
	color: var(--warm-text-secondary);
	margin-top: 2px;
}

.goal-badge {
	font-size: 12px;
	font-weight: 700;
	padding: 3px 8px;
	border-radius: 20px;
	flex-shrink: 0;
}

.badge-success {
	background: var(--teal-light);
	color: var(--teal-dark);
	border: 1px solid var(--teal-primary);
}

.badge-warning {
	background: var(--amber-bg);
	color: var(--amber-text);
	border: 1px solid var(--amber-border);
}

.badge-error {
	background: #fee2e2;
	color: #dc2626;
	border: 1px solid #fca5a5;
}
</style>
