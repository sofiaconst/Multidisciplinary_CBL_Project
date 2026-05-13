import { browser } from '$app/environment'
import { persistedState } from 'svelte-persisted-state'

interface User {
	name: string
	email: string
	avatarInitials: string
}

export class Auth {
	private static instance: Auth

	user = persistedState<User | null>('li.beeb.hydration.auth.user', null)
	streakDays = persistedState('li.beeb.hydration.auth.streakDays', 0)
	lastActiveDate = persistedState<string | null>('li.beeb.hydration.auth.lastActiveDate', null)

	private constructor() {
		if (browser) {
			this.checkAndUpdateStreak()
		}
	}

	static getInstance(): Auth {
		if (!Auth.instance) {
			Auth.instance = new Auth()
		}
		return Auth.instance
	}

	get isLoggedIn(): boolean {
		return this.user.current !== null
	}

	get greeting(): string {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good morning'
		if (hour < 17) return 'Good afternoon'
		return 'Good evening'
	}

	login(email: string, password: string): boolean {
		if (!email || !password) return false
		const username = email.split('@')[0]
		const name = username.charAt(0).toUpperCase() + username.slice(1)
		const avatarInitials = name.slice(0, 2).toUpperCase()
		this.user.current = { name, email, avatarInitials }
		this.checkAndUpdateStreak()
		return true
	}

	logout(): void {
		this.user.current = null
	}

	checkAndUpdateStreak(): void {
		const today = new Date().toISOString().slice(0, 10)
		const last = this.lastActiveDate.current
		if (last === null) {
			this.streakDays.current = 1
		} else {
			const diffDays = Math.round(
				(new Date(today).getTime() - new Date(last).getTime()) / (1000 * 60 * 60 * 24),
			)
			if (diffDays === 1) {
				this.streakDays.current += 1
			} else if (diffDays > 1) {
				this.streakDays.current = 1
			}
		}
		this.lastActiveDate.current = today
	}
}
