import { ArrowUpRight, Briefcase } from "lucide-react"

import { Reveal } from "@/components/common/reveal"
import { Section } from "@/components/common/section"
import { SectionHeading } from "@/components/common/section-heading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { formatPeriod } from "@/lib/site"
import type { Experience, Project } from "@/lib/types"

interface WorkProps {
  experience: Experience[]
  projects: Project[]
}

export function Work({ experience, projects }: WorkProps) {
  return (
    <Section id="work" className="border-t border-border/70">
      <SectionHeading
        index="03"
        eyebrow="Work"
        title="What I’ve built, and what was actually hard about it"
        description="Four products, all in production, all with real users on the other side. The modules below are the ones I owned end to end."
      />

      {/* Role first — the employment context the projects sit inside. */}
      <div className="mt-12 space-y-10">
        {experience.map((role, index) => (
          <Reveal key={role.id} delay={index * 0.05}>
            <article className="relative border-l border-border pl-6 sm:pl-8">
              <span
                className="absolute -left-[5px] top-1.5 flex size-2.5 items-center justify-center rounded-full bg-primary ring-4 ring-background"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-xl font-semibold tracking-tight">{role.role}</h3>
                <span className="text-muted-foreground">·</span>
                <span className="text-[15px] font-medium text-primary">{role.company}</span>
              </div>
              <p className="mt-1.5 font-mono text-xs text-muted-foreground">
                {[formatPeriod(role.start, role.end), role.location]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
                {role.summary}
              </p>
              <ul className="mt-5 space-y-2.5">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm leading-relaxed">
                    <Briefcase
                      className="mt-[3px] size-3.5 shrink-0 text-primary/70"
                      aria-hidden="true"
                    />
                    <span className="text-foreground/85 text-pretty">{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 space-y-5">
        <Reveal>
          <p className="eyebrow">Selected products</p>
        </Reveal>

        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.05}>
            <article className="group rounded-lg border border-border bg-card/60 p-6 transition-colors hover:border-primary/40 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-underline gap-1.5 hover:text-primary"
                      >
                        {project.name}
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{project.org}</p>
                </div>
                {project.period ? (
                  <span className="font-mono text-xs text-muted-foreground/80">
                    {project.period}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
                {project.summary}
              </p>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Badge variant="soft" className="font-mono text-[11px] font-normal">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>

              {project.modules.length > 0 ? (
                <Accordion type="single" collapsible className="mt-5 border-t border-border/70">
                  {project.modules.map((module) => (
                    <AccordionItem key={module.name} value={module.name} className="last:border-b-0">
                      <AccordionTrigger>{module.name}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {module.points.map((point) => (
                            <li
                              key={point.slice(0, 32)}
                              className="flex gap-2.5 text-[14px] leading-relaxed text-muted-foreground"
                            >
                              <span
                                className="mt-[9px] size-1 shrink-0 rounded-full bg-primary/60"
                                aria-hidden="true"
                              />
                              <span className="text-pretty">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
