import { getAuth, type Auth } from "firebase/auth"

import { getFirebaseApp } from "@/lib/firebase"

let auth: Auth | undefined

export function getFirebaseAuth(): Auth | undefined {
  const app = getFirebaseApp()
  if (!app) return undefined
  if (!auth) auth = getAuth(app)
  return auth
}
