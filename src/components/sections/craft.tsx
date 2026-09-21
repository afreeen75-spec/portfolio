import { Reveal } from "@/components/common/reveal"
import { Section } from "@/components/common/section"
import { SectionHeading } from "@/components/common/section-heading"
import type { SkillGroup } from "@/lib/types"

export function Craft({ skills }: { skills: SkillGroup[] }) {
  return (
    <Section id="craft" className="border-t border-border/70">
      <SectionHeading
        index="04"
        eyebrow="Craft"
        title="The toolkit, grouped by the problem it solves"
        description="Frontend is where I’m fastest, but identity and data are where I’ve spent the most time getting things right."
      />

      <dl className="mt-12 divide-y divide-border/70 border-y border-border/70">
        {skills.map((group, index) => (
          <Reveal key={group.id} delay={index * 0.04}>
            <div className="grid gap-3 py-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
              <dt className="flex items-baseline gap-2.5">
                <span className="font-mono text-[11px] text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-semibold tracking-tight">
                  {group.category}
                </span>
              </dt>
              <dd className="flex flex-wrap gap-x-2 gap-y-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border/80 bg-card px-2.5 py-1 text-[13px] text-foreground/85 transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
