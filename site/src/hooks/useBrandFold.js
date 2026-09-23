import { useEffect } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* Navbar brand "Jonatan Thorpe" → "JT" on scroll, plus the transparent-nav
   state while the bar sits over the hero photo.
   - The inner letters (".nav__fold") shrink to 0 width over the first ~35%
     of the hero's height, leaving only the initials in place.
   - html[data-nav-over-hero] is "true" while the hero is still under the
     bar; Navbar.css drops the bar's background for that state.
   - If the full name does not fit in the bar (narrower desktops), it stays
     folded as "JT".
   - Reduced motion: the fold snaps (no in-between frames).
   Styles are written straight to the DOM in a rAF (no React re-renders). */
export function useBrandFold(brandRef) {
  useEffect(() => {
    const brand = brandRef.current
    const hero = document.getElementById('hero')
    if (!brand || !hero) return

    const root = document.documentElement
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY)
    const folds = [...brand.querySelectorAll('.nav__fold')]
    let widths = []
    let fits = true
    let frame = 0

    const measure = () => {
      widths = folds.map((el) => el.scrollWidth)
      // Width the bar content would need with the name fully unfolded
      // (sum of the items, not scrollWidth: the links' auto margin fills it)
      const inner = brand.parentElement
      const cs = getComputedStyle(inner)
      const items = [...inner.children]
      const used = items.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0)
        + parseFloat(cs.columnGap || 0) * (items.length - 1)
        + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
      const shown = folds.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0)
      const full = widths.reduce((sum, w) => sum + w, 0)
      fits = used - shown + full <= inner.clientWidth
    }

    const update = () => {
      frame = 0
      const range = Math.max(1, hero.offsetHeight * 0.35)
      let p = clamp01(window.scrollY / range)
      if (!fits) p = 1
      else if (reduced.matches) p = p < 0.5 ? 0 : 1

      folds.forEach((el, i) => {
        el.style.width = `${widths[i] * (1 - p)}px`
        el.style.opacity = String(1 - clamp01(p * 1.6))
      })

      const navHeight = brand.closest('.nav')?.offsetHeight ?? 0
      root.dataset.navOverHero = String(hero.getBoundingClientRect().bottom > navHeight)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const remeasure = () => {
      measure()
      schedule()
    }

    measure()
    update()
    document.fonts?.ready.then(remeasure)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', remeasure)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', remeasure)
      folds.forEach((el) => { el.style.width = ''; el.style.opacity = '' })
      delete root.dataset.navOverHero
    }
  }, [brandRef])
}
