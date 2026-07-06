/* NOTE: LinkedIn/GitHub brand glyphs aren't in Lucide — using a generic
   placeholder icon here; real brand icons arrive with the Stage-3 social set. */
import { Mail, Contact as ContactIcon, FileDown } from 'lucide-react'
import Section from '../components/Section.jsx'
import { profile } from '../data/portfolio.js'
import './Contact.css'

/* Contact — simple list: email, LinkedIn, CV download, open-to-remote line.
   (Social icons also persist in the navbar — see global-functionality spec.) */
export default function Contact() {
  const items = [
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}`, aria: 'Email' },
    { icon: ContactIcon, label: 'LinkedIn', href: profile.social.linkedin, aria: 'LinkedIn profile', external: true },
    { icon: FileDown, label: 'Download CV (PDF)', href: profile.cvUrl, aria: 'Download CV', download: true },
  ]

  return (
    <Section id="contact" eyebrow="Contact" title="Get in touch">
      <p className="contact__lead">Open to remote / international roles. The fastest way to reach me:</p>
      <ul className="contact__list">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <li key={it.aria}>
              <a
                className="contact__link"
                href={it.href}
                aria-label={it.aria}
                {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...(it.download ? { download: true } : {})}
              >
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                <span>{it.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
