import { resumeData } from "@/lib/resume-data"
import type { ResumeData } from "@/lib/types"

export const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order

/**
 * Sort every collection by `order`.
 *
 * Applied to the static fallback too, so the render order can't drift from what
 * Firestore would produce — otherwise inserting an entry in the middle of
 * resume-data.ts would reshuffle the page the moment it got seeded.
 */
export function normalize(data: ResumeData): ResumeData {
  return {
    profile: data.profile,
    experience: [...data.experience].sort(byOrder),
    projects: [...data.projects].sort(byOrder),
    skills: [...data.skills].sort(byOrder),
    education: [...data.education].sort(byOrder),
  }
}

/**
 * The static resume in its canonical order.
 *
 * Deliberately free of Firebase imports: this is what paints first, so it must
 * not drag the SDK into the initial chunk.
 */
export const fallbackResume = normalize(resumeData)
