import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Seconds. Stagger siblings by passing 0.05, 0.1, … */
  delay?: number
  as?: "div" | "li" | "section" | "article"
}

/**
 * Fade-and-rise on first scroll into view. Respects prefers-reduced-motion by
 * rendering the final state immediately rather than animating a shorter version.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  if (reduceMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
