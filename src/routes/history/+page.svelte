<script lang="ts">
import { History } from '$lib/history.svelte'
import { demo } from '$lib/demo.svelte'

const history = History.getInstance()

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const displayWeek = $derived(demo.active
	? demo.weekData.map((ml, i) => ({ label: DAYS[i], consumedMl: ml }))
	: history.weekSessions.map(s => ({
		label: new Date(s.date).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3),
		consumedMl: s.consumedMl,
	}))
)

const weekMax = $derived(Math.max(...displayWeek.map(s => s.consumedMl), 1))

const getDayLabel = (dateStr: string) =>
	new Date(dateStr).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3)

const formatDate = (dateStr: string) =>
	new Date(dateStr).toLocaleDateString('en', { month: 'short', day: 'numeric' })

const goalPct = (session: (typeof history.weekSessions)[0]) => {
	if (session.goalMl === 0) return 0
	return Math.min(100, Math.round((session.consumedMl / session.goalMl) * 100))
}
</script>

<div class="page">
	<main class="content">
	<div class="page-header">
		<h1>History</h1>
		<p class="page-sub">{history.totalSessions} sessions recorded</p>
	</div>

	<!-- Weekly bar chart -->
	<div class="card">
		<div class="section-label">This week</div>
		<div class="chart">
			{#each displayWeek as session, i}
				{@const isToday = i === 6}
				{@const barPx = Math.max((session.consumedMl / weekMax) * 120, 4)}
				<div class="chart-col">
					<span class="chart-val">{session.consumedMl > 0 ? (session.consumedMl / 1000).toFixed(1) + 'L' : ''}</span>
					<div class="chart-bar-wrap">
						<div
							class="chart-bar"
							class:bar-today={isToday}
							style="height:{barPx}px"
						></div>
					</div>
					<div class="chart-label" class:today={isToday}>{session.label}</div>
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
	</main>
</div>

<svelte:head>
	<title>History — Sippy</title>
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
	gap: 16px;
	box-sizing: border-box;
}

.page-header {
	padding: 4px 0 8px;
}

.page-header h1 {
	font-size: 28px;
	font-weight: 500;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	margin: 0 0 4px;
}

.page-sub {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0;
}

.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 22px 24px;
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
	gap: 8px;
	align-items: flex-end;
	height: 160px;          /* explicit container height */
	padding-bottom: 20px;   /* room for day labels sitting below bars */
	position: relative;
	box-sizing: border-box;
}

.chart-col {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end; /* push bar + label to bottom */
	height: 100%;
	gap: 4px;
}

.chart-val {
	font-size: 10px;
	color: var(--warm-text-tertiary);
	height: 14px;
	line-height: 14px;
	white-space: nowrap;
}

.chart-bar-wrap {
	width: 100%;
	display: flex;
	align-items: flex-end;
}

.chart-bar {
	width: 100%;
	border-radius: 4px 4px 0 0;
	background: var(--warm-border);
	min-height: 4px;
	transition: height 0.35s ease;
}
.chart-bar.bar-today { background: var(--teal-primary); }

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
