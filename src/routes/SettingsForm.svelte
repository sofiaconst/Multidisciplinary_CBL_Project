<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import ArrowRight from 'virtual:icons/mingcute/arrow-right-line'
import toast from 'svelte-french-toast'

const scale = Scale.getInstance()

const calibrationStatusLabel = $derived.by(() => {
  switch (scale.bt.calibrationStatus) {
    case 1:
      return 'Taring...'
    case 2:
      return 'Calibrating...'
    case 3:
      return 'Tare complete'
    case 4:
      return 'Calibration saved'
    case 5:
      return 'Calibration failed'
    default:
      return scale.bt.connected ? 'Ready' : 'Connect the scale to calibrate'
  }
})

const tareScale = async () => {
  try {
    await scale.bt.tareScale()
  } catch (err) {
    const error = err as Error
    toast.error(`Tare failed: ${error.message}`)
  }
}

const calibrateScale = async () => {
  try {
    await scale.bt.calibrateScale(scale.calibrationReferenceWeight.current)
  } catch (err) {
    const error = err as Error
    toast.error(`Calibration failed: ${error.message}`)
  }
}

const previewSipDueLedColor = async (event: Event) => {
  const input = event.currentTarget as HTMLInputElement
  await scale.previewSipDueLedColor(input.value)
}

const stopSipDueLedPreview = async () => {
  await scale.stopSipDueLedPreview()
}
</script>

<div class="flex flex-col bg-base-100 p-4 min-h-full gap-4">
  <div class="absolute top-2 right-2">
    <label for="form-drawer" class="btn btn-sm btn-ghost btn-square" aria-label="Close settings drawer">
      <ArrowRight class="h-6 w-6" />
    </label>
  </div>

  <fieldset class="fieldset max-w-[16rem] mt-8">
    <legend class="fieldset-legend">Daily target intake</legend>
    <div class="join">
      <input
        id="daily-target-intake"
        type="number"
        bind:value={scale.dailyTargetIntake.current}
        min="0"
        step="50"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">ml</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Hourly target intake</legend>
    <div class="join">
      <input
        id="hourly-target-intake"
        type="number"
        bind:value={scale.hourlyTargetIntake.current}
        min="0"
        step="10"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">ml</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Adaptive sip reminders</legend>
    <label class="label cursor-pointer px-0">
      <span class="label-text opacity-70">Use the hourly target and past sip size to pace reminders</span>
      <input type="checkbox" class="toggle" bind:checked={scale.adaptiveRemindersEnabled.current} />
    </label>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Sip due LED color</legend>
    <label class="label cursor-pointer px-0 gap-3 items-center">
      <input
        id="sip-due-led-color"
        type="color"
        class="input input-bordered h-12 w-16 p-1"
        bind:value={scale.sipDueLedColor.current}
        oninput={previewSipDueLedColor}
        onchange={previewSipDueLedColor}
        onblur={stopSipDueLedPreview}
      />
      <span class="label-text opacity-70">Live preview on the LED while you pick</span>
    </label>
  </fieldset>

  <div class="divider my-0">Tracking thresholds</div>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Cup detected above</legend>
    <div class="join">
      <input
        id="cup-presence-threshold"
        type="number"
        bind:value={scale.cupPresenceThresholdG.current}
        min="0"
        step="5"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">g</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Cup removed below</legend>
    <div class="join">
      <input
        id="cup-removed-threshold"
        type="number"
        bind:value={scale.cupRemovedThresholdG.current}
        min="0"
        step="5"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">g</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Stable weight band</legend>
    <div class="join">
      <input
        id="stability-band"
        type="number"
        bind:value={scale.stabilityBandG.current}
        min="1"
        step="1"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">g</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Settle duration</legend>
    <div class="join">
      <input
        id="settle-duration"
        type="number"
        bind:value={scale.settleDurationMs.current}
        min="250"
        step="250"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">ms</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Lift debounce</legend>
    <div class="join">
      <input
        id="lift-debounce"
        type="number"
        bind:value={scale.cupLiftedDebounceMs.current}
        min="0"
        step="100"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">ms</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Sip threshold</legend>
    <div class="join">
      <input
        id="sip-threshold"
        type="number"
        bind:value={scale.sipThresholdG.current}
        min="1"
        step="1"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">ml</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Refill threshold</legend>
    <div class="join">
      <input
        id="refill-threshold"
        type="number"
        bind:value={scale.refillThresholdG.current}
        min="1"
        step="1"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">ml</div>
    </div>
  </fieldset>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Show tracking debug panels</legend>
    <label class="label cursor-pointer px-0">
      <span class="label-text opacity-70">Display tracking debug and recent events</span>
      <input type="checkbox" class="toggle" bind:checked={scale.showTrackingDebugPanels.current} />
    </label>
  </fieldset>

  <div class="divider my-0">Calibration</div>

  <fieldset class="fieldset max-w-[16rem]">
    <legend class="fieldset-legend">Reference weight</legend>
    <div class="join">
      <input
        id="calibration-reference-weight"
        type="number"
        bind:value={scale.calibrationReferenceWeight.current}
        min="1"
        step="1"
        class="input join-item"
      />
      <div class="join-item bg-base-200 px-3 inline-flex items-center">g</div>
    </div>
  </fieldset>

  <div class="max-w-[16rem] text-sm opacity-70">
    1. Remove the cup and tare the scale.
    2. Place the reference weight.
    3. Run calibration to save the new factor.
  </div>

  <div class="flex flex-col gap-2 max-w-[16rem]">
    <button type="button" class="btn btn-outline" onclick={tareScale} disabled={!scale.bt.connected || scale.bt.calibrationBusy}>
      Tare empty scale
    </button>
    <button
      type="button"
      class="btn btn-primary"
      onclick={calibrateScale}
      disabled={!scale.bt.connected || scale.bt.calibrationBusy || scale.calibrationReferenceWeight.current <= 0}
    >
      Calibrate with current load
    </button>
  </div>

  <div class="stats shadow max-w-[16rem]">
    <div class="stat py-3">
      <div class="stat-title">Scale factor</div>
      <div class="stat-value text-2xl">{scale.bt.calibrationFactor.toFixed(3)}</div>
      <div class="stat-desc">{calibrationStatusLabel}</div>
    </div>
  </div>
</div>
