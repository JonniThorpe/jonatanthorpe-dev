import { Sparkles } from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'
import { profile } from '../data/portfolio.js'
import './Footer.css'

/* Site footer. LAYOUT STAGE: social icons + Copy-for-LLM are visual
   placeholders (no real links / no clipboard yet) — same as the navbar. */
const SOCIALS = [
  { name: 'linkedin', label: 'LinkedIn' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'github', label: 'GitHub' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          © {year} {profile.name}. All rights reserved.
        </p>

        <div className="footer__actions">
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <button key={s.name} type="button" className="footer__social" aria-label={`${s.label} (placeholder)`}>
                <BrandIcon name={s.name} size={18} />
              </button>
            ))}
          </div>
          <button type="button" className="footer__llm" aria-label="Copy portfolio for LLM (placeholder)">
            <Sparkles size={16} strokeWidth={1.75} />
            Copy for LLM
          </button>
        </div>
      </div>
    </footer>
  )
}
