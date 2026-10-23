import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import Section from '../components/Section.jsx'
import TechChip from '../components/TechChip.jsx'
import { iconsBySkill } from '../lib/skillIcons.js'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Experience.css'

/* 'YYYY-MM' → absolute month index */
const monthIndex = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + m - 1
}

/* Inclusive month count (Jan-Oct = 10), the usual CV/LinkedIn convention */
const monthsOf = (job) => monthIndex(job.end) - monthIndex(job.start) + 1

/* 'YYYY-MM' → 'Jan 2021' / 'ene 2021', built from the data instead of a
   hand-written string so both languages stay consistent */
const formatMonth = (ym, lang) => {
  const [y, m] = ym.split('-').map(Number)
  return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' })
    .format(new Date(y, m - 1))
    .replace('.', '')
}

/* Experience — vertical timeline, newest first. Each stop pairs its dates
   and duration (left) with the job card (right), joined by a rail; time
   between two jobs shows as a dashed stretch of the rail. */
export default function Experience() {
  const { content, ui, lang } = useLang()
  const jobs = content.experience
  const icons = iconsBySkill(content.skills)
  const t = ui.experience

  return (
    <Section id="experience" eyebrow={t.eyebrow} title={t.title} wide>
      <ol className="xtl">
        {jobs.map((job, i) => {
          const n = monthsOf(job)
          const older = jobs[i + 1]
          const gap = older && monthIndex(job.start) - monthIndex(older.end) > 1
          return (
            <Fragment key={job.id}>
              <li className="xtl__item">
                <p className="xtl__when u-mono">
                  <span className="xtl__from">{formatMonth(job.start, lang)}</span>
                  <span className="xtl__to">→ {formatMonth(job.end, lang)}</span>
                  <span className="xtl__dur">{n} {n === 1 ? t.month : t.months}</span>
                </p>

                <span className="xtl__rail" aria-hidden="true"><span className="xtl__dot" /></span>

                <article className="xp__card" aria-labelledby={`xp-${job.id}`}>
                  <header className="xp__head">
                    <span className="xp__mark" aria-hidden="true">{job.short[0]}</span>
                    <div className="xp__heading">
                      <h3 id={`xp-${job.id}`} className="xp__role">{job.role}</h3>
                      <p className="xp__company">
                        {job.company} <span className="xp__place">· {job.location}</span>
                      </p>
                    </div>
                  </header>

                  {job.context && <p className="xp__context">{job.context}</p>}

                  <ul className="xp__bullets">
                    {job.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>

                  <ul className="xp__stack">
                    {job.stack.map((name) => <TechChip key={name} name={name} FallbackIcon={icons[name]} />)}
                  </ul>

                  {job.project && (
                    <a className="xp__link" href={`#project-${job.project}`}>
                      {t.seeProject} <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  )}
                </article>
              </li>
              {gap && <li className="xtl__gap" aria-hidden="true"><span className="xtl__rail" /></li>}
            </Fragment>
          )
        })}
      </ol>
    </Section>
  )
}
