import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Database, Loader2, LogOut, Save } from "lucide-react"
import { toast } from "sonner"

import {
  EducationEditor,
  ExperienceEditor,
  ProfileEditor,
  ProjectsEditor,
  SkillsEditor,
} from "@/admin/editors"
import { ResumeUpload } from "@/admin/resume-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useResume } from "@/hooks/use-resume"
import { isFirebaseConfigured } from "@/lib/firebase-config"
import {
  deleteItem,
  saveItem,
  saveProfile,
  seedFirestore,
  type CollectionKey,
} from "@/lib/resume-service"
import type { ResumeData } from "@/lib/types"

function NotConfigured() {
  return (
    <Shell>
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Firebase isn’t connected yet</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The site is rendering from the static résumé in{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            src/lib/resume-data.ts
          </code>
          . To edit content live, copy{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.env.example</code> to{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.env.local</code>, fill
          in your Firebase web config, and restart the dev server.
        </p>
      </div>
    </Shell>
  )
}

function SignIn({ onSignIn }: { onSignIn: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      await onSignIn(email, password)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      <form
        onSubmit={submit}
        className="mx-auto max-w-sm space-y-4 rounded-lg border border-border bg-card p-6"
      >
        <div>
          <h2 className="font-display text-lg font-semibold">Sign in to edit</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Uses the Firebase Auth account for this project.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </Shell>
  )
}

function Shell({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  )
}

export default function Admin() {
  const { user, loading, signIn, signOut } = useAuth()
  const { data, source, refresh } = useResume()

  // Local working copy; nothing reaches Firestore until "Publish".
  const [draft, setDraft] = React.useState<ResumeData>(data)
  const [saving, setSaving] = React.useState(false)
  const [seeding, setSeeding] = React.useState(false)

  // Adopt freshly-loaded content, but never clobber edits in progress.
  const dirty = React.useRef(false)
  React.useEffect(() => {
    if (!dirty.current) setDraft(data)
  }, [data])

  const edit = React.useCallback((next: Partial<ResumeData>) => {
    dirty.current = true
    setDraft((current) => ({ ...current, ...next }))
  }, [])

  if (!isFirebaseConfigured) return <NotConfigured />
  if (loading) {
    return (
      <Shell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Checking your session…
        </div>
      </Shell>
    )
  }
  if (!user) return <SignIn onSignIn={signIn} />

  /**
   * Publish writes every section, then removes documents that were deleted in
   * the editor — otherwise a deleted role would reappear on the next read.
   */
  const publish = async () => {
    setSaving(true)
    try {
      const sections: Array<[CollectionKey, Array<{ id: string }>, Array<{ id: string }>]> = [
        ["experience", draft.experience, data.experience],
        ["projects", draft.projects, data.projects],
        ["skills", draft.skills, data.skills],
        ["education", draft.education, data.education],
      ]

      await saveProfile(draft.profile)

      for (const [key, next, previous] of sections) {
        await Promise.all(next.map((item) => saveItem(key, item as { id: string })))
        const keptIds = new Set(next.map((item) => item.id))
        const removed = previous.filter((item) => !keptIds.has(item.id))
        await Promise.all(removed.map((item) => deleteItem(key, item.id)))
      }

      dirty.current = false
      await refresh()
      toast.success("Published", { description: "The live site now shows these changes." })
    } catch (error) {
      toast.error("Could not publish", {
        description: error instanceof Error ? error.message : "Check your Firestore rules.",
      })
    } finally {
      setSaving(false)
    }
  }

  const seed = async () => {
    setSeeding(true)
    try {
      const writes = await seedFirestore()
      dirty.current = false
      await refresh()
      toast.success(`Seeded ${writes} documents`, {
        description: "Firestore now mirrors the résumé in the codebase.",
      })
    } catch (error) {
      toast.error("Seeding failed", {
        description: error instanceof Error ? error.message : "Check your Firestore rules.",
      })
    } finally {
      setSeeding(false)
    }
  }

  return (
    <Shell
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={seed} disabled={seeding}>
            {seeding ? <Loader2 className="animate-spin" /> : <Database />}
            Seed
          </Button>
          <Button size="sm" onClick={publish} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            Publish
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
            <LogOut className="size-4" />
          </Button>
        </>
      }
    >
      <header className="mb-8">
        <p className="eyebrow">Content</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Résumé editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {user.email}. Reading from{" "}
          <span className="font-medium text-foreground">
            {source === "firestore" ? "Firestore" : "the static fallback"}
          </span>
          {source === "fallback"
            ? " — hit Seed once to copy the résumé into Firestore."
            : "."}
        </p>
      </header>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-8 space-y-8">
          <ResumeUpload
            profile={draft.profile}
            onUploaded={(resumeUrl, resumeFileName) =>
              setDraft((current) => ({
                ...current,
                profile: { ...current.profile, resumeUrl, resumeFileName },
              }))
            }
          />
          <ProfileEditor value={draft.profile} onChange={(profile) => edit({ profile })} />
        </TabsContent>
        <TabsContent value="experience" className="mt-8">
          <ExperienceEditor
            items={draft.experience}
            onChange={(experience) => edit({ experience })}
          />
        </TabsContent>
        <TabsContent value="projects" className="mt-8">
          <ProjectsEditor items={draft.projects} onChange={(projects) => edit({ projects })} />
        </TabsContent>
        <TabsContent value="skills" className="mt-8">
          <SkillsEditor items={draft.skills} onChange={(skills) => edit({ skills })} />
        </TabsContent>
        <TabsContent value="education" className="mt-8">
          <EducationEditor items={draft.education} onChange={(education) => edit({ education })} />
        </TabsContent>
      </Tabs>
    </Shell>
  )
}
