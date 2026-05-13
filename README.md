# Hydration Scale

This app is the browser dashboard for the hydration scale prototype.

Current responsibilities:
- connect to the ESP32 scale over Web Bluetooth
- plot live weight data
- calibrate the scale
- detect cup placement and sip events
- pace reminders toward the hourly intake target
- control the reminder LED color

The app is intended to run locally during development:

```bash
bun run dev --host 127.0.0.1 --port 4173
```
