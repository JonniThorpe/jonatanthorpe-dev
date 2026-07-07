/* Bilingual dictionary.

   Shape per language:
     content — section data (from data/portfolio.js / data/portfolio.es.js)
     ui      — chrome strings (titles, labels, buttons, aria) */

import {
  profile, about, featuredProject, projects, experience, studies, skills, hobbies,
} from '../data/portfolio.js'
import {
  profile as profileEs, about as aboutEs, featuredProject as featuredProjectEs,
  projects as projectsEs, experience as experienceEs, studies as studiesEs,
  skills as skillsEs, hobbies as hobbiesEs,
} from '../data/portfolio.es.js'

const contentEn = { profile, about, featuredProject, projects, experience, studies, skills, hobbies }
const contentEs = {
  profile: profileEs, about: aboutEs, featuredProject: featuredProjectEs, projects: projectsEs,
  experience: experienceEs, studies: studiesEs, skills: skillsEs, hobbies: hobbiesEs,
}

const uiEn = {
  nav: {
    hero: 'Home', about: 'About', projects: 'Projects', experience: 'Experience',
    studies: 'Studies', skills: 'Skills', hobbies: 'Hobbies', contact: 'Contact',
  },
  hero: { downloadCv: 'Download CV', contact: 'Contact' },
  about: { eyebrow: 'About', title: 'About me' },
  projects: {
    eyebrow: 'Projects', title: 'Projects', featured: 'Featured case study',
    read: 'Read the case study', showLess: 'Show less', stack: 'Stack',
    problem: 'Problem', approach: 'Approach', story: 'Debugging story', results: 'Results',
  },
  experience: { eyebrow: 'Experience', title: 'Experience' },
  studies: { eyebrow: 'Studies & certifications', title: 'Studies & certifications' },
  skills: { eyebrow: 'Skills', title: 'Skills', all: 'All', filterLabel: 'Filter skills by category' },
  hobbies: { eyebrow: 'Hobbies', title: 'Hobbies', speed: 'Speed' },
  contact: {
    eyebrow: 'Contact', title: 'Get in touch',
    lead: 'Open to remote / international roles. The fastest way to reach me:',
    email: 'Email', linkedin: 'LinkedIn profile', cv: 'Download CV (PDF)',
  },
  actions: {
    copyLlm: 'Copy for LLM', copyLlmAria: 'Copy portfolio summary for LLM', copied: 'Copied!',
    light: 'Light', dark: 'Dark', switchLight: 'Switch to light theme', switchDark: 'Switch to dark theme',
    switchLang: 'Switch language',
  },
  navAria: { primary: 'Primary', openMenu: 'Open menu', closeMenu: 'Close menu', siteNav: 'Site navigation' },
  social: { linkedin: 'LinkedIn', instagram: 'Instagram', github: 'GitHub (JonniThorpe)', github2: 'GitHub (jtp703)' },
  footer: { rights: 'All rights reserved.', iconCredit: 'Sport photos via Wikimedia Commons.' },
  skipLink: 'Skip to content',
}

const uiEs = {
  nav: {
    hero: 'Inicio', about: 'Sobre mí', projects: 'Proyectos', experience: 'Experiencia',
    studies: 'Estudios', skills: 'Habilidades', hobbies: 'Aficiones', contact: 'Contacto',
  },
  hero: { downloadCv: 'Descargar CV', contact: 'Contacto' },
  about: { eyebrow: 'Sobre mí', title: 'Sobre mí' },
  projects: {
    eyebrow: 'Proyectos', title: 'Proyectos', featured: 'Caso de estudio destacado',
    read: 'Ver el caso de estudio', showLess: 'Ver menos', stack: 'Stack',
    problem: 'Necesidad', approach: 'Enfoque', story: 'Historia de desarrollo', results: 'Resultados',
  },
  experience: { eyebrow: 'Experiencia', title: 'Experiencia' },
  studies: { eyebrow: 'Formación académica', title: 'Formación académica' },
  skills: { eyebrow: 'Habilidades', title: 'Habilidades', all: 'Todas', filterLabel: 'Filtrar habilidades por categoría' },
  hobbies: { eyebrow: 'Aficiones', title: 'Aficiones', speed: 'Velocidad' },
  contact: {
    eyebrow: 'Contacto', title: 'Ponte en contacto',
    lead: 'Abierto a puestos remotos / internacionales. La forma más rápida de contactarme:',
    email: 'Email', linkedin: 'Perfil de LinkedIn', cv: 'Descargar CV (PDF)',
  },
  actions: {
    copyLlm: 'Copiar para LLM', copyLlmAria: 'Copiar resumen del portfolio para LLM', copied: '¡Copiado!',
    light: 'Claro', dark: 'Oscuro', switchLight: 'Cambiar a tema claro', switchDark: 'Cambiar a tema oscuro',
    switchLang: 'Cambiar idioma',
  },
  navAria: { primary: 'Principal', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', siteNav: 'Navegación del sitio' },
  social: { linkedin: 'LinkedIn', instagram: 'Instagram', github: 'GitHub (JonniThorpe)', github2: 'GitHub (jtp703)' },
  footer: { rights: 'Todos los derechos reservados.', iconCredit: 'Fotos de deporte vía Wikimedia Commons.' },
  skipLink: 'Saltar al contenido',
}

const en = { content: contentEn, ui: uiEn }
const es = { content: contentEs, ui: uiEs }

export const dictionary = { en, es }
export const DEFAULT_LANG = 'en'
export const LANGS = ['en', 'es']
