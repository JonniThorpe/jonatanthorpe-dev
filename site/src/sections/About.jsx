import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './About.css'

/* About — image + text split (not text-only), personal voice. */
export default function About() {
  const { content, ui } = useLang()
  const { about, profile } = content

  return (
    <Section id="about" eyebrow={ui.about.eyebrow} title={ui.about.title} wide>
      <div className="about__grid">
        <img
          className="about__photo"
          src={profile.photo.src}
          alt={profile.photo.alt}
          width="1200"
          height="1600"
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
