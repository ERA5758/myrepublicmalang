'use client';
import { ReactNode } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

const { firebaseApp, firestore, auth } = initializeFirebase();

/**
 * Provides the Firebase context to the application on the client side.
 * This ensures that Firebase is initialized only once.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
