'use client';

import {
  createContext,
  ReactNode,
  useContext,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

/**
 * The context for the Firebase app.
 */
const FirebaseContext = createContext<{
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}>({
  firebaseApp: null,
  firestore: null,
  auth: null,
});

/**
 * The provider for the Firebase context.
 *
 * This component provides the Firebase context to the application.
 */
export function FirebaseProvider({
  children,
  firebaseApp,
  firestore,
  auth,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}) {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * A hook to get the Firebase context.
 *
 * This hook returns the Firebase context, which contains the Firebase app,
 * Firestore, and Auth instances.
 */
export function useFirebase() {
  return useContext(FirebaseContext);
}

/**
 * A hook to get the Firebase app instance.
 *
 * This hook returns the Firebase app instance.
 */
export function useFirebaseApp() {
  return useContext(FirebaseContext)?.firebaseApp;
}

/**
 * A hook to get the Firestore instance.
 *
 * This hook returns the Firestore instance.
 */
export function useFirestore() {
  return useContext(FirebaseContext)?.firestore;
}

/**
 * A hook to get the Auth instance.
 *
 * This hook returns the Auth instance.
 */
export function useAuth() {
  return useContext(FirebaseContext)?.auth;
}
