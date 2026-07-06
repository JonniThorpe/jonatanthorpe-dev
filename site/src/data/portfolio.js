/* Placeholder content for Stage 2. Realistic shape, NOT final copy —
   Jonatan provides real text in Stage 4. Structure here is what the
   section components render against, so it can stay stable while the
   words change. Names (Scannet, Indra, etc.) come from the section spec
   and are used as realistic stand-ins. */

export const profile = {
  name: 'Jonatan Thorpe Plaza',
  role: 'ML & Document-Processing Engineer',
  focus: 'Building document-intelligence systems — from data pipelines to fine-tuned models in production.',
  location: 'Spain · open to remote / international',
  openToRemote: true,
  email: 'hello@jonatanthorpe.dev',
  cvUrl: '/cv/jonatan-thorpe-cv.pdf',
  photo: {
    // Placeholder portrait — replace with real asset in Stage 4.
    src: 'https://placehold.co/480x600/1F2023/9B9892?text=Portrait',
    alt: 'Portrait photo of Jonatan Thorpe',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/placeholder',
    github: 'https://github.com/JonniThorpe',
    instagram: 'https://www.instagram.com/placeholder',
  },
}

export const about = {
  paragraphs: [
    'Placeholder bio. I work at the intersection of machine learning and document processing — extracting structure and meaning from messy, real-world documents. My path into ML started from a practical problem: too much information trapped in PDFs and scans, and not enough tooling to make it usable.',
    'I work comfortably in Spanish and English, across engineering and business conversations. Outside of models and pipelines I care about shipping things that actually reach users — and about the infrastructure underneath, which is why this very site runs on a server I provisioned and harden myself.',
  ],
  note: 'Bilingual ES / EN — comfortable in both technical and client-facing settings.',
}

export const featuredProject = {
  id: 'scannet',
  name: 'Scannet',
  tagline: 'Document-intelligence pipeline for automated scan understanding.',
  cover: {
    src: 'https://placehold.co/960x540/2B4C43/FAFAF8?text=Scannet',
    alt: 'Screenshot of the Scannet document-processing interface',
  },
  stack: ['Python', 'PyTorch', 'LoRA', 'FastAPI', 'Docker'],
  problem:
    'Placeholder: teams were manually transcribing thousands of scanned documents, with high error rates and no structured output.',
  approach:
    'Placeholder: built an OCR + layout-analysis pipeline and fine-tuned a language model with LoRA to normalise extracted fields into a structured schema.',
  story:
    'Placeholder debugging story: early runs hallucinated field values that looked plausible but were absent from the source. Traced it to the LoRA adapter over-fitting a narrow document class; fixed by rebalancing the training set and adding a source-grounding check that rejects unsupported extractions.',
  results: [
    'Placeholder: ~90% reduction in manual transcription time',
    'Placeholder: structured, queryable output replacing free-text notes',
    'Placeholder: source-grounded extraction to curb hallucinations',
  ],
  links: [
    { label: 'Case study', href: '#' },
    { label: 'Code', href: '#' },
  ],
}

export const projects = [
  {
    id: 'scada-fuxa',
    name: 'SCADA / FUXA dashboard',
    cover: { src: 'https://placehold.co/640x400/1F2023/9B9892?text=SCADA', alt: 'SCADA/FUXA monitoring dashboard screenshot' },
    summary: 'Placeholder: real-time industrial monitoring dashboard built on FUXA, visualising sensor data and alarms.',
    stack: ['FUXA', 'Node.js', 'MQTT'],
    link: { label: 'Details', href: '#' },
  },
  {
    id: 'eda-ii',
    name: 'EDA II',
    cover: { src: 'https://placehold.co/640x400/2B4C43/FAFAF8?text=EDA+II', alt: 'Exploratory data analysis project screenshot' },
    summary: 'Placeholder: exploratory data-analysis toolkit for rapid dataset profiling and visual summaries.',
    stack: ['Python', 'Pandas', 'Plotly'],
    link: { label: 'Details', href: '#' },
  },
  {
    id: 'portfolio-infra',
    name: 'Self-hosted portfolio',
    cover: { src: 'https://placehold.co/640x400/1F2023/9B9892?text=Infra', alt: 'Server infrastructure diagram screenshot' },
    summary: 'Placeholder: this site — provisioned, hardened and deployed on a bare VPS with nginx, TLS and a custom CI pipeline.',
    stack: ['nginx', 'Ubuntu', 'GitHub Actions'],
    link: { label: 'Details', href: '#' },
  },
]

export const experience = [
  {
    id: 'indra',
    company: 'Indra',
    role: 'ML Engineer',
    dates: '2023 — Present',
    location: 'Madrid, Spain',
    logo: { src: 'https://placehold.co/48x48/F1F0EC/6B6862?text=I', alt: 'Indra logo' },
    description:
      'Placeholder: work on document-processing and ML systems for enterprise clients — designing pipelines, fine-tuning models and moving prototypes into production.',
  },
  {
    id: 'all-natura',
    company: 'All Natura',
    role: 'Software Developer',
    dates: '2021 — 2023',
    location: 'Remote',
    logo: { src: 'https://placehold.co/48x48/F1F0EC/6B6862?text=A', alt: 'All Natura logo' },
    description:
      'Placeholder: built and maintained internal tooling and data workflows; first exposure to putting ML-adjacent features in front of real users.',
  },
  {
    id: 'star-group',
    company: 'Star-Group',
    role: 'Junior Developer',
    dates: '2020 — 2021',
    location: 'Spain',
    logo: { src: 'https://placehold.co/48x48/F1F0EC/6B6862?text=S', alt: 'Star-Group logo' },
    description:
      'Placeholder: started as a junior developer, learning production engineering practices and shipping features across the stack.',
  },
]

export const studies = [
  {
    id: 'degree',
    qualification: 'BSc Computer Science (placeholder)',
    institution: 'University (placeholder)',
    dates: '2016 — 2020',
    location: 'Spain',
  },
  {
    id: 'ml-specialisation',
    qualification: 'ML / Data specialisation (placeholder)',
    institution: 'Institution (placeholder)',
    dates: '2021',
    location: 'Online',
  },
]

export const skills = [
  { category: 'Backend', icon: 'Server', items: ['Python', 'Node.js', 'FastAPI', 'REST APIs'] },
  { category: 'Frontend', icon: 'Layout', items: ['React', 'Vite', 'HTML5', 'CSS'] },
  { category: 'DevOps / Cloud', icon: 'Cloud', items: ['GitHub Actions', 'nginx', 'Linux', 'VPS'] },
  { category: 'Infrastructure', icon: 'Network', items: ['Docker', 'TLS / certbot', 'DNS', 'ufw'] },
  { category: 'Databases', icon: 'Database', items: ['PostgreSQL', 'SQLite', 'Redis'] },
  { category: 'Testing', icon: 'FlaskConical', items: ['Pytest', 'Vitest', 'CI checks'] },
  { category: 'Soft Skills', icon: 'Users', items: ['Bilingual ES/EN', 'Client comms', 'Ownership'] },
]

export const hobbies = {
  Books: [
    { title: 'Book placeholder 1', cover: 'https://placehold.co/200x300/1F2023/9B9892?text=Book+1', alt: 'Cover of book placeholder 1' },
    { title: 'Book placeholder 2', cover: 'https://placehold.co/200x300/2B4C43/FAFAF8?text=Book+2', alt: 'Cover of book placeholder 2' },
    { title: 'Book placeholder 3', cover: 'https://placehold.co/200x300/1F2023/9B9892?text=Book+3', alt: 'Cover of book placeholder 3' },
    { title: 'Book placeholder 4', cover: 'https://placehold.co/200x300/2B4C43/FAFAF8?text=Book+4', alt: 'Cover of book placeholder 4' },
  ],
  Podcasts: [
    { title: 'Podcast placeholder 1', cover: 'https://placehold.co/200x200/1F2023/9B9892?text=Pod+1', alt: 'Cover of podcast placeholder 1' },
    { title: 'Podcast placeholder 2', cover: 'https://placehold.co/200x200/2B4C43/FAFAF8?text=Pod+2', alt: 'Cover of podcast placeholder 2' },
    { title: 'Podcast placeholder 3', cover: 'https://placehold.co/200x200/1F2023/9B9892?text=Pod+3', alt: 'Cover of podcast placeholder 3' },
  ],
  Sport: [
    { title: 'Padel', cover: 'https://placehold.co/200x200/2B4C43/FAFAF8?text=Padel', alt: 'Padel' },
    { title: 'Fútbol', cover: 'https://placehold.co/200x200/1F2023/9B9892?text=Futbol', alt: 'Fútbol' },
    { title: 'Walk', cover: 'https://placehold.co/200x200/2B4C43/FAFAF8?text=Walk', alt: 'Walking' },
  ],
}
