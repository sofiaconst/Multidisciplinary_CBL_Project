import { browser } from '$app/environment'
import { persistedState } from 'svelte-persisted-state'
import { auth as firebaseAuth, db } from './firebase'
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInAnonymously,
	deleteUser,
	signOut as firebaseSignOut,
	sendPasswordResetEmail,
	setPersistence,
	inMemoryPersistence,
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

	// Offline cache — still useful when Firestore is unreachable
	private _cache = persistedState<UserProfile | null>('li.beeb.hydration.auth.v3.profile', null)

	private constructor() {
		if (browser) {
			// Don't persist session across app restarts — users must log in each time
			void setPersistence(firebaseAuth, inMemoryPersistence)

			onAuthStateChanged(firebaseAuth, async (fbUser) => {
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

	get isAnonymous(): boolean {
		return this._firebaseUser?.isAnonymous ?? false
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
		this.loading = true
		try {
			await signInWithEmailAndPassword(firebaseAuth, email, password)
		} catch (err: unknown) {
			this.loading = false
			const code = (err as { code?: string }).code ?? ''
			if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
				throw new Error('INVALID_CREDENTIALS')
			}
			if (code === 'auth/invalid-email') throw new Error('Invalid email address.')
			if (code === 'auth/too-many-requests') throw new Error('Too many attempts. Try again later.')
			throw err
		}
	}

	async signInAsGuest(): Promise<void> {
		this.loading = true
		try {
			await signInAnonymously(firebaseAuth)
		} catch (err: unknown) {
			this.loading = false
			throw err
		}
	}

	async deleteAccount(): Promise<void> {
		if (!this._firebaseUser) throw new Error('Not signed in.')
		await deleteUser(this._firebaseUser)
		this._cache.current = null
	}

	async register(email: string, password: string): Promise<void> {
		this.loading = true
		try {
			await createUserWithEmailAndPassword(firebaseAuth, email, password)
		} catch (err: unknown) {
			this.loading = false
			const code = (err as { code?: string }).code ?? ''
			if (code === 'auth/email-already-in-use') throw new Error('EMAIL_IN_USE')
			if (code === 'auth/invalid-email') throw new Error('Invalid email address.')
			if (code === 'auth/weak-password') throw new Error('Password must be at least 6 characters.')
			throw err
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
		// Anonymous users get a local-only guest profile — no Firestore round-trip
		if (fbUser.isAnonymous) {
			this.user = { name: 'Guest', email: '', avatarInitials: 'GU', streakDays: 0, lastActiveDate: null }
			return
		}
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

			// Use local calendar date so users behind UTC don't get a false streak break
			const today = new Intl.DateTimeFormat('en-CA').format(new Date())
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
			lastActiveDate: new Intl.DateTimeFormat('en-CA').format(new Date()),
		}
	}
}
