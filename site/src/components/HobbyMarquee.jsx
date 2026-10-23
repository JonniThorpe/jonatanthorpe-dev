import './HobbyMarquee.css'

const KINDS = ['book', 'podcast', 'sport'] // matches the data order: books, podcasts, sport

/* Endless strip of hobby covers (books, podcasts, sport). Two identical
   lists sit side by side and both slide -100%: when the first has fully
   left, the copy is exactly where it started, so the loop has no seam. The
   second list is a visual duplicate, hidden from screen readers. Hovering
   an item reveals which kind of hobby it is. */
export default function HobbyMarquee({ hobbies, tagline, kindLabels }) {
  /* Interleave the categories so the strip alternates book/podcast/sport */
  const groups = Object.values(hobbies).map((items, g) =>
    items.map((item) => ({ ...item, kind: KINDS[g] })),
  )
  const items = Array.from({ length: Math.max(...groups.map((g) => g.length)) })
    .flatMap((_, i) => groups.map((g) => g[i]).filter(Boolean))

  const list = (copy) => (
    <ul className="hmarquee__list" key={copy} aria-hidden={copy ? 'true' : undefined}>
      {items.map((item) => (
        <li key={item.title} className={`hmarquee__item hmarquee__item--${item.kind}`}>
          <span className="hmarquee__media">
            <img src={item.cover} alt="" loading="lazy" />
          </span>
          <span className="hmarquee__text">
            <span className="hmarquee__kind u-mono">{kindLabels[item.kind]}</span>
            <span className="hmarquee__name u-mono">{item.title}</span>
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="hmarquee">
      <p className="hmarquee__tagline u-mono">{tagline}</p>
      <div className="hmarquee__viewport">
        <div className="hmarquee__track">{[0, 1].map(list)}</div>
      </div>
    </div>
  )
}
