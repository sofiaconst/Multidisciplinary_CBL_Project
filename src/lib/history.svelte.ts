import { persistedState } from 'svelte-persisted-state'

export interface Session {
	date: string
	sipCount: number
	consumedMl: number
	goalMl: number
}

export class History {
	private static instance: History

	sessions = persistedState<Session[]>('li.beeb.hydration.history.sessions', [])

	private constructor() {}

	static getInstance(): History {
		if (!History.instance) {
			History.instance = new History()
		}
		return History.instance
	}

	get weekSessions(): Session[] {
		const days: Session[] = []
		for (let i = 6; i >= 0; i--) {
			const d = new Date()
			d.setDate(d.getDate() - i)
			const dateStr = d.toISOString().slice(0, 10)
			const found = this.sessions.current.find((s) => s.date === dateStr)
			days.push(found ?? { date: dateStr, sipCount: 0, consumedMl: 0, goalMl: 2500 })
		}
		return days
	}

	get totalSessions(): number {
		return this.sessions.current.filter((s) => s.sipCount > 0).length
	}

	get averageDailyMl(): number {
		const active = this.sessions.current.filter((s) => s.consumedMl > 0)
		if (active.length === 0) return 0
		return active.reduce((sum, s) => sum + s.consumedMl, 0) / active.length
	}

	saveSession(sipCount: number, consumedMl: number, goalMl: number): void {
		const date = new Date().toISOString().slice(0, 10)
		const idx = this.sessions.current.findIndex((s) => s.date === date)
		const session: Session = { date, sipCount, consumedMl, goalMl }
		if (idx >= 0) {
			const updated = [...this.sessions.current]
			updated[idx] = session
			this.sessions.current = updated
		} else {
			this.sessions.current = [...this.sessions.current, session]
		}
	}
}
