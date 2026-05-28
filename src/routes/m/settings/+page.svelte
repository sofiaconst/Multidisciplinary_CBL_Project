<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'
import toast from 'svelte-french-toast'
import { Toaster } from 'svelte-french-toast'

const scale = Scale.getInstance()
const auth  = Auth.getInstance()

// Per-section dirty/save
type SS = 'idle' | 'saving' | 'saved'
let goalsDirty = $state(false); let goalsSave = $state<SS>('idle')
let remDirty   = $state(false); let remSave   = $state<SS>('idle')
let scaleDirty = $state(false); let scaleSave  = $state<SS>('idle')

async function save(section: 'goals' | 'rem' | 'scale') {
	const [dSet, sSet] = section === 'goals' ? [(v: boolean) => goalsDirty = v, (v: SS) => goalsSave = v]
		: section === 'rem' ? [(v: boolean) => remDirty = v, (v: SS) => remSave = v]
		: [(v: boolean) => scaleDirty = v, (v: SS) => scaleSave = v]
	sSet('saving')
	await new Promise(r => setTimeout(r, 400))
	dSet(false); sSet('saved')
	setTimeout(() => sSet('idle'), 1600)
}

// LED hex
const swatches = ['#0087BD', '#3B82F6', '#D97706', '#A32D2D', '#7C3AED', '#FFFFFF']
let hexInput = $state(scale.sipDueLedColor.current)
const applyHex = async () => {
	const v = hexInput.trim()
	if (!/^#[0-9A-Fa-f]{6}$/.test(v)) return
	scale.sipDueLedColor.current = v; remDirty = true
	try { await scale.previewSipDueLedColor(v) } catch {}
}

// Calibration
const calibStatusLabel = $derived.by(() => {
	switch (scale.bt.calibrationStatus) {
		case 1: return 'Taring…'; case 2: return 'Calibrating…'
		case 3: return 'Tare done'; case 4: return 'Calibration saved'
		case 5: return 'Failed'
		default: return scale.bt.connected ? 'Ready' : 'Connect scale first'
	}
})
const tare = async () => { try { await scale.bt.tareScale() } catch (e) { toast.error(`${(e as Error).message}`) } }
const calibrate = async () => {
	try { await scale.bt.calibrateScale(Math.round(Math.max(1, Math.min(9999, scale.calibrationReferenceWeight.current)))) }
	catch (e) { toast.error(`${(e as Error).message}`) }
}

// Account
let deleteConfirm = $state(false)
const signOut = async () => { await auth.logout(); await goto('/m/welcome') }
const deleteAccount = async () => {
	try { await auth.deleteAccount(); await goto('/m/welcome') }
	catch (e) { toast.error(`Could not delete: ${(e as Error).message}`); deleteConfirm = false }
}
</script>

<div class="page">
	<div class="page-head"><h1>Settings</h1><p class="sub">Each section saves independently.</p></div>

	<!-- Goals -->
	<div class="card">
		<div class="sh"><h2>Goals</h2></div>
		<div class="field-row">
			<div class="field">
				<div class="lbl">Daily target</div>
				<div class="stepper">
					<button class="sp-btn" onclick={() => { scale.dailyTargetIntake.current = Math.max(0, scale.dailyTargetIntake.current - 100); goalsDirty = true }}>–</button>
					<div class="sp-val">{scale.dailyTargetIntake.current.toLocaleString()}<span class="sp-unit">ml</span></div>
					<button class="sp-btn" onclick={() => { scale.dailyTargetIntake.current += 100; goalsDirty = true }}>+</button>
				</div>
			</div>
			<div class="field">
				<div class="lbl">Hourly target</div>
				<div class="stepper">
					<button class="sp-btn" onclick={() => { scale.hourlyTargetIntake.current = Math.max(0, scale.hourlyTargetIntake.current - 10); goalsDirty = true }}>–</button>
					<div class="sp-val">{scale.hourlyTargetIntake.current}<span class="sp-unit">ml</span></div>
					<button class="sp-btn" onclick={() => { scale.hourlyTargetIntake.current += 10; goalsDirty = true }}>+</button>
				</div>
			</div>
		</div>
		<div class="save-block">
			<span class="ss" class:ss-unsaved={goalsDirty && goalsSave !== 'saved'} class:ss-saved={goalsSave === 'saved'}>
				{goalsSave === 'saved' ? '✓ Saved' : goalsDirty ? '● Unsaved' : 'All saved'}
			</span>
			<button class="s-btn-ghost" disabled={!goalsDirty || goalsSave === 'saving'} onclick={() => { goalsDirty = false }}>Discard</button>
			<button class="s-btn-teal" disabled={!goalsDirty || goalsSave === 'saving'} onclick={() => save('goals')}>{goalsSave === 'saving' ? 'Saving…' : 'Save'}</button>
		</div>
	</div>

	<!-- Reminders -->
	<div class="card">
		<div class="sh"><h2>Reminders</h2></div>
		<div class="row-item">
			<div class="ri-label">
				<div class="lbl">Adaptive reminders</div>
				<div class="hint">Adjusts to your real-time pace.</div>
			</div>
			<button class="toggle" class:on={scale.adaptiveRemindersEnabled.current}
				onclick={() => { scale.adaptiveRemindersEnabled.current = !scale.adaptiveRemindersEnabled.current; remDirty = true }}
				aria-pressed={scale.adaptiveRemindersEnabled.current}>
				<span class="knob"></span>
			</button>
		</div>
		<div class="divider"></div>
		<div class="lbl" style="margin-bottom:10px">LED reminder color</div>
		<div class="swatches">
			{#each swatches as s}
				<button class="swatch" class:swatch-active={scale.sipDueLedColor.current===s} style="background:{s}" onclick={() => { scale.sipDueLedColor.current=s; hexInput=s; remDirty=true }}></button>
			{/each}
		</div>
		<div class="hex-row">
			<div class="hex-preview" style="background:{scale.sipDueLedColor.current}"></div>
			<input type="text" bind:value={hexInput} placeholder="#0087BD" maxlength="7" class="hex-input" oninput={() => { if(/^#[0-9A-Fa-f]{6}$/.test(hexInput)) { scale.sipDueLedColor.current=hexInput; remDirty=true } }} />
			<button class="ghost-sm" onclick={applyHex}>Add hex</button>
		</div>
		<div class="save-block">
			<span class="ss" class:ss-unsaved={remDirty && remSave !== 'saved'} class:ss-saved={remSave === 'saved'}>
				{remSave === 'saved' ? '✓ Saved' : remDirty ? '● Unsaved' : 'All saved'}
			</span>
			<button class="s-btn-ghost" disabled={!remDirty || remSave === 'saving'} onclick={() => { remDirty = false }}>Discard</button>
			<button class="s-btn-teal" disabled={!remDirty || remSave === 'saving'} onclick={() => save('rem')}>{remSave === 'saving' ? 'Saving…' : 'Save'}</button>
		</div>
	</div>

	<!-- Scale -->
	<div class="card">
		<div class="sh"><h2>Scale</h2></div>
		<div class="lbl">Reference weight</div>
		<div class="input-wrap">
			<input type="number" min="1" max="9999" bind:value={scale.calibrationReferenceWeight.current} oninput={() => scaleDirty=true} class="text-input" />
			<span class="unit">g</span>
		</div>
		<div class="cal-btns">
			<button class="ghost-sm" onclick={tare} disabled={!scale.bt.connected || scale.bt.calibrationBusy}>Tare</button>
			<button class="teal-sm" onclick={calibrate} disabled={!scale.bt.connected || scale.bt.calibrationBusy || scale.calibrationReferenceWeight.current<=0}>Calibrate</button>
		</div>
		<div class="cal-status"><span class="cf">{scale.bt.calibrationFactor.toFixed(3)}</span><span class="cl">{calibStatusLabel}</span></div>
		<div class="divider"></div>
		<div class="row-item">
			<div class="ri-label"><div class="lbl">Debug panels</div><div class="hint">Raw readings in dashboard.</div></div>
			<button class="toggle" class:on={scale.showTrackingDebugPanels.current}
				onclick={() => { scale.showTrackingDebugPanels.current = !scale.showTrackingDebugPanels.current; scaleDirty=true }}
				aria-pressed={scale.showTrackingDebugPanels.current}><span class="knob"></span></button>
		</div>
		<div class="save-block">
			<span class="ss" class:ss-unsaved={scaleDirty && scaleSave !== 'saved'} class:ss-saved={scaleSave === 'saved'}>
				{scaleSave === 'saved' ? '✓ Saved' : scaleDirty ? '● Unsaved' : 'All saved'}
			</span>
			<button class="s-btn-ghost" disabled={!scaleDirty || scaleSave === 'saving'} onclick={() => { scaleDirty = false }}>Discard</button>
			<button class="s-btn-teal" disabled={!scaleDirty || scaleSave === 'saving'} onclick={() => save('scale')}>{scaleSave === 'saving' ? 'Saving…' : 'Save'}</button>
		</div>
	</div>

	<!-- Account -->
	<div class="card">
		<div class="sh"><h2>Account</h2></div>
		<button class="signout-btn" onclick={signOut}>Sign out</button>
		<div class="divider"></div>
		<div class="danger-zone">
			<div class="danger-lbl">Danger zone</div>
			<p class="danger-desc">Permanently deletes your account and all data. Cannot be undone.</p>
			{#if !deleteConfirm}
				<button class="delete-btn" onclick={() => deleteConfirm=true}>Delete account</button>
			{:else}
				<p class="danger-desc" style="font-weight:600">Are you sure?</p>
				<div class="del-btns">
					<button class="ghost-sm" onclick={() => deleteConfirm=false}>Cancel</button>
					<button class="delete-btn-confirm" onclick={deleteAccount}>Yes, delete</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<Toaster />
<svelte:head><title>Settings · Sippy</title></svelte:head>

<style>
.page { padding: 16px 16px 32px; display: flex; flex-direction: column; gap: 14px; }
.page-head { padding: 4px 0; }
h1 { font-size: 24px; font-weight: 500; letter-spacing: -0.4px; color: var(--warm-text); margin: 0 0 4px; }
h2 { font-size: 17px; font-weight: 500; letter-spacing: -0.3px; color: var(--warm-text); margin: 0; }
.sub { font-size: 13px; color: var(--warm-text-secondary); margin: 0; }
.card { background: var(--warm-surface); border: 0.5px solid var(--warm-border); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.sh { margin-bottom: 2px; }
.lbl { font-size: 13px; font-weight: 500; color: var(--warm-text); }
.hint { font-size: 12px; color: var(--warm-text-tertiary); margin-top: 2px; }

/* Stepper */
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 8px; }
.stepper { display: flex; align-items: center; height: 44px; border: 0.5px solid var(--warm-border); border-radius: 10px; overflow: hidden; }
.sp-btn { width: 40px; height: 100%; border: none; background: transparent; font-size: 18px; font-weight: 400; cursor: pointer; color: var(--warm-text-secondary); }
.sp-val { flex: 1; text-align: center; font-size: 14px; font-weight: 500; color: var(--warm-text); border-left: 0.5px solid var(--warm-border); border-right: 0.5px solid var(--warm-border); height: 100%; display: grid; place-items: center; font-variant-numeric: tabular-nums; }
.sp-unit { font-size: 10px; color: var(--warm-text-tertiary); margin-left: 2px; font-weight: 400; }

/* Number input */
.input-wrap { display: flex; height: 44px; border: 0.5px solid var(--warm-border); border-radius: 10px; overflow: hidden; max-width: 160px; }
.text-input { flex: 1; height: 100%; border: none; outline: none; background: transparent; color: var(--warm-text); font-size: 14px; font-family: inherit; padding: 0 12px; }
.unit { padding: 0 10px; font-size: 13px; color: var(--warm-text-secondary); border-left: 0.5px solid var(--warm-border); display: grid; place-items: center; background: var(--warm-bg); }

/* Toggle */
.toggle { width: 40px; height: 22px; border-radius: 20px; border: none; background: #C7C5BC; position: relative; cursor: pointer; padding: 0; transition: background 0.15s; flex-shrink: 0; }
.toggle.on { background: var(--teal-primary); }
.knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15); transition: left 0.15s; }
.toggle.on .knob { left: 20px; }

/* Row item */
.row-item { display: flex; align-items: center; gap: 12px; }
.ri-label { flex: 1; }

/* Divider */
.divider { height: 1px; background: var(--warm-border); opacity: 0.6; }

/* LED */
.swatches { display: flex; gap: 8px; flex-wrap: wrap; }
.swatch { width: 30px; height: 30px; border-radius: 50%; border: 0.5px solid var(--warm-border); cursor: pointer; padding: 0; }
.swatch.swatch-active { border: 2px solid var(--teal-primary); box-shadow: 0 0 0 3px var(--teal-light); }
.hex-row { display: flex; align-items: center; gap: 8px; }
.hex-preview { width: 32px; height: 32px; border-radius: 8px; border: 0.5px solid var(--warm-border); flex-shrink: 0; }
.hex-input { width: 110px; height: 36px; padding: 0 10px; border: 0.5px solid var(--warm-border); border-radius: 8px; background: var(--warm-bg); color: var(--warm-text); font-size: 13px; font-family: ui-monospace, monospace; outline: none; }

/* Cal */
.cal-btns { display: flex; gap: 8px; }
.cal-status { display: flex; align-items: baseline; gap: 8px; }
.cf { font-size: 18px; font-weight: 700; color: var(--warm-text); }
.cl { font-size: 12px; color: var(--warm-text-secondary); }

/* Buttons */
.ghost-sm, .teal-sm {
	display: inline-flex; align-items: center; gap: 6px;
	height: 38px; padding: 0 14px; border-radius: 10px;
	font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer;
}
.ghost-sm { background: transparent; color: var(--warm-text); border: 0.5px solid var(--warm-border); }
.ghost-sm:hover:not(:disabled) { border-color: var(--teal-primary); color: var(--teal-primary); }
.teal-sm { background: var(--teal-primary); color: #fff; border: none; }
.teal-sm:hover:not(:disabled) { background: var(--teal-dark); }
.ghost-sm:disabled, .teal-sm:disabled { opacity: 0.4; cursor: not-allowed; }

/* Save block */
.save-block { display: flex; align-items: center; gap: 8px; padding-top: 14px; border-top: 0.5px dashed var(--warm-border); margin-top: 4px; }
.ss { flex: 1; font-size: 12px; color: var(--warm-text-tertiary); }
.ss.ss-unsaved { color: var(--amber-text); }
.ss.ss-saved { color: var(--teal-text); }
.s-btn-ghost { height: 34px; padding: 0 12px; border-radius: 8px; background: transparent; color: var(--warm-text); border: 0.5px solid var(--warm-border); font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; }
.s-btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
.s-btn-teal { height: 34px; padding: 0 12px; border-radius: 8px; background: var(--teal-primary); color: #fff; border: none; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; }
.s-btn-teal:disabled { opacity: 0.4; cursor: not-allowed; }

/* Account */
.signout-btn { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 16px; background: transparent; color: #ef4444; border: 0.5px solid #fca5a5; border-radius: 10px; font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer; align-self: flex-start; }
.signout-btn:hover { background: #fee2e2; }
.danger-zone { background: #fff5f5; border: 0.5px solid #fca5a5; border-radius: 10px; padding: 14px; }
.danger-lbl { font-size: 13px; font-weight: 600; color: #dc2626; margin-bottom: 6px; }
.danger-desc { font-size: 13px; color: var(--warm-text-secondary); margin: 0 0 10px; line-height: 1.5; }
.delete-btn { height: 36px; padding: 0 14px; border-radius: 8px; background: transparent; color: #dc2626; border: 0.5px solid #fca5a5; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; }
.delete-btn:hover { background: #fee2e2; }
.del-btns { display: flex; gap: 8px; }
.delete-btn-confirm { height: 36px; padding: 0 14px; border-radius: 8px; background: #dc2626; color: #fff; border: none; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
</style>
