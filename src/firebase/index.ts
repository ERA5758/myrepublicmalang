
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

/**
 * Initializes the Firebase app and returns the Firebase app, Firestore, and
 * Auth instances.
 *
 * This function initializes the Firebase app if it has not already been
 * initialized. It then returns the Firebase app, Firestore, and Auth.
 * instances.
 */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
} {
  
  const apps = getApps();
  if (!apps.length) {
    if (!firebaseConfig.projectId) {
      console.error("Firebase config is not set. Please check your .env.local file.");
      return { firebaseApp: null, firestore: null, auth: null };
    }
    initializeApp(firebaseConfig);
  }
  
  const firebaseApp = getApps()[0];
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  return { firebaseApp, firestore, auth };
}

export {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
export { useUser } from './auth/use-user';
