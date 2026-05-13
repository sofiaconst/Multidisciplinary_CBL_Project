import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyD10PQAAYHnO52q9rhUOEGooF3IXdkOl4Q',
	authDomain: 'hydration-app-2b583.firebaseapp.com',
	projectId: 'hydration-app-2b583',
	storageBucket: 'hydration-app-2b583.firebasestorage.app',
	messagingSenderId: '955296328828',
	appId: '1:955296328828:web:df5983d95067700bdfedf9',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
