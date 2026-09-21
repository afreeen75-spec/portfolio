import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore"

import { getDb } from "@/lib/firebase"
import { resumeData } from "@/lib/resume-data"
import { byOrder, fallbackResume } from "@/lib/resume-fallback"
import type {
  Education,
  Experience,
  Profile,
  Project,
  ResumeData,
  ResumeSource,
  SkillGroup,
} from "@/lib/types"

/** Firestore layout: one settings doc plus four ordered collections. */
export const PROFILE_DOC = { collection: "site", id: "profile" } as const
export const COLLECTIONS = {
  experience: "experience",
  projects: "projects",
  skills: "skills",
  education: "education",
} as const

export type CollectionKey = keyof typeof COLLECTIONS

export interface LoadedResume {
  data: ResumeData
  source: ResumeSource
  /** Set when Firestore was configured but the read failed. */
  error?: string
}



async function readCollection<T extends { id: string; order: number }>(
  name: string
): Promise<T[]> {
  const db = getDb()
  if (!db) return []
  const snapshot = await getDocs(collection(db, name))
  return snapshot.docs
    .map((d) => ({ ...(d.data() as Omit<T, "id">), id: d.id }) as T)
    .sort(byOrder)
}

/**
 * Load the resume, preferring Firestore and falling back per-section.
 *
 * Falling back section by section (rather than all-or-nothing) means a
 * half-seeded database still renders a complete page instead of gaps.
 */
export async function fetchResume(): Promise<LoadedResume> {
  const db = getDb()
  if (!db) return { data: fallbackResume, source: "fallback" }

  try {
    const [profileSnap, experience, projects, skills, education] = await Promise.all([
      getDoc(doc(db, PROFILE_DOC.collection, PROFILE_DOC.id)),
      readCollection<Experience>(COLLECTIONS.experience),
      readCollection<Project>(COLLECTIONS.projects),
      readCollection<SkillGroup>(COLLECTIONS.skills),
      readCollection<Education>(COLLECTIONS.education),
    ])

    const hasAnything =
      profileSnap.exists() ||
      experience.length > 0 ||
      projects.length > 0 ||
      skills.length > 0 ||
      education.length > 0

    if (!hasAnything) return { data: fallbackResume, source: "fallback" }

    return {
      source: "firestore",
      data: {
        profile: profileSnap.exists()
          ? { ...resumeData.profile, ...(profileSnap.data() as Partial<Profile>) }
          : resumeData.profile,
        experience: experience.length ? experience : fallbackResume.experience,
        projects: projects.length ? projects : fallbackResume.projects,
        skills: skills.length ? skills : fallbackResume.skills,
        education: education.length ? education : fallbackResume.education,
      },
    }
  } catch (error) {
    // A misconfigured project or a blocked read should never blank the page.
    return {
      data: fallbackResume,
      source: "fallback",
      error: error instanceof Error ? error.message : "Could not reach Firestore",
    }
  }
}

function requireDb() {
  const db = getDb()
  if (!db) throw new Error("Firebase is not configured — add your keys to .env.local")
  return db
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = requireDb()
  await setDoc(doc(db, PROFILE_DOC.collection, PROFILE_DOC.id), profile, { merge: true })
}

export async function saveItem<T extends { id: string }>(
  key: CollectionKey,
  item: T
): Promise<void> {
  const db = requireDb()
  const { id, ...rest } = item
  await setDoc(doc(db, COLLECTIONS[key], id), rest, { merge: false })
}

export async function deleteItem(key: CollectionKey, id: string): Promise<void> {
  const db = requireDb()
  await deleteDoc(doc(db, COLLECTIONS[key], id))
}

/**
 * Push the entire static resume into Firestore in one batch.
 *
 * Used once to bootstrap a new project, and afterwards as a reset button:
 * it overwrites documents that share an id but leaves extra ones alone.
 */
export async function seedFirestore(data: ResumeData = resumeData): Promise<number> {
  const db = requireDb()
  const batch = writeBatch(db)
  let writes = 0

  batch.set(doc(db, PROFILE_DOC.collection, PROFILE_DOC.id), data.profile)
  writes += 1

  const sections: Array<[CollectionKey, Array<{ id: string }>]> = [
    ["experience", data.experience],
    ["projects", data.projects],
    ["skills", data.skills],
    ["education", data.education],
  ]

  for (const [key, items] of sections) {
    for (const item of items) {
      const { id, ...rest } = item
      batch.set(doc(db, COLLECTIONS[key], id), rest)
      writes += 1
    }
  }

  await batch.commit()
  return writes
}
