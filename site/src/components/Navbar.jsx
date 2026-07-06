import { useEffect, useMemo, useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'
import { navSections } from '../config/sections.config.js'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import './Navbar.css'

/* Placeholder social set + Copy-for-LLM button. LAYOUT STAGE: these are
   visual placeholders — no real links / no clipboard behavior yet (real
   hrefs + the LLM aggregation come in a later stage). */
const SOCIALS = [
  { name: 'linkedin', label: 'LinkedIn' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'github', label: 'GitHub' },
]

function SocialIcons({ className }) {
  return (
    <div className={`nav__socials${className ? ' ' + className : ''}`}>
      {SOCIALS.map((s) => (
        <button key={s.name} type="button" className="nav__social" aria-label={`${s.label} (placeholder)`}>
          <BrandIcon name={s.name} size={18} />
        </button>
      ))}
    </div>
  )
}

function LlmButton({ className }) {
  return (
    <button type="button" className={`nav__llm${className ? ' ' + className : ''}`} aria-label="Copy portfolio for LLM (placeholder)">
      <Sparkles size={16} strokeWidth={1.75} />
      Copy for LLM
    </button>
  )
}

/* Navbar. Links render FROM sections.config (never hardcoded); the current
   section is scrollspy-highlighted (underline). Desktop: sticky top bar.
   Mobile (<=768px): bottom tab bar whose hamburger expands a panel upward
   with the full nav. */
export default function Navbar() {
  const ids = useMemo(() => navSections.map((s) => s.id), [])
  const active = useScrollSpy(ids)
  const [open, setOpen] = useState(false)

  // Close the mobile panel on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const activeLabel = navSections.find((s) => s.id === active)?.navLabel ?? ''

  const renderLinks = (onClick) =>
    navSections.map((s) => (
      <li key={s.id}>
        <a
          href={`#${s.id}`}
          className={`nav__link${active === s.id ? ' is-active' : ''}`}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={onClick}
        >
          {s.navLabel}
        </a>
      </li>
    ))

  return (
    <>
      {/* ---- Desktop / tablet: sticky top bar ---- */}
      <header className="nav">
        <nav className="nav__inner" aria-label="Primary">
          <a className="nav__brand" href="#hero">JT</a>
          <ul className="nav__links">{renderLinks()}</ul>
          <div className="nav__actions">
            <SocialIcons />
            <LlmButton />
          </div>
        </nav>
      </header>

      {/* ---- Mobile: bottom tab bar + upward-expanding panel ---- */}
      <div className={`navm${open ? ' is-open' : ''}`}>
        <div
          id="navm-panel"
          className="navm__panel"
          role="region"
          aria-label="Site navigation"
          hidden={!open}
        >
          <ul className="navm__links">{renderLinks(() => setOpen(false))}</ul>
          <div className="navm__actions">
            <SocialIcons className="navm__socials" />
            <LlmButton className="navm__llm" />
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
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>
    </>
  )
}
