import * as React from "react"

/**
 * Scroll-spy for the side rail.
 *
 * Uses a viewport band rather than a plain intersection ratio: a section counts
 * as active once its top crosses ~35% down the screen, which matches where the
 * eye actually sits while reading and avoids a short section never winning.
 */
export function useActiveSection(ids: string[], offset = 0.35) {
  const [active, setActive] = React.useState(ids[0] ?? "")

  React.useEffect(() => {
    if (ids.length === 0) return

    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight * offset
      let current = ids[0]

      for (const id of ids) {
        const element = document.getElementById(id)
        if (!element) continue
        if (element.getBoundingClientRect().top <= line) current = id
      }

      // Anything within a screen of the bottom should light up the last entry,
      // otherwise a short final section can never become active.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 80
      setActive(atBottom ? ids[ids.length - 1] : current)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids, offset])

  return active
}
