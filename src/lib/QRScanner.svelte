<script lang="ts">
import jsQR from 'jsqr'

const { onScan, onClose } = $props<{
	onScan: (result: string) => void
	onClose: () => void
}>()

// Live viewfinder requires a secure context; fall back to single-photo capture on HTTP
const canUseLive = typeof window !== 'undefined' &&
	(location.protocol === 'https:' || location.hostname === 'localhost') &&
	!!navigator?.mediaDevices?.getUserMedia

let video: HTMLVideoElement
let canvas: HTMLCanvasElement
let fileInput: HTMLInputElement
let errorMsg = $state<string | null>(null)
let liveMode = $state(canUseLive)
let active = true
let stream: MediaStream | null = null
let rafId = 0

$effect(() => {
	if (liveMode) startLive()
	return () => {
		active = false
		cancelAnimationFrame(rafId)
		stream?.getTracks().forEach(t => t.stop())
	}
})

async function startLive() {
	try {
		stream = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
		})
		video.srcObject = stream
		await video.play()
		rafId = requestAnimationFrame(scanLive)
	} catch {
		// Permission denied or unavailable — fall back to capture
		liveMode = false
	}
}

function scanLive() {
	if (!active) return
	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		const ctx = canvas.getContext('2d')!
		canvas.width  = video.videoWidth
		canvas.height = video.videoHeight
		ctx.drawImage(video, 0, 0)
		const img  = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
		if (code) {
			active = false
			stream?.getTracks().forEach(t => t.stop())
			onScan(code.data)
			return
		}
	}
	rafId = requestAnimationFrame(scanLive)
}

// ── Capture (photo) mode ─────────────────────────────────────────

function openCapture() {
	errorMsg = null
	fileInput.click()
}

function onFileChange(e: Event) {
	const file = (e.target as HTMLInputElement).files?.[0]
	if (!file) return
	;(e.target as HTMLInputElement).value = '' // allow re-selecting same file

	const img = new Image()
	const url = URL.createObjectURL(file)
	img.onload = () => {
		URL.revokeObjectURL(url)
		const c   = document.createElement('canvas')
		c.width   = img.width
		c.height  = img.height
		const ctx = c.getContext('2d')!
		ctx.drawImage(img, 0, 0)
		const data = ctx.getImageData(0, 0, c.width, c.height)
		const code = jsQR(data.data, data.width, data.height)
		if (code) {
			onScan(code.data)
		} else {
			errorMsg = 'No QR code found. Move closer and try again.'
		}
	}
	img.onerror = () => { errorMsg = 'Could not read the photo. Please try again.' }
	img.src = url
}

function cancel() {
	active = false
	stream?.getTracks().forEach(t => t.stop())
	onClose()
}
</script>

<!-- Hidden inputs always rendered so bindings resolve before any click() call -->
<input
	bind:this={fileInput}
	type="file"
	accept="image/*"
	capture="environment"
	class="sr-only"
	onchange={onFileChange}
/>
<canvas bind:this={canvas} class="sr-only"></canvas>

{#if liveMode}
	<!-- ── Live viewfinder ── -->
	<div class="scanner">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video bind:this={video} playsinline muted class="feed"></video>
		<div class="vignette"></div>
		<div class="ui">
			<p class="hint">Point at the QR code on your scale</p>
			<div class="viewfinder">
				<span class="c tl"></span><span class="c tr"></span>
				<span class="c bl"></span><span class="c br"></span>
				<div class="scan-line"></div>
			</div>
			<button class="cancel-btn" onclick={cancel}>Cancel</button>
		</div>
	</div>
{:else}
	<!-- ── Photo-capture fallback (HTTP / no camera permission) ── -->
	<div class="capture-screen">
		<div class="capture-card">
			<div class="capture-icon">
				<svg viewBox="0 0 24 24" fill="none" width="36" height="36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
			</div>
			<h2 class="capture-title">Scan scale QR code</h2>
			<p class="capture-sub">Tap the button below, point your camera at the QR code on the bottom of your scale, and take a photo.</p>

			{#if errorMsg}
				<p class="capture-error">{errorMsg}</p>
			{/if}

			<button class="capture-btn" onclick={openCapture}>
				<svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
				{errorMsg ? 'Try again' : 'Open camera'}
			</button>
			<button class="cancel-link" onclick={cancel}>Cancel</button>
		</div>
	</div>
{/if}

<style>
.sr-only {
	position: absolute; width: 1px; height: 1px;
	padding: 0; margin: -1px; overflow: hidden;
	clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* ── Live scanner ── */
.scanner {
	position: fixed; inset: 0; z-index: 200;
	background: #000;
	display: flex; flex-direction: column;
	align-items: center; justify-content: center;
}
.feed {
	position: absolute; inset: 0;
	width: 100%; height: 100%;
	object-fit: cover;
}
.vignette {
	position: absolute; inset: 0;
	background: radial-gradient(ellipse 56vw 56vw at center, transparent 48%, rgba(0,0,0,0.75) 68%);
	pointer-events: none;
}
.ui {
	position: relative; z-index: 1;
	display: flex; flex-direction: column;
	align-items: center; gap: 28px; padding: 24px; width: 100%;
}
.hint {
	font-size: 15px; font-weight: 500; color: #fff;
	text-align: center; margin: 0;
	text-shadow: 0 1px 4px rgba(0,0,0,0.5); max-width: 260px;
}
.viewfinder {
	position: relative; width: 64vw; max-width: 240px; aspect-ratio: 1; overflow: hidden;
}
.c {
	position: absolute; width: 22px; height: 22px;
	border-color: #fff; border-style: solid;
}
.c.tl { top:0; left:0;  border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
.c.tr { top:0; right:0; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
.c.bl { bottom:0; left:0;  border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
.c.br { bottom:0; right:0; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }
.scan-line {
	position: absolute; left: 8px; right: 8px; height: 2px;
	background: linear-gradient(90deg, transparent, var(--teal-primary), transparent);
	animation: sweep 2s ease-in-out infinite; top: 50%;
}
@keyframes sweep {
	0%   { top: 10%; opacity: 0; }
	10%  { opacity: 1; }
	90%  { opacity: 1; }
	100% { top: 90%; opacity: 0; }
}
.cancel-btn {
	height: 48px; padding: 0 32px; border-radius: 14px;
	background: rgba(255,255,255,0.15);
	backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
	color: #fff; border: 1px solid rgba(255,255,255,0.3);
	font-size: 16px; font-weight: 500; font-family: inherit; cursor: pointer;
}

/* ── Capture screen — centred modal ── */
.capture-screen {
	position: fixed; inset: 0; z-index: 200;
	background: rgba(0,0,0,0.6);
	backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
	display: flex; align-items: center; justify-content: center;
	padding: 24px;
	touch-action: none;           /* block background scroll */
	overscroll-behavior: contain;
}
.capture-card {
	background: var(--warm-surface);
	border-radius: 24px;           /* fully rounded — not bottom-sheet */
	padding: 32px 28px 32px;
	width: 100%; max-width: 340px;
	display: flex; flex-direction: column;
	align-items: center; gap: 14px;
	text-align: center;
}
.capture-icon {
	width: 72px; height: 72px; border-radius: 20px;
	background: var(--teal-light); color: var(--teal-dark);
	display: grid; place-items: center;
}
.capture-title {
	font-size: 20px; font-weight: 700;
	color: var(--warm-text); margin: 0;
	letter-spacing: -0.4px;
}
.capture-sub {
	font-size: 14px; color: var(--warm-text-secondary);
	margin: 0; line-height: 1.5; max-width: 300px;
}
.capture-error {
	font-size: 13px; color: #dc2626;
	background: #fee2e2; border-radius: 8px;
	padding: 8px 14px; margin: 0; width: 100%; box-sizing: border-box;
}
.capture-btn {
	display: inline-flex; align-items: center; gap: 8px;
	width: 100%; height: 56px; border-radius: 16px;
	background: var(--teal-primary); color: #fff; border: none;
	font-size: 17px; font-weight: 600; font-family: inherit;
	cursor: pointer; justify-content: center;
	transition: background 0.15s;
}
.capture-btn:hover { background: var(--teal-dark); }
.cancel-link {
	background: none; border: none; cursor: pointer;
	font-size: 15px; color: var(--warm-text-tertiary);
	font-family: inherit; padding: 4px;
}
</style>
