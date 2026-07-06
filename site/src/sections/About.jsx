import Section from '../components/Section.jsx'
import { about, profile } from '../data/portfolio.js'
import './About.css'

/* About — image + text split (not text-only), personal voice. */
export default function About() {
  return (
    <Section id="about" eyebrow="About" title="About me" wide>
      <div className="about__grid">
        <img
          className="about__photo"
          src={profile.photo.src}
          alt={profile.photo.alt}
          width="480"
          height="600"
          loading="lazy"
        />
        <div className="about__body">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="about__p">{p}</p>
          ))}
          <p className="about__note u-mono">{about.note}</p>
        </div>
      </div>
    </Section>
  )
}
