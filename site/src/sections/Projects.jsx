import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import Section from '../components/Section.jsx'
import Modal from '../components/Modal.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Projects.css'

/* Projects — featured Scannet case study (accordion expand) as the standout,
   plus a secondary grid of cards (hover reveal on desktop, tap-to-open modal). */
export default function Projects() {
  const { content, ui } = useLang()
  const fp = content.featuredProject
  const projects = content.projects
  const t = ui.projects

  const [expanded, setExpanded] = useState(false)
  const [openProject, setOpenProject] = useState(null)

  return (
    <Section id="projects" eyebrow={t.eyebrow} title={t.title} wide>
      {/* Featured — large hero-style card, expands in place */}
      <article className={`featured${expanded ? ' is-open' : ''}`}>
        <div className="featured__media">
          <img src={fp.cover.src} alt={fp.cover.alt} loading="lazy" />
          <div className="featured__overlay">
            <ul className="tags" aria-label={t.stack}>
              {fp.stack.map((s) => <li key={s} className="tag">{s}</li>)}
            </ul>
            <p>{fp.tagline}</p>
          </div>
        </div>

        <div className="featured__body">
          <p className="featured__eyebrow u-mono">{t.featured}</p>
          <h3>{fp.name}</h3>
          <p className="featured__tagline">{fp.tagline}</p>

          <button
            className="featured__toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="scannet-detail"
          >
            {expanded ? t.showLess : t.read}
            <ChevronDown size={18} strokeWidth={1.75} className="featured__chev" />
          </button>

          <div id="scannet-detail" className="featured__detail" hidden={!expanded}>
            <h4 className="case__head u-mono">{t.problem}</h4>
            <p>{fp.problem}</p>
            <h4 className="case__head u-mono">{t.approach}</h4>
            <p>{fp.approach}</p>
            <h4 className="case__head u-mono">{t.story}</h4>
            <p>{fp.story}</p>
            <h4 className="case__head u-mono">{t.results}</h4>
            <ul className="case__results">
              {fp.results.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            <div className="featured__links">
              {fp.links.map((l) => (
                <a
                  key={l.label}
                  className="btn btn--ghost"
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {l.label} <ExternalLink size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Secondary grid */}
      <ul className="proj-grid">
        {projects.map((p) => (
          <li key={p.id}>
            <button className="proj-card" onClick={() => setOpenProject(p)} aria-haspopup="dialog">
              <span className="proj-card__media">
                <img src={p.cover.src} alt={p.cover.alt} loading="lazy" />
                <span className="proj-card__overlay">
                  <span className="tags">
                    {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
                  </span>
                </span>
              </span>
              <span className="proj-card__body">
                <span className="proj-card__title">{p.name}</span>
                <span className="proj-card__summary">{p.summary}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openProject && (
        <Modal title={openProject.name} onClose={() => setOpenProject(null)}>
          <img className="proj-modal__img" src={openProject.cover.src} alt={openProject.cover.alt} />
          <h3 className="proj-modal__title">{openProject.name}</h3>
          <ul className="tags" aria-label={t.stack}>
            {openProject.stack.map((s) => <li key={s} className="tag">{s}</li>)}
          </ul>
          <p className="proj-modal__summary">{openProject.summary}</p>
          <a className="btn btn--primary" href={openProject.link.href} target="_blank" rel="noopener noreferrer">
            {openProject.link.label} <ExternalLink size={16} strokeWidth={1.75} />
          </a>
        </Modal>
      )}
    </Section>
  )
}
