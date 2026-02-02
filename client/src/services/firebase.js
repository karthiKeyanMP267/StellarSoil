import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasConfig = Object.values(firebaseConfig).every(Boolean);

const app = hasConfig
  ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig))
  : null;

export const isFirebaseConfigured = hasConfig;
export const firebaseApp = app;
const auth = app ? getAuth(app) : null;

const getMessagingInstance = async () => {
  if (!hasConfig) return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export const registerFirebaseServiceWorker = async () => {
  if (!hasConfig || typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    return registration;
  } catch (error) {
    console.warn('Firebase service worker registration failed:', error);
    return null;
  }
};

export const requestFcmToken = async () => {
  if (!hasConfig || typeof window === 'undefined') return null;
  if (!('Notification' in window)) return null;

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn('Missing VITE_FIREBASE_VAPID_KEY.');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  const serviceWorkerRegistration = await registerFirebaseServiceWorker();

  return getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: serviceWorkerRegistration || undefined
  });
};

export const onForegroundMessage = async (handler) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};
  return onMessage(messaging, handler);
};

export const initFirebaseClient = async () => {
  if (!hasConfig) {
    console.warn('Firebase config is missing. Skipping Firebase initialization.');
    return;
  }

  await registerFirebaseServiceWorker();
};

export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
};
