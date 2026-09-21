import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        This page doesn’t exist
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        The link may be out of date, or the section was renamed.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link to="/">
          <ArrowLeft />
          Back to the portfolio
        </Link>
      </Button>
    </div>
  )
}
