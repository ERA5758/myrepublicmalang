'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '.';

type FirebaseContextValue = {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
};

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  firestore: null,
  auth: null,
});

export function FirebaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [value, setValue] = useState<FirebaseContextValue>({
    firebaseApp: null,
    firestore: null,
    auth: null,
  });

  useEffect(() => {
    const { firebaseApp, firestore, auth } = initializeFirebase();
    setValue({ firebaseApp, firestore, auth });
  }, []);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirebaseApp() {
  return useContext(FirebaseContext)?.firebaseApp;
}

export function useFirestore() {
  return useContext(FirebaseContext)?.firestore;
}

export function useAuth() {
  return useContext(FirebaseContext)?.auth;
}
