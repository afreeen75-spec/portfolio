import * as React from "react"

import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string
}

/** Consistent vertical rhythm and a scroll-margin that clears the mobile bar. */
export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 sm:py-28", className)}
      {...props}
    >
      {children}
    </section>
  )
}
