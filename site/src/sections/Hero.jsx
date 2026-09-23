import { Download, ArrowDown } from 'lucide-react'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Hero.css'

/* Hero — 5-second read: who, what, open-to-remote, two CTAs.
   The name is displayed by the navbar brand (folds into "JT" on scroll), so
   the <h1> carries it for screen readers/SEO and shows the role visually. */
export default function Hero() {
  const { content, ui } = useLang()
  const { profile } = content
  const { first, last } = profile.brandName

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__inner">
        <p className="hero__eyebrow u-mono">{profile.location}</p>
        <h1 id="hero-title" className="hero__role">
          <span className="u-sr-only">{first} {last} — </span>
          {profile.role}
        </h1>
        <p className="hero__focus">{profile.focus}</p>

        <div className="hero__cta">
          <a className="btn btn--primary" href={profile.cvUrl} download>
            {ui.hero.downloadCv} <Download size={18} strokeWidth={1.75} />
          </a>
          <a className="btn btn--ghost" href="#contact">
            {ui.hero.contact} <ArrowDown size={18} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  )
}
