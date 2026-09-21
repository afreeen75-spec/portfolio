/**
 * The shape of every piece of resume content.
 *
 * These types are the contract between three things: the Firestore documents,
 * the static fallback in `resume-data.ts`, and the admin editor. Change a type
 * here and TypeScript will point at every place that needs updating.
 */

export interface SocialLink {
  label: string
  url: string
  /** lucide-react icon name, resolved at render time. */
  icon: "github" | "linkedin" | "mail" | "phone" | "globe" | "twitter"
}

export interface Stat {
  value: string
  label: string
}

export interface Profile {
  name: string
  role: string
  location: string
  email: string
  phone: string
  /** Short line under the hero headline. */
  tagline: string
  /** Long-form intro, one entry per paragraph. */
  about: string[]
  /** Big numbers in the hero strip. */
  stats: Stat[]
  socials: SocialLink[]
  /** Public URL of the resume PDF — a Storage link once one is uploaded. */
  resumeUrl: string
  /** Original filename of the uploaded PDF, shown in the admin panel. */
  resumeFileName?: string
  /** Firestore server timestamp of the last resume upload. */
  resumeUpdatedAt?: { seconds: number } | null
  /** Shown as a small pill next to the name. */
  availability: string
  /** ISO date the career clock starts from — drives "years of experience". */
  careerStart: string
}

export interface Experience {
  id: string
  order: number
  role: string
  company: string
  location: string
  /** ISO `YYYY-MM`, or empty `end` for a current role. */
  start: string
  end: string
  summary: string
  highlights: string[]
}

export interface ProjectModule {
  name: string
  points: string[]
}

export interface Project {
  id: string
  order: number
  name: string
  /** Client or owning organisation. */
  org: string
  url: string
  period: string
  summary: string
  stack: string[]
  modules: ProjectModule[]
  featured: boolean
}

export interface SkillGroup {
  id: string
  order: number
  category: string
  items: string[]
}

export interface Education {
  id: string
  order: number
  qualification: string
  institution: string
  detail: string
  period: string
  grade: string
}

export interface ResumeData {
  profile: Profile
  experience: Experience[]
  projects: Project[]
  skills: SkillGroup[]
  education: Education[]
}

/** Where the rendered content came from — surfaced in the admin panel. */
export type ResumeSource = "firestore" | "fallback"
