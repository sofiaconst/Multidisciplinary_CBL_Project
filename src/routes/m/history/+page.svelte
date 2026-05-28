<script lang="ts">
import { History } from '$lib/history.svelte'

const history = History.getInstance()
const weekMax     = $derived(Math.max(...history.weekSessions.map(s => s.consumedMl), 100))
const getDayLabel = (d: string) => new Date(d).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3)
const formatDate  = (d: string) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })
const goalPct     = (s: (typeof history.weekSessions)[0]) =>
	s.goalMl === 0 ? 0 : Math.min(100, Math.round((s.consumedMl / s.goalMl) * 100))
</script>

<div class="page">

	<div class="page-head">
		<h1>History</h1>
		<p class="sub">{history.totalSessions} sessions recorded</p>
	</div>

	<!-- Weekly bar chart -->
	<div class="card">
		<p class="section-label">This week</p>
		<div class="chart">
			{#each history.weekSessions as session, i}
				{@const isToday = i === 6}
				{@const pct    = weekMax > 0 ? (session.consumedMl / weekMax) * 100 : 0}
				<div class="chart-col">
					<div class="chart-bar-wrap">
						<div
							class="chart-bar"
							class:today-bar={isToday}
							style="height:{Math.max(pct, 3)}%"
						></div>
					</div>
					<span class="day-label" class:today-label={isToday}>
						{getDayLabel(session.date)}
					</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Session list -->
	<div class="card">
		<p class="section-label">All sessions</p>
		{#if history.sessions.length === 0}
			<div class="empty">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".35"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
				<p>No sessions yet.<br/>Start tracking to record your hydration.</p>
			</div>
		{:else}
			<div class="session-list">
				{#each [...history.sessions].reverse() as session}
					{@const pct = goalPct(session)}
					<div class="session-row">
						<div class="session-info">
							<span class="session-date">{formatDate(session.date)}</span>
							<span class="session-stats">{session.sipCount} sips · {session.consumedMl.toFixed(0)} ml</span>
						</div>
						<span
							class="badge"
							class:badge-ok={pct >= 100}
							class:badge-warn={pct >= 50 && pct < 100}
							class:badge-low={pct < 50}
						>{pct}%</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

</div>

<svelte:head><title>History · Sippy</title></svelte:head>

<style>
.page {
	padding: 20px 16px 40px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.page-head { padding: 2px 0 4px; }
h1 {
	font-size: 26px;
	font-weight: 600;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	margin: 0 0 4px;
}
.sub {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0;
}

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
	margin: 0 0 16px;
}

/* Bar chart */
.chart {
	display: flex;
	gap: 6px;
	height: 140px;
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
	border-radius: 6px 6px 0 0;
	background: var(--warm-border);
	min-height: 4px;
	transition: height 0.3s ease;
}
.chart-bar.today-bar { background: var(--teal-primary); }
.day-label {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	margin-top: 6px;
	font-weight: 500;
}
.day-label.today-label {
	color: var(--teal-primary);
	font-weight: 700;
}

/* Empty state */
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	padding: 24px 0 8px;
	text-align: center;
	color: var(--warm-text-tertiary);
}
.empty p {
	font-size: 14px;
	line-height: 1.6;
	margin: 0;
}

/* Session list */
.session-list {
	display: flex;
	flex-direction: column;
}
.session-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px 0;
	border-bottom: 1px solid var(--warm-bg);
}
.session-row:last-child { border-bottom: none; }
.session-info {
	display: flex;
	flex-direction: column;
	gap: 3px;
}
.session-date {
	font-size: 15px;
	font-weight: 600;
	color: var(--warm-text);
}
.session-stats {
	font-size: 13px;
	color: var(--warm-text-secondary);
}

/* Badges */
.badge {
	font-size: 13px;
	font-weight: 700;
	padding: 5px 12px;
	border-radius: 20px;
	flex-shrink: 0;
}
.badge-ok   { background: var(--teal-light); color: var(--teal-dark); border: 1px solid var(--teal-primary); }
.badge-warn { background: var(--amber-bg); color: var(--amber-text); border: 1px solid var(--amber-border); }
.badge-low  { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
</style>
