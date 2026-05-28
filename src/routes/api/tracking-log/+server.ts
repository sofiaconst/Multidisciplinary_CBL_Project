import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { json, error } from '@sveltejs/kit'
import { DEV } from 'esm-env'

const LOG_PATH = resolve(process.cwd(), '..', '..', 'runtime-logs', 'tracking.ndjson')
const MAX_BODY_BYTES = 4096

// Only allow requests from the local dev server origin. In production (adapter-static
// + Capacitor) this route is never served, so this is belt-and-suspenders for pnpm dev.
function guardDev(request: Request) {
	if (!DEV) error(404, 'Not found')
	const ct = request.headers.get('content-type') ?? ''
	if (!ct.includes('application/json')) error(400, 'Bad request')
}

export async function POST({ request }) {
	guardDev(request)

	const raw = await request.text()
	if (raw.length > MAX_BODY_BYTES) error(413, 'Payload too large')

	let payload: unknown
	try {
		payload = JSON.parse(raw)
	} catch {
		error(400, 'Invalid JSON')
	}

	if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
		error(400, 'Expected JSON object')
	}

	await mkdir(dirname(LOG_PATH), { recursive: true })
	await appendFile(LOG_PATH, `${JSON.stringify({ ts: new Date().toISOString(), ...payload })}\n`, 'utf8')
	return json({ ok: true })
}

export async function DELETE({ request }) {
	guardDev(request)
	await mkdir(dirname(LOG_PATH), { recursive: true })
	await writeFile(LOG_PATH, '', 'utf8')
	return json({ ok: true })
}
