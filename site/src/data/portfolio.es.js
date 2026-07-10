/* Real content (Stage 4), Spanish. Sourced from CV_Jonatan_Thorpe_ATS_ES.pdf.
   Reuses language-agnostic bits (photo, socials, covers, stacks, ids, links,
   dates) from ./portfolio.js and overrides text fields with the ES copy. */

import {
  profile as profileEn,
  featuredProject as featuredEn,
  projects as projectsEn,
  experience as experienceEn,
  studies as studiesEn,
  skills as skillsEn,
  hobbies as hobbiesEn,
} from './portfolio.js'

export const profile = {
  ...profileEn,
  role: 'Ingeniero Informático · Desarrollo de Software · IA/ML',
  focus: 'Ingeniero backend con experiencia en desarrollo de productos full-stack, con experiencia práctica en fine-tuning de modelos de lenguaje y visión para problemas reales de negocio.',
  cvUrl: '/cv/CV_Jonatan_Thorpe_ATS_ES.pdf',
}

export const about = {
  paragraphs: [
    'Soy Ingeniero Informático especializado en Ingeniería del Software, con experiencia profesional construyendo sistemas backend en Java, Spring y SQL, diseñando servicios, trabajando con bases de datos relacionales y entregando funcionalidades bajo Scrum. Esa base backend es lo que aporto a cada proyecto, desde sistemas de empresa hasta herramientas para pequeños negocios.',
    'Además, desarrollo proyectos prácticos de IA y Machine Learning: fine-tuning de modelos de lenguaje y visión (LoRA, PEFT, Unsloth) e integración de APIs de LLM para resolver problemas reales y poco vistosos, como convertir recibos escaneados o mensajes de WhatsApp en datos estructurados. También trabajo en todo el stack, desde interfaces en React/Next.js hasta la infraestructura de debajo. Llevando proyectos a despliegue en producción, como este mismo portfolio.',
  ],
  note: 'Bilingüe ES / EN, cómodo tanto en entornos técnicos como de cara al cliente.',
}

export const featuredProject = {
  ...featuredEn,
  tagline: 'Pipeline de inteligencia documental que convierte recibos de compra en datos estructurados.',
  problem:
    'Digitalizar los datos de recibos y tickets de compra implicaba entrada manual, lento y propenso a errores, sin ninguna salida estructurada con la que trabajar.',
  approach:
    'Combiné un pipeline de OCR con un modelo de visión-lenguaje afinado (DeepSeek-OCR2, afinado y servido en RunPod) para leer recibos y extraer datos estructurados y consultables de forma automática. La aplicación en sí es un frontend en React + Vite respaldado por Supabase, desplegado en Vercel, con tests end-to-end en Playwright.',
  story:
    'Desarrollado como mi Trabajo Fin de Grado (TFG) en la Universidad de Almería. El reto principal fue conseguir que un modelo de visión-lenguaje de propósito general devolviera de forma fiable campos estructurados en lugar de texto libre. El prompting a secas no era lo bastante consistente, lo que llevó el proyecto hacia el fine-tuning sobre un dataset de recibos específico para la tarea.',
  results: [
    'Extracción estructurada automatizada de recibos escaneados, sustituyendo la transcripción manual',
    'Pipeline de principio a fin combinando OCR, un VLM afinado y una aplicación web, desplegado en Vercel con backend en Supabase',
  ],
  links: [
    { label: 'Demo en vivo', href: 'https://tfg-sigma-five.vercel.app/', external: true },
    { label: 'Código', href: 'https://github.com/jtp703/TFG-GestionFinancia_VL_OCR', external: true },
  ],
}

export const projects = [
  {
    ...projectsEn[0],
    name: 'Automatización de Pedidos con IA',
    summary: 'Convierte mensajes informales de pedidos por WhatsApp en pedidos estructurados de forma automática, usando la API de WhatsApp Web y DeepSeek para la categorización.',
    need: 'Los pedidos llegaban como mensajes informales de WhatsApp y requerían transcripción manual.',
    idea: 'Capturar los mensajes con la API de WhatsApp Web (Meta) y usar la API de DeepSeek para categorizar e interpretar el lenguaje natural, generando pedidos estructurados de forma automática.',
    link: { label: 'Código', href: projectsEn[0].link.href },
  },
  {
    ...projectsEn[3],
    name: 'Tienda de Venta Online',
    summary: 'Solución de e-commerce full-stack que da a un negocio local su propio canal de venta online.',
    need: 'Dar a un negocio local su propio canal de venta online.',
    idea: 'Construir una solución de e-commerce full-stack para un pequeño negocio local.',
    link: { label: 'Código', href: projectsEn[1].link.href },
  },
  {
    ...projectsEn[2],
    name: 'Aplicación Web para Academia de Inglés',
    summary: 'Aplicación web a medida para digitalizar la gestión diaria de una academia de inglés local.',
    need: 'Una academia de inglés local necesitaba digitalizar la gestión de su actividad.',
    idea: 'Abordar las necesidades reales de negocio de una empresa local con una aplicación web a medida.',
    link: { label: 'Código', href: projectsEn[2].link.href },
  },
  {
    ...projectsEn[1],
    name: 'Portfolio autoalojado',
    summary: 'Este sitio, provisionado, endurecido y desplegado en un VPS desnudo con nginx, TLS y un pipeline de CI propio.',
    need: 'Desarrollar habilidades de DevOps de forma práctica en un proyecto real en producción.',
    idea: 'Usar mi portfolio personal para autogestionar todo el ciclo (servidor, TLS, CI/CD, hardening) y dejarlo preparado para desplegar futuras aplicaciones web.',
    link: { label: 'Código', href: projectsEn[3].link.href },
  },
]

export const experience = [
  {
    ...experienceEn[0],
    role: 'Programador Junior',
    location: 'España',
    description:
      'Desarrollo y mantenimiento backend en Java 8 con Spring y Oracle. Implementación de tests unitarios con Mockito, gestión de bases de datos y consultas SQL, despliegue en servidor JBoss con desarrollo de interfaz en GWT, y trabajo bajo metodología Scrum con Git.',
  },
  {
    ...experienceEn[1],
    role: 'Desarrollador de Aplicaciones Web',
    location: 'España',
    description: 'Diseño y maquetación de páginas web, además de personalización del CRM Odoo.',
  },
  {
    ...experienceEn[2],
    role: 'Programador en Prácticas',
    location: 'España',
    description: 'Desarrollo individual de una aplicación web en ASP.NET, trabajando bajo metodología ágil Scrum.',
  },
]

export const studies = [
  {
    ...studiesEn[0],
    qualification: 'Grado en Ingeniería Informática, Especialización en Ingeniería del Software',
    institution: 'Universidad de Almería',
    location: 'Almería, España',
  },
  {
    ...studiesEn[1],
    qualification: 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
    location: 'España',
  },
  {
    ...studiesEn[2],
    qualification: 'Técnico en Sistemas Microinformáticos y Redes (SMR)',
    location: 'España',
  },
]

export const skills = [
  { ...skillsEn[0], category: 'Lenguajes' },
  { ...skillsEn[1], category: 'Frameworks y Librerías' },
  { ...skillsEn[2], category: 'IA / ML' },
  { ...skillsEn[3], category: 'Bases de datos' },
  { ...skillsEn[4], category: 'Herramientas y DevOps' },
  { ...skillsEn[5], category: 'Metodologías' },
]

export const hobbies = {
  Libros: [
    { ...hobbiesEn.Books[0], title: 'Los 7 hábitos de la gente altamente efectiva' },
    { ...hobbiesEn.Books[1], title: 'El monje que vendió su Ferrari' },
    { ...hobbiesEn.Books[2], title: 'El Alquimista' },
    { ...hobbiesEn.Books[3], title: 'El método Lean Startup' },
    { ...hobbiesEn.Books[4], title: 'Meditaciones de Marco Aurelio' },
    { ...hobbiesEn.Books[5], title: 'El truco de los Ricos (actualmente leyendo)' },
  ],
  Podcasts: hobbiesEn.Podcasts,
  Sport: [
    { title: 'Fútbol', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ball%20white%20black.jpg?width=500', alt: 'Football / soccer ball' },
    { title: 'Padel', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Padel%20rackets%20and%20balls.jpg?width=500', alt: 'Padel rackets and balls' },
    { title: 'Gimnasio', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kurzhanteln%202%20x%2015%20kg%201v2.jpg?width=500', alt: 'Dumbbells at the gym' },
    { title: 'Andar', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forest%20ranger%20walking%20through%20the%20trail%20to%20Netravati%20peak.jpg?width=500', alt: 'Person walking a forest trail' },
    { title: 'Golf', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Golf%20ball%20with%20white%20tee%20in%20grass.jpg?width=500', alt: 'Golf ball with tee in grass' },
  ],
}
