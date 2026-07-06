import { Mail, Contact as ContactIcon, FileDown } from 'lucide-react'
import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Contact.css'

/* Contact — simple list: email, LinkedIn, CV download, open-to-remote line.
   (Social links also persist in the navbar — see global-functionality spec.)
   NOTE: LinkedIn/GitHub brand glyphs aren't in Lucide — using a generic
   placeholder icon here; brand glyphs live in the navbar/footer socials. */
export default function Contact() {
  const { content, ui } = useLang()
  const { profile } = content
  const t = ui.contact

  const items = [
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}`, aria: t.email },
    { icon: ContactIcon, label: 'LinkedIn', href: profile.social.linkedin, aria: t.linkedin, external: true },
    { icon: FileDown, label: t.cv, href: profile.cvUrl, aria: t.cv, download: true },
  ]

  return (
    <Section id="contact" eyebrow={t.eyebrow} title={t.title}>
      <p className="contact__lead">{t.lead}</p>
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
