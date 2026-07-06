import { useState } from 'react'
import { Server, Layout, Cloud, Network, Database, FlaskConical, Users } from 'lucide-react'
import Section from '../components/Section.jsx'
import { skills } from '../data/portfolio.js'
import './Skills.css'

/* Icon map for CATEGORY headers only (Backend, Frontend, …). */
const ICONS = { Server, Layout, Cloud, Network, Database, FlaskConical, Users }

/* ── DEFERRED TO REAL-CONTENT STAGE (not placeholder) ─────────────────────
   1. Per-technology brand icons: the spec wants a brand LOGO per individual
      skill (React, Docker, PostgreSQL…). Lucide has no brand icons, so for
      now each skill reuses its category icon as a neutral placeholder mark.
      Real per-tech logos get added with the real skills data (brand source
      e.g. simple-icons or inline SVGs, same approach as the navbar socials).
   2. Skill accent bar (`.skill-item__bar`): currently a static full-width
      bar — a visual placeholder. Its REAL VALUE (proficiency / level per
      skill) will be defined together with the real skills content, then
      drive the bar's fill.
   Both are intentionally decoupled from layout and land when real info does. */

/* Skills — multi-column icon-grid grouped by category, with a filter that
   isolates one category (click again / "All" to reset). */
export default function Skills() {
  const [active, setActive] = useState('all')
  const shown = active === 'all' ? skills : skills.filter((g) => g.category === active)

  return (
    <Section id="skills" eyebrow="Skills" title="Skills" wide>
      <div className="skills__filter" role="group" aria-label="Filter skills by category">
        <button
          className={`chip${active === 'all' ? ' is-active' : ''}`}
          onClick={() => setActive('all')}
          aria-pressed={active === 'all'}
        >
          All
        </button>
        {skills.map((g) => (
          <button
            key={g.category}
            className={`chip${active === g.category ? ' is-active' : ''}`}
            onClick={() => setActive((c) => (c === g.category ? 'all' : g.category))}
            aria-pressed={active === g.category}
          >
            {g.category}
          </button>
        ))}
      </div>

      <div className="skills__grid">
        {shown.map((group) => {
          const Icon = ICONS[group.icon] ?? Server
          return (
            <div key={group.category} className="skill-group">
              <h3 className="skill-group__head">
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                {group.category}
              </h3>
              <ul className="skill-group__list">
                {group.items.map((item) => (
                  <li key={item} className="skill-item">
                    {/* placeholder icon (real per-tech logo) + placeholder bar
                        (real proficiency value) come with real content — see note above */}
                    <Icon size={16} strokeWidth={1.5} aria-hidden="true" className="skill-item__icon" />
                    <span className="skill-item__label">{item}</span>
                    <span className="skill-item__bar" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
