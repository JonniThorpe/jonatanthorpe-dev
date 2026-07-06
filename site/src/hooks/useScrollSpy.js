import { useEffect, useState } from 'react'

/* Scrollspy: returns the id of the section currently in view, for navbar
   highlighting. Observes all given section ids and picks the one nearest
   the top of the viewport that is intersecting. */
export function useScrollSpy(ids, { rootMargin = '-45% 0px -50% 0px' } = {}) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const visible = new Map()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        })

        // Pick the first section (in document order) that is currently visible.
        const current = ids.find((id) => visible.has(id))
        if (current) setActiveId(current)
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, rootMargin])

  return activeId
}
