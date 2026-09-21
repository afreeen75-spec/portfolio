import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

import { getDb } from "@/lib/firebase"
import { getFirebaseStorage } from "@/lib/firebase-storage"
import { PROFILE_DOC } from "@/lib/resume-service"

/**
 * One fixed path, overwritten on every upload.
 *
 * Firebase mints a fresh download token each time the object is replaced, which
 * invalidates the previous URL — so the new URL is written straight back to the
 * profile document. That write is what makes the site's download button point
 * at the new CV without a redeploy.
 */
export const RESUME_STORAGE_PATH = "resume/resume.pdf"

export interface UploadResult {
  url: string
  fileName: string
}

export async function uploadResume(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const storage = getFirebaseStorage()
  const db = getDb()
  if (!storage || !db) {
    throw new Error("Firebase is not configured — add your keys to .env.local")
  }
  if (file.type !== "application/pdf") {
    throw new Error("Please choose a PDF file.")
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("That PDF is larger than 10 MB.")
  }

  const task = uploadBytesResumable(ref(storage, RESUME_STORAGE_PATH), file, {
    contentType: "application/pdf",
    // Let browsers cache it briefly, but not so long that a new CV goes unseen.
    cacheControl: "public, max-age=300",
    customMetadata: { originalName: file.name },
  })

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        if (!onProgress) return
        onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
      },
      reject,
      () => resolve()
    )
  })

  const url = await getDownloadURL(task.snapshot.ref)

  await setDoc(
    doc(db, PROFILE_DOC.collection, PROFILE_DOC.id),
    { resumeUrl: url, resumeFileName: file.name, resumeUpdatedAt: serverTimestamp() },
    { merge: true }
  )

  return { url, fileName: file.name }
}
