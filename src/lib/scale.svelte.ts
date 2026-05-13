import { browser } from '$app/environment'
import type { Point } from 'chart.js'
import { untrack } from 'svelte'
import { persistedState } from 'svelte-persisted-state'
import type { Bluetooth } from './bt.svelte'

type TrackingStatus = 'tracking_off' | 'no_cup_detected' | 'cup_settling' | 'cup_placed' | 'cup_lifted'
type ReminderStatus = 'reminders_off' | 'target_reached' | 'on_track' | 'sip_due'

export class Scale {
	private static instance: Scale
	private static bluetooth: Bluetooth

	chartWindowSeconds = 40
	streamStartMs = $state(0)

	dailyTargetIntake = persistedState('li.beeb.hydration.v2.dailyTargetIntake', 2500.0)
	hourlyTargetIntake = persistedState('li.beeb.hydration.v2.hourlyTargetIntake', 250.0)
	calibrationReferenceWeight = persistedState('li.beeb.hydration.v2.calibrationReferenceWeight', 216.0)
	trackingEnabled = persistedState('li.beeb.hydration.v2.trackingEnabled', false)
	adaptiveRemindersEnabled = persistedState('li.beeb.hydration.v2.adaptiveRemindersEnabled', true)
	cupPresenceThresholdG = persistedState('li.beeb.hydration.v2.cupPresenceThresholdG', 150.0)
	cupRemovedThresholdG = persistedState('li.beeb.hydration.v2.cupRemovedThresholdG', 30.0)
	stabilityBandG = persistedState('li.beeb.hydration.v2.stabilityBandG', 10.0)
	settleDurationMs = persistedState('li.beeb.hydration.v2.settleDurationMs', 2000.0)
	cupLiftedDebounceMs = persistedState('li.beeb.hydration.v2.cupLiftedDebounceMs', 500.0)
	sipThresholdG = persistedState('li.beeb.hydration.v2.sipThresholdG', 10.0)
	refillThresholdG = persistedState('li.beeb.hydration.v2.refillThresholdG', 10.0)
	sipDueLedColor = persistedState('li.beeb.hydration.v2.sipDueLedColor', '#ff0000')
	showTrackingDebugPanels = persistedState('li.beeb.hydration.v2.showTrackingDebugPanels', false)

	wakeLock = $state<WakeLockSentinel>()
	chartData = $state<Point[]>([])
	trackingStatus = $state<TrackingStatus>('tracking_off')
	sipCount = $state(0)
	consumedMl = $state(0)
	lastSipAmountMl = $state(0)
	currentSettledWeight = $state<number | null>(null)
	currentStableAverage = $state<number | null>(null)
	stableForMs = $state(0)
	stableSampleCount = $state(0)
	reminderStatus = $state<ReminderStatus>('reminders_off')
	consumedThisHourMl = $state(0)
	averageSipSizeMl = $state(25)
	recommendedSipIntervalMs = $state<number | null>(null)
	nextSipDueInMs = $state<number | null>(null)
	trackingDebugLog = $state<string[]>([])
	debugLoggingEnabled = persistedState('li.beeb.hydration.v2.debugLoggingEnabled', true)

	interval: ReturnType<typeof setInterval> | undefined
	private stableSamples: Array<{ time: number; weight: number }> = []
	private stableSinceMs: number | null = null
	private liftedSinceMs: number | null = null
	private previousSettledWeight: number | null = null
	private awaitingCupReturnAfterLift = false
	private lastLoggedStatus: TrackingStatus | null = null
	private lastSnapshotLogMs = 0
	private trackingSessionStartedAt: number | null = null
	private sipHistory: Array<{ time: number; amountMl: number }> = []
	private lastReminderLedOn: boolean | null = null
	private ledPreviewColorHex: string | null = null
	private ledPreviewUntilMs = 0

	private readonly defaultSipSizeMl = 25
	private readonly minReminderIntervalMs = 2 * 60 * 1000
	private readonly maxReminderIntervalMs = 20 * 60 * 1000

	private constructor(bt: Bluetooth) {
		Scale.bluetooth = bt

		$effect(() => {
			const connected = Scale.bluetooth.connected

			untrack(() => {
				if (this.interval !== undefined) {
					clearInterval(this.interval)
					this.interval = undefined
				}
				if (connected) {
					this.chartData = []
					this.streamStartMs = Date.now()
					this.updateChartData(Scale.bluetooth.currentWeight)
					this.interval = setInterval(() => {
						const now = Date.now()
						const currentWeight = Scale.bluetooth.currentWeight
						this.updateChartData(currentWeight, now)
						this.processTracking(currentWeight, now)
					}, 350)
					this.acquireWakeLock()
				} else {
					this.resetTrackingRuntimeState()
					this.releaseWakeLock()
				}
			})

			return () => {
				if (this.interval !== undefined) {
					clearInterval(this.interval)
					this.interval = undefined
				}
			}
		})
	}

	public static init(bluetooth: Bluetooth) {
		if (!Scale.instance) {
			Scale.instance = new Scale(bluetooth)
		}
		return Scale.instance
	}

	public static getInstance(): Scale {
		if (!Scale.instance) {
			throw new Error('Scale not initialized')
		}
		return Scale.instance
	}

	get bt() {
		return Scale.bluetooth
	}

	private acquireWakeLock = async () => {
		if (!browser) {
			return
		}
		if ('wakeLock' in navigator && !this.wakeLock) {
			try {
				this.wakeLock = await navigator.wakeLock.request('screen')
			} catch (err) {
				console.error(err)
			}
		}
	}

	private releaseWakeLock = async () => {
		await this.wakeLock?.release()
		this.wakeLock = undefined
	}

	toggleTracking = () => {
		this.trackingEnabled.current = !this.trackingEnabled.current
		this.resetTrackingRuntimeState()
	}

	resetTrackingSession = () => {
		this.sipCount = 0
		this.consumedMl = 0
		this.lastSipAmountMl = 0
		this.trackingDebugLog = []
		this.sipHistory = []
		this.resetTrackingRuntimeState()
	}

	private resetTrackingRuntimeState = () => {
		this.stableSamples = []
		this.stableSinceMs = null
		this.liftedSinceMs = null
		this.currentSettledWeight = null
		this.currentStableAverage = null
		this.stableForMs = 0
		this.stableSampleCount = 0
		this.previousSettledWeight = null
		this.awaitingCupReturnAfterLift = false
		this.lastLoggedStatus = null
		this.lastSnapshotLogMs = 0
		this.lastReminderLedOn = null
		this.trackingSessionStartedAt = Scale.bluetooth.connected ? Date.now() : null
		this.reminderStatus = this.adaptiveRemindersEnabled.current && this.trackingEnabled.current ? 'on_track' : 'reminders_off'
		this.consumedThisHourMl = 0
		this.averageSipSizeMl = this.defaultSipSizeMl
		this.recommendedSipIntervalMs = null
		this.nextSipDueInMs = null
		this.trackingStatus = this.trackingEnabled.current ? 'no_cup_detected' : 'tracking_off'
	}

	private updateReminderState = (now: number) => {
		if (!this.trackingEnabled.current || !this.adaptiveRemindersEnabled.current || !Scale.bluetooth.connected) {
			this.reminderStatus = 'reminders_off'
			this.consumedThisHourMl = 0
			this.averageSipSizeMl = this.defaultSipSizeMl
			this.recommendedSipIntervalMs = null
			this.nextSipDueInMs = null
			return
		}

		if (this.trackingSessionStartedAt === null) {
			this.trackingSessionStartedAt = now
		}

		const hourWindowMs = 60 * 60 * 1000
		const elapsedSinceStartMs = Math.max(0, now - this.trackingSessionStartedAt)
		const currentHourIndex = Math.floor(elapsedSinceStartMs / hourWindowMs)
		const currentHourStartMs = this.trackingSessionStartedAt + currentHourIndex * hourWindowMs
		const currentHourEndMs = currentHourStartMs + hourWindowMs
		const remainingMsInHour = Math.max(0, currentHourEndMs - now)

		const hourSipEvents = this.sipHistory.filter((sip) => sip.time >= currentHourStartMs)
		const consumedThisHourMl = hourSipEvents.reduce((sum, sip) => sum + sip.amountMl, 0)
		this.consumedThisHourMl = consumedThisHourMl

		const totalConsumedMl = this.sipHistory.reduce((sum, sip) => sum + sip.amountMl, 0)
		this.averageSipSizeMl =
			this.sipHistory.length === 0
				? this.defaultSipSizeMl
				: Math.max(10, Math.min(60, totalConsumedMl / this.sipHistory.length))

		const remainingTargetMl = Math.max(0, this.hourlyTargetIntake.current - consumedThisHourMl)
		if (remainingTargetMl <= 0) {
			this.reminderStatus = 'target_reached'
			this.recommendedSipIntervalMs = null
			this.nextSipDueInMs = null
			return
		}

		const predictedSipsNeeded = Math.max(1, Math.ceil(remainingTargetMl / this.averageSipSizeMl))
		const recommendedIntervalMs = Math.max(
			this.minReminderIntervalMs,
			Math.min(this.maxReminderIntervalMs, remainingMsInHour / predictedSipsNeeded),
		)
		this.recommendedSipIntervalMs = recommendedIntervalMs

		const lastSipTimeMs = hourSipEvents.length > 0 ? hourSipEvents[hourSipEvents.length - 1].time : currentHourStartMs
		const nextSipDueAtMs = lastSipTimeMs + recommendedIntervalMs
		this.nextSipDueInMs = Math.max(0, nextSipDueAtMs - now)
		this.reminderStatus = now >= nextSipDueAtMs ? 'sip_due' : 'on_track'
	}

	private syncReminderLed = () => {
		if (!Scale.bluetooth.connected) {
			this.lastReminderLedOn = null
			return
		}
		const now = Date.now()
		const previewActive = this.ledPreviewColorHex !== null && now < this.ledPreviewUntilMs
		if (previewActive && this.ledPreviewColorHex !== null) {
			void this.sendLedHex(this.ledPreviewColorHex)
			this.lastReminderLedOn = null
			return
		}

		if (this.ledPreviewColorHex !== null && now >= this.ledPreviewUntilMs) {
			this.ledPreviewColorHex = null
			this.ledPreviewUntilMs = 0
		}

		const shouldBeOn = this.reminderStatus === 'sip_due'
		if (this.lastReminderLedOn === shouldBeOn) {
			return
		}
		this.lastReminderLedOn = shouldBeOn
		void (shouldBeOn ? this.sendLedHex(this.sipDueLedColor.current) : Scale.bluetooth.setReminderLed(false))
	}

	private hexToRgb = (hex: string) => {
		const normalized = hex.startsWith('#') ? hex.slice(1) : hex
		if (normalized.length !== 6) {
			return null
		}
		const red = Number.parseInt(normalized.slice(0, 2), 16)
		const green = Number.parseInt(normalized.slice(2, 4), 16)
		const blue = Number.parseInt(normalized.slice(4, 6), 16)
		if ([red, green, blue].some((value) => Number.isNaN(value))) {
			return null
		}
		return { red, green, blue }
	}

	private sendLedHex = async (hex: string) => {
		const rgb = this.hexToRgb(hex)
		if (rgb === null) {
			return
		}
		await Scale.bluetooth.setReminderLedColor(rgb.red, rgb.green, rgb.blue)
	}

	previewSipDueLedColor = async (hex: string) => {
		this.sipDueLedColor.current = hex
		if (!Scale.bluetooth.connected) {
			return
		}
		this.ledPreviewColorHex = hex
		this.ledPreviewUntilMs = Date.now() + 1500
		this.lastReminderLedOn = null
		await this.sendLedHex(hex)
	}

	stopSipDueLedPreview = async () => {
		this.ledPreviewColorHex = null
		this.ledPreviewUntilMs = 0
		this.lastReminderLedOn = null
		this.syncReminderLed()
	}

	private pushTrackingDebug = (message: string) => {
		const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false })
		this.trackingDebugLog = [`${timestamp} ${message}`, ...this.trackingDebugLog].slice(0, 8)
	}

	private logTrackingEvent = async (payload: Record<string, unknown>) => {
		if (!browser || !this.debugLoggingEnabled.current) {
			return
		}
		try {
			void fetch('/api/tracking-log', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload),
				keepalive: true,
			})
		} catch (err) {
			console.error('tracking log failed', err)
		}
	}

	private logTrackingSnapshot = (weight: number, now: number) => {
		if (!browser || !this.debugLoggingEnabled.current) {
			return
		}
		if (this.trackingStatus !== 'cup_settling') {
			return
		}
		if (now - this.lastSnapshotLogMs < 1000) {
			return
		}
		this.lastSnapshotLogMs = now
		void this.logTrackingEvent({
			type: 'tracking_snapshot',
			status: this.trackingStatus,
			weight,
			stableAverage: this.currentStableAverage,
			stableForMs: this.stableForMs,
			stableSampleCount: this.stableSampleCount,
			thresholds: {
				cupPresenceThresholdG: this.cupPresenceThresholdG.current,
				cupRemovedThresholdG: this.cupRemovedThresholdG.current,
				stabilityBandG: this.stabilityBandG.current,
				settleDurationMs: this.settleDurationMs.current,
				cupLiftedDebounceMs: this.cupLiftedDebounceMs.current,
				sipThresholdG: this.sipThresholdG.current,
				refillThresholdG: this.refillThresholdG.current,
			},
		})
	}

	private recordTrackingStatusChange = (weight: number) => {
		if (this.trackingStatus === this.lastLoggedStatus) {
			return
		}
		this.lastLoggedStatus = this.trackingStatus
		void this.logTrackingEvent({
			type: 'tracking_status',
			status: this.trackingStatus,
			weight,
			stableAverage: this.currentStableAverage,
			stableForMs: this.stableForMs,
			stableSampleCount: this.stableSampleCount,
			settledWeight: this.currentSettledWeight,
			sipCount: this.sipCount,
			consumedMl: this.consumedMl,
		})
	}

	private updateChartData = (weight: number, now = Date.now()) => {
		if (!Scale.bluetooth.connected) {
			return
		}
		if (this.streamStartMs === 0) {
			this.streamStartMs = now
		}
		const elapsed = (now - this.streamStartMs) / 1000
		this.chartData = [...this.chartData, { x: elapsed, y: weight }].filter(
			(point) => (point.x ?? 0) >= elapsed - this.chartWindowSeconds,
		)
	}

	private processTracking = (weight: number, now: number) => {
		this.updateReminderState(now)
		this.syncReminderLed()

		if (!this.trackingEnabled.current) {
			this.trackingStatus = 'tracking_off'
			this.recordTrackingStatusChange(weight)
			return
		}
		if (!Scale.bluetooth.connected) {
			this.trackingStatus = 'tracking_off'
			this.recordTrackingStatusChange(weight)
			return
		}

		if (weight < this.cupRemovedThresholdG.current) {
			this.stableSamples = []
			this.stableSinceMs = null
			this.currentSettledWeight = null
			this.currentStableAverage = null
			this.stableForMs = 0
			this.stableSampleCount = 0
			if (this.previousSettledWeight !== null) {
				if (this.liftedSinceMs === null) {
					this.liftedSinceMs = now
					this.pushTrackingDebug(`weight ${weight.toFixed(1)} g below removal threshold`)
				}
				if (now - this.liftedSinceMs >= this.cupLiftedDebounceMs.current) {
					this.trackingStatus = 'cup_lifted'
					this.awaitingCupReturnAfterLift = true
				}
			} else {
				this.liftedSinceMs = null
				this.trackingStatus = 'no_cup_detected'
			}
			this.recordTrackingStatusChange(weight)
			return
		}

		if (weight < this.cupPresenceThresholdG.current) {
			this.stableSamples = []
			this.stableSinceMs = null
			this.liftedSinceMs = null
			this.currentSettledWeight = null
			this.currentStableAverage = null
			this.stableForMs = 0
			this.stableSampleCount = 0
			this.trackingStatus = 'no_cup_detected'
			this.recordTrackingStatusChange(weight)
			return
		}

		this.liftedSinceMs = null
		if (
			!this.awaitingCupReturnAfterLift &&
			this.currentSettledWeight !== null &&
			this.trackingStatus === 'cup_placed' &&
			Math.abs(weight - this.currentSettledWeight) <= this.stabilityBandG.current
		) {
			this.currentStableAverage = this.currentSettledWeight
			this.stableForMs = this.settleDurationMs.current
			this.stableSampleCount = 1
			this.recordTrackingStatusChange(weight)
			return
		}

		if (this.stableSamples.length === 0) {
			this.stableSamples = [{ time: now, weight }]
			this.stableSinceMs = now
			this.currentStableAverage = weight
			this.stableForMs = 0
			this.stableSampleCount = 1
			this.pushTrackingDebug(`stability window started at ${weight.toFixed(1)} g`)
		} else {
			const stableAverage =
				this.stableSamples.reduce((sum, sample) => sum + sample.weight, 0) / this.stableSamples.length
			if (Math.abs(weight - stableAverage) <= this.stabilityBandG.current) {
				this.stableSamples = [...this.stableSamples, { time: now, weight }]
			} else {
				this.pushTrackingDebug(
					`stability reset: ${weight.toFixed(1)} g outside ${this.stabilityBandG.current.toFixed(1)} g band from ${stableAverage.toFixed(1)} g`,
				)
				this.stableSamples = [{ time: now, weight }]
				this.stableSinceMs = now
			}
			const nextAverage =
				this.stableSamples.reduce((sum, sample) => sum + sample.weight, 0) / this.stableSamples.length
			this.currentStableAverage = nextAverage
			this.stableForMs = this.stableSinceMs === null ? 0 : now - this.stableSinceMs
			this.stableSampleCount = this.stableSamples.length
		}
		this.trackingStatus = 'cup_settling'
		this.recordTrackingStatusChange(weight)
		this.logTrackingSnapshot(weight, now)

		if (this.stableSinceMs === null || now - this.stableSinceMs < this.settleDurationMs.current) {
			return
		}

		const weights = this.stableSamples.map((sample) => sample.weight)
		const settledWeight = weights.reduce((sum, sampleWeight) => sum + sampleWeight, 0) / weights.length
		this.currentSettledWeight = settledWeight
		this.trackingStatus = 'cup_placed'
		this.stableSamples = [{ time: now, weight: settledWeight }]
		this.stableSinceMs = now
		this.currentStableAverage = settledWeight
		this.stableForMs = this.settleDurationMs.current
		this.stableSampleCount = 1
		this.pushTrackingDebug(`cup settled at ${settledWeight.toFixed(1)} g`)
		this.recordTrackingStatusChange(weight)

		if (this.previousSettledWeight === null) {
			this.previousSettledWeight = settledWeight
			this.awaitingCupReturnAfterLift = false
			return
		}

		if (this.awaitingCupReturnAfterLift) {
			const delta = this.previousSettledWeight - settledWeight
			if (delta >= this.sipThresholdG.current) {
				this.sipCount += 1
				this.lastSipAmountMl = delta
				this.consumedMl += delta
				this.sipHistory = [...this.sipHistory, { time: now, amountMl: delta }]
				this.updateReminderState(now)
				this.pushTrackingDebug(`sip counted: ${delta.toFixed(1)} ml`)
			} else if (delta <= -this.refillThresholdG.current) {
				this.lastSipAmountMl = 0
				this.pushTrackingDebug(`refill/reposition detected: ${(-delta).toFixed(1)} ml`)
			} else {
				this.lastSipAmountMl = 0
				this.pushTrackingDebug(`cup returned with insignificant delta ${delta.toFixed(1)} ml`)
			}
		}

		this.previousSettledWeight = settledWeight
		this.awaitingCupReturnAfterLift = false
	}
}
