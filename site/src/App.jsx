import Navbar from './components/Navbar.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Footer from './components/Footer.jsx'
import { sections } from './config/sections.config.js'
import { useLang } from './i18n/LanguageProvider.jsx'
import './styles/layout.css'
import './App.css'

/* The page renders from sections.config: Navbar reads the same registry,
   so section order and nav order can never drift apart. */
function App() {
  const { ui } = useLang()
  return (
    <>
      <a className="skip-link" href="#main">{ui.skipLink}</a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        {sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
      <Footer />
    </>
  )
}

export default App
