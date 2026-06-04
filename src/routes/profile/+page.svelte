<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { History } from '$lib/history.svelte'
import { Scale } from '$lib/scale.svelte'

const auth = Auth.getInstance()
const history = History.getInstance()
const scale = Scale.getInstance()

// ── Name editing ─────────────────────────────────────────────
let editingName = $state(false)
let nameInput = $state('')
let nameSaving = $state(false)
let nameError = $state('')

function startEditName() {
	nameInput = auth.user?.name ?? ''
	nameError = ''
	editingName = true
}

function cancelEditName() {
	editingName = false
	nameError = ''
}

async function saveName() {
	if (!nameInput.trim()) { nameError = 'Name cannot be empty.'; return }
	nameSaving = true
	try {
		await auth.updateName(nameInput)
		editingName = false
	} catch {
		nameError = 'Could not save. Please try again.'
	} finally {
		nameSaving = false
	}
}

// ── Avatar image ──────────────────────────────────────────────
let fileInput: HTMLInputElement
let avatarSaving = $state(false)

function pickImage() {
	fileInput.click()
}

function resizeImage(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		const url = URL.createObjectURL(file)
		img.onload = () => {
			URL.revokeObjectURL(url)
			const size = 256
			const canvas = document.createElement('canvas')
			canvas.width = size
			canvas.height = size
			const ctx = canvas.getContext('2d')!
			const scale = Math.max(size / img.width, size / img.height)
			const w = img.width * scale
			const h = img.height * scale
			ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
			resolve(canvas.toDataURL('image/jpeg', 0.82))
		}
		img.onerror = reject
		img.src = url
	})
}

async function onFileChange(e: Event) {
	const file = (e.target as HTMLInputElement).files?.[0]
	if (!file) return
	avatarSaving = true
	try {
		const dataUrl = await resizeImage(file)
		await auth.setAvatarImage(dataUrl)
	} finally {
		avatarSaving = false
		fileInput.value = ''
	}
}

async function removeImage() {
	avatarSaving = true
	try {
		await auth.setAvatarImage(null)
	} finally {
		avatarSaving = false
	}
}

const hasImage = $derived(!!auth.user?.avatarImageUrl)
</script>

<div class="page">
	<main class="content">
	<div class="page-header">
		<h1>Profile</h1>
		<p class="page-sub">{auth.user?.email ?? ''}</p>
	</div>

	<!-- Avatar + user info -->
	<div class="card identity-card">
		<!-- Avatar -->
		<div class="avatar-wrap">
			<button
				type="button"
				class="avatar-btn"
				class:saving={avatarSaving}
				onclick={pickImage}
				disabled={avatarSaving}
				aria-label="Change profile photo"
			>
				{#if auth.user?.avatarImageUrl}
					<img src={auth.user.avatarImageUrl} alt="Profile" class="avatar-img" />
				{:else}
					<span class="avatar-initials">{auth.user?.avatarInitials ?? '?'}</span>
				{/if}
				<span class="avatar-overlay">
					{#if avatarSaving}
						<span class="avatar-spinner"></span>
					{:else}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
					{/if}
				</span>
			</button>
			{#if hasImage}
				<button type="button" class="remove-photo-btn" onclick={removeImage} disabled={avatarSaving}>
					Remove photo
				</button>
			{/if}
		</div>

		<input
			bind:this={fileInput}
			type="file"
			accept="image/*"
			class="sr-only"
			onchange={onFileChange}
		/>

		<!-- Name -->
		{#if editingName}
			<div class="name-edit-row">
				<input
					class="name-input"
					type="text"
					bind:value={nameInput}
					maxlength="40"
					onkeydown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEditName() }}
				/>
				{#if nameError}<p class="name-error">{nameError}</p>{/if}
				<div class="name-edit-btns">
					<button type="button" class="ghost-sm" onclick={cancelEditName} disabled={nameSaving}>Cancel</button>
					<button type="button" class="teal-sm" onclick={saveName} disabled={nameSaving}>
						{nameSaving ? 'Saving…' : 'Save'}
					</button>
				</div>
			</div>
		{:else}
			<div class="identity-name-row">
				<span class="identity-name">{auth.user?.name ?? '—'}</span>
				<button type="button" class="edit-name-btn" onclick={startEditName} aria-label="Edit name">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
				</button>
			</div>
		{/if}

		<div class="identity-email">{auth.user?.email ?? '—'}</div>
		<div class="streak-pill">{auth.streakDays} day streak</div>
	</div>

	<!-- Stats -->
	<div class="stats-row">
		<div class="card stat-card">
			<div class="stat-value">{history.totalSessions}</div>
			<div class="stat-label">Sessions</div>
		</div>
		<div class="card stat-card">
			<div class="stat-value">{history.averageDailyMl.toFixed(0)}<span class="stat-unit">ml</span></div>
			<div class="stat-label">Daily avg</div>
		</div>
	</div>

	<!-- Linked scale card -->
	<div class="card">
		<div class="section-label">Linked scale</div>
		<div class="scale-row">
			<div>
				<div class="scale-status" class:connected={scale.bt.connected}>
					{scale.bt.connected ? 'Connected' : 'Not connected'}
				</div>
				{#if scale.bt.connected}
					<div class="scale-detail">Battery: {scale.bt.batteryLevel != null ? scale.bt.batteryLevel + '%' : 'Unknown'}</div>
					<div class="scale-detail">Factor: {scale.bt.calibrationFactor.toFixed(3)}</div>
				{/if}
			</div>
			<button type="button" class="qr-btn" disabled>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
					<rect x="3" y="3" width="7" height="7" rx="1" />
					<rect x="14" y="3" width="7" height="7" rx="1" />
					<rect x="3" y="14" width="7" height="7" rx="1" />
					<rect x="5" y="5" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
					<rect x="16" y="5" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
					<rect x="5" y="16" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
					<path d="M14 14h3v2h-3z M17 14h3v3h-2M14 17h2v3h-2M18 18v3" />
				</svg>
				Scan QR
			</button>
		</div>
	</div>
	</main>
</div>

<svelte:head>
	<title>Profile — Sippy</title>
</svelte:head>

<style>
.page {
	background: var(--warm-bg);
	min-height: 100%;
}

.content {
	width: 100%;
	max-width: 1180px;
	margin: 0 auto;
	padding: 28px 24px 56px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	box-sizing: border-box;
}

.page-header { padding: 4px 0 8px; }

.page-header h1 {
	font-size: 28px;
	font-weight: 500;
	letter-spacing: -0.5px;
	color: var(--warm-text);
	margin: 0 0 4px;
}

.page-sub {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0;
}

.card {
	background: var(--warm-surface);
	border: 0.5px solid var(--warm-border);
	border-radius: 16px;
	padding: 22px 24px;
}

/* ── Identity card ── */
.identity-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 6px;
	padding: 24px 16px;
}

/* ── Avatar ── */
.avatar-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	margin-bottom: 4px;
}

.avatar-btn {
	position: relative;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border: none;
	padding: 0;
	cursor: pointer;
	background: var(--teal-primary);
	overflow: hidden;
	flex-shrink: 0;
}

.avatar-btn:disabled { cursor: not-allowed; }

.avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.avatar-initials {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	font-size: 26px;
	font-weight: 700;
	color: #fff;
}

.avatar-overlay {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	opacity: 0;
	transition: opacity 0.15s;
}

.avatar-btn:hover .avatar-overlay,
.avatar-btn.saving .avatar-overlay {
	opacity: 1;
}

.avatar-spinner {
	width: 18px;
	height: 18px;
	border: 2px solid rgba(255,255,255,0.4);
	border-top-color: #fff;
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.remove-photo-btn {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	text-decoration: underline;
	font-family: inherit;
}
.remove-photo-btn:hover { color: #ef4444; }
.remove-photo-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Name editing ── */
.identity-name-row {
	display: flex;
	align-items: center;
	gap: 6px;
}

.identity-name {
	font-size: 18px;
	font-weight: 700;
	color: var(--warm-text);
}

.edit-name-btn {
	background: none;
	border: none;
	padding: 4px;
	cursor: pointer;
	color: var(--warm-text-tertiary);
	border-radius: 6px;
	display: flex;
	align-items: center;
	transition: color 0.15s, background 0.15s;
}
.edit-name-btn:hover { color: var(--teal-primary); background: var(--teal-light); }

.name-edit-row {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	width: 100%;
	max-width: 280px;
}

.name-input {
	width: 100%;
	box-sizing: border-box;
	height: 36px;
	padding: 0 12px;
	border: 1px solid var(--warm-border);
	border-radius: 10px;
	font-size: 15px;
	font-weight: 600;
	font-family: inherit;
	color: var(--warm-text);
	background: var(--warm-bg);
	text-align: center;
	outline: none;
}
.name-input:focus { border-color: var(--teal-primary); }

.name-error {
	font-size: 12px;
	color: #b91c1c;
	margin: 0;
}

.name-edit-btns {
	display: flex;
	gap: 8px;
}

.ghost-sm {
	height: 30px;
	padding: 0 12px;
	background: transparent;
	color: var(--warm-text-secondary);
	border: 0.5px solid var(--warm-border);
	border-radius: 8px;
	font-size: 13px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
}
.ghost-sm:disabled { opacity: 0.5; cursor: not-allowed; }

.teal-sm {
	height: 30px;
	padding: 0 14px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 13px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
}
.teal-sm:hover { background: var(--teal-dark); }
.teal-sm:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Other identity ── */
.identity-email {
	font-size: 13px;
	color: var(--warm-text-secondary);
}

.streak-pill {
	margin-top: 4px;
	font-size: 12px;
	font-weight: 600;
	color: var(--teal-dark);
	background: var(--teal-light);
	border: 1px solid var(--teal-primary);
	border-radius: 20px;
	padding: 3px 12px;
}

/* ── Stats ── */
.stats-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.stat-card { text-align: center; padding: 16px; }

.stat-value {
	font-size: 26px;
	font-weight: 700;
	color: var(--warm-text);
}

.stat-unit {
	font-size: 14px;
	font-weight: 400;
	color: var(--warm-text-secondary);
}

.stat-label {
	font-size: 12px;
	color: var(--warm-text-tertiary);
	margin-top: 2px;
}

/* ── Scale card ── */
.section-label {
	font-size: 12px;
	font-weight: 600;
	color: var(--warm-text-secondary);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-bottom: 12px;
}

.scale-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
}

.scale-status {
	font-size: 14px;
	font-weight: 600;
	color: var(--warm-text-secondary);
}
.scale-status.connected { color: var(--teal-primary); }

.scale-detail {
	font-size: 12px;
	color: var(--warm-text-secondary);
	margin-top: 2px;
}

.qr-btn {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 14px;
	background: var(--warm-bg);
	color: var(--warm-text-secondary);
	border: 1px solid var(--warm-border);
	border-radius: 8px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
}
.qr-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.sr-only {
	position: absolute;
	width: 1px; height: 1px;
	padding: 0; margin: -1px;
	overflow: hidden;
	clip: rect(0,0,0,0);
	white-space: nowrap;
	border: 0;
}
</style>
