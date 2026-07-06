import { GraduationCap, Award } from 'lucide-react'
import Section from '../components/Section.jsx'
import { studies } from '../data/portfolio.js'
import './Studies.css'

/* Studies & certifications — simple card list (not a timeline).
   Studies use accent-primary, certifications use accent-secondary. */
export default function Studies() {
  return (
    <Section id="studies" eyebrow="Studies & certifications" title="Studies & certifications" wide>
      <ul className="studies">
        {studies.map((s) => {
          const Icon = s.type === 'certification' ? Award : GraduationCap
          return (
            <li key={s.id} className={`study-card study-card--${s.type}`}>
              <Icon className="study-card__icon" size={22} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h3 className="study-card__title">{s.qualification}</h3>
                <p className="study-card__inst">{s.institution}</p>
                <p className="study-card__meta u-mono">{s.dates} · {s.location}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
