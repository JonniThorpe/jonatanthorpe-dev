import { Sparkles } from 'lucide-react'
import { useLang } from '../../i18n/LanguageProvider.jsx'

/* Copy-for-LLM button. Chunk 1: label + a11y wired; the clipboard aggregation
   is implemented in Chunk 2 (onClick placeholder for now). */
export default function LlmButton({ className }) {
  const { ui } = useLang()
  return (
    <button
      type="button"
      className={`llm-btn${className ? ' ' + className : ''}`}
      aria-label={ui.actions.copyLlmAria}
    >
      <Sparkles size={16} strokeWidth={1.75} />
      {ui.actions.copyLlm}
    </button>
  )
}
