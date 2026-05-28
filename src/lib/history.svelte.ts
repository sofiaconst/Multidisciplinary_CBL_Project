import { browser } from '$app/environment'
import { persistedState } from 'svelte-persisted-state'
import { auth as firebaseAuth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
	collection,
	doc,
	getDocs,
	setDoc,
} from 'firebase/firestore'

export interface Session {
	date: string
	sipCount: number
	consumedMl: number
	goalMl: number
}

export class History {
	private static instance: History
	private _uid: string | null = null

	sessions = $state<Session[]>([])

	// Offline cache
	private _cache = persistedState<Session[]>('li.beeb.hydration.history.v3.sessions', [])

	private _unsubscribeAuth: (() => void) | null = null

	private constructor() {
		if (browser) {
			// Load from cache immediately while Firestore resolves
			this.sessions = this._cache.current

			this._unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (fbUser) => {
				this._uid = fbUser?.uid ?? null
				if (fbUser) {
					await this._loadSessions(fbUser.uid)
				} else {
					// Clear both state and cache so stale data doesn't leak to the next user
					this.sessions = []
					this._cache.current = []
				}
			})
		}
	}

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
			const found = this.sessions.find((s) => s.date === dateStr)
			days.push(found ?? { date: dateStr, sipCount: 0, consumedMl: 0, goalMl: 2500 })
		}
		return days
	}

	get totalSessions(): number {
		return this.sessions.filter((s) => s.sipCount > 0).length
	}

	get averageDailyMl(): number {
		const active = this.sessions.filter((s) => s.consumedMl > 0)
		if (active.length === 0) return 0
		return active.reduce((sum, s) => sum + s.consumedMl, 0) / active.length
	}

	async saveSession(sipCount: number, consumedMl: number, goalMl: number): Promise<void> {
		const date = new Date().toISOString().slice(0, 10)
		const session: Session = { date, sipCount, consumedMl, goalMl }

		// Update local state
		const idx = this.sessions.findIndex((s) => s.date === date)
		if (idx >= 0) {
			const updated = [...this.sessions]
			updated[idx] = session
			this.sessions = updated
		} else {
			this.sessions = [...this.sessions, session]
		}
		this._cache.current = this.sessions

		// Sync to Firestore
		if (this._uid) {
			try {
				await setDoc(doc(db, 'users', this._uid, 'sessions', date), session)
			} catch {
				// Will sync next time when online
			}
		}
	}

	private async _loadSessions(uid: string): Promise<void> {
		try {
			const snap = await getDocs(collection(db, 'users', uid, 'sessions'))
			const sessions = snap.docs.map((d) => d.data() as Session)
			this.sessions = sessions
			this._cache.current = sessions
		} catch {
			// Offline: keep using cache
		}
	}
}
