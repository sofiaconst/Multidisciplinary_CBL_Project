<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'
import toast from 'svelte-french-toast'
import { Toaster } from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth = Auth.getInstance()

const calibrationStatusLabel = $derived.by(() => {
	switch (scale.bt.calibrationStatus) {
		case 1: return 'Taring...'
		case 2: return 'Calibrating...'
		case 3: return 'Tare complete'
		case 4: return 'Calibration saved'
		case 5: return 'Calibration failed'
		default: return scale.bt.connected ? 'Ready' : 'Connect the scale to calibrate'
	}
})

const tareScale = async () => {
	try {
		await scale.bt.tareScale()
	} catch (err) {
		toast.error(`Tare failed: ${(err as Error).message}`)
	}
}

const calibrateScale = async () => {
	try {
		await scale.bt.calibrateScale(scale.calibrationReferenceWeight.current)
	} catch (err) {
		toast.error(`Calibration failed: ${(err as Error).message}`)
	}
}

const previewLedColor = async (event: Event) => {
	const input = event.currentTarget as HTMLInputElement
	await scale.previewSipDueLedColor(input.value)
}

const stopLedPreview = async () => {
	await scale.stopSipDueLedPreview()
}

const signOut = async () => {
	await auth.logout()
	await goto('/login')
}
</script>

<div class="page">
	<div class="page-header">
		<a href="/" class="back-btn">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4L6 10l6 6"/></svg>
		</a>
		<h1>Settings</h1>
	</div>

	<!-- Goals -->
	<div class="card">
		<div class="section-title">Goals</div>

		<div class="field">
			<label for="daily-target">Daily target</label>
			<div class="input-row">
				<input
					id="daily-target"
					type="number"
					bind:value={scale.dailyTargetIntake.current}
					min="0"
					step="50"
				/>
				<span class="unit">ml</span>
			</div>
		</div>

		<div class="field">
			<label for="hourly-target">Hourly target</label>
			<div class="input-row">
				<input
					id="hourly-target"
					type="number"
					bind:value={scale.hourlyTargetIntake.current}
					min="0"
					step="10"
				/>
				<span class="unit">ml</span>
			</div>
		</div>
	</div>

	<!-- Reminders -->
	<div class="card">
		<div class="section-title">Reminders</div>

		<div class="toggle-row">
			<div>
				<div class="toggle-label">Adaptive reminders</div>
				<div class="toggle-desc">Pace reminders using hourly target and past sip size</div>
			</div>
			<label class="toggle-switch">
				<input type="checkbox" bind:checked={scale.adaptiveRemindersEnabled.current} />
				<span class="slider"></span>
			</label>
		</div>

		<div class="field" style="margin-top: 12px;">
			<label for="led-color">Sip due LED color</label>
			<div class="color-row">
				<input
					id="led-color"
					type="color"
					bind:value={scale.sipDueLedColor.current}
					oninput={previewLedColor}
					onchange={previewLedColor}
					onblur={stopLedPreview}
					class="color-input"
				/>
				<span class="toggle-desc">Live preview on the LED while you pick</span>
			</div>
		</div>
	</div>

	<!-- Calibration -->
	<div class="card">
		<div class="section-title">Calibration</div>

		<div class="field">
			<label for="ref-weight">Reference weight</label>
			<div class="input-row">
				<input
					id="ref-weight"
					type="number"
					bind:value={scale.calibrationReferenceWeight.current}
					min="1"
					step="1"
				/>
				<span class="unit">g</span>
			</div>
		</div>

		<p class="cal-instructions">
			1. Remove cup and tare. 2. Place reference weight. 3. Run calibration.
		</p>

		<div class="btn-col">
			<button
				type="button"
				class="btn-outline"
				onclick={tareScale}
				disabled={!scale.bt.connected || scale.bt.calibrationBusy}
			>
				Tare empty scale
			</button>
			<button
				type="button"
				class="btn-primary"
				onclick={calibrateScale}
				disabled={!scale.bt.connected || scale.bt.calibrationBusy || scale.calibrationReferenceWeight.current <= 0}
			>
				Calibrate with current load
			</button>
		</div>

		<div class="cal-status">
			<span class="cal-factor">{scale.bt.calibrationFactor.toFixed(3)}</span>
			<span class="cal-label">{calibrationStatusLabel}</span>
		</div>

		<div class="toggle-row" style="margin-top: 12px;">
			<div>
				<div class="toggle-label">Debug panels</div>
				<div class="toggle-desc">Show tracking debug info on home screen</div>
			</div>
			<label class="toggle-switch">
				<input type="checkbox" bind:checked={scale.showTrackingDebugPanels.current} />
				<span class="slider"></span>
			</label>
		</div>
	</div>

	<!-- Sign out -->
	<button type="button" class="signout-btn" onclick={signOut}>Sign out</button>
</div>

<Toaster />

<svelte:head>
	<title>Settings — Sippy</title>
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
	margin: 0;
}

.card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 12px;
	padding: 16px;
}

.section-title {
	font-size: 13px;
	font-weight: 700;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.06em;
	margin-bottom: 14px;
}

.field {
	margin-bottom: 12px;
}

.field:last-child {
	margin-bottom: 0;
}

label {
	display: block;
	font-size: 13px;
	font-weight: 500;
	color: var(--warm-text);
	margin-bottom: 6px;
}

.input-row {
	display: flex;
	align-items: center;
	gap: 0;
	max-width: 180px;
}

input[type='number'] {
	flex: 1;
	padding: 8px 10px;
	border: 1px solid var(--warm-border);
	border-right: none;
	border-radius: 8px 0 0 8px;
	background: var(--warm-bg);
	color: var(--warm-text);
	font-size: 14px;
	outline: none;
}

input[type='number']:focus {
	border-color: var(--teal-primary);
}

.unit {
	padding: 8px 10px;
	background: var(--warm-bg);
	border: 1px solid var(--warm-border);
	border-radius: 0 8px 8px 0;
	font-size: 13px;
	color: var(--warm-text-secondary);
}

.toggle-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 12px;
}

.toggle-label {
	font-size: 14px;
	font-weight: 500;
	color: var(--warm-text);
}

.toggle-desc {
	font-size: 12px;
	color: var(--warm-text-secondary);
	margin-top: 2px;
}

.toggle-switch {
	position: relative;
	display: inline-block;
	width: 44px;
	height: 24px;
	flex-shrink: 0;
	margin-top: 2px;
}

.toggle-switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	inset: 0;
	background-color: var(--warm-border);
	border-radius: 24px;
	transition: background 0.2s;
}

.slider::before {
	content: '';
	position: absolute;
	height: 18px;
	width: 18px;
	left: 3px;
	bottom: 3px;
	background: white;
	border-radius: 50%;
	transition: transform 0.2s;
}

.toggle-switch input:checked + .slider {
	background-color: var(--teal-primary);
}

.toggle-switch input:checked + .slider::before {
	transform: translateX(20px);
}

.color-row {
	display: flex;
	align-items: center;
	gap: 10px;
}

.color-input {
	width: 48px;
	height: 40px;
	padding: 2px;
	border: 1px solid var(--warm-border);
	border-radius: 8px;
	background: var(--warm-bg);
	cursor: pointer;
}

.cal-instructions {
	font-size: 12px;
	color: var(--warm-text-secondary);
	margin: 0 0 12px;
}

.btn-col {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 12px;
}

.btn-outline {
	width: 100%;
	padding: 10px;
	background: transparent;
	color: var(--warm-text);
	border: 1px solid var(--warm-border);
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: border-color 0.15s;
}

.btn-outline:hover:not(:disabled) {
	border-color: var(--teal-primary);
	color: var(--teal-primary);
}

.btn-outline:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.btn-primary {
	width: 100%;
	padding: 10px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s;
}

.btn-primary:hover:not(:disabled) {
	background: var(--teal-dark);
}

.btn-primary:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.cal-status {
	display: flex;
	align-items: baseline;
	gap: 8px;
}

.cal-factor {
	font-size: 20px;
	font-weight: 700;
	color: var(--warm-text);
}

.cal-label {
	font-size: 12px;
	color: var(--warm-text-secondary);
}

.signout-btn {
	width: 100%;
	padding: 12px;
	background: transparent;
	color: #ef4444;
	border: 1px solid #fca5a5;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	margin-top: 4px;
	transition: background 0.15s;
}

.signout-btn:hover {
	background: #fee2e2;
}
</style>
