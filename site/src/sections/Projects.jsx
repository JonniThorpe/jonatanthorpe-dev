import { useState } from 'react'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import Section from '../components/Section.jsx'
import Modal from '../components/Modal.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Projects.css'

/* Projects — bento collage: Scannet takes the large tile, the rest fill the
   grid around it. Every tile is a full-bleed screenshot with its title on top;
   the stack shows on hover. Clicking any tile opens the detail modal. */
export default function Projects() {
  const { content, ui } = useLang()
  const fp = content.featuredProject
  const t = ui.projects

  const [open, setOpen] = useState(null)
  const isFeatured = open?.id === fp.id

  const tiles = [
    { ...fp, summary: fp.tagline, featured: true },
    ...content.projects,
  ]

  return (
    <Section id="projects" eyebrow={t.eyebrow} title={t.title} wide>
      <ul className="bento">
        {tiles.map((p) => (
          <li
            key={p.id}
            id={`project-${p.id}`}
            className={`bento__item${p.featured ? ' bento__item--featured' : ''}`}
          >
            <button className="tile" onClick={() => setOpen(p)} aria-haspopup="dialog">
              <img className="tile__img" src={p.cover.src} alt={p.cover.alt} loading="lazy" />
              <span className="tile__shade" aria-hidden="true" />
              <span className="tile__body">
                {p.featured && <span className="tile__eyebrow u-mono">{t.featured}</span>}
                <span className="tile__tags">
                  {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
                </span>
                <span className="tile__title">{p.name}</span>
                <span className="tile__summary">{p.summary}</span>
              </span>
              <ArrowUpRight className="tile__arrow" size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <Modal title={open.name} onClose={() => setOpen(null)}>
          <img className="proj-modal__img" src={open.cover.src} alt={open.cover.alt} />
          {isFeatured && <p className="proj-modal__eyebrow u-mono">{t.featured}</p>}
          <h3 className="proj-modal__title">{open.name}</h3>
          <ul className="tags" aria-label={t.stack}>
            {open.stack.map((s) => <li key={s} className="tag">{s}</li>)}
          </ul>
          <p className="proj-modal__summary">{open.summary}</p>

          {isFeatured ? (
            <>
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
              <div className="proj-modal__links">
                {fp.links.map((l, i) => (
                  <a
                    key={l.label}
                    className={`btn ${i === 0 ? 'btn--primary' : 'btn--ghost'}`}
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {l.label} <ExternalLink size={16} strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              {open.need && (
                <>
                  <h4 className="case__head u-mono">{t.problem}</h4>
                  <p>{open.need}</p>
                  <h4 className="case__head u-mono">{t.approach}</h4>
                  <p>{open.idea}</p>
                </>
              )}
              {open.demo && <p className="proj-modal__demo-note">{open.demo.note}</p>}
              <div className="proj-modal__links">
                {open.demo && (
                  <a className="btn btn--primary" href={open.demo.href} target="_blank" rel="noopener noreferrer">
                    {open.demo.label} <ExternalLink size={16} strokeWidth={1.75} />
                  </a>
                )}
                <a
                  className={`btn ${open.demo ? 'btn--ghost' : 'btn--primary'}`}
                  href={open.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {open.link.label} <ExternalLink size={16} strokeWidth={1.75} />
                </a>
              </div>
            </>
          )}
        </Modal>
      )}
    </Section>
  )
}
