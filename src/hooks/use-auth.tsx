import * as React from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"

import { getFirebaseAuth } from "@/lib/firebase-auth"
import { isFirebaseConfigured } from "@/lib/firebase-config"

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

/** Optional allowlist. Firestore rules enforce the same thing server-side. */
const allowedEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()

export function useAuth(): AuthState {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(isFirebaseConfigured)

  React.useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next)
      setLoading(false)
    })
  }, [])

  const signIn = React.useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Firebase is not configured — add your keys to .env.local")
    if (allowedEmail && email.trim().toLowerCase() !== allowedEmail) {
      throw new Error("That account isn't allowed to edit this site.")
    }
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const signOut = React.useCallback(async () => {
    const auth = getFirebaseAuth()
    if (auth) await firebaseSignOut(auth)
  }, [])

  return { user, loading, signIn, signOut }
}
