import { useReveal } from '../hooks/useReveal.js'

/* Shared section shell: semantic <section> landmark with a stable id
   (matches the navbar anchor), an accessible heading, and the fade-up
   reveal. Keeps section rhythm/heading hierarchy consistent site-wide. */
export default function Section({ id, eyebrow, title, lead, wide = false, children }) {
  const ref = useReveal()

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div ref={ref} className={`section__inner reveal${wide ? ' section__inner--wide' : ''}`}>
        {eyebrow && <p className="section__eyebrow u-mono">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="section__title">{title}</h2>
        {lead && <p className="section__lead">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
