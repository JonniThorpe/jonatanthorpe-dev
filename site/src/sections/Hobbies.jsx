import { useState } from 'react'
import Section from '../components/Section.jsx'
import { hobbies } from '../data/portfolio.js'
import './Hobbies.css'

const categories = Object.keys(hobbies)          // ['Books', 'Podcasts', 'Sport']

/* Fisher-Yates shuffle — randomizes the strip order. Computed once at module
   load, so the order is different on each visit but stable across re-renders
   (tab switches don't reshuffle / jump the strip). */
function shuffle(items) {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const allItems = shuffle(Object.values(hobbies).flat()) // every hobby, random order

/* Infinite marquee of EVERY hobby cover. Two identical halves + a -50%
   translate = a seamless loop with no visible reset (pauses on hover/focus,
   disabled under prefers-reduced-motion → manual scroll). The duplicate
   half is aria-hidden so it isn't announced twice. */
function InfiniteStrip() {
  return (
    <div className="hstrip__viewport">
      <ul className="hstrip__track" style={{ '--count': allItems.length }}>
        {allItems.concat(allItems).map((item, i) => (
          <li className="hstrip__item" key={`${item.title}-${i}`} aria-hidden={i >= allItems.length ? 'true' : undefined}>
            <figure className="cover" tabIndex={i >= allItems.length ? -1 : 0}>
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
  const [active, setActive] = useState(categories[0])

  return (
    <Section id="hobbies" eyebrow="Hobbies" title="Hobbies" wide>
      <InfiniteStrip />

      <div className="htabs" role="tablist" aria-label="Hobby categories">
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
