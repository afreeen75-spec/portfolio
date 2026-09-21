import * as React from "react"

import { isFirebaseConfigured } from "@/lib/firebase-config"
import { fallbackResume } from "@/lib/resume-fallback"
import type { ResumeData, ResumeSource } from "@/lib/types"

interface ResumeContextValue {
  data: ResumeData
  source: ResumeSource
  loading: boolean
  error?: string
  refresh: () => Promise<void>
}

const ResumeContext = React.createContext<ResumeContextValue | null>(null)

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  // Start from the static resume so the first paint is already complete;
  // Firestore then upgrades it in place rather than replacing a spinner.
  const [data, setData] = React.useState<ResumeData>(fallbackResume)
  const [source, setSource] = React.useState<ResumeSource>("fallback")
  const [loading, setLoading] = React.useState(isFirebaseConfigured)
  const [error, setError] = React.useState<string | undefined>()

  const refresh = React.useCallback(async () => {
    if (!isFirebaseConfigured) return
    setLoading(true)
    // Loaded on demand so visitors don't pay for the Firebase SDK before the
    // page has painted — the static resume is already on screen by now.
    const { fetchResume } = await import("@/lib/resume-service")
    const result = await fetchResume()
    setData(result.data)
    setSource(result.source)
    setError(result.error)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const value = React.useMemo(
    () => ({ data, source, loading, error, refresh }),
    [data, source, loading, error, refresh]
  )

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const context = React.useContext(ResumeContext)
  if (!context) throw new Error("useResume must be used inside <ResumeProvider>")
  return context
}
