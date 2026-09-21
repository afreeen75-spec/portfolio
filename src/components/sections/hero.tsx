import { ArrowDownToLine, ArrowRight, MapPin } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { yearsSince } from "@/lib/site"
import type { Profile } from "@/lib/types"

export function Hero({ profile }: { profile: Profile }) {
  const reduceMotion = useReducedMotion()
  const years = yearsSince(profile.careerStart)

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section id="intro" className="relative scroll-mt-24 pb-20 pt-14 sm:pt-20 lg:pb-28 lg:pt-24">
      <div
        className="paper-grid pointer-events-none absolute inset-x-0 -top-24 h-[28rem]"
        aria-hidden="true"
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <div>
          {/* The rail carries the name on desktop; on mobile it belongs here. */}
          <motion.div {...rise(0)} className="lg:hidden">
            <p className="eyebrow">{profile.availability}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-[15px] font-medium text-foreground/80">{profile.role}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden="true" />
              {profile.location}
            </p>
            <div className="mt-8 h-px w-16 bg-primary/50" aria-hidden="true" />
          </motion.div>

          <motion.p {...rise(0.05)} className="eyebrow mt-8 hidden lg:mt-0 lg:block">
            {years}+ years · Kathmandu
          </motion.p>

          <motion.h2
            {...rise(0.1)}
            className="mt-6 font-display text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-balance sm:text-5xl lg:mt-5 lg:text-[3.25rem]"
          >
            Interfaces for systems{" "}
            <span className="text-primary">people can’t opt out of</span>.
          </motion.h2>

          <motion.p
            {...rise(0.15)}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base"
          >
            {profile.tagline}
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#work">
                See the work
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={profile.resumeUrl} download target="_blank" rel="noreferrer noopener">
                <ArrowDownToLine />
                Résumé
              </a>
            </Button>
          </motion.div>

          <motion.dl
            {...rise(0.28)}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-7"
          >
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-snug text-muted-foreground">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, scale: 0.97 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const },
              })}
          className="relative mx-auto w-full max-w-[17rem] sm:max-w-[19rem] lg:mx-0 lg:max-w-none"
        >
          {/* Offset rule behind the portrait — a printed-plate feel. */}
          <div
            className="absolute -bottom-3 -right-3 h-full w-full rounded-lg border border-primary/35"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
            <picture>
              <source srcSet="/afreen-portrait.webp" type="image/webp" />
              <img
                src="/afreen-portrait.jpg"
                alt={`${profile.name}, ${profile.role}`}
                width={800}
                height={1000}
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover object-[55%_30%]"
              />
            </picture>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
