import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../theme/ThemeProvider.jsx'
import { useLang } from '../../i18n/LanguageProvider.jsx'

/* Theme toggle button. State lives in ThemeProvider (shared across instances).
   Shows the current theme; clicking flips it. */
export default function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme()
  const { ui } = useLang()

  const goingToDark = theme !== 'dark'
  const Icon = theme === 'dark' ? Moon : Sun

  return (
    <button
      type="button"
      className={`ctl${className ? ' ' + className : ''}`}
      onClick={toggle}
      aria-label={goingToDark ? ui.actions.switchDark : ui.actions.switchLight}
    >
      <Icon size={16} strokeWidth={1.75} />
      <span>{theme === 'dark' ? ui.actions.dark : ui.actions.light}</span>
    </button>
  )
}
