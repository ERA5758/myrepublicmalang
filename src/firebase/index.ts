import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

/**
 * Initializes the Firebase app and returns the Firebase app, Firestore, and
 * Auth instances.
 *
 * This function initializes the Firebase app if it has not already been
- * initialized. It then returns the Firebase app, Firestore, and Auth
+ * initialized. It then returns the Firebase app, Firestore, and Auth.
  * instances.
  */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
} {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, firestore: null, auth: null };
  }
  const apps = getApps();
  const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
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
