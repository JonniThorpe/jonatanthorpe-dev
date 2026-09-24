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

/* Route strip: each job is a leg of the trail, as wide as its duration,
   placed on a shared time axis (gaps show as dashed trail). Decorative:
   the cards below carry the same information for screen readers. */
function Route({ jobs }) {
  const from = Math.min(...jobs.map((j) => monthIndex(j.start)))
  const to = Math.max(...jobs.map((j) => monthIndex(j.end))) + 1
  const share = (months) => `${(months / (to - from)) * 100}%`
  const pct = (i) => share(i - from)

  const years = []
  for (let y = Math.floor(from / 12); y * 12 < to; y++) {
    years.push({ year: y, at: pct(Math.max(y * 12, from)) })
  }

  return (
    <div className="xroute" aria-hidden="true">
      <div className="xroute__track">
        {[...jobs].reverse().map((job, i) => (
          <span
            key={job.id}
            className={`xroute__leg xroute__leg--${i % 2 ? 'below' : 'above'}`}
            style={{ left: pct(monthIndex(job.start)), width: share(monthsOf(job)) }}
          >
            <span className="xroute__label u-mono">{job.short}</span>
          </span>
        ))}
      </div>
      <div className="xroute__years">
        {years.map(({ year, at }) => (
          <span key={year} className="xroute__year u-mono" style={{ left: at }}>{year}</span>
        ))}
      </div>
    </div>
  )
}

/* Experience — the career as a route (legs sized by duration), then one
   open card per job: context, what I did, stack. Newest first; the newest
   spans the full width. */
export default function Experience() {
  const { content, ui } = useLang()
  const jobs = content.experience
  const icons = iconsBySkill(content.skills)
  const t = ui.experience

  return (
    <Section id="experience" eyebrow={t.eyebrow} title={t.title} wide>
      <Route jobs={jobs} />

      <ol className="xp">
        {jobs.map((job) => {
          const n = monthsOf(job)
          return (
            <li key={job.id} className="xp__item">
              <article className="xp__card" aria-labelledby={`xp-${job.id}`}>
                <header className="xp__head">
                  <span className="xp__mark" aria-hidden="true">{job.short[0]}</span>
                  <div className="xp__heading">
                    <h3 id={`xp-${job.id}`} className="xp__role">{job.role}</h3>
                    <p className="xp__company">{job.company}</p>
                  </div>
                  <p className="xp__meta u-mono">
                    {job.dates} · {n} {n === 1 ? t.month : t.months} · {job.location}
                  </p>
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
          )
        })}
      </ol>
    </Section>
  )
}
