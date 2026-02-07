/**
 * Firebase Configuration
 *
 * This file initializes Firebase using the modular Web SDK.
 * All Firebase config values should be set via environment variables.
 *
 * Required environment variables:
 * - NEXT_PUBLIC_FIREBASE_API_KEY
 * - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 * - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 * - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 * - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - NEXT_PUBLIC_FIREBASE_APP_ID
 *
 * Optional:
 * - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (for Google Analytics via Firebase)
 * - NEXT_PUBLIC_FIREBASE_DATABASE_URL (if using Realtime Database)
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL?: string;
}

// Get Firebase config from environment variables
const getFirebaseConfig = (): FirebaseConfig => {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
  };

  // Validate required config values
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingFields = requiredFields.filter(
    (field) => !config[field]
  );

  if (missingFields.length > 0 && typeof window !== 'undefined') {
    console.warn(
      `Firebase configuration incomplete. Missing: ${missingFields.join(', ')}. ` +
      'Firebase features will not work until these environment variables are set.'
    );
  }

  return config;
};

// Initialize Firebase App (singleton pattern)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | null = null;

const initializeFirebase = (): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics: Analytics | null;
} => {
  // Return existing instances if already initialized
  if (app && auth && db) {
    return { app, auth, db, analytics };
  }

  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    const config = getFirebaseConfig();
    // Only initialize if we have at least the projectId
    if (config.projectId) {
      app = initializeApp(config);
    } else {
      throw new Error(
        'Firebase configuration is missing. Please set NEXT_PUBLIC_FIREBASE_* environment variables.'
      );
    }
  }

  // Initialize Auth and Firestore
  auth = getAuth(app);
  db = getFirestore(app);

  // Analytics is initialized asynchronously in the client (see AnalyticsProvider)
  return { app, auth, db, analytics };
};

/**
 * Initialize and return Firebase Analytics (client-only).
 * Call this from a client component after mount.
 */
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null;
  const supported = await isSupported();
  if (!supported) return null;
  if (analytics) return analytics;
  const { app: firebaseApp } = initializeFirebase();
  analytics = getAnalytics(firebaseApp);
  return analytics;
};

// Export initialized Firebase services
// Only initialize on client side or when explicitly called
export const getFirebase = (): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics: Analytics | null;
} => {
  if (typeof window === 'undefined') {
    throw new Error(
      'Firebase should only be initialized on the client side. ' +
      'Use getFirebase() within useEffect or client components only.'
    );
  }
  return initializeFirebase();
};

// Export individual services (lazy initialization)
export const getFirebaseAuth = (): Auth => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth should only be used on the client side.');
  }
  if (!auth) {
    initializeFirebase();
  }
  return auth!;
};

export const getFirebaseFirestore = (): Firestore => {
  if (typeof window === 'undefined') {
    throw new Error('Firestore should only be used on the client side.');
  }
  if (!db) {
    initializeFirebase();
  }
  return db!;
};

// Export for direct use in client components
export default getFirebase;
