<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import toast from 'svelte-french-toast'
import { Toaster } from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth  = Auth.getInstance()

const goalPct = $derived(
	scale.dailyTargetIntake.current > 0
		? Math.min(100, (scale.consumedMl / scale.dailyTargetIntake.current) * 100)
		: 0
)
const isSipDue  = $derived(scale.reminderStatus === 'sip_due')
const fmtMl     = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const fmtMin    = (ms: number | null) => ms === null ? '—' : `${Math.max(1, Math.round(ms / 60000))} m`

const tare = async () => {
	try { await scale.bt.tareScale() }
	catch (err) { toast.error(`Tare failed: ${(err as Error).message}`) }
}
</script>

<div class="page">
	<!-- Greeting -->
	<div class="greeting">
		<div>
			<div class="greeting-sub">{auth.greeting}</div>
			<div class="greeting-name">{auth.user?.name ?? ''}</div>
		</div>
		<div class="streak">
			<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2C7 6 5 8 5 11a5 5 0 0010 0c0-3-2-5-5-9z" fill="#f59e0b"/></svg>
			{auth.streakDays} day streak
		</div>
	</div>

	<!-- Hero progress -->
	<div class="hero">
		<div class="hero-orbs"></div>
		<div class="hero-today">TODAY</div>
		<div class="hero-pct">{Math.round(goalPct)}<span class="hero-sign">%</span></div>
		<div class="hero-ml">{fmtMl(scale.consumedMl)} / {fmtMl(scale.dailyTargetIntake.current)} ml</div>
		<div class="hero-bar">
			<div class="hero-fill" style="width:{goalPct}%"></div>
		</div>
	</div>

	<!-- 2×2 stat grid -->
	<div class="stat-grid">
		<div class="stat-card">
			<div class="stat-label">Sips</div>
			<div class="stat-val">{scale.sipCount}</div>
			<div class="stat-sub">today</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Consumed</div>
			<div class="stat-val">{fmtMl(scale.consumedMl)}<span class="stat-unit">ml</span></div>
			<div class="stat-sub">vs goal</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Avg sip</div>
			<div class="stat-val">{scale.averageSipSizeMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-sub">last 7 days</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Next sip</div>
			<div class="stat-val">{fmtMin(scale.nextSipDueInMs)}</div>
			<div class="stat-sub">adaptive</div>
		</div>
	</div>

	<!-- Reminder card -->
	<div class="card reminder" class:sip-due={isSipDue}>
		<div class="card-icon" class:icon-amber={isSipDue}>
			<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
		</div>
		<div class="card-body">
			<div class="card-title">
				{#if scale.reminderStatus === 'sip_due'}Time to drink
				{:else if scale.reminderStatus === 'on_track'}Next reminder
				{:else if scale.reminderStatus === 'target_reached'}Hourly target reached
				{:else}Reminders off{/if}
			</div>
			<div class="card-desc">
				{#if scale.reminderStatus === 'sip_due'}Drink now
				{:else if scale.reminderStatus === 'on_track'}In {fmtMin(scale.nextSipDueInMs)} · adaptive
				{:else if scale.reminderStatus === 'target_reached'}Great job this hour!
				{:else}&nbsp;{/if}
			</div>
		</div>
		<div class="card-aside">{fmtMl(scale.consumedThisHourMl)} / {fmtMl(scale.hourlyTargetIntake.current)} ml/hr</div>
	</div>

	<!-- Scale card -->
	{#if scale.bt.connected}
		<div class="card scale-card">
			<div class="scale-header">
				<svg viewBox="0 0 24 24" fill="none" width="15" height="15" color="var(--teal-dark)"><rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
				<span class="scale-lbl">Live reading</span>
				<span class="live"><span class="live-dot"></span>live</span>
			</div>
			<div class="scale-reading">
				<span class="scale-weight">{scale.bt.currentWeight.toFixed(1)}<span class="stat-unit"> g</span></span>
				<span class="cup-lbl">cup detected</span>
			</div>
			<button class="tare-btn" onclick={tare} disabled={scale.bt.calibrationBusy}>
				<svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
				Tare
			</button>
		</div>
	{/if}
</div>

<Toaster />

<svelte:head><title>Dashboard · Sippy</title></svelte:head>

<style>
@keyframes scalePulse {
	0%   { box-shadow: 0 0 0 0 rgba(0,135,189,0.55); }
	70%  { box-shadow: 0 0 0 6px rgba(0,135,189,0); }
	100% { box-shadow: 0 0 0 0 rgba(0,135,189,0); }
}

.page { padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 14px; }

.greeting { display: flex; justify-content: space-between; align-items: center; }
.greeting-sub { font-size: 13px; color: var(--warm-text-tertiary); }
.greeting-name { font-size: 22px; font-weight: 500; letter-spacing: -0.4px; color: var(--warm-text); }
.streak {
	display: inline-flex; align-items: center; gap: 5px;
	font-size: 12px; font-weight: 500; color: #854f0b;
	background: #faeeda; border: 0.5px solid #fac775;
	border-radius: 20px; padding: 4px 12px;
}

/* Hero */
.hero {
	border-radius: 20px; padding: 28px 20px;
	background: linear-gradient(135deg, var(--teal-dark) 0%, #2a7ab9 60%, var(--teal-primary) 100%);
	color: #fff; position: relative; overflow: hidden;
	display: flex; flex-direction: column; align-items: center;
}
.hero-orbs {
	position: absolute; inset: 0;
	background-image:
		radial-gradient(circle at 18% 75%, rgba(255,255,255,0.12) 0, transparent 35%),
		radial-gradient(circle at 85% 20%, rgba(255,255,255,0.08) 0, transparent 35%);
}
.hero-today { position: relative; font-size: 11px; color: rgba(255,255,255,0.78); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.hero-pct { position: relative; font-size: 72px; font-weight: 500; letter-spacing: -3px; line-height: 1; margin-bottom: 4px; font-variant-numeric: tabular-nums; }
.hero-sign { font-size: 28px; color: rgba(255,255,255,0.6); }
.hero-ml { position: relative; font-size: 14px; color: rgba(255,255,255,0.88); margin-bottom: 18px; font-variant-numeric: tabular-nums; }
.hero-bar { position: relative; width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 20px; overflow: hidden; }
.hero-fill { height: 100%; background: #fff; border-radius: 20px; min-width: 4px; transition: width 600ms cubic-bezier(.2,.7,.3,1); }

/* Stat grid 2×2 */
.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stat-card {
	background: var(--warm-surface); border: 0.5px solid var(--warm-border);
	border-radius: 14px; padding: 16px;
}
.stat-label { font-size: 11px; color: var(--warm-text-tertiary); margin-bottom: 6px; }
.stat-val { font-size: 26px; font-weight: 500; letter-spacing: -0.5px; color: var(--warm-text); font-variant-numeric: tabular-nums; line-height: 1; }
.stat-unit { font-size: 13px; font-weight: 400; color: var(--warm-text-secondary); }
.stat-sub { font-size: 11px; color: var(--warm-text-tertiary); margin-top: 4px; }

/* Cards */
.card { background: var(--warm-surface); border: 0.5px solid var(--warm-border); border-radius: 14px; padding: 18px; }

.reminder { display: flex; align-items: center; gap: 12px; transition: background 0.3s, border-color 0.3s; }
.reminder.sip-due { background: #faeeda; border-color: #fac775; }
.card-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--teal-light); color: var(--teal-dark); display: grid; place-items: center; flex-shrink: 0; }
.card-icon.icon-amber { background: rgba(133,79,11,0.12); color: #854f0b; }
.card-body { flex: 1; min-width: 0; }
.card-title { font-size: 12px; font-weight: 500; color: var(--warm-text-secondary); margin-bottom: 3px; }
.reminder.sip-due .card-title { color: #854f0b; }
.card-desc { font-size: 14px; color: var(--warm-text); }
.reminder.sip-due .card-desc { color: #854f0b; }
.card-aside { font-size: 11px; color: var(--warm-text-tertiary); text-align: right; flex-shrink: 0; }

/* Scale card */
.scale-card { display: flex; flex-direction: column; gap: 10px; }
.scale-header { display: flex; align-items: center; gap: 7px; }
.scale-lbl { font-size: 13px; color: var(--warm-text-secondary); font-weight: 500; flex: 1; }
.live { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--teal-dark); font-weight: 600; }
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--teal-primary); animation: scalePulse 1.6s ease-out infinite; }
.scale-reading { display: flex; align-items: baseline; gap: 10px; }
.scale-weight { font-size: 36px; font-weight: 500; letter-spacing: -1px; color: var(--warm-text); font-variant-numeric: tabular-nums; }
.cup-lbl { font-size: 12px; color: var(--warm-text-tertiary); }
.tare-btn {
	display: inline-flex; align-items: center; gap: 6px;
	height: 36px; padding: 0 14px; border-radius: 10px;
	background: transparent; color: var(--warm-text);
	border: 0.5px solid var(--warm-border); font-size: 13px; font-weight: 500;
	font-family: inherit; cursor: pointer; align-self: flex-start;
	transition: border-color 0.15s;
}
.tare-btn:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.tare-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
