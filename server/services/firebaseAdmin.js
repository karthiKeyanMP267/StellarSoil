import admin from 'firebase-admin';
import fs from 'fs';

let initialized = false;

const initFirebaseAdmin = () => {
  if (initialized) return admin;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  try {
    if (json) {
      const serviceAccount = JSON.parse(json.replace(/\\n/g, '\n'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else if (path && fs.existsSync(path)) {
      const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      admin.initializeApp();
    }

    initialized = true;
    return admin;
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    throw error;
  }
};

export const verifyFirebaseIdToken = async (idToken) => {
  const firebaseAdmin = initFirebaseAdmin();
  return firebaseAdmin.auth().verifyIdToken(idToken);
};
