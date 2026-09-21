import { initializeApp, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebase-config"

export { isFirebaseConfigured }

/**
 * App + Firestore only.
 *
 * Auth and Storage live in sibling modules so that visitors — who just read
 * content — never download the sign-in and upload SDKs. See firebase-auth.ts
 * and firebase-storage.ts.
 */
let app: FirebaseApp | undefined
let firestore: Firestore | undefined

export function getFirebaseApp(): FirebaseApp | undefined {
  if (!isFirebaseConfigured) return undefined
  if (!app) app = initializeApp(firebaseConfig)
  return app
}

export function getDb(): Firestore | undefined {
  const instance = getFirebaseApp()
  if (!instance) return undefined
  if (!firestore) firestore = getFirestore(instance)
  return firestore
}
