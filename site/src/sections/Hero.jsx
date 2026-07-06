import { Download, ArrowDown } from 'lucide-react'
import { profile } from '../data/portfolio.js'
import './Hero.css'

/* Hero — 5-second read: who, what, open-to-remote, two CTAs.
   Uses <h1> (single top-level heading for the page). */
export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <p className="hero__eyebrow u-mono">{profile.location}</p>
        <h1 id="hero-title" className="hero__title">{profile.name}</h1>
        <p className="hero__role">{profile.role}</p>
        <p className="hero__focus">{profile.focus}</p>

        <div className="hero__cta">
          <a className="btn btn--primary" href={profile.cvUrl} download>
            Download CV <Download size={18} strokeWidth={1.75} />
          </a>
          <a className="btn btn--ghost" href="#contact">
            Contact <ArrowDown size={18} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  )
}
