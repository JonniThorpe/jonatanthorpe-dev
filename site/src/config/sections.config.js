/* Single source of truth for section order + navigation.
   Add a section by: creating its component and adding ONE entry here — it
   then appears in both the page and the navbar automatically. The navbar
   never hardcodes links; it reads this config.

   Fields: id (matches the section's DOM id + nav anchor), navLabel (nav text),
   order (sort key), visible (show in nav + page), Component. */

import Hero from '../sections/Hero.jsx'
import About from '../sections/About.jsx'
import Projects from '../sections/Projects.jsx'
import Experience from '../sections/Experience.jsx'
import Studies from '../sections/Studies.jsx'
import Skills from '../sections/Skills.jsx'
import Hobbies from '../sections/Hobbies.jsx'
import Contact from '../sections/Contact.jsx'

export const sections = [
  { id: 'hero', navLabel: 'Home', order: 1, visible: true, Component: Hero },
  { id: 'about', navLabel: 'About', order: 2, visible: true, Component: About },
  { id: 'projects', navLabel: 'Projects', order: 3, visible: true, Component: Projects },
  { id: 'experience', navLabel: 'Experience', order: 4, visible: true, Component: Experience },
  { id: 'studies', navLabel: 'Studies', order: 5, visible: true, Component: Studies },
  { id: 'skills', navLabel: 'Skills', order: 6, visible: true, Component: Skills },
  { id: 'hobbies', navLabel: 'Hobbies', order: 7, visible: true, Component: Hobbies },
  { id: 'contact', navLabel: 'Contact', order: 8, visible: true, Component: Contact },
].sort((a, b) => a.order - b.order)

/* Sections shown in navigation (drives nav links + scrollspy). */
export const navSections = sections.filter((s) => s.visible)
