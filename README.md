# Sippy — Hydration Scale App

Group Assignment 4CBLW005 Creating a Healthy Workplace — Group 5

## Table of contents

- [Introduction](#introduction)
- [Current Responsibilities](#current-responsibilities)
- [Technologies](#technologies)
- [Installation](#installation)
- [Run Locally](#run-locally)
- [Stop the Local Server](#stop-the-local-server)
- [Contributions](#contributions)
- [License](#license)
- [Project Status](#project-status)

## Introduction

Sippy is a browser dashboard for a hydration scale prototype. The app is designed to support healthier workplace habits by helping users monitor hydration patterns, view live weight data from the scale, and receive reminders toward an hourly intake target.

## Current Responsibilities

The app currently aims to:

- Connect to the ESP32 scale over Web Bluetooth
- Plot live weight data
- Calibrate the scale
- Detect cup placement and sip events
- Pace reminders toward the hourly intake target
- Control the reminder LED color

## Technologies

This project is created using:

- Svelte
- TypeScript
- Vite
- Web Bluetooth
- ESP32

## Installation

Follow these steps to set up and run the app:

1. Clone the repository.

```powershell
git clone <repository-url>
```

2. Open the project folder.

```powershell
cd "C:\Users\sofia\OneDrive\Multidisciplinary CBL\hydration-scale-app"
```

3. Install dependencies.

```powershell
pnpm install
```

## Run Locally

Start the local development server:

```powershell
pnpm dev
```

The terminal will print two URLs:

```text
  Local:    http://localhost:5173/
  Network:  http://192.168.x.x:5173/
```

> **Note:** Vite tries port `5173` first. If that port is already in use, it picks the next free one (`5174`, `5175`, …). Always check the terminal for the actual port.

**Desktop view** — open the Local URL in a browser on your computer:

```text
http://localhost:5173/
```

**Phone view (browser emulation)** — open DevTools (`F12`), click the device toolbar icon or press `Ctrl+Shift+M`, select a phone preset (e.g. iPhone 12), then navigate to:

```text
http://localhost:5173/m/
```

**Phone view (physical device)** — connect your phone to the same WiFi as your computer, then open the Network URL on your phone:

```text
http://192.168.x.x:5173/m/
```

If you see a "permission denied" error on a physical device, allow the port through Windows Firewall by running this in an elevated PowerShell (right-click → Run as administrator):

```powershell
netsh advfirewall firewall add rule name="Sippy Dev" dir=in action=allow protocol=TCP localport=5173
```

Keep the terminal open while using the app.

## Stop the Local Server

In the terminal where the server is running, press:

```text
Ctrl + C
```

If PowerShell asks whether to terminate the batch job, type:

```text
Y
```

Then press Enter.

## Contributions

- **Sofia Constantinou** — _Student ID: 2127326_ — `sofiaconst` — s.c.constantinou@student.tue.nl
- **Domas Berulis** — _Student ID: XXXXXXX_ — `helloimdomas` — d.berulis@student.tue.nl

## License

This project was developed as part of a group assignment for the 4CBLW005 Creating a Healthy Workplace course.

It is intended for academic use only and is not licensed for commercial distribution.

## Project Status

This project is being developed as part of the 4CBLW005 Creating a Healthy Workplace course.

The current version runs locally during development and supports the browser dashboard for the hydration scale prototype.
