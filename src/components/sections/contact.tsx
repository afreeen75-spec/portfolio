import { ArrowUpRight, Mail, MapPin } from "lucide-react"

import { Reveal } from "@/components/common/reveal"
import { Section } from "@/components/common/section"
import { SectionHeading } from "@/components/common/section-heading"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/layout/social-links"
import type { Profile } from "@/lib/types"

export function Contact({ profile }: { profile: Profile }) {
  const rows = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: MapPin, label: "Based in", value: profile.location, href: "" },
  ]

  return (
    <Section id="contact" className="border-t border-border/70">
      <SectionHeading
        index="06"
        eyebrow="Contact"
        title="Have something that needs building properly?"
        description="I’m open to full-stack roles and focused freelance work — especially anything involving authentication, permissions or a component system that has to hold up across teams."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <Reveal>
          <dl className="divide-y divide-border/70 border-y border-border/70">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 py-4">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <dt className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </dt>
                <dd className="min-w-0 flex-1 text-sm">
                  {href ? (
                    <a
                      href={href}
                      className="link-underline break-all text-foreground/90 hover:text-primary"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-foreground/90">{value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col items-start gap-5 lg:items-end">
          <Button asChild size="lg">
            <a href={`mailto:${profile.email}`}>
              Start a conversation
              <ArrowUpRight />
            </a>
          </Button>
          <SocialLinks links={profile.socials} className="-ml-2 lg:-mr-2 lg:ml-0" />
        </Reveal>
      </div>
    </Section>
  )
}
