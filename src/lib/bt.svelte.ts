import { browser } from '$app/environment'

const CONTROL_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const CONTROL_COMMAND_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
const CONTROL_STATUS_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
const sessionId = browser ? `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` : 'server'

export class Bluetooth {
	private static instance: Bluetooth
	server = $state<BluetoothRemoteGATTServer>()
	enabled = $state(false)
	connected = $state(false)
	newFirmware = $state(true)
	weightCharacteristic = $state<BluetoothRemoteGATTCharacteristic>()
	controlCommandCharacteristic = $state<BluetoothRemoteGATTCharacteristic>()
	controlStatusCharacteristic = $state<BluetoothRemoteGATTCharacteristic>()
	batteryLevel = $state<number>()
	currentWeight = $state(0)
	calibrationFactor = $state(0)
	calibrationStatus = $state(0)
	calibrationBusy = $state(false)

	private constructor() {
		this.checkStatus()

		if (browser && navigator.bluetooth) {
			navigator.bluetooth.addEventListener('availabilitychanged', () => {
				void this.logEvent('availability_changed')
				this.checkStatus()
			})
		}
	}

	private logEvent = async (type: string, extra: Record<string, unknown> = {}) => {
		if (!browser) {
			return
		}
		try {
			void fetch('/api/tracking-log', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ type, source: 'bluetooth', sessionId, ...extra }),
				keepalive: true,
			})
		} catch (err) {
			console.error('ble log failed', err)
		}
	}

	private readBatteryLevel = async () => {
		if (!this.server) {
			return
		}
		await this.logEvent('battery_read_start')
		const service = await this.server.getPrimaryService(0x180f)
		const batteryLevelCharacteristic = await service.getCharacteristic(0x2a19)
		this.batteryLevel = (await batteryLevelCharacteristic.readValue()).getUint8(0)
		await this.logEvent('battery_read_ok', { batteryLevel: this.batteryLevel })
	}

	private onWeightUpdate = (event: Event) => {
		if (event.target === null) {
			return
		}
		const dataView = (event.target as BluetoothRemoteGATTCharacteristic).value
		// Decode based on payload length so larger weights do not overflow on legacy service UUIDs.
		const value =
			dataView == null ? 0 : dataView.byteLength >= 4 ? dataView.getInt32(0, false) : dataView.getInt16(0, false)
		this.currentWeight = value / 100.0
	}

	private onControlStatusUpdate = (event: Event) => {
		if (event.target === null) {
			return
		}
		const dataView = (event.target as BluetoothRemoteGATTCharacteristic).value
		const payload = new TextDecoder().decode(dataView?.buffer ? new Uint8Array(dataView.buffer) : new Uint8Array())
		this.applyControlStatus(payload)
	}

	private applyControlStatus = (payload: string) => {
		if (!payload) {
			return
		}
		try {
			const status = JSON.parse(payload) as { s?: number; f?: number }
			this.calibrationStatus = status.s ?? 0
			this.calibrationFactor = status.f ?? this.calibrationFactor
			this.calibrationBusy = this.calibrationStatus === 1 || this.calibrationStatus === 2
		} catch (err) {
			console.error('failed to parse control status', err, payload)
		}
	}

	private checkStatus = async () => {
		if (!browser) {
			return
		}
		try {
			this.enabled = await navigator.bluetooth.getAvailability()
			await this.logEvent('availability_checked', { enabled: this.enabled })
			if (this.connected && !this.enabled) {
				// bluetooth was disabled
				this.weightCharacteristic?.removeEventListener('characteristicvaluechanged', this.onWeightUpdate)
				this.controlStatusCharacteristic?.removeEventListener(
					'characteristicvaluechanged',
					this.onControlStatusUpdate,
				)
				this.connected = false
				await this.logEvent('availability_forced_disconnect')
			}
		} catch (err) {
			console.log(err)
			this.enabled = false
			await this.logEvent('availability_error', {
				error: err instanceof Error ? err.message : String(err),
			})
		}
	}

	public static getInstance(): Bluetooth {
		if (!Bluetooth.instance) {
			Bluetooth.instance = new Bluetooth()
		}
		return Bluetooth.instance
	}

	connect = async () => {
		if (!browser || !navigator.bluetooth) {
			return
		}
		await this.logEvent('connect_start')
		// Support the current hydration firmware names and identify the implementation by service UUIDs.
		// The new firmware uses a more appropriate service and characteristic UUIDs, so we can use those to identify
		// the firmware variant.
		const device = await navigator.bluetooth.requestDevice({
			filters: [
				{ name: 'mpy-hydration' },
				{ name: 'sip-scale' },
				{ services: [0x180f, 0x1815] }, // python firmware
				{ services: [0x180f, 0x181d] }, // rust firmware
			],
			optionalServices: [CONTROL_SERVICE_UUID],
		})
		await this.logEvent('device_selected', { name: device.name ?? null, id: device.id ?? null })
		device.addEventListener('gattserverdisconnected', () => {
			this.connected = false
			this.currentWeight = 0
			this.batteryLevel = undefined
			this.calibrationBusy = false
			void this.logEvent('gatt_disconnected')
		})
		await this.logEvent('gatt_connect_start')
		this.server = await device.gatt?.connect()
		await this.logEvent('gatt_connect_ok')
		this.connected = true

		// Detect firmware version
		try {
			// python firmware
			await this.logEvent('weight_service_try_python')
			const service = await this.server?.getPrimaryService(0x1815)
			this.weightCharacteristic = await service?.getCharacteristic(0x2a59)
			this.newFirmware = false
			await this.logEvent('weight_service_python_ok')
		} catch {
			// rust firmware
			await this.logEvent('weight_service_try_rust')
			const service = await this.server?.getPrimaryService(0x181d)
			this.weightCharacteristic = await service?.getCharacteristic(0x2a9d)
			this.newFirmware = true
			await this.logEvent('weight_service_rust_ok')
		}
		await this.logEvent('weight_notify_start')
		await this.weightCharacteristic?.startNotifications()
		this.weightCharacteristic?.addEventListener('characteristicvaluechanged', this.onWeightUpdate)
		await this.logEvent('weight_notify_ok', { newFirmware: this.newFirmware })

		await this.logEvent('control_service_start')
		const controlService = await this.server?.getPrimaryService(CONTROL_SERVICE_UUID)
		this.controlCommandCharacteristic = await controlService?.getCharacteristic(CONTROL_COMMAND_UUID)
		this.controlStatusCharacteristic = await controlService?.getCharacteristic(CONTROL_STATUS_UUID)
		await this.controlStatusCharacteristic?.startNotifications()
		this.controlStatusCharacteristic?.addEventListener('characteristicvaluechanged', this.onControlStatusUpdate)
		const initialStatus = await this.controlStatusCharacteristic?.readValue()
		if (initialStatus) {
			this.applyControlStatus(new TextDecoder().decode(new Uint8Array(initialStatus.buffer)))
		}
		await this.logEvent('control_service_ok')

		await this.readBatteryLevel()
		await this.logEvent('connect_complete')
	}

	sendControlCommand = async (command: string) => {
		if (!this.controlCommandCharacteristic) {
			return
		}
		await this.controlCommandCharacteristic.writeValue(new TextEncoder().encode(command))
	}

	tareScale = async () => {
		await this.sendControlCommand('tare')
	}

	setReminderLed = async (enabled: boolean) => {
		await this.sendControlCommand(enabled ? 'led:255,0,0' : 'led:off')
	}

	setReminderLedColor = async (red: number, green: number, blue: number) => {
		await this.sendControlCommand(`led:${red},${green},${blue}`)
	}

	calibrateScale = async (referenceWeightGrams: number) => {
		await this.sendControlCommand(`cal:${referenceWeightGrams}`)
	}
}
