import { useEffect, useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navSections } from '../config/sections.config.js'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import { useLang } from '../i18n/LanguageProvider.jsx'
import LangToggle from './chrome/LangToggle.jsx'
import ThemeToggle from './chrome/ThemeToggle.jsx'
import SocialLinks from './chrome/SocialLinks.jsx'
import LlmButton from './chrome/LlmButton.jsx'
import './chrome/chrome.css'
import './Navbar.css'

/* Navbar. Links render FROM sections.config (labels come from i18n); the
   current section is scrollspy-highlighted (underline). Desktop: sticky top
   bar. Mobile (<=768px): bottom tab bar whose hamburger expands a panel
   upward with the full nav + controls. */
export default function Navbar() {
  const ids = useMemo(() => navSections.map((s) => s.id), [])
  const active = useScrollSpy(ids)
  const { ui } = useLang()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const activeLabel = ui.nav[active] ?? ''

  const renderLinks = (onClick) =>
    navSections.map((s) => (
      <li key={s.id}>
        <a
          href={`#${s.id}`}
          className={`nav__link${active === s.id ? ' is-active' : ''}`}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={onClick}
        >
          {ui.nav[s.id] ?? s.navLabel}
        </a>
      </li>
    ))

  return (
    <>
      {/* ---- Desktop / tablet: sticky top bar ---- */}
      <header className="nav">
        <nav className="nav__inner" aria-label={ui.navAria.primary}>
          <a className="nav__brand" href="#hero">JT</a>
          <ul className="nav__links">{renderLinks()}</ul>
          <div className="nav__actions">
            <LangToggle />
            <ThemeToggle />
            <SocialLinks />
            <LlmButton />
          </div>
        </nav>
      </header>

      {/* ---- Mobile: bottom tab bar + upward-expanding panel ---- */}
      <div className={`navm${open ? ' is-open' : ''}`}>
        <div id="navm-panel" className="navm__panel" role="region" aria-label={ui.navAria.siteNav} hidden={!open}>
          <ul className="navm__links">{renderLinks(() => setOpen(false))}</ul>
          <div className="navm__controls">
            <LangToggle />
            <ThemeToggle />
          </div>
          <div className="navm__actions">
            <SocialLinks />
            <LlmButton />
          </div>
        </div>

        <div className="navm__bar">
          <a className="navm__brand" href="#hero" onClick={() => setOpen(false)}>
            JT<span className="navm__current"> · {activeLabel}</span>
          </a>
          <button
            type="button"
            className="navm__toggle"
            aria-expanded={open}
            aria-controls="navm-panel"
            aria-label={open ? ui.navAria.closeMenu : ui.navAria.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>
    </>
  )
}
