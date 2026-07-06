import { useState } from 'react'
import { Sparkles, Check } from 'lucide-react'
import { useLang } from '../../i18n/LanguageProvider.jsx'
import { buildMarkdown } from '../../lib/portfolioSummary.js'

/* Copy-for-LLM: copies a full structured markdown summary of the portfolio
   (same generator that produces /llms.txt) to the clipboard, with brief
   "Copied!" feedback. */
export default function LlmButton({ className }) {
  const { content, ui } = useLang()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const markdown = buildMarkdown(content)
    try {
      await navigator.clipboard.writeText(markdown)
    } catch {
      // Fallback for older/insecure contexts
      const ta = document.createElement('textarea')
      ta.value = markdown
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* no-op */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      className={`llm-btn${className ? ' ' + className : ''}${copied ? ' is-copied' : ''}`}
      onClick={onCopy}
      aria-label={ui.actions.copyLlmAria}
    >
      {copied ? <Check size={16} strokeWidth={2} /> : <Sparkles size={16} strokeWidth={1.75} />}
      {copied ? ui.actions.copied : ui.actions.copyLlm}
    </button>
  )
}
