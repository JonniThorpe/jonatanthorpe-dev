import { GraduationCap } from 'lucide-react'
import Section from '../components/Section.jsx'
import { studies } from '../data/portfolio.js'
import './Studies.css'

/* Studies — simple card list (not a timeline). */
export default function Studies() {
  return (
    <Section id="studies" eyebrow="Studies" title="Studies">
      <ul className="studies">
        {studies.map((s) => (
          <li key={s.id} className="study-card">
            <GraduationCap className="study-card__icon" size={22} strokeWidth={1.75} aria-hidden="true" />
            <div>
              <h3 className="study-card__title">{s.qualification}</h3>
              <p className="study-card__inst">{s.institution}</p>
              <p className="study-card__meta u-mono">{s.dates} · {s.location}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
