/* STAGE 1: showing the design-token preview instead of the placeholder
   sections. The real section layout arrives in Stage 2 — at that point,
   restore the section imports below and delete src/dev/StylePreview.jsx.

   import Hero from './sections/Hero.jsx'
   import About from './sections/About.jsx'
   import Projects from './sections/Projects.jsx'
   import Contact from './sections/Contact.jsx'
*/
import StylePreview from './dev/StylePreview.jsx'
import './App.css'

function App() {
  return <StylePreview />
}

export default App
