<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'
import toast from 'svelte-french-toast'
import { Toaster } from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth  = Auth.getInstance()

type SS = 'idle' | 'saving' | 'saved'
let goalsDirty = $state(false); let goalsSave = $state<SS>('idle')
let remDirty   = $state(false); let remSave   = $state<SS>('idle')
let scaleDirty = $state(false); let scaleSave  = $state<SS>('idle')

async function saveSection(section: 'goals' | 'rem' | 'scale') {
	if (section === 'goals') {
		goalsSave = 'saving'
		await new Promise(r => setTimeout(r, 400))
		goalsDirty = false; goalsSave = 'saved'
		setTimeout(() => goalsSave = 'idle', 1600)
	} else if (section === 'rem') {
		remSave = 'saving'
		await new Promise(r => setTimeout(r, 400))
		remDirty = false; remSave = 'saved'
		setTimeout(() => remSave = 'idle', 1600)
	} else {
		scaleSave = 'saving'
		await new Promise(r => setTimeout(r, 400))
		scaleDirty = false; scaleSave = 'saved'
		setTimeout(() => scaleSave = 'idle', 1600)
	}
}

const swatches = ['#0087BD', '#3B82F6', '#D97706', '#A32D2D', '#7C3AED', '#FFFFFF']
let hexInput = $state(scale.sipDueLedColor.current)
const applyHex = async () => {
	const v = hexInput.trim()
	if (!/^#[0-9A-Fa-f]{6}$/.test(v)) return
	scale.sipDueLedColor.current = v; remDirty = true
	try { await scale.previewSipDueLedColor(v) } catch {}
}

const calibLabel = $derived.by(() => {
	switch (scale.bt.calibrationStatus) {
		case 1: return 'Taring…'
		case 2: return 'Calibrating…'
		case 3: return 'Tare done'
		case 4: return 'Calibration saved'
		case 5: return 'Calibration failed'
		default: return scale.bt.connected ? 'Ready' : 'Connect scale first'
	}
})
const tare = async () => {
	try { await scale.bt.tareScale() }
	catch (e) { toast.error((e as Error).message) }
}
const calibrate = async () => {
	try {
		await scale.bt.calibrateScale(Math.round(Math.max(1, Math.min(9999, scale.calibrationReferenceWeight.current))))
	} catch (e) { toast.error((e as Error).message) }
}

let deleteConfirm = $state(false)
const signOut = async () => { await auth.logout(); await goto('/m/welcome') }
const deleteAccount = async () => {
	try { await auth.deleteAccount(); await goto('/m/welcome') }
	catch (e) { toast.error(`Could not delete: ${(e as Error).message}`); deleteConfirm = false }
}
</script>

<div class="page">

	<div class="page-head">
		<h1>Settings</h1>
		<p class="sub">Each section saves independently.</p>
	</div>

	<!-- ── Goals ─────────────────────────────────────────────────── -->
	<div class="card">
		<h2 class="section-title">Goals</h2>

		<div class="field">
			<div class="field-label">
				<span class="lbl">Daily water target</span>
				<span class="hint">Target you track against</span>
			</div>
			<div class="stepper">
				<button class="sp-btn" onclick={() => { scale.dailyTargetIntake.current = Math.max(0, scale.dailyTargetIntake.current - 100); goalsDirty = true }}>−</button>
				<div class="sp-mid">
					<span class="sp-val">{scale.dailyTargetIntake.current.toLocaleString()}</span>
					<span class="sp-unit">ml</span>
				</div>
				<button class="sp-btn" onclick={() => { scale.dailyTargetIntake.current += 100; goalsDirty = true }}>+</button>
			</div>
		</div>

		<div class="divider"></div>

		<div class="field">
			<div class="field-label">
				<span class="lbl">Hourly target</span>
				<span class="hint">Used to pace reminders</span>
			</div>
			<div class="stepper">
				<button class="sp-btn" onclick={() => { scale.hourlyTargetIntake.current = Math.max(0, scale.hourlyTargetIntake.current - 10); goalsDirty = true }}>−</button>
				<div class="sp-mid">
					<span class="sp-val">{scale.hourlyTargetIntake.current}</span>
					<span class="sp-unit">ml</span>
				</div>
				<button class="sp-btn" onclick={() => { scale.hourlyTargetIntake.current += 10; goalsDirty = true }}>+</button>
			</div>
		</div>

		<div class="save-row">
			<span class="save-status" class:unsaved={goalsDirty && goalsSave !== 'saved'} class:saved={goalsSave === 'saved'}>
				{goalsSave === 'saved' ? '✓ Saved' : goalsDirty ? '● Unsaved changes' : 'All saved'}
			</span>
			<div class="save-btns">
				<button class="btn-ghost-sm" disabled={!goalsDirty || goalsSave === 'saving'} onclick={() => goalsDirty = false}>Discard</button>
				<button class="btn-teal-sm"  disabled={!goalsDirty || goalsSave === 'saving'} onclick={() => saveSection('goals')}>
					{goalsSave === 'saving' ? 'Saving…' : 'Save'}
				</button>
			</div>
		</div>
	</div>

	<!-- ── Reminders ──────────────────────────────────────────────── -->
	<div class="card">
		<h2 class="section-title">Reminders</h2>

		<div class="row-item">
			<div class="field-label">
				<span class="lbl">Adaptive reminders</span>
				<span class="hint">Adjusts to your real-time drinking pace</span>
			</div>
			<button
				class="toggle"
				class:on={scale.adaptiveRemindersEnabled.current}
				onclick={() => { scale.adaptiveRemindersEnabled.current = !scale.adaptiveRemindersEnabled.current; remDirty = true }}
				aria-pressed={scale.adaptiveRemindersEnabled.current}
			><span class="knob"></span></button>
		</div>

		<div class="divider"></div>

		<div class="field">
			<span class="lbl">LED reminder color</span>
			<span class="hint">Coaster pulses this color when it's time to drink</span>
			<div class="swatches">
				{#each swatches as s}
					<button
						class="swatch"
						class:active={scale.sipDueLedColor.current === s}
						style="background:{s}"
						aria-label={s}
						onclick={() => { scale.sipDueLedColor.current = s; hexInput = s; remDirty = true }}
					></button>
				{/each}
			</div>
			<div class="hex-row">
				<div class="hex-dot" style="background:{scale.sipDueLedColor.current}"></div>
				<input
					type="text"
					bind:value={hexInput}
					placeholder="#0087BD"
					maxlength="7"
					class="hex-input"
					oninput={() => { if (/^#[0-9A-Fa-f]{6}$/.test(hexInput)) { scale.sipDueLedColor.current = hexInput; remDirty = true } }}
				/>
				<button class="btn-ghost-sm" onclick={applyHex}>Add hex</button>
			</div>
		</div>

		<div class="save-row">
			<span class="save-status" class:unsaved={remDirty && remSave !== 'saved'} class:saved={remSave === 'saved'}>
				{remSave === 'saved' ? '✓ Saved' : remDirty ? '● Unsaved changes' : 'All saved'}
			</span>
			<div class="save-btns">
				<button class="btn-ghost-sm" disabled={!remDirty || remSave === 'saving'} onclick={() => remDirty = false}>Discard</button>
				<button class="btn-teal-sm"  disabled={!remDirty || remSave === 'saving'} onclick={() => saveSection('rem')}>
					{remSave === 'saving' ? 'Saving…' : 'Save'}
				</button>
			</div>
		</div>
	</div>

	<!-- ── Scale ──────────────────────────────────────────────────── -->
	<div class="card">
		<h2 class="section-title">Scale</h2>

		<div class="field">
			<div class="field-label">
				<span class="lbl">Reference weight</span>
				<span class="hint">Place a known-mass object to calibrate</span>
			</div>
			<div class="number-input">
				<input
					type="number"
					min="1" max="9999"
					bind:value={scale.calibrationReferenceWeight.current}
					oninput={() => scaleDirty = true}
					class="num-field"
				/>
				<span class="num-unit">g</span>
			</div>
		</div>

		<div class="cal-buttons">
			<button
				class="btn-ghost-md"
				onclick={tare}
				disabled={!scale.bt.connected || scale.bt.calibrationBusy}
			>Tare scale</button>
			<button
				class="btn-teal-md"
				onclick={calibrate}
				disabled={!scale.bt.connected || scale.bt.calibrationBusy || scale.calibrationReferenceWeight.current <= 0}
			>Calibrate</button>
		</div>

		<div class="cal-status">
			<span class="cal-factor">{scale.bt.calibrationFactor.toFixed(3)}</span>
			<span class="cal-label">{calibLabel}</span>
		</div>

		<div class="divider"></div>

		<div class="row-item">
			<div class="field-label">
				<span class="lbl">Debug panels</span>
				<span class="hint">Shows raw readings in the dashboard</span>
			</div>
			<button
				class="toggle"
				class:on={scale.showTrackingDebugPanels.current}
				onclick={() => { scale.showTrackingDebugPanels.current = !scale.showTrackingDebugPanels.current; scaleDirty = true }}
				aria-pressed={scale.showTrackingDebugPanels.current}
			><span class="knob"></span></button>
		</div>

		<div class="save-row">
			<span class="save-status" class:unsaved={scaleDirty && scaleSave !== 'saved'} class:saved={scaleSave === 'saved'}>
				{scaleSave === 'saved' ? '✓ Saved' : scaleDirty ? '● Unsaved changes' : 'All saved'}
			</span>
			<div class="save-btns">
				<button class="btn-ghost-sm" disabled={!scaleDirty || scaleSave === 'saving'} onclick={() => scaleDirty = false}>Discard</button>
				<button class="btn-teal-sm"  disabled={!scaleDirty || scaleSave === 'saving'} onclick={() => saveSection('scale')}>
					{scaleSave === 'saving' ? 'Saving…' : 'Save'}
				</button>
			</div>
		</div>
	</div>

	<!-- ── Account ────────────────────────────────────────────────── -->
	<div class="card">
		<h2 class="section-title">Account</h2>

		<button class="signout-btn" onclick={signOut}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
			Sign out
		</button>

		<div class="divider"></div>

		<div class="danger-zone">
			<p class="danger-title">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
				Danger zone
			</p>
			<p class="danger-desc">Permanently removes your account and all data. This cannot be undone.</p>
			{#if !deleteConfirm}
				<button class="delete-btn" onclick={() => deleteConfirm = true}>Delete account</button>
			{:else}
				<p class="danger-confirm">Are you sure? All your history and goals will be deleted.</p>
				<div class="del-btns">
					<button class="btn-ghost-sm" onclick={() => deleteConfirm = false}>Cancel</button>
					<button class="delete-confirm-btn" onclick={deleteAccount}>Yes, delete</button>
				</div>
			{/if}
		</div>
	</div>

</div>

<Toaster />
<svelte:head><title>Settings · Sippy</title></svelte:head>

<style>
.page {
	padding: 20px 16px 48px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

/* Page header */
.page-head { padding: 2px 0 4px; }
h1 {
	font-size: 26px;
	font-weight: 600;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	margin: 0 0 4px;
}
.sub { font-size: 14px; color: var(--warm-text-secondary); margin: 0; }

/* Card */
.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 18px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.section-title {
	font-size: 19px;
	font-weight: 600;
	letter-spacing: -0.3px;
	color: var(--warm-text);
	margin: 0;
}

/* Fields */
.field { display: flex; flex-direction: column; gap: 10px; }
.field-label { display: flex; flex-direction: column; gap: 2px; }
.lbl { font-size: 15px; font-weight: 500; color: var(--warm-text); }
.hint { font-size: 13px; color: var(--warm-text-tertiary); line-height: 1.4; }

/* Stepper — full width, large */
.stepper {
	display: flex;
	align-items: center;
	height: 60px;
	border: 1px solid var(--warm-border);
	border-radius: 14px;
	overflow: hidden;
	background: var(--warm-bg);
}
.sp-btn {
	width: 64px;
	height: 100%;
	border: none;
	background: transparent;
	font-size: 26px;
	font-weight: 300;
	color: var(--warm-text);
	cursor: pointer;
	display: grid;
	place-items: center;
	transition: background 0.1s;
}
.sp-btn:active { background: var(--warm-border); }
.sp-mid {
	flex: 1;
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 4px;
	border-left: 1px solid var(--warm-border);
	border-right: 1px solid var(--warm-border);
	height: 100%;
	padding: 0 8px;
}
.sp-val {
	font-size: 22px;
	font-weight: 600;
	color: var(--warm-text);
	font-variant-numeric: tabular-nums;
}
.sp-unit {
	font-size: 14px;
	color: var(--warm-text-secondary);
	font-weight: 400;
}

/* Divider */
.divider {
	height: 1px;
	background: var(--warm-border);
	opacity: 0.6;
	margin: 0 -4px;
}

/* Row item (toggle rows) */
.row-item {
	display: flex;
	align-items: center;
	gap: 16px;
}
.row-item .field-label { flex: 1; }

/* Toggle */
.toggle {
	width: 54px; height: 30px; border-radius: 30px;
	border: none; background: #C7C5BC;
	position: relative; cursor: pointer; padding: 0;
	transition: background 0.15s; flex-shrink: 0;
}
.toggle.on { background: var(--teal-primary); }
.knob {
	position: absolute; top: 4px; left: 4px;
	width: 22px; height: 22px; border-radius: 50%;
	background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.18);
	transition: left 0.15s;
}
.toggle.on .knob { left: 28px; }

/* LED swatches */
.swatches {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}
.swatch {
	width: 34px; height: 34px; border-radius: 50%;
	border: 2px solid transparent; cursor: pointer; padding: 0;
	box-shadow: 0 0 0 1px var(--warm-border);
	transition: all 0.12s;
}
.swatch.active {
	box-shadow: 0 0 0 2px var(--teal-primary), 0 0 0 4px var(--teal-light);
}
.hex-row {
	display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.hex-dot {
	width: 34px; height: 34px; border-radius: 10px;
	border: 1px solid var(--warm-border); flex-shrink: 0;
}
.hex-input {
	flex: 1; min-width: 110px; height: 44px; padding: 0 12px;
	border: 1px solid var(--warm-border); border-radius: 10px;
	background: var(--warm-bg); color: var(--warm-text);
	font-size: 15px; font-family: ui-monospace, monospace; outline: none;
	transition: border-color 0.12s;
}
.hex-input:focus { border-color: var(--teal-primary); }

/* Number input for reference weight */
.number-input {
	display: flex;
	height: 56px;
	border: 1px solid var(--warm-border);
	border-radius: 12px;
	overflow: hidden;
	background: var(--warm-bg);
}
.num-field {
	flex: 1; height: 100%; border: none; outline: none;
	background: transparent; color: var(--warm-text);
	font-size: 18px; font-family: inherit; padding: 0 16px;
}
.num-unit {
	padding: 0 16px;
	font-size: 15px;
	color: var(--warm-text-secondary);
	border-left: 1px solid var(--warm-border);
	display: grid; place-items: center;
}

/* Calibration */
.cal-buttons {
	display: flex; gap: 10px;
}
.cal-status {
	display: flex; align-items: baseline; gap: 10px;
}
.cal-factor {
	font-size: 22px; font-weight: 700; color: var(--warm-text);
	font-variant-numeric: tabular-nums;
}
.cal-label {
	font-size: 13px; color: var(--warm-text-secondary);
}

/* Save row */
.save-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding-top: 14px;
	border-top: 0.5px dashed var(--warm-border);
}
.save-status {
	flex: 1; font-size: 13px; color: var(--warm-text-tertiary);
}
.save-status.unsaved { color: var(--amber-text); }
.save-status.saved   { color: var(--teal-text); }
.save-btns { display: flex; gap: 8px; }

/* Buttons */
.btn-ghost-sm {
	height: 40px; padding: 0 16px; border-radius: 10px;
	background: transparent; color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
	font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer;
}
.btn-ghost-sm:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.btn-ghost-sm:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-teal-sm {
	height: 40px; padding: 0 16px; border-radius: 10px;
	background: var(--teal-primary); color: #fff; border: none;
	font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer;
}
.btn-teal-sm:hover:not(:disabled) { background: var(--teal-dark); }
.btn-teal-sm:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost-md {
	flex: 1; height: 52px; border-radius: 12px;
	background: transparent; color: var(--warm-text);
	border: 1px solid var(--warm-border);
	font-size: 15px; font-weight: 500; font-family: inherit; cursor: pointer;
}
.btn-ghost-md:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.btn-ghost-md:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-teal-md {
	flex: 1; height: 52px; border-radius: 12px;
	background: var(--teal-primary); color: #fff; border: none;
	font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer;
}
.btn-teal-md:hover:not(:disabled) { background: var(--teal-dark); }
.btn-teal-md:disabled { opacity: 0.4; cursor: not-allowed; }

/* Sign out */
.signout-btn {
	display: flex; align-items: center; gap: 10px;
	height: 52px; padding: 0 18px;
	border-radius: 12px; background: transparent;
	color: #ef4444; border: 1px solid #fca5a5;
	font-size: 16px; font-weight: 500; font-family: inherit;
	cursor: pointer; align-self: flex-start;
}
.signout-btn:hover { background: #fee2e2; }

/* Danger zone */
.danger-zone {
	background: #fff5f5;
	border: 0.5px solid #fca5a5;
	border-radius: 14px;
	padding: 18px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.danger-title {
	display: flex; align-items: center; gap: 7px;
	font-size: 14px; font-weight: 700; color: #dc2626; margin: 0;
}
.danger-desc {
	font-size: 14px; color: var(--warm-text-secondary);
	margin: 0; line-height: 1.5;
}
.danger-confirm {
	font-size: 14px; font-weight: 600; color: var(--warm-text); margin: 0;
}
.delete-btn {
	height: 44px; padding: 0 18px; border-radius: 10px;
	background: transparent; color: #dc2626; border: 1px solid #fca5a5;
	font-size: 15px; font-weight: 500; font-family: inherit; cursor: pointer;
	align-self: flex-start;
}
.delete-btn:hover { background: #fee2e2; }
.del-btns { display: flex; gap: 10px; }
.delete-confirm-btn {
	height: 44px; padding: 0 18px; border-radius: 10px;
	background: #dc2626; color: #fff; border: none;
	font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer;
}
.delete-confirm-btn:hover { background: #b91c1c; }
</style>
