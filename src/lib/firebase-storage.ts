import { getStorage, type FirebaseStorage } from "firebase/storage"

import { getFirebaseApp } from "@/lib/firebase"

let storage: FirebaseStorage | undefined

export function getFirebaseStorage(): FirebaseStorage | undefined {
  const app = getFirebaseApp()
  if (!app) return undefined
  if (!storage) storage = getStorage(app)
  return storage
}
