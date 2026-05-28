<div class="page">
	<div class="hero">
		<img src="/logo-icon.png" alt="Sippy" class="logo-img" />
		<h1>Sippy</h1>
		<p class="tagline">Know every sip.</p>
	</div>

	<div class="ctas">
		<a href="/login" class="btn-primary">Sign in</a>
		<a href="/signup" class="btn-outline">Create account</a>
	</div>
</div>

<svelte:head>
	<title>Sippy</title>
</svelte:head>

<style>
.page {
	min-height: 100dvh;
	background: var(--warm-bg);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 32px 24px;
	gap: 48px;
}

.hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	text-align: center;
}

.logo-img {
	width: 88px;
	height: 88px;
	border-radius: 22px;
	object-fit: contain;
	margin-bottom: 8px;
}

h1 {
	font-size: 32px;
	font-weight: 800;
	color: var(--warm-text);
	margin: 0;
	letter-spacing: -0.5px;
}

.tagline {
	font-size: 16px;
	color: var(--warm-text-secondary);
	margin: 0;
}

.ctas {
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
	max-width: 320px;
}

.btn-primary {
	display: block;
	width: 100%;
	padding: 14px;
	background: var(--teal-primary);
	color: #fff;
	border: none;
	border-radius: 10px;
	font-size: 16px;
	font-weight: 600;
	text-align: center;
	text-decoration: none;
	transition: background 0.15s;
	box-sizing: border-box;
}

.btn-primary:hover {
	background: var(--teal-dark);
}

.btn-outline {
	display: block;
	width: 100%;
	padding: 14px;
	background: transparent;
	color: var(--warm-text);
	border: 1px solid var(--warm-border);
	border-radius: 10px;
	font-size: 16px;
	font-weight: 600;
	text-align: center;
	text-decoration: none;
	transition: border-color 0.15s, color 0.15s;
	box-sizing: border-box;
}

.btn-outline:hover {
	border-color: var(--teal-primary);
	color: var(--teal-primary);
}
</style>
