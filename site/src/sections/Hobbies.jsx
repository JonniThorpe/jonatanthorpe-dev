import Section from '../components/Section.jsx'
import { hobbies } from '../data/portfolio.js'
import './Hobbies.css'

/* One auto-rotating roulette per sub-category. The track marquees via CSS
   (pauses on hover/focus, disabled under prefers-reduced-motion — where it
   falls back to a normal horizontal scroll). Covers show at rest; the title
   reveals on hover/focus. Items are duplicated for a seamless loop; the
   duplicate copy is aria-hidden so it isn't announced twice. */
function Roulette({ label, items }) {
  return (
    <div className="roulette">
      <h3 className="roulette__label">{label}</h3>
      <div className="roulette__viewport">
        <ul className="roulette__track" style={{ '--count': items.length }}>
          {items.concat(items).map((item, i) => (
            <li
              className="roulette__item"
              key={`${item.title}-${i}`}
              aria-hidden={i >= items.length ? 'true' : undefined}
            >
              <figure className="roulette__figure" tabIndex={i >= items.length ? -1 : 0}>
                <img src={item.cover} alt={item.alt} loading="lazy" />
                <figcaption className="roulette__title">{item.title}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* Hobbies — human touch: Books, Podcasts, Sport as auto-rotating roulettes. */
export default function Hobbies() {
  return (
    <Section id="hobbies" eyebrow="Hobbies" title="Hobbies" wide>
      <div className="hobbies">
        {Object.entries(hobbies).map(([label, items]) => (
          <Roulette key={label} label={label} items={items} />
        ))}
      </div>
    </Section>
  )
}
