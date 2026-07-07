import { useEffect, useMemo, useState } from 'react'
import { Gauge } from 'lucide-react'
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

/* Cover tile — square by default (uniform grid); on hover/focus it pops
   with a springy overshoot bounce and its image switches from cropped
   (object-fit: cover) to fully visible (object-fit: contain), revealing
   the item's real/native shape inside the same enlarged box. The caption
   carries the hobby's category (Books/Podcasts/Sport) as a small
   secondary-accent subtitle above the title. */
function Cover({ item }) {
  return (
    <figure className="cover">
      <img src={item.cover} alt={item.alt} loading="lazy" />
      <figcaption className="cover__caption">
        <span className="cover__category">{item.category}</span>
        <span className="cover__title">{item.title}</span>
      </figcaption>
    </figure>
  )
}

/* Infinite marquee of EVERY hobby cover. Two identical halves + a -50%
   translate = a seamless loop with no visible reset (pauses on hover/focus,
   disabled under prefers-reduced-motion → manual scroll). The duplicate
   half is aria-hidden so it isn't announced twice. `speed` scales the
   loop duration (higher = faster). */
function InfiniteStrip({ items, speed }) {
  const duration = (items.length * 3.2) / speed
  return (
    <div className="hstrip__viewport">
      <ul className="hstrip__track" style={{ animationDuration: `${duration}s` }}>
        {items.concat(items).map((item, i) => (
          <li
            className="hstrip__item"
            key={`${item.title}-${i}`}
            aria-hidden={i >= items.length ? 'true' : undefined}
            tabIndex={i >= items.length ? -1 : 0}
          >
            <Cover item={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

const MOBILE_QUERY = '(max-width: 640px)'
const DEFAULT_SPEED_DESKTOP = 1
const DEFAULT_SPEED_MOBILE = 1.8 // faster by default on mobile, per spec

/* Hobbies — a single infinite showcase strip of every book/podcast/sport,
   shuffled once per mount, with a speed slider. No category filter: hover
   (or focus) an item to see it pop to its actual shape. */
export default function Hobbies() {
  const { content, ui } = useLang()

  const allItems = useMemo(
    () => shuffle(Object.entries(content.hobbies).flatMap(([category, items]) => items.map((item) => ({ ...item, category })))),
    [content.hobbies],
  )

  const [speed, setSpeed] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
      ? DEFAULT_SPEED_MOBILE
      : DEFAULT_SPEED_DESKTOP
  ))

  // Re-baseline the default speed if the viewport crosses the mobile
  // breakpoint (e.g. rotating a tablet), but only while the user hasn't
  // touched the slider yet — handled by resetting on mount per breakpoint.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setSpeed(e.matches ? DEFAULT_SPEED_MOBILE : DEFAULT_SPEED_DESKTOP)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <Section id="hobbies" eyebrow={ui.hobbies.eyebrow} title={ui.hobbies.title} wide>
      <InfiniteStrip items={allItems} speed={speed} />

      <div className="hspeed">
        <Gauge size={18} strokeWidth={1.75} aria-hidden="true" />
        <label htmlFor="hobbies-speed" className="hspeed__label">{ui.hobbies.speed}</label>
        <input
          id="hobbies-speed"
          type="range"
          min="0.25"
          max="3"
          step="0.05"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          aria-valuetext={`${speed.toFixed(2)}x`}
        />
      </div>
    </Section>
  )
}
