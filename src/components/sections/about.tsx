import { Reveal } from "@/components/common/reveal"
import { Section } from "@/components/common/section"
import { SectionHeading } from "@/components/common/section-heading"
import type { Profile, SkillGroup } from "@/lib/types"

interface AboutProps {
  profile: Profile
  skills: SkillGroup[]
}

export function About({ profile, skills }: AboutProps) {
  /* A short "currently working in" strip, drawn from the first two skill groups
     so it stays accurate when the skills are edited in Firestore. */
  const focus = skills.slice(0, 2).flatMap((group) => group.items.slice(0, 4))

  return (
    <Section id="about" className="border-t border-border/70">
      <SectionHeading
        index="02"
        eyebrow="About"
        title="From visa forms at 2am to the permissions behind them"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <div className="space-y-5">
          {profile.about.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 28)} delay={index * 0.05}>
              <p className="text-[15px] leading-[1.75] text-muted-foreground text-pretty">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="lg:pt-1">
          <p className="eyebrow">Currently in</p>
          <ul className="mt-4 space-y-2.5">
            {focus.map((item) => (
              <li key={item} className="flex items-baseline gap-2.5 text-sm">
                <span className="size-1 shrink-0 translate-y-[-2px] rounded-full bg-primary" aria-hidden="true" />
                <span className="text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
