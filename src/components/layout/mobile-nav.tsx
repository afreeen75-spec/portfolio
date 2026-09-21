import * as React from "react"
import { ArrowDownToLine, Menu } from "lucide-react"

import { SocialLinks } from "@/components/layout/social-links"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navItems } from "@/lib/site"
import type { Profile } from "@/lib/types"
import { cn } from "@/lib/utils"

export function MobileNav({ profile, active }: { profile: Profile; active: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between px-6">
        <a href="#intro" className="font-display text-lg font-semibold tracking-tight">
          {profile.name}
        </a>
        <div className="flex items-center gap-1">
          <ThemeToggle className="size-9" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[17rem] flex-col p-6">
              <SheetHeader>
                <SheetTitle className="text-left">Sections</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex-1">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2 py-2.5 text-sm transition-colors",
                          active === item.id
                            ? "bg-accent font-medium text-foreground"
                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                        )}
                      >
                        <span className="font-mono text-[11px] text-primary">{item.index}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-4 border-t border-border pt-5">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={profile.resumeUrl} download target="_blank" rel="noreferrer noopener">
                    <ArrowDownToLine />
                    Download résumé
                  </a>
                </Button>
                <SocialLinks links={profile.socials} className="-ml-2" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
