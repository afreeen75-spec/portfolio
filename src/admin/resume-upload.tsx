import * as React from "react"
import { FileText, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { RESUME_STORAGE_PATH, uploadResume } from "@/lib/resume-file"
import type { Profile } from "@/lib/types"

interface ResumeUploadProps {
  profile: Profile
  /** Called with the fresh Storage URL so the open draft stays in sync. */
  onUploaded: (url: string, fileName: string) => void
}

/**
 * Replace the CV in Firebase Storage.
 *
 * The upload also rewrites `profile.resumeUrl` in Firestore, so every download
 * button on the site picks up the new file on the next load — no republish.
 */
export function ResumeUpload({ profile, onUploaded }: ResumeUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [progress, setProgress] = React.useState<number | null>(null)

  const isStored = profile.resumeUrl.includes("firebasestorage")
  const updatedAt = profile.resumeUpdatedAt?.seconds
    ? new Date(profile.resumeUpdatedAt.seconds * 1000).toLocaleString()
    : null

  const onPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = "" // allow re-picking the same filename
    if (!file) return

    setProgress(0)
    try {
      const result = await uploadResume(file, setProgress)
      onUploaded(result.url, result.fileName)
      toast.success("Résumé updated", {
        description: "The download button now serves the new PDF.",
      })
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Check your Storage rules.",
      })
    } finally {
      setProgress(null)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card/60 p-5">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
          <FileText className="size-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">Résumé PDF</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {isStored ? (
              <>
                Served from Firebase Storage at{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono">
                  {RESUME_STORAGE_PATH}
                </code>
                {profile.resumeFileName ? ` · ${profile.resumeFileName}` : null}
                {updatedAt ? ` · updated ${updatedAt}` : null}
              </>
            ) : (
              <>
                Currently serving the copy bundled in{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono">/public</code>. Upload a
                PDF to switch to Storage — after that, replacing the file here is all it takes to
                update the site.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={onPick}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={progress !== null}
          onClick={() => inputRef.current?.click()}
        >
          {progress !== null ? <Loader2 className="animate-spin" /> : <Upload />}
          {progress !== null ? `Uploading… ${progress}%` : "Upload new PDF"}
        </Button>
        {profile.resumeUrl ? (
          <Button asChild variant="ghost" size="sm">
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener">
              Preview current
            </a>
          </Button>
        ) : null}
      </div>

      {progress !== null ? (
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-primary transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}
