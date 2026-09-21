import { Github, Globe, Linkedin, Mail, Phone, Twitter } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { SocialLink } from "@/lib/types"
import { cn } from "@/lib/utils"

const icons = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  twitter: Twitter,
}

export function SocialLinks({
  links,
  className,
}: {
  links: SocialLink[]
  className?: string
}) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {links.map((link) => {
        const Icon = icons[link.icon] ?? Globe
        const external = link.url.startsWith("http")
        return (
          <li key={link.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={link.url}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer noopener" : undefined}
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-[18px]" />
                  <span className="sr-only">{link.label}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>{link.label}</TooltipContent>
            </Tooltip>
          </li>
        )
      })}
    </ul>
  )
}
