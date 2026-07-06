import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/* Theme state, shared so every toggle instance (desktop navbar + mobile panel)
   stays in sync. Defaults to the visitor's system preference; NO persistence
   (spec) — resets to system on each visit. Writes [data-theme] on <html>,
   which the token system reads. */
const ThemeContext = createContext(null)

function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getSystemTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
