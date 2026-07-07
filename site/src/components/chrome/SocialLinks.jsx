import BrandIcon from '../BrandIcon.jsx'
import { useLang } from '../../i18n/LanguageProvider.jsx'
import { profile } from '../../data/portfolio.js'

/* Real outbound social links (open in a new tab). URLs come from
   profile.social — still placeholder values until real ones land in Stage 4,
   but the links themselves are live. */
const ORDER = ['linkedin', 'instagram', 'github', 'github2']

export default function SocialLinks({ className }) {
  const { ui } = useLang()
  return (
    <div className={`social-links${className ? ' ' + className : ''}`}>
      {ORDER.map((name) => (
        <a
          key={name}
          className="social-link"
          href={profile.social[name]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ui.social[name]}
        >
          <BrandIcon name={name} size={18} />
        </a>
      ))}
    </div>
  )
}
