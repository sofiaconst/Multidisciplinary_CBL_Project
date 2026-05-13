import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { json } from '@sveltejs/kit'

const LOG_PATH = resolve(process.cwd(), '..', '..', 'runtime-logs', 'tracking.ndjson')

export async function POST({ request }) {
	const payload = await request.json()
	await mkdir(dirname(LOG_PATH), { recursive: true })
	await appendFile(LOG_PATH, `${JSON.stringify({ ts: new Date().toISOString(), ...payload })}\n`, 'utf8')
	return json({ ok: true })
}

export async function DELETE() {
	await mkdir(dirname(LOG_PATH), { recursive: true })
	await writeFile(LOG_PATH, '', 'utf8')
	return json({ ok: true })
}
