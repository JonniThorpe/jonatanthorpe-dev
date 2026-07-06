import { useLang } from '../../i18n/LanguageProvider.jsx'

/* EN / ES text toggle. Default English, no persistence (handled in the
   provider). Highlights the active language. */
export default function LangToggle({ className }) {
  const { lang, toggle, ui } = useLang()
  return (
    <button
      type="button"
      className={`ctl ctl--lang${className ? ' ' + className : ''}`}
      onClick={toggle}
      aria-label={ui.actions.switchLang}
    >
      <span className={lang === 'en' ? 'is-active' : ''}>EN</span>
      <span className="ctl__sep" aria-hidden="true">/</span>
      <span className={lang === 'es' ? 'is-active' : ''}>ES</span>
    </button>
  )
}
