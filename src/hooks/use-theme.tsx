import * as React from "react"

type Theme = "light" | "dark" | "system"
type Resolved = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: Resolved
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const STORAGE_KEY = "afreen-theme"
const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function systemTheme(): Resolved {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") return stored
  } catch {
    // Private browsing or blocked storage — fall through to the system default.
  }
  return "system"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(readStoredTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<Resolved>(() =>
    readStoredTheme() === "system" ? systemTheme() : (readStoredTheme() as Resolved)
  )

  React.useEffect(() => {
    const next = theme === "system" ? systemTheme() : theme
    setResolvedTheme(next)
    const root = document.documentElement
    root.classList.toggle("dark", next === "dark")
    root.style.colorScheme = next
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore — the theme just won't persist across reloads.
    }
  }, [theme])

  // Follow the OS while the user hasn't picked a side.
  React.useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      const next = media.matches ? "dark" : "light"
      setResolvedTheme(next)
      document.documentElement.classList.toggle("dark", next === "dark")
      document.documentElement.style.colorScheme = next
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState(resolvedTheme === "dark" ? "light" : "dark"),
    }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>")
  return context
}
