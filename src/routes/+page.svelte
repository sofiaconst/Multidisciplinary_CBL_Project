<script lang="ts">
import '../app.css'
import Chart from './Chart.svelte'
import SettingsForm from './SettingsForm.svelte'
// import Title from './Title.svelte'
import { Toaster } from 'svelte-french-toast'
import Settings from 'virtual:icons/mingcute/settings-1-line'
import ConnectStartButton from './ConnectStartButton.svelte'
import Gauge from './Gauge.svelte'
import { Scale } from '$lib/scale.svelte'
import BatteryLevel from './BatteryLevel.svelte'

const scale = Scale.getInstance()

const trackingStatusLabels = {
  tracking_off: 'Tracking off',
  no_cup_detected: 'No cup detected',
  cup_settling: 'Cup settling',
  cup_placed: 'Cup placed',
  cup_lifted: 'Cup lifted',
}

const reminderStatusLabels = {
  reminders_off: 'Reminders off',
  target_reached: 'Hourly target reached',
  on_track: 'Reminder in',
  sip_due: 'Take a sip',
}

const formatMinutes = (ms: number | null) => {
  if (ms === null) {
    return '—'
  }
  return `${Math.max(1, Math.round(ms / 60000))} min`
}
</script>

<div class="w-screen h-screen relative drawer drawer-end">
  <input id="form-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <Chart />
    <div class="absolute inset-0">
      <!-- Temporarily hide top-left branding -->
      <!-- <Title /> -->
      <div class="absolute left-6 top-6">
        <div class="card bg-base-100/90 shadow-xl backdrop-blur-sm w-96">
          <div class="card-body gap-3">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs uppercase tracking-[0.18em] opacity-60">Tracking</div>
                <div class="text-xl font-semibold">{trackingStatusLabels[scale.trackingStatus]}</div>
              </div>
              <button
                type="button"
                class:btn-success={scale.trackingEnabled.current}
                class:btn-outline={!scale.trackingEnabled.current}
                class="btn btn-sm"
                onclick={scale.toggleTracking}
                disabled={!scale.bt.connected}
              >
                {scale.trackingEnabled.current ? 'Tracking on' : 'Tracking off'}
              </button>
            </div>

            <div class="stats stats-horizontal shadow-sm bg-base-200/60">
              <div class="stat px-4 py-3">
                <div class="stat-title">Sips</div>
                <div class="stat-value text-3xl">{scale.sipCount}</div>
              </div>
              <div class="stat px-4 py-3">
                <div class="stat-title">Consumed</div>
                <div class="stat-value text-3xl">{scale.consumedMl.toFixed(0)}</div>
                <div class="stat-desc">ml</div>
              </div>
            </div>

            <div class="rounded-box bg-base-200/60 px-3 py-3">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-semibold">{reminderStatusLabels[scale.reminderStatus]}</div>
                </div>
                <div
                  class:text-success={scale.reminderStatus === 'target_reached'}
                  class:text-warning={scale.reminderStatus === 'sip_due'}
                  class="text-right text-sm font-medium"
                >
                  {scale.reminderStatus === 'sip_due'
                    ? 'Sip now'
                    : scale.reminderStatus === 'target_reached'
                      ? 'This hour done'
                      : formatMinutes(scale.nextSipDueInMs)}
                </div>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div class="rounded-box bg-base-100/70 px-3 py-2">
                  <div class="opacity-60">This hour</div>
                  <div class="font-medium">{scale.consumedThisHourMl.toFixed(0)} / {scale.hourlyTargetIntake.current.toFixed(0)} ml</div>
                </div>
                <div class="rounded-box bg-base-100/70 px-3 py-2">
                  <div class="opacity-60">Avg sip</div>
                  <div class="font-medium">{scale.averageSipSizeMl.toFixed(0)} ml</div>
                </div>
                <div class="rounded-box bg-base-100/70 px-3 py-2">
                  <div class="opacity-60">Pace</div>
                  <div class="font-medium">{formatMinutes(scale.recommendedSipIntervalMs)}</div>
                </div>
              </div>
            </div>

            {#if scale.showTrackingDebugPanels.current}
              <div class="rounded-box bg-base-200/60 px-3 py-2 text-xs">
                <div class="font-medium mb-1">Tracking debug</div>
                <div>Live: {scale.bt.currentWeight.toFixed(1)} g</div>
                <div>Stable avg: {scale.currentStableAverage === null ? '—' : `${scale.currentStableAverage.toFixed(1)} g`}</div>
                <div>Stable for: {scale.stableForMs} ms</div>
                <div>Samples: {scale.stableSampleCount}</div>
              </div>

              <div class="rounded-box bg-base-200/60 px-3 py-2 text-xs max-h-32 overflow-auto">
                <div class="font-medium mb-1">Recent events</div>
                {#if scale.trackingDebugLog.length === 0}
                  <div class="opacity-60">No tracking events yet</div>
                {:else}
                  {#each scale.trackingDebugLog as entry}
                    <div class="leading-snug">{entry}</div>
                  {/each}
                {/if}
              </div>
            {/if}

          </div>
        </div>
      </div>
      <div class="absolute right-10 bottom-20">
        <label for="form-drawer" class="btn btn-neutral drawer-button" aria-label="Open settings drawer">
          <Settings class="h-6 w-6" /> Targets
        </label>
      </div>
      <div class="absolute left-20 bottom-20">
        <ConnectStartButton />
      </div>
      {#if scale.bt.connected}
        <div class="absolute left-20 top-[calc(55%-5rem)]" style="width: min(15rem, 45vh)">
          <Gauge
            startAngle={-110}
            endAngle={110}
            value={scale.bt.currentWeight}
            max={Math.max(scale.hourlyTargetIntake.current, 1)}
            separatorStep={Math.max(scale.hourlyTargetIntake.current / 4, 1)}
            innerRadius={70}
            scaleInterval={0}
          >
            <div class="w-full h-full text-3xl font-bold text-center mt-16">
              {scale.bt.currentWeight.toFixed(0)} g
            </div>
          </Gauge>
        </div>
      {/if}
      {#if scale.bt.batteryLevel}
        <div class="absolute right-4 bottom-2">
          <BatteryLevel level={scale.bt.batteryLevel} />
        </div>
      {/if}
    </div>
  </div>
  <div class="drawer-side">
    <label for="form-drawer" class="drawer-overlay"></label>
    <SettingsForm />
  </div>
</div>
<Toaster />

<svelte:head>
  <title>Hydration Scale</title>
</svelte:head>
