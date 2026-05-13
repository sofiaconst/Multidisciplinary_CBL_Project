import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.group5.hydrationscale',
  appName: 'Hydration Scale',
  webDir: 'build',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: 'Scanning for scale...',
        cancel: 'Cancel',
        availableDevices: 'Available devices',
        noDeviceFound: 'No scale found',
      },
    },
  },
}

export default config