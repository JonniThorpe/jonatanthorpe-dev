/* Bilingual dictionary. English is authored now; Spanish (`es`) mirrors it
   as a stub until Stage 4 supplies real translations — at which point only
   this file changes (build `contentEs` / `uiEs` and point `es` at them).

   Shape per language:
     content — section data (from portfolio.js)
     ui      — chrome strings (titles, labels, buttons, aria) */

import {
  profile, about, featuredProject, projects, experience, studies, skills, hobbies,
} from '../data/portfolio.js'

const contentEn = { profile, about, featuredProject, projects, experience, studies, skills, hobbies }

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
  hobbies: { eyebrow: 'Hobbies', title: 'Hobbies', categoriesLabel: 'Hobby categories' },
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
  social: { linkedin: 'LinkedIn', instagram: 'Instagram', github: 'GitHub' },
  footer: { rights: 'All rights reserved.' },
  skipLink: 'Skip to content',
}

const en = { content: contentEn, ui: uiEn }
const es = en // STUB — mirrors English until Stage 4. Do not translate placeholders.

export const dictionary = { en, es }
export const DEFAULT_LANG = 'en'
export const LANGS = ['en', 'es']
