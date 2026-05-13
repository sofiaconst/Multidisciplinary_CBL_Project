<script lang="ts">
import { Auth } from '$lib/auth.svelte'
import { goto } from '$app/navigation'

const auth = Auth.getInstance()

let email = $state('')
let password = $state('')
let error = $state('')

const handleSubmit = (e: Event) => {
	e.preventDefault()
	error = ''
	const ok = auth.login(email, password)
	if (ok) {
		void goto('/')
	} else {
		error = 'Please enter your email and password.'
	}
}
</script>

<div class="login-page">
	<div class="login-card">
		<div class="login-header">
			<div class="logo-circle">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
					<path d="M12 6v6l4 2" />
				</svg>
			</div>
			<h1>Hydration Scale</h1>
			<p>Track your hydration with your smart scale</p>
		</div>

		<form onsubmit={handleSubmit}>
			<div class="field">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					autocomplete="email"
					required
				/>
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Enter password"
					autocomplete="current-password"
					required
				/>
			</div>

			{#if error}
				<div class="error-msg">{error}</div>
			{/if}

			<button type="submit" class="signin-btn">Sign in</button>
		</form>
	</div>
</div>

<style>
.login-page {
	min-height: 100dvh;
	background: var(--warm-bg);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
}

.login-card {
	background: var(--warm-surface);
	border: 1px solid var(--warm-border);
	border-radius: 16px;
	padding: 32px 28px;
	width: 100%;
	max-width: 380px;
}

.login-header {
	text-align: center;
	margin-bottom: 28px;
}

.logo-circle {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: var(--teal-light);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 12px;
	color: var(--teal-primary);
}

.logo-circle svg {
	width: 28px;
	height: 28px;
}

h1 {
	font-size: 20px;
	font-weight: 700;
	color: var(--warm-text);
	margin: 0 0 6px;
}

p {
	font-size: 14px;
	color: var(--warm-text-secondary);
	margin: 0;
}

.field {
	margin-bottom: 16px;
}

label {
	display: block;
	font-size: 13px;
	font-weight: 500;
	color: var(--warm-text-secondary);
	margin-bottom: 6px;
}

input {
	width: 100%;
	padding: 10px 12px;
	border: 1px solid var(--warm-border);
	border-radius: 8px;
	background: var(--warm-bg);
	color: var(--warm-text);
	font-size: 15px;
	outline: none;
	box-sizing: border-box;
	transition: border-color 0.15s;
}

input:focus {
	border-color: var(--teal-primary);
}

.error-msg {
	font-size: 13px;
	color: #ef4444;
	margin-bottom: 12px;
}

.signin-btn {
	width: 100%;
	padding: 12px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	margin-top: 4px;
	transition: background 0.15s;
}

.signin-btn:hover {
	background: var(--teal-dark);
}
</style>
