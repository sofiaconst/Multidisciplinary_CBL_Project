import { browser } from '$app/environment'
import { persistedState } from 'svelte-persisted-state'
import { auth as firebaseAuth, db } from './firebase'
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	sendPasswordResetEmail,
	onAuthStateChanged,
	type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export interface UserProfile {
	name: string
	email: string
	avatarInitials: string
	streakDays: number
	lastActiveDate: string | null
}

export class Auth {
	private static instance: Auth
	private _uid: string | null = null
	private _firebaseUser = $state<FirebaseUser | null>(null)

	user = $state<UserProfile | null>(null)
	loading = $state(true)

	// Offline cache
	private _cache = persistedState<UserProfile | null>('li.beeb.hydration.auth.v3.profile', null)

	private constructor() {
		if (browser) {
			// Show cached data immediately while Firebase resolves
			if (this._cache.current) {
				this.user = this._cache.current
			}

			onAuthStateChanged(firebaseAuth, async (fbUser) => {
				// Set _firebaseUser immediately so isLoggedIn is true before profile loads
				this._firebaseUser = fbUser
				this._uid = fbUser?.uid ?? null
				if (fbUser) {
					await this._loadOrCreateProfile(fbUser)
				} else {
					this.user = null
					this._cache.current = null
				}
				this.loading = false
			})
		} else {
			this.loading = false
		}
	}

	static getInstance(): Auth {
		if (!Auth.instance) {
			Auth.instance = new Auth()
		}
		return Auth.instance
	}

	get isLoggedIn(): boolean {
		return this._firebaseUser !== null
	}

	get greeting(): string {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good morning'
		if (hour < 17) return 'Good afternoon'
		return 'Good evening'
	}

	get streakDays(): number {
		return this.user?.streakDays ?? 0
	}

	async login(email: string, password: string): Promise<void> {
		// Set loading so the auth guard waits while onAuthStateChanged fires
		this.loading = true
		try {
			await signInWithEmailAndPassword(firebaseAuth, email, password)
			// onAuthStateChanged will set loading = false once profile is loaded
		} catch (signInErr: unknown) {
			const code = (signInErr as { code?: string }).code
			if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
				// New user — create account
				try {
					await createUserWithEmailAndPassword(firebaseAuth, email, password)
					// onAuthStateChanged will fire and finish loading
				} catch (createErr: unknown) {
					this.loading = false
					const createCode = (createErr as { code?: string }).code
					if (createCode === 'auth/email-already-in-use') {
						throw new Error('Incorrect email or password.')
					}
					throw createErr
				}
			} else {
				this.loading = false
				throw signInErr
			}
		}
	}

	async logout(): Promise<void> {
		await firebaseSignOut(firebaseAuth)
		this._cache.current = null
	}

	async sendPasswordReset(email: string): Promise<void> {
		await sendPasswordResetEmail(firebaseAuth, email)
	}

	private async _loadOrCreateProfile(fbUser: FirebaseUser): Promise<void> {
		try {
			const ref = doc(db, 'users', fbUser.uid)
			const snap = await getDoc(ref)
			let profile: UserProfile

			if (snap.exists()) {
				profile = snap.data() as UserProfile
			} else {
				profile = this._makeProfile(fbUser.email ?? '')
				await setDoc(ref, profile)
			}

			// Update streak if needed
			const today = new Date().toISOString().slice(0, 10)
			if (profile.lastActiveDate !== today) {
				const last = profile.lastActiveDate
				const diffDays =
					last === null
						? Infinity
						: Math.round(
								(new Date(today).getTime() - new Date(last).getTime()) / (1000 * 60 * 60 * 24),
							)
				if (diffDays === 1) profile.streakDays += 1
				else if (diffDays > 1) profile.streakDays = 1
				profile.lastActiveDate = today
				await updateDoc(ref, { streakDays: profile.streakDays, lastActiveDate: today })
			}

			this.user = profile
			this._cache.current = profile
		} catch {
			// Offline: use cached profile if available
			if (this._cache.current) {
				this.user = this._cache.current
			}
		}
	}

	private _makeProfile(email: string): UserProfile {
		const username = email.split('@')[0]
		const name = username.charAt(0).toUpperCase() + username.slice(1)
		return {
			name,
			email,
			avatarInitials: name.slice(0, 2).toUpperCase(),
			streakDays: 1,
			lastActiveDate: new Date().toISOString().slice(0, 10),
		}
	}
}
