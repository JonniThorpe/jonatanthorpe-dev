import { GraduationCap, Award } from 'lucide-react'
import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Studies.css'

/* Studies & certifications — simple card list (not a timeline).
   Studies use accent-primary, certifications use accent-secondary. */
export default function Studies() {
  const { content, ui } = useLang()
  const studies = content.studies

  return (
    <Section id="studies" eyebrow={ui.studies.eyebrow} title={ui.studies.title} wide>
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
