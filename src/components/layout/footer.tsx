import type { Profile } from "@/lib/types"

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-border/70 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React, Tailwind and shadcn/ui.
        </p>
        {/* Admin link intentionally hidden — reach the editor at /admin directly. */}
      </div>
    </footer>
  )
}
