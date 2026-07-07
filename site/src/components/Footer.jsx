import SocialLinks from './chrome/SocialLinks.jsx'
import LlmButton from './chrome/LlmButton.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './chrome/chrome.css'
import './Footer.css'

/* Site footer: copyright + social links + Copy-for-LLM. */
export default function Footer() {
  const { content, ui } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          © {year} {content.profile.name}. {ui.footer.rights}
          {' '}
          <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="footer__credit">
            {ui.footer.iconCredit}
          </a>
        </p>
        <div className="footer__actions">
          <SocialLinks />
          <LlmButton />
        </div>
      </div>
    </footer>
  )
}
