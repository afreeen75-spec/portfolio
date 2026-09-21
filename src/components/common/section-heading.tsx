import { Reveal } from "@/components/common/reveal"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground/70">{index}</span>
        <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
