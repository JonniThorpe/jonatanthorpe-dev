import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { dictionary, DEFAULT_LANG } from './strings.js'

/* Language context. Default English on every load, NO persistence (spec) —
   deliberately no localStorage, so it resets to English on each visit.
   Exposes: lang, setLang, toggle, and the active language's { content, ui }. */

const LangContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG)

  const setLang = useCallback((next) => {
    setLangState(next)
    document.documentElement.lang = next // keep <html lang> in sync (a11y/SEO)
  }, [])

  const toggle = useCallback(() => {
    setLangState((cur) => {
      const next = cur === 'en' ? 'es' : 'en'
      document.documentElement.lang = next
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, toggle, ...dictionary[lang] }),
    [lang, setLang, toggle],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
