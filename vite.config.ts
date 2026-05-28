import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
		tailwindcss(),
	],
	server: {
		host: true,   // expose on local network so phones on the same WiFi can connect
		port: 5173,   // preferred port — Vite auto-increments if it's already in use
	},
}

export default config
