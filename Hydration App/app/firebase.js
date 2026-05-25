// ── Firebase configuration ────────────────────────────────────────────────────
// Paste your project's config from:
//   Firebase Console → Project Settings → Your apps → SDK setup → Config
// ─────────────────────────────────────────────────────────────────────────────
const HS_FIREBASE_CONFIG = {
  apiKey:            "AIzaSyD10PQAAYHnO52q9rhUOEGooF3IXdkOl4Q",
  authDomain:        "hydration-app-2b583.firebaseapp.com",
  projectId:         "hydration-app-2b583",
  storageBucket:     "hydration-app-2b583.firebasestorage.app",
  messagingSenderId: "955296328828",
  appId:             "1:955296328828:web:b289d09e3585230edfedf9",
};

firebase.initializeApp(HS_FIREBASE_CONFIG);
window.HS_AUTH = firebase.auth();
window.HS_DB   = firebase.firestore();

// Human-readable messages for Firebase Auth error codes
window.HS_AUTH_ERR = function(code) {
  const MAP = {
    'auth/user-not-found':          'No account found with that email address.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Email or password is incorrect.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/too-many-requests':       'Too many failed attempts. Please wait a moment and try again.',
    'auth/network-request-failed':  'Network error. Check your connection and try again.',
    'auth/user-disabled':           'This account has been disabled. Contact support.',
    'auth/operation-not-allowed':   'Email/password sign-in is not enabled. Contact support.',
  };
  return MAP[code] || 'Something went wrong. Please try again.';
};
