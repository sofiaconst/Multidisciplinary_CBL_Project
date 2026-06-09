<script lang="ts">
import { History } from '$lib/history.svelte'
import { demo } from '$lib/demo.svelte'

const history = History.getInstance()

const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Weekly chart ──
const displayWeek = $derived(
	demo.active
		? demo.weekData.map((ml, i) => ({ label: DAYS[i], consumedMl: ml, sipCount: Math.round(ml / 118), goalMl: 2500, date: '' }))
		: history.weekSessions.map(s => ({
			label: new Date(s.date).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3),
			consumedMl: s.consumedMl, sipCount: s.sipCount, goalMl: s.goalMl, date: s.date,
		}))
)
const weekMax = $derived(Math.max(...displayWeek.map(s => s.consumedMl), 1))
let hoveredWeek = $state<number | null>(null)

// ── View mode ──
type ViewMode = 'all' | 'monthly' | 'yearly'
let viewMode   = $state<ViewMode>('all')
let selMonth   = $state(new Date().getMonth())
let selYear    = $state(new Date().getFullYear())
let hoveredBar = $state<number | null>(null)

// ── Monthly data ──
const monthDays = $derived.by(() => {
	const count = new Date(selYear, selMonth + 1, 0).getDate()
	return Array.from({ length: count }, (_, i) => {
		const d = i + 1
		const dateStr = `${selYear}-${String(selMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
		const s = history.sessions.find(x => x.date === dateStr)
		return { day: d, dateStr, consumedMl: s?.consumedMl ?? 0, sipCount: s?.sipCount ?? 0, goalMl: s?.goalMl ?? 2500 }
	})
})
const monthMax        = $derived(Math.max(...monthDays.map(d => d.consumedMl), 1))
const monthTotal      = $derived(monthDays.reduce((a, d) => a + d.consumedMl, 0))
const monthSips       = $derived(monthDays.reduce((a, d) => a + d.sipCount, 0))
const monthActiveDays = $derived(monthDays.filter(d => d.consumedMl > 0).length)

// ── Yearly data ──
const yearMonths = $derived.by(() =>
	MONTHS.map((label, i) => {
		const ss = history.sessions.filter(s => {
			const dd = new Date(s.date)
			return dd.getFullYear() === selYear && dd.getMonth() === i
		})
		return {
			label, month: i,
			consumedMl: ss.reduce((a, s) => a + s.consumedMl, 0),
			sipCount:   ss.reduce((a, s) => a + s.sipCount, 0),
			activeDays: ss.filter(s => s.sipCount > 0).length,
		}
	})
)
const yearMax        = $derived(Math.max(...yearMonths.map(m => m.consumedMl), 1))
const yearTotal      = $derived(yearMonths.reduce((a, m) => a + m.consumedMl, 0))
const yearSips       = $derived(yearMonths.reduce((a, m) => a + m.sipCount, 0))
const yearActiveMths = $derived(yearMonths.filter(m => m.activeDays > 0).length)
const yearAvgMl      = $derived.by(() => {
	const active = yearMonths.filter(m => m.consumedMl > 0)
	return active.length > 0 ? Math.round(yearTotal / active.length) : 0
})

// ── Navigation ──
const _now = new Date()
const canGoNext = $derived(
	viewMode === 'monthly'
		? !(selMonth === _now.getMonth() && selYear === _now.getFullYear())
		: selYear < _now.getFullYear()
)

function prev() {
	hoveredBar = null
	if (viewMode === 'yearly') { selYear--; return }
	if (selMonth === 0) { selMonth = 11; selYear-- } else selMonth--
}
function next() {
	if (!canGoNext) return
	hoveredBar = null
	if (viewMode === 'yearly') { selYear++; return }
	if (selMonth === 11) { selMonth = 0; selYear++ } else selMonth++
}

const periodLabel = $derived(
	viewMode === 'yearly'  ? String(selYear) :
	viewMode === 'monthly' ? `${MONTHS[selMonth]} ${selYear}` : ''
)

// ── Helpers ──
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en', { month: 'short', day: 'numeric' })
const fmtL    = (ml: number) => ml >= 1000 ? (ml / 1000).toFixed(1) + ' L' : ml + ' ml'
function pct(consumed: number, goal: number) { return goal ? Math.min(100, Math.round(consumed / goal * 100)) : 0 }
function goalClass(p: number) { return p >= 100 ? 'goal-ok' : p >= 50 ? 'goal-warn' : 'goal-bad' }
</script>

<div class="page">
	<main class="content">
		<div class="page-header">
			<h1>History</h1>
			<p class="page-sub">{history.totalSessions} sessions recorded</p>
		</div>

		<!-- ── Weekly bar chart ── -->
		<div class="card">
			<div class="section-label">This week</div>
			<div class="chart">
				{#each displayWeek as session, i}
					{@const isToday = i === 6}
					{@const barPx = Math.max((session.consumedMl / weekMax) * 120, session.consumedMl > 0 ? 4 : 2)}
					{@const isHovered = hoveredWeek === i}
					<div
						class="chart-col"
						onmouseenter={() => hoveredWeek = i}
						onmouseleave={() => hoveredWeek = null}
						role="img"
						aria-label="{session.label}: {session.consumedMl} ml"
					>
						<span class="chart-val" class:chart-val-hidden={isHovered}>
							{session.consumedMl > 0 ? fmtL(session.consumedMl) : ''}
						</span>
						<div class="chart-bar-wrap">
							{#if isHovered && session.consumedMl > 0}
								{@const p = pct(session.consumedMl, session.goalMl)}
								<div class="bar-tooltip" class:tt-left={i <= 1} class:tt-right={i >= 5}>
									<div class="tt-title">{session.label}{session.date ? ` · ${fmtDate(session.date)}` : ''}</div>
									<div class="tt-row"><span class="tt-k">Water</span><span class="tt-v">{fmtL(session.consumedMl)}</span></div>
									<div class="tt-row"><span class="tt-k">Sips</span><span class="tt-v">{session.sipCount}</span></div>
									<div class="tt-row"><span class="tt-k">Goal</span><span class="tt-v {goalClass(p)}">{p}%</span></div>
									<div class="tt-caret" class:tt-caret-left={i <= 1} class:tt-caret-right={i >= 5}></div>
								</div>
							{/if}
							<div
								class="chart-bar"
								style="height:{barPx}px; background:{
									isToday && isHovered ? 'var(--teal-dark)' :
									isToday             ? 'var(--teal-primary)' :
									isHovered           ? 'var(--teal-mid)' :
									                      'var(--warm-border)'
								}"
							></div>
						</div>
						<div class="chart-label" class:today={isToday}>{session.label}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- ── Sessions / Monthly / Yearly ── -->
		<div class="card">
			<!-- Tabs -->
			<div class="tab-row">
				{#each [['all','All sessions'],['monthly','Monthly'],['yearly','Yearly']] as [mode, label]}
					<button
						class="tab"
						class:tab-active={viewMode === mode}
						onclick={() => { viewMode = mode as ViewMode; hoveredBar = null }}
					>{label}</button>
				{/each}
			</div>

			{#if viewMode === 'monthly'}
				<!-- Period nav -->
				<div class="period-nav">
					<button class="nav-arrow" onclick={prev}>‹</button>
					<span class="period-label">{periodLabel}</span>
					<button class="nav-arrow" onclick={next} disabled={!canGoNext}>›</button>
				</div>
				<!-- Stats -->
				<div class="stat-row">
					<div class="stat-chip">
						<div class="stat-val">{monthTotal > 0 ? fmtL(monthTotal) : '—'}</div>
						<div class="stat-key">Total</div>
					</div>
					<div class="stat-chip">
						<div class="stat-val">{monthSips > 0 ? monthSips : '—'}</div>
						<div class="stat-key">Sips</div>
					</div>
					<div class="stat-chip">
						<div class="stat-val">{monthActiveDays}<span class="stat-denom">/{monthDays.length}</span></div>
						<div class="stat-key">Active days</div>
					</div>
					<div class="stat-chip">
						<div class="stat-val">{monthActiveDays > 0 ? fmtL(Math.round(monthTotal / monthActiveDays)) : '—'}</div>
						<div class="stat-key">Daily avg</div>
					</div>
				</div>
				<!-- Hover info bar -->
				<div class="hover-info" class:hover-info-visible={hoveredBar !== null && monthDays[hoveredBar ?? 0]?.consumedMl > 0}>
					{#if hoveredBar !== null}
						{@const d = monthDays[hoveredBar]}
						{@const p = pct(d.consumedMl, d.goalMl)}
						{#if d.consumedMl > 0}
							<span class="wi-day">{fmtDate(d.dateStr)}</span>
							<span class="wi-sep">·</span>
							<span class="wi-stat"><span class="wi-key">Water</span> <strong>{fmtL(d.consumedMl)}</strong></span>
							<span class="wi-sep">·</span>
							<span class="wi-stat"><span class="wi-key">Sips</span> <strong>{d.sipCount}</strong></span>
							<span class="wi-sep">·</span>
							<span class="wi-stat"><span class="wi-key">Goal</span> <strong class={goalClass(p)}>{p}%</strong></span>
						{:else}
							<span class="wi-key">{fmtDate(d.dateStr)} — no data</span>
						{/if}
					{:else}
						&nbsp;
					{/if}
				</div>
				<!-- Dense daily bars -->
				<div class="dense-chart">
					{#each monthDays as day, i}
						{@const p = pct(day.consumedMl, day.goalMl)}
						{@const barH = day.consumedMl > 0 ? Math.max((day.consumedMl / monthMax) * 72, 4) : 2}
						{@const isH = hoveredBar === i}
						<div
							class="dense-col"
							onmouseenter={() => hoveredBar = i}
							onmouseleave={() => hoveredBar = null}
							role="img"
							aria-label="Day {day.day}"
						>
							<div
								class="dense-bar"
								style="height:{barH}px; background:{
									day.consumedMl === 0 ? 'var(--warm-border)' :
									isH               ? 'var(--teal-dark)' :
									p >= 100          ? 'var(--teal-primary)' :
									                    'var(--teal-mid)'
								}"
							></div>
							<div class="dense-label">
								{day.day === 1 || day.day % 7 === 1 || day.day === monthDays.length ? day.day : ''}
							</div>
						</div>
					{/each}
				</div>

			{:else if viewMode === 'yearly'}
				<!-- Period nav -->
				<div class="period-nav">
					<button class="nav-arrow" onclick={prev}>‹</button>
					<span class="period-label">{periodLabel}</span>
					<button class="nav-arrow" onclick={next} disabled={!canGoNext}>›</button>
				</div>
				<!-- Stats -->
				<div class="stat-row">
					<div class="stat-chip">
						<div class="stat-val">{yearTotal > 0 ? fmtL(yearTotal) : '—'}</div>
						<div class="stat-key">Total</div>
					</div>
					<div class="stat-chip">
						<div class="stat-val">{yearSips > 0 ? yearSips : '—'}</div>
						<div class="stat-key">Sips</div>
					</div>
					<div class="stat-chip">
						<div class="stat-val">{yearActiveMths}<span class="stat-denom">/12</span></div>
						<div class="stat-key">Active months</div>
					</div>
					<div class="stat-chip">
						<div class="stat-val">{yearAvgMl > 0 ? fmtL(yearAvgMl) : '—'}</div>
						<div class="stat-key">Monthly avg</div>
					</div>
				</div>
				<!-- Hover info bar -->
				<div class="hover-info" class:hover-info-visible={hoveredBar !== null && yearMonths[hoveredBar ?? 0]?.consumedMl > 0}>
					{#if hoveredBar !== null}
						{@const m = yearMonths[hoveredBar]}
						{#if m.consumedMl > 0}
							<span class="wi-day">{m.label} {selYear}</span>
							<span class="wi-sep">·</span>
							<span class="wi-stat"><span class="wi-key">Water</span> <strong>{fmtL(m.consumedMl)}</strong></span>
							<span class="wi-sep">·</span>
							<span class="wi-stat"><span class="wi-key">Sips</span> <strong>{m.sipCount}</strong></span>
							<span class="wi-sep">·</span>
							<span class="wi-stat"><span class="wi-key">Days active</span> <strong>{m.activeDays}</strong></span>
						{:else}
							<span class="wi-key">{m.label} {selYear} — no data</span>
						{/if}
					{:else}
						&nbsp;
					{/if}
				</div>
				<!-- Monthly bars -->
				<div class="year-chart">
					{#each yearMonths as m, i}
						{@const barH = m.consumedMl > 0 ? Math.max((m.consumedMl / yearMax) * 100, 4) : 2}
						{@const isH = hoveredBar === i}
						<div
							class="year-col"
							onmouseenter={() => hoveredBar = i}
							onmouseleave={() => hoveredBar = null}
							role="img"
							aria-label="{m.label}: {m.consumedMl} ml"
						>
							<div
								class="year-bar"
								style="height:{barH}px; background:{
									m.consumedMl === 0 ? 'var(--warm-border)' :
									isH               ? 'var(--teal-dark)' :
									                    'var(--teal-primary)'
								}"
							></div>
							<div class="year-label" class:year-label-active={m.consumedMl > 0}>{m.label}</div>
						</div>
					{/each}
				</div>

			{:else}
				<!-- All sessions list -->
				{#if history.sessions.length === 0}
					<div class="empty">No sessions yet. Start tracking to record your hydration.</div>
				{:else}
					<div class="session-list">
						{#each [...history.sessions].reverse() as session}
							{@const p = pct(session.consumedMl, session.goalMl)}
							<div class="session-item">
								<div class="session-left">
									<div class="session-date">{fmtDate(session.date)}</div>
									<div class="session-stats">{session.sipCount} sips · {session.consumedMl} ml</div>
								</div>
								<div
									class="goal-badge"
									class:badge-success={p >= 100}
									class:badge-warning={p >= 50 && p < 100}
									class:badge-error={p < 50}
								>{p}%</div>
							</div>
						{/each}
					</div>
				{/if}
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
	flex: 1;
	min-height: 0;
}

.content {
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: 1180px;
	margin: 0 auto;
	padding: 28px 24px 56px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	box-sizing: border-box;
}

.page-header { padding: 4px 0 8px; }
.page-header h1 {
	font-size: 28px; font-weight: 500; letter-spacing: -0.5px;
	color: var(--warm-text); margin: 0 0 4px;
}
.page-sub { font-size: 14px; color: var(--warm-text-secondary); margin: 0; }

.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 22px 24px;
}

.section-label {
	font-size: 12px; font-weight: 600;
	color: var(--warm-text-secondary);
	text-transform: uppercase; letter-spacing: 0.05em;
	margin-bottom: 6px;
}

/* ── Weekly chart ── */
.chart {
	display: flex;
	gap: 8px;
	align-items: flex-end;
	height: 160px;
	padding-bottom: 20px;
	position: relative;
	box-sizing: border-box;
}
.chart-col {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
	gap: 4px;
	cursor: default;
}
.chart-val {
	font-size: 10px;
	color: var(--warm-text-tertiary);
	height: 14px; line-height: 14px;
	white-space: nowrap;
	transition: opacity 0.1s;
}
.chart-val.chart-val-hidden { opacity: 0; }

.chart-bar-wrap {
	width: 100%;
	display: flex;
	align-items: flex-end;
	position: relative;
}

/* ── Bar tooltip bubble ── */
.bar-tooltip {
	position: absolute;
	bottom: calc(100% + 10px);
	left: 50%;
	transform: translateX(-50%);
	background: var(--warm-text);
	color: #fff;
	border-radius: 10px;
	padding: 10px 13px;
	min-width: 148px;
	z-index: 20;
	pointer-events: none;
	box-shadow: 0 6px 20px rgba(0,0,0,0.22);
}
.bar-tooltip.tt-left  { left: 0;    transform: none; }
.bar-tooltip.tt-right { left: auto; right: 0; transform: none; }

.tt-caret {
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	width: 0; height: 0;
	border: 6px solid transparent;
	border-top-color: var(--warm-text);
	border-bottom: none;
}
.tt-caret.tt-caret-left  { left: 18px; transform: none; }
.tt-caret.tt-caret-right { left: auto; right: 18px; transform: none; }

.tt-title {
	font-size: 11px;
	font-weight: 600;
	color: rgba(255,255,255,0.55);
	margin-bottom: 7px;
	white-space: nowrap;
}
.tt-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 18px;
	font-size: 12px;
	margin-top: 4px;
}
.tt-k { color: rgba(255,255,255,0.5); font-weight: 400; }
.tt-v { font-weight: 600; }

.chart-bar {
	width: 100%;
	border-radius: 4px 4px 0 0;
	min-height: 2px;
	transition: height 0.3s ease, background 0.15s;
}
.chart-label { font-size: 11px; color: var(--warm-text-tertiary); margin-top: 4px; }
.chart-label.today { color: var(--teal-primary); font-weight: 700; }

/* ── Tabs ── */
.tab-row {
	display: flex;
	gap: 3px;
	margin-bottom: 16px;
	background: var(--warm-bg);
	border-radius: 10px;
	padding: 3px;
}
.tab {
	flex: 1; height: 32px; border: none; border-radius: 8px;
	font-size: 13px; font-weight: 500; font-family: inherit;
	cursor: pointer; background: transparent;
	color: var(--warm-text-secondary);
	transition: background 0.15s, color 0.15s;
}
.tab.tab-active {
	background: var(--warm-surface);
	color: var(--warm-text);
	box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* ── Period nav ── */
.period-nav {
	display: flex; align-items: center;
	justify-content: space-between; margin-bottom: 14px;
}
.period-label { font-size: 14px; font-weight: 600; color: var(--warm-text); }
.nav-arrow {
	width: 28px; height: 28px; border: none;
	background: var(--warm-bg); border-radius: 8px;
	font-size: 20px; cursor: pointer;
	color: var(--warm-text-secondary);
	display: grid; place-items: center;
	line-height: 1; transition: background 0.12s;
	padding-bottom: 2px;
}
.nav-arrow:hover:not(:disabled) { background: var(--warm-border); color: var(--warm-text); }
.nav-arrow:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── Stat chips ── */
.stat-row {
	display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;
}
.stat-chip {
	flex: 1; min-width: 0;
	background: var(--warm-bg); border-radius: 10px;
	padding: 10px 12px; text-align: center;
}
.stat-val {
	font-size: 15px; font-weight: 600;
	color: var(--teal-primary); letter-spacing: -0.3px;
}
.stat-denom { font-size: 12px; font-weight: 400; color: var(--warm-text-tertiary); }
.stat-key {
	font-size: 10px; color: var(--warm-text-tertiary);
	margin-top: 2px; text-transform: uppercase; letter-spacing: 0.04em;
}

/* ── Hover info bar (monthly/yearly) ── */
.hover-info {
	height: 20px;
	display: flex; align-items: center; gap: 6px;
	font-size: 12px; color: var(--warm-text-secondary);
	margin-bottom: 10px;
	opacity: 0; transition: opacity 0.15s;
}
.hover-info.hover-info-visible { opacity: 1; }

/* shared info bar pieces */
.wi-day   { font-weight: 600; color: var(--warm-text); }
.wi-sep   { color: var(--warm-border); }
.wi-key   { color: var(--warm-text-tertiary); }
.wi-stat  { display: inline-flex; align-items: center; gap: 4px; }
.goal-ok  { color: var(--teal-primary); }
.goal-warn{ color: var(--amber-text); }
.goal-bad { color: #dc2626; }

/* ── Dense monthly chart ── */
.dense-chart {
	display: flex; gap: 2px;
	align-items: flex-end;
	height: 96px; padding-bottom: 18px;
	box-sizing: border-box;
}
.dense-col {
	flex: 1; display: flex; flex-direction: column;
	align-items: center; justify-content: flex-end;
	height: 100%; cursor: default;
}
.dense-bar {
	width: 100%; min-height: 2px;
	border-radius: 2px 2px 0 0;
	transition: background 0.12s;
}
.dense-label {
	font-size: 8px; color: var(--warm-text-tertiary);
	margin-top: 3px; height: 11px; line-height: 11px;
}

/* ── Yearly chart ── */
.year-chart {
	display: flex; gap: 6px;
	align-items: flex-end;
	height: 140px; padding-bottom: 22px;
	box-sizing: border-box;
}
.year-col {
	flex: 1; display: flex; flex-direction: column;
	align-items: center; justify-content: flex-end;
	height: 100%; cursor: default;
}
.year-bar {
	width: 100%; min-height: 2px;
	border-radius: 4px 4px 0 0;
	transition: background 0.12s, height 0.25s ease;
}
.year-label {
	font-size: 10px; color: var(--warm-text-tertiary);
	margin-top: 4px; white-space: nowrap;
}
.year-label.year-label-active { color: var(--warm-text-secondary); }

/* ── All sessions list ── */
.empty {
	font-size: 14px; color: var(--warm-text-tertiary);
	text-align: center; padding: 20px 0;
}
.session-list { display: flex; flex-direction: column; }
.session-item {
	display: flex; justify-content: space-between;
	align-items: center; padding: 10px 0;
	border-bottom: 1px solid var(--warm-bg);
}
.session-item:last-child { border-bottom: none; }
.session-date { font-size: 14px; font-weight: 600; color: var(--warm-text); }
.session-stats { font-size: 12px; color: var(--warm-text-secondary); margin-top: 2px; }
.goal-badge {
	font-size: 12px; font-weight: 700;
	padding: 3px 8px; border-radius: 20px; flex-shrink: 0;
}
.badge-success { background: var(--teal-light); color: var(--teal-dark); border: 1px solid var(--teal-primary); }
.badge-warning { background: var(--amber-bg); color: var(--amber-text); border: 1px solid var(--amber-border); }
.badge-error   { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
</style>
