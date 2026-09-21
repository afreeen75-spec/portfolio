export interface NavItem {
  id: string
  label: string
  /** Rendered as the monospace index in the rail. */
  index: string
}

export const navItems: NavItem[] = [
  { id: "intro", label: "Intro", index: "01" },
  { id: "about", label: "About", index: "02" },
  { id: "work", label: "Work", index: "03" },
  { id: "craft", label: "Craft", index: "04" },
  { id: "studies", label: "Studies", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
]

export const navIds = navItems.map((item) => item.id)

/** Whole years since the career start date, floored, never below one. */
export function yearsSince(isoMonth: string): number {
  const [year, month] = isoMonth.split("-").map(Number)
  if (!year) return 1
  const start = new Date(year, (month ?? 1) - 1, 1)
  const now = new Date()
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.max(1, Math.floor(months / 12))
}

/**
 * "2024-01" + "" → "Jan 2024 — Present".
 *
 * Returns an empty string when there is no start date, so an entry whose dates
 * haven't been filled in renders without a stray "— Present" line.
 */
export function formatPeriod(start: string, end: string): string {
  if (!start) return end ? labelMonth(end) : ""
  return `${labelMonth(start)} — ${end ? labelMonth(end) : "Present"}`
}

function labelMonth(value: string): string {
  const [year, month] = value.split("-").map(Number)
  if (!year) return value
  return new Date(year, (month ?? 1) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}
