/* Real content (Stage 4), English. Sourced from CV_Jonatan_Thorpe_ATS_EN.pdf.
   Spanish translation lives in ./portfolio.es.js and reuses the
   language-agnostic bits from here (images, stacks, ids, links, social). */

export const profile = {
  name: 'Jonatan Thorpe Plaza',
  role: 'Computer Engineer · Software Development · AI/ML',
  focus: 'Backend engineer building full-stack products, with hands-on experience fine-tuning language and vision models for real business problems.',
  location: 'Alhaurín el Grande, Málaga, Spain',
  openToRemote: true,
  email: 'jonnithorpe7@gmail.com',
  cvUrl: '/cv/CV_Jonatan_Thorpe_ATS_EN.pdf',
  photo: {
    src: '/profile.jpg',
    alt: 'Portrait photo of Jonatan Thorpe',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/jonatan-thorpe-plaza-2409861b4/',
    github: 'https://github.com/JonniThorpe',
    github2: 'https://github.com/jtp703',
    instagram: 'https://www.instagram.com/jonnithorpe/',
  },
}

export const about = {
  paragraphs: [
    "I'm a Computer Engineer specialised in Software Engineering, with professional experience building backend systems in Java, Spring and SQL, designing services, working with relational databases, and shipping features under Scrum. That backend foundation is what I bring to every project, from enterprise systems to small-business tools.",
    "Alongside that, I build hands-on projects in AI and Machine Learning: fine-tuning language and vision models (LoRA, PEFT, Unsloth) and integrating LLM APIs to solve real, unglamorous problems, like turning scanned receipts or WhatsApp messages into structured data. I also work across the full stack, from React/Next.js front ends to the infrastructure underneath. Taking projects to production deployment, like this very portfolio.",
  ],
  note: 'Bilingual ES / EN, comfortable in both technical and client-facing settings.',
}

export const featuredProject = {
  id: 'scannet',
  name: 'Scannet',
  tagline: 'Document-intelligence pipeline that turns purchase receipts into structured data.',
  cover: {
    src: '/projects/Scannet.webp',
    alt: 'Screenshot of the Scannet document-processing interface',
  },
  stack: ['React', 'Vite', 'Supabase', 'DeepSeek-OCR2 (fine-tuned)', 'RunPod', 'Vercel'],
  problem:
    'Digitising data from purchase receipts and tickets meant manual data entry, slow and error-prone, with no structured output to work from.',
  approach:
    'Combined an OCR pipeline with a fine-tuned vision-language model (DeepSeek-OCR2, fine-tuned and served on RunPod) to read receipts and extract structured, queryable data automatically. The app itself is a React + Vite front end backed by Supabase, deployed on Vercel, with Playwright end-to-end tests.',
  story:
    "Built as my Final Degree Project (TFG) at the University of Almería. The core challenge was getting a general-purpose vision-language model to reliably output structured fields instead of free text. Plain prompting wasn't consistent enough, which is what pushed the project toward fine-tuning on a task-specific receipt dataset.",
  results: [
    'Automated structured extraction from scanned receipts, replacing manual transcription',
    'End-to-end pipeline combining OCR, a fine-tuned VLM and a web app, deployed on Vercel with a Supabase backend',
  ],
  links: [
    { label: 'Live demo', href: 'https://tfg-sigma-five.vercel.app/', external: true },
    { label: 'Code', href: 'https://github.com/jtp703/TFG-GestionFinancia_VL_OCR', external: true },
  ],
}

export const projects = [
  {
    id: 'ai-order-automation',
    name: 'AI Order Automation',
    cover: { src: '/projects/AutomatizacionIA.webp', alt: 'AI order automation interface screenshot' },
    summary: 'Turns informal WhatsApp order messages into structured orders automatically, using the WhatsApp Web API and DeepSeek for categorisation.',
    need: 'Orders arrived as informal WhatsApp messages and required manual transcription.',
    idea: 'Capture messages via the WhatsApp Web API (Meta) and use the DeepSeek API to categorise and interpret the natural language, generating structured orders automatically.',
    stack: ['Spring Boot', 'React', 'MySQL', 'WhatsApp Web API', 'DeepSeek API', 'JWT', 'Docker'],
    link: { label: 'Code', href: 'https://github.com/jtp703/PedidosTwilio/tree/Peidilio_Refactorizaci%C3%B3n_React' },
  },
  {
    id: 'portfolio-infra',
    name: 'Self-hosted portfolio',
    cover: { src: '/projects/Portfolio.webp', alt: 'Self-hosted portfolio screenshot' },
    summary: 'This site, provisioned, hardened and deployed on a bare VPS with nginx, TLS and a custom CI pipeline.',
    need: 'Build DevOps skills hands-on in a real project running in production.',
    idea: 'Leverage my personal portfolio to self-manage the full cycle (server, TLS, CI/CD, hardening) and set it up to deploy future web apps.',
    stack: ['nginx', 'Ubuntu', 'GitHub Actions'],
    link: { label: 'Code', href: 'https://github.com/JonniThorpe/jonatanthorpe-dev' },
  },
  {
    id: 'english-academy',
    name: 'English Academy Web App',
    cover: { src: '/projects/Academia.webp', alt: 'English academy web application screenshot' },
    summary: 'Tailor-made web application to digitalise the day-to-day management of a local English academy.',
    need: 'A local English academy needed to digitalise the management of its activity.',
    idea: 'Address the real business needs of a local company with a tailor-made web application.',
    stack: ['C#', 'ASP.NET MVC', 'SQL Server'],
    link: { label: 'Code', href: 'https://github.com/JonniThorpe/AcademyWebAplication' },
  },
  {
    id: 'online-store',
    name: 'Online Store',
    cover: { src: '/projects/Eccomerce.webp', alt: 'Online store project screenshot' },
    summary: 'Full-stack e-commerce solution giving a local business its own online sales channel.',
    need: 'Give a local business its own online sales channel.',
    idea: 'Build a full-stack e-commerce solution for a small local business.',
    stack: ['Spring Boot', 'JSP', 'MySQL', 'Selenium (E2E)'],
    link: { label: 'Code', href: 'https://github.com/JonniThorpe/WebSalesAPP-JavaSpringBased' },
  },
]

export const experience = [
  {
    id: 'indra',
    company: 'Indra Producción Software',
    role: 'Junior Developer',
    dates: 'Jan 2021 - Oct 2021',
    location: 'Spain',
    logo: { src: 'https://placehold.co/48x48/F1F0EC/6B6862?text=I', alt: 'Indra logo' },
    description:
      'Backend development and maintenance in Java 8 with Spring and Oracle. Implemented unit tests with Mockito, managed databases and SQL queries, deployed on a JBoss server with GWT front-end development, and worked under Scrum with Git.',
  },
  {
    id: 'all-natura',
    company: 'All Natura S.L.',
    role: 'Web Application Developer',
    dates: 'Oct 2020 - Jan 2021',
    location: 'Spain',
    logo: { src: 'https://placehold.co/48x48/F1F0EC/6B6862?text=A', alt: 'All Natura logo' },
    description:
      'Web page design and layout, plus customisation of the Odoo CRM.',
  },
  {
    id: 'star-group',
    company: 'Star-Group',
    role: 'Developer Intern',
    dates: 'Apr 2020 - Jun 2020',
    location: 'Spain',
    logo: { src: 'https://placehold.co/48x48/F1F0EC/6B6862?text=S', alt: 'Star-Group logo' },
    description:
      'Individual development of a web application in ASP.NET, working under agile Scrum methodology.',
  },
]

/* type: 'study' (accent-primary). No certifications listed on the CV yet. */
export const studies = [
  {
    id: 'degree',
    type: 'study',
    qualification: 'BSc in Computer Engineering, Specialisation in Software Engineering',
    institution: 'University of Almería',
    dates: '2021 - 2026',
    location: 'Almería, Spain',
  },
  {
    id: 'dam',
    type: 'study',
    qualification: 'Higher Technician in Multiplatform Application Development (DAM)',
    institution: 'IES Los Montecillos',
    dates: '2018 - 2020',
    location: 'Spain',
  },
  {
    id: 'smr',
    type: 'study',
    qualification: 'Technician in Microcomputer Systems and Networks (SMR)',
    institution: 'IES Gerald Brenan',
    dates: '2016 - 2018',
    location: 'Spain',
  },
]

/* `level` (1-100) drives the Skills accent bar fill — Jonatan's real
   self-assessed proficiency per skill. */
export const skills = [
  { category: 'Languages', icon: 'Code2', items: [
    { name: 'Java', level: 100 },
    { name: 'Python', level: 80 },
    { name: 'JavaScript/TypeScript', level: 100 },
    { name: 'C#', level: 80 },
    { name: 'C++', level: 50 },
    { name: 'SQL', level: 100 },
    { name: 'HTML/CSS', level: 100 },
  ] },
  { category: 'Frameworks & Libraries', icon: 'Layers', items: [
    { name: 'Spring', level: 100 },
    { name: 'Next.js', level: 50 },
    { name: 'React', level: 80 },
    { name: 'Angular', level: 80 },
    { name: 'ASP.NET', level: 50 },
    { name: 'GWT', level: 40 },
    { name: 'Mockito', level: 70 },
  ] },
  { category: 'AI / ML', icon: 'Brain', items: [
    { name: 'LoRA', level: 90 },
    { name: 'PEFT', level: 90 },
    { name: 'Unsloth', level: 100 },
    { name: 'DeepSeek', level: 100 },
    { name: 'Gemini', level: 100 },
    { name: 'Gemma', level: 100 },
    { name: 'OCR pipelines', level: 80 },
  ] },
  { category: 'Databases', icon: 'Database', items: [
    { name: 'PostgreSQL', level: 100 },
    { name: 'MySQL', level: 100 },
    { name: 'Oracle', level: 70 },
    { name: 'Supabase', level: 70 },
  ] },
  { category: 'Tools & DevOps', icon: 'Wrench', items: [
    { name: 'Git', level: 100 },
    { name: 'Docker', level: 100 },
    { name: 'Vercel', level: 80 },
    { name: 'RunPod', level: 80 },
    { name: 'JBoss', level: 70 },
    { name: 'Maven', level: 100 },
    { name: 'LaTeX', level: 50 },
    { name: 'CI/CD', level: 100 },
  ] },
  { category: 'Methodologies', icon: 'Workflow', items: [
    { name: 'Scrum/Agile', level: 100 },
    { name: 'TDD', level: 70 },
    { name: 'Unit testing', level: 100 },
  ] },
]

/* Hobbies. Books/Podcasts use real cover art (Open Library / iTunes Search
   API, plus direct URLs Jonatan supplied where those APIs came up short).
   Sport uses real photos too (Wikimedia Commons — CC0/CC-BY, credited in
   the footer) instead of icons, which read as generic rather than
   personal. Each item carries its own `category` for the Hobbies subtitle. */
export const hobbies = {
  Books: [
    { title: 'The 7 Habits of Highly Effective People', cover: 'https://m.media-amazon.com/images/I/810oMMWrltL._AC_UF1000,1000_QL80_.jpg', alt: 'Cover of The 7 Habits of Highly Effective People' },
    { title: 'The Monk Who Sold His Ferrari', cover: 'https://covers.openlibrary.org/b/id/48817-M.jpg', alt: 'Cover of The Monk Who Sold His Ferrari' },
    { title: 'The Alchemist', cover: 'https://covers.openlibrary.org/b/id/7414780-M.jpg', alt: 'Cover of The Alchemist' },
    { title: 'The Lean Startup', cover: 'https://covers.openlibrary.org/b/id/7104760-M.jpg', alt: 'Cover of The Lean Startup' },
    { title: 'Marco Aurelio Meditations', cover: 'https://m.media-amazon.com/images/I/81DFDGzHZqL.jpg', alt: 'Cover of Meditations by Marcus Aurelius' },
    { title: 'El truco de los Ricos (currently reading)', cover: 'https://imagessl8.casadellibro.com/a/l/t5/18/9788423439218.jpg', alt: 'Cover of El truco de los Ricos' },
  ],
  Podcasts: [
    { title: 'Spicy4Tuna', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/0f/2b/d7/0f2bd77d-4309-af4c-12f3-06ea56d28bd3/mza_2881845507794056917.jpg/600x600bb.jpg', alt: 'Spicy4Tuna podcast cover' },
    { title: 'The wild project', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/f9/d1/5f/f9d15fa3-7cf2-110e-647d-c7966f292cff/mza_3972999760339797846.jpg/600x600bb.jpg', alt: 'The Wild Project (Jordi Wild) podcast cover' },
    { title: 'Tengo un plan', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/7d/d1/36/7dd1360a-ed41-0a9f-7132-c5aeb460daa9/mza_11484819718601191227.jpg/600x600bb.jpg', alt: 'Tengo un plan podcast cover' },
    { title: 'Búscate la vida', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeLBm286oCpdwrAzPa5X8OcsNrFvvmdTWIHYV9PLsPeQ&s=10', alt: 'Búscate la vida podcast cover' },
    { title: 'Lex Fridman Podcast', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/3e/e3/9c/3ee39c89-de08-47a6-7f3d-3849cef6d255/mza_16657851278549137484.png/600x600bb.jpg', alt: 'Lex Fridman Podcast cover' },
  ],
  Sport: [
    { title: 'Football', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ball%20white%20black.jpg?width=500', alt: 'Football / soccer ball' },
    { title: 'Padel', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Padel%20rackets%20and%20balls.jpg?width=500', alt: 'Padel rackets and balls' },
    { title: 'Gym', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kurzhanteln%202%20x%2015%20kg%201v2.jpg?width=500', alt: 'Dumbbells at the gym' },
    { title: 'Wal', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forest%20ranger%20walking%20through%20the%20trail%20to%20Netravati%20peak.jpg?width=500', alt: 'Person walking a forest trail' },
    { title: 'Golf', cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Golf%20ball%20with%20white%20tee%20in%20grass.jpg?width=500', alt: 'Golf ball with tee in grass' },
  ],
}
