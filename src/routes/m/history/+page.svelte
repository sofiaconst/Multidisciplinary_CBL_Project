<script lang="ts">
import { History } from '$lib/history.svelte'

const history = History.getInstance()
const weekMax = $derived(Math.max(...history.weekSessions.map(s => s.consumedMl), 100))
const getDayLabel = (d: string) => new Date(d).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3)
const formatDate  = (d: string) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })
const goalPct = (s: (typeof history.weekSessions)[0]) => s.goalMl === 0 ? 0 : Math.min(100, Math.round((s.consumedMl / s.goalMl) * 100))
</script>

<div class="page">
	<div class="page-head">
		<h1>History</h1>
		<p class="sub">{history.totalSessions} sessions recorded</p>
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
						<div class="chart-bar" style="height:{Math.max(pct,2)}%;background:{isToday?'var(--teal-primary)':'var(--warm-border)'}"></div>
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
			<div class="empty">No sessions yet. Start tracking to see your history.</div>
		{:else}
			{#each [...history.sessions].reverse() as session}
				{@const pct = goalPct(session)}
				<div class="session-item">
					<div>
						<div class="session-date">{formatDate(session.date)}</div>
						<div class="session-stats">{session.sipCount} sips · {session.consumedMl.toFixed(0)} ml</div>
					</div>
					<div class="badge" class:badge-success={pct>=100} class:badge-warn={pct>=50&&pct<100} class:badge-err={pct<50}>{pct}%</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<svelte:head><title>History · Sippy</title></svelte:head>

<style>
.page { padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 14px; }
.page-head { padding: 4px 0; }
h1 { font-size: 24px; font-weight: 500; letter-spacing: -0.4px; color: var(--warm-text); margin: 0 0 4px; }
.sub { font-size: 13px; color: var(--warm-text-secondary); margin: 0; }
.card { background: var(--warm-surface); border: 0.5px solid var(--warm-border); border-radius: 14px; padding: 18px; }
.section-label { font-size: 11px; font-weight: 600; color: var(--warm-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
.chart { display: flex; gap: 4px; height: 100px; align-items: flex-end; }
.chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.chart-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.chart-bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 3px; }
.chart-label { font-size: 10px; color: var(--warm-text-tertiary); margin-top: 4px; }
.chart-label.today { color: var(--teal-primary); font-weight: 700; }
.empty { font-size: 14px; color: var(--warm-text-tertiary); text-align: center; padding: 16px 0; }
.session-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--warm-bg); }
.session-item:last-child { border-bottom: none; }
.session-date { font-size: 14px; font-weight: 600; color: var(--warm-text); }
.session-stats { font-size: 12px; color: var(--warm-text-secondary); margin-top: 2px; }
.badge { font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
.badge-success { background: var(--teal-light); color: var(--teal-dark); border: 1px solid var(--teal-primary); }
.badge-warn { background: var(--amber-bg); color: var(--amber-text); border: 1px solid var(--amber-border); }
.badge-err { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
</style>
