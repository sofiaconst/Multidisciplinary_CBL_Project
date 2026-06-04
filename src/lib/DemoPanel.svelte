<script lang="ts">
import { demo } from '$lib/demo.svelte'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const fmtMl = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const goalPct = $derived(
	demo.dailyTargetMl > 0
		? Math.round((demo.consumedMl / demo.dailyTargetMl) * 100)
		: 0
)

function setWeekDay(i: number, val: number) {
	const next = [...demo.weekData]
	next[i] = val
	demo.weekData = next
}

function close() { demo.panelOpen = false }
function exit()  { demo.active = false; demo.panelOpen = false }
</script>

<!-- Backdrop -->
<div class="backdrop" role="presentation" onclick={close}></div>

<!-- Panel -->
<div class="panel">
	<div class="drag-handle"></div>

	<div class="panel-head">
		<div class="panel-title-row">
			<span class="demo-badge">DEMO MODE</span>
			<h2 class="panel-title">Test controls</h2>
		</div>
		<button class="close-btn" onclick={close} aria-label="Close">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
		</button>
	</div>

	<div class="panel-body">

		<!-- ── Today ── -->
		<section class="section">
			<p class="section-label">Today's intake</p>

			<div class="row-space">
				<span class="ctrl-label">Consumed</span>
				<span class="ctrl-val">{fmtMl(demo.consumedMl)} ml <span class="pct-badge" class:over={goalPct > 100}>{goalPct}%</span></span>
			</div>
			<input
				type="range" min="0" max={demo.dailyTargetMl * 1.5}
				bind:value={demo.consumedMl} class="slider"
			/>

			<div class="row-space" style="margin-top:14px">
				<span class="ctrl-label">Daily goal</span>
				<span class="ctrl-val">{fmtMl(demo.dailyTargetMl)} ml</span>
			</div>
			<input type="range" min="500" max="5000" step="100"
				bind:value={demo.dailyTargetMl} class="slider"
			/>

			<div class="row-space" style="margin-top:14px">
				<span class="ctrl-label">Sip count</span>
				<span class="ctrl-val">{demo.sipCount}</span>
			</div>
			<input type="range" min="0" max="40"
				bind:value={demo.sipCount} class="slider"
			/>
		</section>

		<!-- ── Reminder state ── -->
		<section class="section">
			<p class="section-label">Reminder state</p>
			<div class="chip-row">
				{#each [
					{ v: 'off',             label: 'Off' },
					{ v: 'on_track',        label: 'On track' },
					{ v: 'sip_due',         label: 'Drink now' },
					{ v: 'target_reached',  label: 'Goal hit' },
				] as opt}
					<button
						class="chip"
						class:chip-active={demo.reminderStatus === opt.v}
						onclick={() => demo.reminderStatus = opt.v as typeof demo.reminderStatus}
					>{opt.label}</button>
				{/each}
			</div>
		</section>

		<!-- ── Weekly chart ── -->
		<section class="section">
			<p class="section-label">This week's history</p>
			{#each DAYS as day, i}
				<div class="week-row">
					<span class="day-lbl">{day}</span>
					<input type="range" min="0" max="4000" step="50"
						value={demo.weekData[i]}
						oninput={(e) => setWeekDay(i, Number((e.target as HTMLInputElement).value))}
						class="slider slider-week"
					/>
					<span class="week-val">{fmtMl(demo.weekData[i])}</span>
				</div>
			{/each}
		</section>

		<button class="exit-btn" onclick={exit}>Exit demo mode</button>

	</div>
</div>

<style>
.backdrop {
	position: fixed; inset: 0; z-index: 299;
	background: rgba(0,0,0,0.4);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(2px);
}
.panel {
	position: fixed; left: 0; right: 0; bottom: 0; z-index: 300;
	background: var(--warm-surface);
	border-radius: 22px 22px 0 0;
	padding-bottom: env(safe-area-inset-bottom, 0px);
	max-height: 82dvh;
	display: flex; flex-direction: column;
	box-shadow: 0 -4px 32px rgba(0,0,0,0.18);
}
.drag-handle {
	width: 36px; height: 4px; border-radius: 4px;
	background: var(--warm-border);
	margin: 12px auto 0;
	flex-shrink: 0;
}

.panel-head {
	display: flex; align-items: center; justify-content: space-between;
	padding: 14px 20px 10px;
	border-bottom: 0.5px solid var(--warm-border);
	flex-shrink: 0;
}
.panel-title-row { display: flex; align-items: center; gap: 10px; }
.demo-badge {
	font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
	color: var(--teal-dark); background: var(--teal-light);
	border: 1px solid var(--teal-mid); border-radius: 6px;
	padding: 3px 7px;
}
.panel-title { font-size: 17px; font-weight: 700; color: var(--warm-text); margin: 0; }
.close-btn {
	width: 32px; height: 32px; border-radius: 50%;
	background: var(--warm-bg); border: 0.5px solid var(--warm-border);
	display: grid; place-items: center;
	cursor: pointer; color: var(--warm-text-secondary);
	outline: none; -webkit-tap-highlight-color: transparent;
}

.panel-body {
	flex: 1; overflow-y: auto; padding: 16px 20px 24px;
	display: flex; flex-direction: column; gap: 20px;
}

.section {
	display: flex; flex-direction: column; gap: 6px;
}
.section-label {
	font-size: 11px; font-weight: 700; text-transform: uppercase;
	letter-spacing: 0.06em; color: var(--warm-text-secondary); margin: 0 0 6px;
}
.row-space {
	display: flex; justify-content: space-between; align-items: baseline;
}
.ctrl-label { font-size: 14px; font-weight: 500; color: var(--warm-text); }
.ctrl-val   { font-size: 14px; color: var(--warm-text-secondary); display: flex; align-items: center; gap: 6px; }
.pct-badge {
	font-size: 11px; font-weight: 700;
	background: var(--teal-light); color: var(--teal-dark);
	border-radius: 6px; padding: 2px 6px;
}
.pct-badge.over { background: #faeeda; color: #854f0b; }

/* Sliders */
.slider {
	width: 100%; height: 6px; -webkit-appearance: none; appearance: none;
	border-radius: 6px;
	background: linear-gradient(
		to right,
		var(--teal-primary) 0%,
		var(--teal-primary) calc(var(--pct, 50%) * 1%),
		var(--warm-border)  calc(var(--pct, 50%) * 1%)
	);
	outline: none; cursor: pointer;
}
.slider::-webkit-slider-thumb {
	-webkit-appearance: none; appearance: none;
	width: 22px; height: 22px; border-radius: 50%;
	background: var(--teal-primary);
	box-shadow: 0 1px 6px rgba(0,87,120,0.35);
	cursor: pointer;
}
.slider::-moz-range-thumb {
	width: 22px; height: 22px; border-radius: 50%;
	background: var(--teal-primary); border: none;
	box-shadow: 0 1px 6px rgba(0,87,120,0.35); cursor: pointer;
}

/* Reminder chips */
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
	height: 34px; padding: 0 14px; border-radius: 20px;
	background: var(--warm-bg); border: 1px solid var(--warm-border);
	font-size: 13px; font-weight: 500; color: var(--warm-text);
	cursor: pointer; font-family: inherit;
	outline: none; -webkit-tap-highlight-color: transparent;
	transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.chip.chip-active {
	background: var(--teal-primary); border-color: var(--teal-primary); color: #fff;
}

/* Week rows */
.week-row {
	display: grid; grid-template-columns: 32px 1fr 56px;
	align-items: center; gap: 10px;
}
.day-lbl { font-size: 12px; font-weight: 600; color: var(--warm-text-secondary); }
.slider-week { margin: 0; }
.week-val { font-size: 12px; color: var(--warm-text-tertiary); text-align: right; font-variant-numeric: tabular-nums; }

.exit-btn {
	width: 100%; height: 48px; border-radius: 14px;
	background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;
	font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer;
	margin-top: 4px;
	outline: none; -webkit-tap-highlight-color: transparent;
}
</style>
