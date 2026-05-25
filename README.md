# Hydration Scale

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

Hydration Scale is a browser dashboard for a hydration scale prototype. The app is designed to support healthier workplace habits by helping users monitor hydration patterns, view live weight data from the scale, and receive reminders toward an hourly intake target.

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
npm install
```

If the project uses pnpm instead, run:

```powershell
pnpm install
```

## Run Locally

Start the local development server:

```powershell
npm run dev
```

If that does not work, try:

```powershell
pnpm dev
```

Open the local URL shown in the terminal.

Usually it is:

```text
http://localhost:5173
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
