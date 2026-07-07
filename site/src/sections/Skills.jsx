import { useState } from 'react'
import { Code2, Layers, Brain, Database, Wrench, Workflow } from 'lucide-react'
import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import { TECH_ICONS } from '../lib/techIcons.js'
import './Skills.css'

/* Icon map for CATEGORY headers only (Languages, Frameworks, …). */
const ICONS = { Code2, Layers, Brain, Database, Wrench, Workflow }

/* Per-skill brand mark when one exists, else the category icon as a
   neutral fallback (SQL, RunPod, JBoss, Unsloth, GWT, Mockito and a few
   AI/ML terms have no logo in any icon set checked — see techIcons.js). */
function SkillIcon({ name, CategoryIcon }) {
  const brand = TECH_ICONS[name]
  if (!brand) return <CategoryIcon size={16} strokeWidth={1.5} aria-hidden="true" className="skill-item__icon" />
  return (
    <svg
      width={16} height={16} viewBox={brand.viewBox ?? '0 0 24 24'} fill="currentColor"
      aria-hidden="true" focusable="false" className="skill-item__icon skill-item__icon--brand"
      style={{ '--brand-hex': `#${brand.hex}` }}
    >
      <path d={brand.path} />
    </svg>
  )
}

/* Skills — multi-column icon-grid grouped by category, with a filter that
   isolates one category (click again / "All" to reset). */
export default function Skills() {
  const { content, ui } = useLang()
  const skills = content.skills
  const [active, setActive] = useState('all')
  const shown = active === 'all' ? skills : skills.filter((g) => g.category === active)

  return (
    <Section id="skills" eyebrow={ui.skills.eyebrow} title={ui.skills.title} wide>
      <div className="skills__filter" role="group" aria-label={ui.skills.filterLabel}>
        <button
          className={`chip${active === 'all' ? ' is-active' : ''}`}
          onClick={() => setActive('all')}
          aria-pressed={active === 'all'}
        >
          {ui.skills.all}
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
          const Icon = ICONS[group.icon] ?? Code2
          return (
            <div key={group.category} className="skill-group">
              <h3 className="skill-group__head">
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                {group.category}
              </h3>
              <ul className="skill-group__list">
                {group.items.map((item) => (
                  <li key={item.name} className="skill-item">
                    <SkillIcon name={item.name} CategoryIcon={Icon} />
                    <span className="skill-item__label">{item.name}</span>
                    <span
                      className="skill-item__bar"
                      role="meter"
                      aria-label={`${item.name} proficiency`}
                      aria-valuenow={item.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span className="skill-item__bar-fill" style={{ '--level': `${item.level}%` }} />
                    </span>
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
