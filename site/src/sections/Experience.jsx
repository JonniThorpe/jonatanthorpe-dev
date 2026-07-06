import Section from '../components/Section.jsx'
import { experience } from '../data/portfolio.js'
import './Experience.css'

/* Experience — vertical timeline, newest first, all entries expanded.
   Divider lines between entries rather than heavy card borders. */
export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Experience">
      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.id} className="timeline__item">
            <img className="timeline__logo" src={job.logo.src} alt={job.logo.alt} width="48" height="48" loading="lazy" />
            <div className="timeline__content">
              <h3 className="timeline__role">
                {job.role} <span className="timeline__company">· {job.company}</span>
              </h3>
              <p className="timeline__meta u-mono">{job.dates} · {job.location}</p>
              <p className="timeline__desc">{job.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
