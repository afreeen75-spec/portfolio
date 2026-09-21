import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SideRail } from "@/components/layout/side-rail"
import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"
import { Craft } from "@/components/sections/craft"
import { Hero } from "@/components/sections/hero"
import { Studies } from "@/components/sections/studies"
import { Work } from "@/components/sections/work"
import { useActiveSection } from "@/hooks/use-active-section"
import { useResume } from "@/hooks/use-resume"
import { navIds } from "@/lib/site"

export default function Home() {
  const { data } = useResume()
  const active = useActiveSection(navIds)

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <MobileNav profile={data.profile} active={active} />

      <div className="mx-auto w-full max-w-[85rem] px-6 sm:px-8 lg:flex lg:gap-16 lg:px-12 xl:gap-24">
        <SideRail profile={data.profile} active={active} />

        <main id="main" className="min-w-0 flex-1 lg:py-16">
          <Hero profile={data.profile} />
          <About profile={data.profile} skills={data.skills} />
          <Work experience={data.experience} projects={data.projects} />
          <Craft skills={data.skills} />
          <Studies education={data.education} />
          <Contact profile={data.profile} />
          <Footer profile={data.profile} />
        </main>
      </div>
    </div>
  )
}
