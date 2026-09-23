import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import './Hobbies.css'

/* Optional personal line under an item ("what I took from it") */
function Note({ text }) {
  return text ? <p className="hcard__note">“{text}”</p> : null
}

/* Compact rows (podcasts, sport): thumbnail + title + optional note */
function ItemList({ items }) {
  return (
    <ul className="hlist">
      {items.map((item) => (
        <li key={item.title} className="hlist__item">
          <img className="hlist__thumb" src={item.cover} alt="" loading="lazy" />
          <div>
            <p className="hlist__title">{item.title}</p>
            <Note text={item.note} />
          </div>
        </li>
      ))}
    </ul>
  )
}

/* Hobbies — "off the keyboard": three cards. Books lead with what's being
   read now, the rest stand on a small shelf (hover/focus lifts a book and
   shows its title). Category order in the data is books, podcasts, sport. */
export default function Hobbies() {
  const { content, ui } = useLang()
  const [books, podcasts, sport] = Object.values(content.hobbies)
  const current = books.find((b) => b.current) ?? books[books.length - 1]
  const shelf = books.filter((b) => b !== current)

  return (
    <Section id="hobbies" eyebrow={ui.hobbies.eyebrow} title={ui.hobbies.title} wide>
      <div className="hobbies">
        <article className="hcard hcard--books">
          <h3 className="hcard__label u-mono">{ui.hobbies.reading}</h3>
          <div className="hnow">
            <img className="hnow__cover" src={current.cover} alt={current.alt} loading="lazy" />
            <div>
              <p className="hnow__title">{current.title}</p>
              <Note text={current.note} />
            </div>
          </div>

          <h3 className="hcard__label u-mono">{ui.hobbies.shelf}</h3>
          <ul className="hshelf">
            {shelf.map((book) => (
              <li key={book.title} className="hshelf__book" tabIndex={0}>
                <img src={book.cover} alt={book.alt} loading="lazy" />
                <span className="hshelf__tip" role="tooltip">{book.title}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="hcard">
          <h3 className="hcard__label u-mono">{ui.hobbies.listening}</h3>
          <ItemList items={podcasts} />
        </article>

        <article className="hcard">
          <h3 className="hcard__label u-mono">{ui.hobbies.moving}</h3>
          <ItemList items={sport} />
        </article>
      </div>
    </Section>
  )
}
