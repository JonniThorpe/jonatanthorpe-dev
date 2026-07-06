import Navbar from './components/Navbar.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import { sections } from './config/sections.config.js'
import './styles/layout.css'
import './App.css'

/* The page renders from sections.config: Navbar reads the same registry,
   so section order and nav order can never drift apart. */
function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        {sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
    </>
  )
}

export default App
