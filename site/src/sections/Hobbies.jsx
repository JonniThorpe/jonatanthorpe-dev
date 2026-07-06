import { useMemo, useState } from 'react'
import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Hobbies.css'

/* Fisher-Yates shuffle — randomizes the strip order. */
function shuffle(items) {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* Infinite marquee of EVERY hobby cover. Two identical halves + a -50%
   translate = a seamless loop with no visible reset (pauses on hover/focus,
   disabled under prefers-reduced-motion → manual scroll). The duplicate
   half is aria-hidden so it isn't announced twice. */
function InfiniteStrip({ items }) {
  return (
    <div className="hstrip__viewport">
      <ul className="hstrip__track" style={{ '--count': items.length }}>
        {items.concat(items).map((item, i) => (
          <li className="hstrip__item" key={`${item.title}-${i}`} aria-hidden={i >= items.length ? 'true' : undefined}>
            <figure className="cover" tabIndex={i >= items.length ? -1 : 0}>
              <img src={item.cover} alt={item.alt} loading="lazy" />
              <figcaption className="cover__title">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Hobbies — infinite showcase strip on top; category tabs (Books default)
   expand below into a static grid of that category's items with titles. */
export default function Hobbies() {
  const { content, ui } = useLang()
  const hobbies = content.hobbies
  const categories = Object.keys(hobbies)

  // Random order, computed once per mount (stable across tab switches).
  const allItems = useMemo(() => shuffle(Object.values(hobbies).flat()), [hobbies])
  const [active, setActive] = useState(categories[0])

  return (
    <Section id="hobbies" eyebrow={ui.hobbies.eyebrow} title={ui.hobbies.title} wide>
      <InfiniteStrip items={allItems} />

      <div className="htabs" role="tablist" aria-label={ui.hobbies.categoriesLabel}>
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            id={`htab-${cat}`}
            aria-selected={active === cat}
            aria-controls={`hpanel-${cat}`}
            className={`htab${active === cat ? ' is-active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div id={`hpanel-${active}`} role="tabpanel" aria-labelledby={`htab-${active}`} className="hpanel">
        <ul className="hgrid">
          {hobbies[active].map((item) => (
            <li key={item.title}>
              <figure className="cover cover--static">
                <img src={item.cover} alt={item.alt} loading="lazy" />
              </figure>
              <p className="hgrid__title">{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
