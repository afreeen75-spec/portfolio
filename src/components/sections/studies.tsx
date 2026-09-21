import { GraduationCap } from "lucide-react"

import { Reveal } from "@/components/common/reveal"
import { Section } from "@/components/common/section"
import { SectionHeading } from "@/components/common/section-heading"
import type { Education } from "@/lib/types"

export function Studies({ education }: { education: Education[] }) {
  return (
    <Section id="studies" className="border-t border-border/70">
      <SectionHeading
        index="05"
        eyebrow="Studies"
        title="Where the formal side comes from"
      />

      <ol className="mt-12 space-y-7">
        {education.map((entry, index) => (
          <Reveal as="li" key={entry.id} delay={index * 0.04}>
            <div className="flex gap-4 sm:gap-5">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                <GraduationCap className="size-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {entry.qualification}
                  </h3>
                  {entry.grade ? (
                    <span className="font-mono text-xs text-primary">{entry.grade}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{entry.institution}</p>
                {entry.detail ? (
                  <p className="mt-1 font-mono text-xs text-muted-foreground/75">{entry.detail}</p>
                ) : null}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
