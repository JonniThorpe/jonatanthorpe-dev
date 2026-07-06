import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.js'
import './index.css'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
