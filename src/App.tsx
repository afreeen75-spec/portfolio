import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ResumeProvider } from "@/hooks/use-resume"
import { ThemeProvider } from "@/hooks/use-theme"
import Home from "@/pages/home"
import NotFound from "@/pages/not-found"

// The editor pulls in Firebase Auth and the form stack — keep it out of the
// bundle visitors download.
const Admin = lazy(() => import("@/pages/admin"))

export default function App() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <TooltipProvider delayDuration={200}>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </ResumeProvider>
    </ThemeProvider>
  )
}
