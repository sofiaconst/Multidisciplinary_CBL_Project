<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'
import toast from 'svelte-french-toast'
import { Toaster } from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth = Auth.getInstance()

// ── Per-section dirty tracking ──────────────────────────────────
type SaveState = 'idle' | 'saving' | 'saved'

let goalsDirty = $state(false)
let goalsSave = $state<SaveState>('idle')
let remindersDirty = $state(false)
let remindersSave = $state<SaveState>('idle')
let scaleDirty = $state(false)
let scaleSave = $state<SaveState>('idle')

function markDirty(section: 'goals' | 'reminders' | 'scale') {
	if (section === 'goals') goalsDirty = true
	if (section === 'reminders') remindersDirty = true
	if (section === 'scale') scaleDirty = true
}

async function saveSection(
	section: 'goals' | 'reminders' | 'scale',
	action: 'save' | 'discard' = 'save'
) {
	if (section === 'goals') {
		if (action === 'discard') { goalsDirty = false; return }
		goalsSave = 'saving'
		await new Promise((r) => setTimeout(r, 400))
		goalsDirty = false
		goalsSave = 'saved'
		setTimeout(() => { goalsSave = 'idle' }, 1600)
	}
	if (section === 'reminders') {
		if (action === 'discard') { remindersDirty = false; return }
		remindersSave = 'saving'
		try {
			await scale.stopSipDueLedPreview()
		} catch { /* ignore */ }
		await new Promise((r) => setTimeout(r, 400))
		remindersDirty = false
		remindersSave = 'saved'
		setTimeout(() => { remindersSave = 'idle' }, 1600)
	}
	if (section === 'scale') {
		if (action === 'discard') { scaleDirty = false; return }
		scaleSave = 'saving'
		await new Promise((r) => setTimeout(r, 400))
		scaleDirty = false
		scaleSave = 'saved'
		setTimeout(() => { scaleSave = 'idle' }, 1600)
	}
}

// ── Scale calibration ────────────────────────────────────────────
const calibStatusLabel = $derived.by(() => {
	switch (scale.bt.calibrationStatus) {
		case 1: return 'Taring…'
		case 2: return 'Calibrating…'
		case 3: return 'Tare complete'
		case 4: return 'Calibration saved'
		case 5: return 'Calibration failed'
		default: return scale.bt.connected ? 'Ready' : 'Connect scale to calibrate'
	}
})

const tareScale = async () => {
	try { await scale.bt.tareScale() }
	catch (err) { toast.error(`Tare failed: ${(err as Error).message}`) }
}

const calibrateScale = async () => {
	try { await scale.bt.calibrateScale(Math.round(Math.max(1, Math.min(9999, scale.calibrationReferenceWeight.current)))) }
	catch (err) { toast.error(`Calibration failed: ${(err as Error).message}`) }
}

const previewLed = async (hex: string) => {
	scale.sipDueLedColor.current = hex
	markDirty('reminders')
	try { await scale.previewSipDueLedColor(hex) }
	catch { /* ignore */ }
}

// ── Advanced thresholds toggle ───────────────────────────────────
let showAdvanced = $state(false)

// ── LED color swatches ───────────────────────────────────────────
const swatches = ['#0087BD', '#3B82F6', '#D97706', '#A32D2D', '#7C3AED', '#FFFFFF']

// ── Sign out ─────────────────────────────────────────────────────
const signOut = async () => {
	await auth.logout()
	await goto('/login')
}
</script>

<div class="page">
	<main class="content">

		<!-- Page header -->
		<div class="page-head">
			<h1>Settings</h1>
			<p class="page-sub">Each section saves independently.</p>
		</div>

		<!-- ── Goals ──────────────────────────────────────────────── -->
		<div class="card">
			<div class="section-header">
				<div>
					<h2>Goals</h2>
					<p class="section-sub">Personal hydration targets.</p>
				</div>
			</div>

			<div class="row-2">
				<div class="field">
					<div class="label">Daily water target</div>
					<div class="label-hint">The target you'll be tracking against.</div>
					<div class="stepper">
						<button type="button" class="stepper-btn" onclick={() => { scale.dailyTargetIntake.current = Math.max(0, scale.dailyTargetIntake.current - 100); markDirty('goals') }}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>
						</button>
						<div class="stepper-val">
							{scale.dailyTargetIntake.current.toLocaleString()}
							<span class="stepper-unit">ml</span>
						</div>
						<button type="button" class="stepper-btn" onclick={() => { scale.dailyTargetIntake.current = scale.dailyTargetIntake.current + 100; markDirty('goals') }}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
						</button>
					</div>
				</div>
				<div class="field">
					<div class="label">Hourly target</div>
					<div class="label-hint">Used to pace adaptive reminders.</div>
					<div class="stepper">
						<button type="button" class="stepper-btn" onclick={() => { scale.hourlyTargetIntake.current = Math.max(0, scale.hourlyTargetIntake.current - 10); markDirty('goals') }}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>
						</button>
						<div class="stepper-val">
							{scale.hourlyTargetIntake.current.toLocaleString()}
							<span class="stepper-unit">ml</span>
						</div>
						<button type="button" class="stepper-btn" onclick={() => { scale.hourlyTargetIntake.current = scale.hourlyTargetIntake.current + 10; markDirty('goals') }}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
						</button>
					</div>
				</div>
			</div>

			<div class="save-block" class:dirty={goalsDirty}>
				<span class="save-status" class:saved={goalsSave === 'saved'} class:unsaved={goalsDirty && goalsSave !== 'saved'}>
					{#if goalsSave === 'saved'}
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
						Saved
					{:else if goalsDirty}
						<span class="dot-amber"></span>
						Unsaved changes in this section
					{:else}
						All saved
					{/if}
				</span>
				<div class="save-btns">
					<button class="ghost-sm" disabled={!goalsDirty || goalsSave === 'saving'} onclick={() => saveSection('goals', 'discard')}>Discard</button>
					<button class="teal-sm" disabled={!goalsDirty || goalsSave === 'saving'} onclick={() => saveSection('goals')}>
						{goalsSave === 'saving' ? 'Saving…' : 'Save goals'}
					</button>
				</div>
			</div>
		</div>

		<!-- ── Reminders ──────────────────────────────────────────── -->
		<div class="card">
			<div class="section-header">
				<div>
					<h2>Reminders</h2>
					<p class="section-sub">When and how the coaster nudges you.</p>
				</div>
			</div>

			<div class="row-item">
				<div class="row-label">
					<div class="label">Adaptive reminders</div>
					<div class="label-hint">Reminders adjust to your real-time pace.</div>
				</div>
				<button
					type="button"
					class="toggle"
					class:toggle-on={scale.adaptiveRemindersEnabled.current}
					onclick={() => { scale.adaptiveRemindersEnabled.current = !scale.adaptiveRemindersEnabled.current; markDirty('reminders') }}
					aria-pressed={scale.adaptiveRemindersEnabled.current}
				>
					<span class="toggle-knob"></span>
				</button>
			</div>

			<div class="divider"></div>

			<div class="row-item row-item-stack">
				<div class="row-label">
					<div class="label">LED reminder color</div>
					<div class="label-hint">The coaster pulses this color when it's time to drink.</div>
				</div>
				<div class="led-row">
					<div class="swatches">
						{#each swatches as swatch}
							<button
								type="button"
								class="swatch"
								class:swatch-active={scale.sipDueLedColor.current === swatch}
								style="background: {swatch};"
								aria-label={swatch}
								onclick={() => previewLed(swatch)}
							></button>
						{/each}
					</div>
					<input
						type="color"
						bind:value={scale.sipDueLedColor.current}
						oninput={(e) => previewLed((e.currentTarget as HTMLInputElement).value)}
						class="color-input"
					/>
					<button
						type="button"
						class="ghost-sm"
						onclick={async () => { try { await scale.stopSipDueLedPreview() } catch {} }}
						disabled={!scale.bt.connected}
					>
						Test LED
					</button>
				</div>
			</div>

			<div class="save-block" class:dirty={remindersDirty}>
				<span class="save-status" class:saved={remindersSave === 'saved'} class:unsaved={remindersDirty && remindersSave !== 'saved'}>
					{#if remindersSave === 'saved'}
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
						Saved
					{:else if remindersDirty}
						<span class="dot-amber"></span>
						Unsaved changes in this section
					{:else}
						All saved
					{/if}
				</span>
				<div class="save-btns">
					<button class="ghost-sm" disabled={!remindersDirty || remindersSave === 'saving'} onclick={() => saveSection('reminders', 'discard')}>Discard</button>
					<button class="teal-sm" disabled={!remindersDirty || remindersSave === 'saving'} onclick={() => saveSection('reminders')}>
						{remindersSave === 'saving' ? 'Saving…' : 'Save reminders'}
					</button>
				</div>
			</div>
		</div>

		<!-- ── Scale ──────────────────────────────────────────────── -->
		<div class="card">
			<div class="section-header">
				<div>
					<h2>Scale</h2>
					<p class="section-sub">Calibration and hardware behaviour.</p>
				</div>
			</div>

			<div class="row-2">
				<div class="field">
					<div class="label">Reference weight</div>
					<div class="label-hint">Place a known-mass object to calibrate.</div>
					<div class="input-wrap">
						<input
							type="number"
							min="1"
							max="9999"
							step="1"
							bind:value={scale.calibrationReferenceWeight.current}
							oninput={() => markDirty('scale')}
							class="text-input"
						/>
						<span class="input-unit">g</span>
					</div>
				</div>
				<div class="field">
					<div class="label">&nbsp;</div>
					<div class="label-hint">&nbsp;</div>
					<div class="btn-row">
						<button
							type="button"
							class="ghost-md"
							onclick={tareScale}
							disabled={!scale.bt.connected || scale.bt.calibrationBusy}
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
							Tare scale
						</button>
						<button
							type="button"
							class="teal-md"
							onclick={calibrateScale}
							disabled={!scale.bt.connected || scale.bt.calibrationBusy || scale.calibrationReferenceWeight.current <= 0}
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
							Calibrate
						</button>
					</div>
					<div class="cal-status">
						<span class="cal-factor">{scale.bt.calibrationFactor.toFixed(3)}</span>
						<span class="cal-label">{calibStatusLabel}</span>
					</div>
				</div>
			</div>

			<div class="divider"></div>

			<!-- Advanced thresholds collapsible -->
			<button
				type="button"
				class="adv-toggle"
				onclick={() => showAdvanced = !showAdvanced}
			>
				<svg
					width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
					style="transform: rotate({showAdvanced ? '90deg' : '0deg'}); transition: transform .15s"
				>
					<path d="M9 18l6-6-6-6"/>
				</svg>
				Advanced thresholds
				<span class="adv-label">{showAdvanced ? 'hide' : 'show'} expert settings</span>
			</button>

			{#if showAdvanced}
				<div class="adv-grid">
					<div class="field">
						<div class="label">Cup presence threshold</div>
						<div class="label-hint">Min weight to detect a cup on the coaster.</div>
						<div class="input-wrap">
							<input type="number" step="0.5" bind:value={scale.cupPresenceThresholdG.current} oninput={() => markDirty('scale')} class="text-input" />
							<span class="input-unit">g</span>
						</div>
					</div>
					<div class="field">
						<div class="label">Cup removal threshold</div>
						<div class="label-hint">Weight below which cup is considered lifted.</div>
						<div class="input-wrap">
							<input type="number" step="0.5" bind:value={scale.cupRemovedThresholdG.current} oninput={() => markDirty('scale')} class="text-input" />
							<span class="input-unit">g</span>
						</div>
					</div>
					<div class="field">
						<div class="label">Stability band</div>
						<div class="label-hint">Reading must stay within this band to settle.</div>
						<div class="input-wrap">
							<input type="number" step="0.1" bind:value={scale.stabilityBandG.current} oninput={() => markDirty('scale')} class="text-input" />
							<span class="input-unit">g</span>
						</div>
					</div>
					<div class="field">
						<div class="label">Settle duration</div>
						<div class="label-hint">Time of stability before classifying as steady.</div>
						<div class="input-wrap">
							<input type="number" step="50" bind:value={scale.settleDurationMs.current} oninput={() => markDirty('scale')} class="text-input" />
							<span class="input-unit">ms</span>
						</div>
					</div>
					<div class="field">
						<div class="label">Sip threshold</div>
						<div class="label-hint">Min delta between settles to register a sip.</div>
						<div class="input-wrap">
							<input type="number" step="0.5" bind:value={scale.sipThresholdG.current} oninput={() => markDirty('scale')} class="text-input" />
							<span class="input-unit">g</span>
						</div>
					</div>
					<div class="field">
						<div class="label">Refill threshold</div>
						<div class="label-hint">Delta required to classify as a refill, not a sip.</div>
						<div class="input-wrap">
							<input type="number" step="1" bind:value={scale.refillThresholdG.current} oninput={() => markDirty('scale')} class="text-input" />
							<span class="input-unit">g</span>
						</div>
					</div>
				</div>
			{/if}

			<div class="divider"></div>

			<div class="row-item">
				<div class="row-label">
					<div class="label">Debug panels</div>
					<div class="label-hint">Shows raw readings and timing in the dashboard.</div>
				</div>
				<button
					type="button"
					class="toggle"
					class:toggle-on={scale.showTrackingDebugPanels.current}
					onclick={() => { scale.showTrackingDebugPanels.current = !scale.showTrackingDebugPanels.current; markDirty('scale') }}
					aria-pressed={scale.showTrackingDebugPanels.current}
				>
					<span class="toggle-knob"></span>
				</button>
			</div>

			<div class="save-block" class:dirty={scaleDirty}>
				<span class="save-status" class:saved={scaleSave === 'saved'} class:unsaved={scaleDirty && scaleSave !== 'saved'}>
					{#if scaleSave === 'saved'}
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
						Saved
					{:else if scaleDirty}
						<span class="dot-amber"></span>
						Unsaved changes in this section
					{:else}
						All saved
					{/if}
				</span>
				<div class="save-btns">
					<button class="ghost-sm" disabled={!scaleDirty || scaleSave === 'saving'} onclick={() => saveSection('scale', 'discard')}>Discard</button>
					<button class="teal-sm" disabled={!scaleDirty || scaleSave === 'saving'} onclick={() => saveSection('scale')}>
						{scaleSave === 'saving' ? 'Saving…' : 'Save scale'}
					</button>
				</div>
			</div>
		</div>

		<!-- ── Account ────────────────────────────────────────────── -->
		<div class="card">
			<div class="section-header">
				<div>
					<h2>Account</h2>
					<p class="section-sub">Sign out and account actions.</p>
				</div>
			</div>

			<button type="button" class="signout-btn" onclick={signOut}>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
				Sign out
			</button>
		</div>

	</main>
</div>

<Toaster />

<svelte:head>
	<title>Settings — Sippy</title>
</svelte:head>

<style>
.page { background: var(--warm-bg); min-height: 100%; }

.content {
	width: 100%;
	max-width: 920px;
	margin: 0 auto;
	padding: 32px 24px 56px;
	display: flex;
	flex-direction: column;
	gap: 22px;
	box-sizing: border-box;
}

/* Header */
.page-head { padding: 4px 0 8px; }
h1 {
	font-size: 30px;
	font-weight: 500;
	letter-spacing: -0.6px;
	color: var(--warm-text);
	margin: 0 0 4px;
}
.page-sub { font-size: 14px; color: var(--warm-text-secondary); margin: 0; }

/* Card */
.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 28px;
}

/* Section header */
.section-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 22px;
}
h2 {
	font-size: 20px;
	font-weight: 500;
	letter-spacing: -0.4px;
	color: var(--warm-text);
	margin: 0;
}
.section-sub { font-size: 13.5px; color: var(--warm-text-secondary); margin: 4px 0 0; }

/* Grid */
.row-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }

/* Field */
.field { display: flex; flex-direction: column; gap: 2px; }
.label { font-size: 13px; font-weight: 500; color: var(--warm-text); }
.label-hint { font-size: 12px; color: var(--warm-text-tertiary); margin-bottom: 8px; }

/* NumberStepper */
.stepper {
	display: inline-flex;
	align-items: center;
	height: 40px;
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 10px;
	overflow: hidden;
}
.stepper-btn {
	width: 36px;
	height: 100%;
	border: none;
	background: transparent;
	cursor: pointer;
	display: grid;
	place-items: center;
	color: var(--warm-text-secondary);
	transition: background 0.1s;
}
.stepper-btn:hover { background: var(--warm-bg); }
.stepper-val {
	min-width: 90px;
	text-align: center;
	font-size: 14px;
	font-weight: 500;
	font-variant-numeric: tabular-nums;
	color: var(--warm-text);
	border-left: 0.5px solid var(--warm-border);
	border-right: 0.5px solid var(--warm-border);
	height: 100%;
	display: grid;
	place-items: center;
	padding: 0 10px;
}
.stepper-unit { font-size: 11px; color: var(--warm-text-tertiary); font-weight: 400; margin-left: 2px; }

/* Text input with unit */
.input-wrap {
	display: flex;
	align-items: center;
	height: 40px;
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 10px;
	overflow: hidden;
	max-width: 180px;
}
.text-input {
	flex: 1;
	height: 100%;
	border: none;
	outline: none;
	background: transparent;
	color: var(--warm-text);
	font-size: 14px;
	font-family: inherit;
	padding: 0 12px;
}
.text-input:focus { outline: none; }
.input-wrap:focus-within {
	border-color: var(--teal-primary);
	box-shadow: 0 0 0 3px var(--teal-light);
}
.input-unit {
	padding: 0 10px;
	font-size: 13px;
	color: var(--warm-text-secondary);
	border-left: 0.5px solid var(--warm-border);
	height: 100%;
	display: grid;
	place-items: center;
	background: var(--warm-bg);
}

/* Row item (label left, control right) */
.row-item {
	display: flex;
	align-items: center;
	gap: 16px;
}
.row-item-stack { align-items: flex-start; flex-direction: column; gap: 12px; }
.row-label { flex: 1; }

/* Toggle */
.toggle {
	width: 40px;
	height: 22px;
	border-radius: 20px;
	border: none;
	background: #C7C5BC;
	position: relative;
	cursor: pointer;
	padding: 0;
	transition: background 0.15s;
	flex-shrink: 0;
}
.toggle.toggle-on { background: var(--teal-primary); }
.toggle-knob {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: #fff;
	box-shadow: 0 1px 3px rgba(0,0,0,0.15);
	transition: left 0.15s;
}
.toggle.toggle-on .toggle-knob { left: 20px; }

/* Divider */
.divider { height: 1px; background: var(--warm-border); opacity: 0.6; margin: 20px 0; }

/* LED swatches */
.led-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.swatches { display: flex; gap: 6px; }
.swatch {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	border: 0.5px solid var(--warm-border);
	cursor: pointer;
	padding: 0;
	transition: all 0.12s;
}
.swatch.swatch-active {
	border: 2px solid var(--teal-primary);
	box-shadow: 0 0 0 3px var(--teal-light);
}
.color-input {
	width: 40px;
	height: 36px;
	padding: 2px;
	border: 0.5px solid var(--warm-border);
	border-radius: 8px;
	background: var(--warm-bg);
	cursor: pointer;
}

/* Button rows */
.btn-row { display: flex; gap: 8px; }

/* Calibration status */
.cal-status { display: flex; align-items: baseline; gap: 8px; margin-top: 10px; }
.cal-factor { font-size: 18px; font-weight: 700; color: var(--warm-text); }
.cal-label { font-size: 12px; color: var(--warm-text-secondary); }

/* Advanced thresholds */
.adv-toggle {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background: transparent;
	border: none;
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
	color: var(--warm-text);
	font-family: inherit;
	padding: 0;
}
.adv-label { font-size: 12px; color: var(--warm-text-tertiary); font-weight: 400; }
.adv-grid {
	margin-top: 16px;
	display: grid;
	grid-template-columns: repeat(2, minmax(0,1fr));
	gap: 14px;
}

/* Buttons */
.ghost-sm, .teal-sm, .ghost-md, .teal-md {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	height: 36px;
	padding: 0 14px;
	border-radius: 12px;
	font-size: 13px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	transition: all 0.15s;
}
.ghost-sm, .ghost-md {
	background: transparent;
	color: var(--warm-text);
	border: 0.5px solid var(--warm-border);
}
.ghost-sm:hover:not(:disabled), .ghost-md:hover:not(:disabled) {
	border-color: var(--teal-primary);
	color: var(--teal-primary);
}
.teal-sm, .teal-md {
	background: var(--teal-primary);
	color: #fff;
	border: none;
}
.teal-sm:hover:not(:disabled), .teal-md:hover:not(:disabled) { background: var(--teal-dark); }
.ghost-sm:disabled, .teal-sm:disabled, .ghost-md:disabled, .teal-md:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}
.ghost-md { height: 40px; }
.teal-md  { height: 40px; }

/* Per-section save block */
.save-block {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-top: 22px;
	padding-top: 18px;
	border-top: 0.5px dashed var(--warm-border);
}
.save-status {
	flex: 1;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 12.5px;
	color: var(--warm-text-tertiary);
}
.save-status.unsaved { color: var(--amber-text); }
.save-status.saved { color: var(--teal-text); }
.save-btns { display: flex; gap: 8px; }
.dot-amber {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--amber-text);
	display: inline-block;
}

/* Sign out */
.signout-btn {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	height: 36px;
	padding: 0 16px;
	background: transparent;
	color: #ef4444;
	border: 0.5px solid #fca5a5;
	border-radius: 12px;
	font-size: 14px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	transition: background 0.15s;
}
.signout-btn:hover { background: #fee2e2; }
</style>
