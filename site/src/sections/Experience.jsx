import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Experience.css'

/* Experience — central vertical timeline with entries alternating left/right
   (desktop). Single-open accordion: clicking an entry expands it and closes
   any other. Newest first; the newest starts open. On mobile the timeline
   collapses to a single left-aligned rail (same click-to-expand behavior). */
export default function Experience() {
  const { content, ui } = useLang()
  const experience = content.experience
  const [openId, setOpenId] = useState(experience[0]?.id ?? null)

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id))

  return (
    <Section id="experience" eyebrow={ui.experience.eyebrow} title={ui.experience.title} wide>
      <ol className="xp">
        {experience.map((job, i) => {
          const isOpen = openId === job.id
          const side = i % 2 === 0 ? 'left' : 'right'
          return (
            <li key={job.id} className={`xp__item xp__item--${side}${isOpen ? ' is-open' : ''}`}>
              <span className="xp__marker" aria-hidden="true" />
              <article className="xp__card">
                <button
                  type="button"
                  className="xp__head"
                  aria-expanded={isOpen}
                  aria-controls={`xp-${job.id}`}
                  onClick={() => toggle(job.id)}
                >
                  <img className="xp__logo" src={job.logo.src} alt={job.logo.alt} width="44" height="44" loading="lazy" />
                  <span className="xp__heading">
                    <span className="xp__role">
                      {job.role} <span className="xp__company">· {job.company}</span>
                    </span>
                    <span className="xp__meta u-mono">{job.dates} · {job.location}</span>
                  </span>
                  <ChevronDown className="xp__chev" size={20} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <div id={`xp-${job.id}`} className="xp__detail" hidden={!isOpen}>
                  <p>{job.description}</p>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
