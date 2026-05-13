import { browser } from '$app/environment'
import {
  BleClient,
  type BleDevice,
  numberToUUID,
} from '@capacitor-community/bluetooth-le'

const CONTROL_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const CONTROL_COMMAND_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
const CONTROL_STATUS_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
const WEIGHT_SCALE_SERVICE = numberToUUID(0x181d)
const WEIGHT_MEASUREMENT = numberToUUID(0x2a9d)
const BATTERY_SERVICE = numberToUUID(0x180f)
const BATTERY_LEVEL = numberToUUID(0x2a19)

const sessionId = browser ? `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` : 'server'

export class Bluetooth {
  private static instance: Bluetooth
  private device: BleDevice | null = null

  enabled = $state(false)
  connected = $state(false)
  newFirmware = $state(true)
  batteryLevel = $state<number>()
  currentWeight = $state(0)
  calibrationFactor = $state(0)
  calibrationStatus = $state(0)
  calibrationBusy = $state(false)

  private constructor() {
    if (browser) {
      this.initBle()
    }
  }

  private initBle = async () => {
    try {
      await BleClient.initialize({ androidNeverForLocation: true })
      this.enabled = true
      await this.logEvent('availability_checked', { enabled: true })
    } catch (err) {
      this.enabled = false
      await this.logEvent('availability_error', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  private logEvent = async (type: string, extra: Record<string, unknown> = {}) => {
    if (!browser) return
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

  public static getInstance(): Bluetooth {
    if (!Bluetooth.instance) {
      Bluetooth.instance = new Bluetooth()
    }
    return Bluetooth.instance
  }

  connect = async () => {
    if (!browser) return
    await this.logEvent('connect_start')

    this.device = await BleClient.requestDevice({
      services: [WEIGHT_SCALE_SERVICE],
      optionalServices: [BATTERY_SERVICE, CONTROL_SERVICE_UUID],
    })

    await BleClient.connect(this.device.deviceId, () => {
      this.connected = false
      this.currentWeight = 0
      this.batteryLevel = undefined
      this.calibrationBusy = false
      void this.logEvent('gatt_disconnected')
    })

    this.connected = true
    await this.logEvent('gatt_connect_ok')

    // Read battery
    try {
      const batteryData = await BleClient.read(
        this.device.deviceId,
        BATTERY_SERVICE,
        BATTERY_LEVEL
      )
      this.batteryLevel = batteryData.getUint8(0)
      await this.logEvent('battery_read_ok', { batteryLevel: this.batteryLevel })
    } catch (err) {
      console.error('battery read failed', err)
    }

    // Subscribe to weight notifications
    await BleClient.startNotifications(
      this.device.deviceId,
      WEIGHT_SCALE_SERVICE,
      WEIGHT_MEASUREMENT,
      (data) => {
        const value = data.byteLength >= 4
          ? data.getInt32(0, false)
          : data.getInt16(0, false)
        this.currentWeight = value / 100.0
      }
    )

    // Control service
    try {
      const statusData = await BleClient.read(
        this.device.deviceId,
        CONTROL_SERVICE_UUID,
        CONTROL_STATUS_UUID
      )
      const payload = new TextDecoder().decode(new Uint8Array(statusData.buffer))
      this.applyControlStatus(payload)

      await BleClient.startNotifications(
        this.device.deviceId,
        CONTROL_SERVICE_UUID,
        CONTROL_STATUS_UUID,
        (data) => {
          const payload = new TextDecoder().decode(new Uint8Array(data.buffer))
          this.applyControlStatus(payload)
        }
      )
    } catch (err) {
      console.error('control service failed', err)
    }

    await this.logEvent('connect_complete')
  }

  private applyControlStatus = (payload: string) => {
    if (!payload) return
    try {
      const status = JSON.parse(payload) as { s?: number; f?: number }
      this.calibrationStatus = status.s ?? 0
      this.calibrationFactor = status.f ?? this.calibrationFactor
      this.calibrationBusy = this.calibrationStatus === 1 || this.calibrationStatus === 2
    } catch (err) {
      console.error('failed to parse control status', err, payload)
    }
  }

  sendControlCommand = async (command: string) => {
    if (!this.device) return
    await BleClient.write(
      this.device.deviceId,
      CONTROL_SERVICE_UUID,
      CONTROL_COMMAND_UUID,
      new DataView(new TextEncoder().encode(command).buffer)
    )
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