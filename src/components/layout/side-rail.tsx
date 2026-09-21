import { ArrowDownToLine, MapPin } from "lucide-react"

import { SocialLinks } from "@/components/layout/social-links"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/types"
import { navItems } from "@/lib/site"
import { cn } from "@/lib/utils"

interface SideRailProps {
  profile: Profile
  active: string
}

/**
 * Desktop navigation: a fixed column that stays put while the content scrolls
 * past it. The numbered index doubles as a progress indicator — the active
 * entry grows a rule and shifts right.
 */
export function SideRail({ profile, active }: SideRailProps) {
  return (
    <header className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[21rem] lg:shrink-0 lg:flex-col lg:justify-between lg:py-16 xl:w-[23rem]">
      <div>
        <p className="eyebrow">{profile.availability}</p>
        <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-3 text-[15px] font-medium text-foreground/80">{profile.role}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden="true" />
          {profile.location}
        </p>

        <nav aria-label="Sections" className="mt-12">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-md py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[11px] transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/60"
                      )}
                    >
                      {item.index}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-px bg-current transition-all duration-300 ease-out",
                        isActive
                          ? "w-10 bg-primary"
                          : "w-5 bg-border group-hover:w-8 group-hover:bg-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "tracking-wide transition-transform duration-300",
                        isActive && "translate-x-0.5 font-medium"
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="space-y-5">
        <Button asChild variant="outline" size="sm" className="w-fit">
          <a href={profile.resumeUrl} download target="_blank" rel="noreferrer noopener">
            <ArrowDownToLine />
            Download résumé
          </a>
        </Button>
        <div className="flex items-center gap-1">
          <SocialLinks links={profile.socials} className="-ml-2" />
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <ThemeToggle className="size-9" />
        </div>
      </div>
    </header>
  )
}
