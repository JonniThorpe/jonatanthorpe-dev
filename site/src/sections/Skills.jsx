import { useEffect, useRef } from 'react'
import { Code2, Layers, Brain, Database, Wrench, Workflow } from 'lucide-react'
import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageProvider.jsx'
import { TECH_ICONS } from '../lib/techIcons.js'
import './Skills.css'

/* Icon map for CATEGORY icons (Languages, Frameworks, …), used as the
   fallback mark for skills without a brand logo. */
const ICONS = { Code2, Layers, Brain, Database, Wrench, Workflow }

/* Per-skill brand mark when one exists, else the category icon as a
   neutral fallback (SQL, RunPod, JBoss, Unsloth, GWT, Mockito and a few
   AI/ML terms have no logo in any icon set checked — see techIcons.js). */
function SkillIcon({ name, CategoryIcon }) {
  const brand = TECH_ICONS[name]
  if (!brand) return <CategoryIcon size={16} strokeWidth={1.5} aria-hidden="true" className="skill-item__icon" />
  return (
    <svg
      width={16} height={16} viewBox={brand.viewBox ?? '0 0 24 24'} fill="currentColor"
      aria-hidden="true" focusable="false" className="skill-item__icon skill-item__icon--brand"
      style={{ '--brand-hex': `#${brand.hex}` }}
    >
      <path d={brand.path} />
    </svg>
  )
}

/* Altitude by proficiency level (0-100, from the data) */
const TIERS = [
  { key: 'base', min: 0 },
  { key: 'halfway', min: 60 },
  { key: 'summit', min: 80 },
]
const tierOf = (level) => [...TIERS].reverse().find((t) => level >= t.min).key

/* Mountain drawing (viewBox 1000×600). On desktop it is stretched to the
   full-screen stage (preserveAspectRatio="none"), so camp positions given
   as % of the viewBox stay exactly on the trail. The trail is split at each
   camp so every segment ends on its waypoint. */
const RIDGE_BACK = 'M0,600 L0,440 C100,410 180,360 250,345 C320,330 380,365 450,350 C520,335 600,345 680,330 C740,318 780,305 820,312 C900,325 960,350 1000,360 L1000,600 Z'
const RIDGE_FRONT = 'M0,600 L0,500 C120,470 250,420 350,380 C420,350 460,300 500,270 C560,320 620,380 700,420 C740,440 770,448 810,452 C880,460 950,468 1000,475 L1000,600 Z'
const TRAIL = [
  'M30,585 C80,570 120,555 170,540',
  'M170,540 C320,500 420,540 560,505 C640,485 700,462 750,445',
  'M750,445 C700,415 650,395 610,365 C570,335 535,300 500,273',
]
const CAMPS = { base: { x: '17%', y: '90%' }, halfway: { x: '75%', y: '74.2%' }, summit: { x: '50%', y: '45.5%' } }

const DESKTOP_QUERY = '(min-width: 1101px)' // matches the nav breakpoint
const CLIMB_END = 0.6 // share of the pinned scroll spent climbing; the rest holds the summit

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* Scroll progress of the climb, written as --p on the container plus each
   segment's dashoffset (no React re-renders).
   - Desktop: the stage is sticky inside a tall wrapper; progress runs from
     the wrapper's top at mid-screen to the end of the pinned scroll, and
     finishes at CLIMB_END so the summit stays on screen afterwards.
   - Tablet/mobile: vertical trail, filled as the list passes 85% of the
     viewport height. */
function useTrailProgress(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const desktop = window.matchMedia(DESKTOP_QUERY)
    const segments = [...el.querySelectorAll('.strail__path')]
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      let p
      if (desktop.matches) {
        const stage = el.firstElementChild.offsetHeight
        const start = vh * 0.5
        const pinned = rect.height - stage
        p = clamp01(clamp01((start - rect.top) / (start + pinned - (vh - stage))) / CLIMB_END)
      } else {
        p = clamp01((vh * 0.85 - rect.top) / rect.height)
      }
      el.style.setProperty('--p', p.toFixed(3))
      segments.forEach((seg, i) => {
        seg.style.strokeDashoffset = String(1 - clamp01(p * segments.length - i))
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    desktop.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      desktop.removeEventListener('change', schedule)
      el.style.removeProperty('--p')
      segments.forEach((seg) => { seg.style.strokeDashoffset = '' })
    }
  }, [ref])
}

/* Skills — a climb that echoes the hero's mountains. Each skill sits at the
   altitude of its level: base camp (<60), halfway up (60-79) and the summit
   (80+, proven and documented). Desktop: full-width mountain pinned while
   the trail draws itself on scroll, then holds on the summit.
   Tablet/mobile: vertical trail with the summit first. */
export default function Skills() {
  const { content, ui } = useLang()
  const trailRef = useRef(null)
  useTrailProgress(trailRef)

  const byTier = { base: [], halfway: [], summit: [] }
  content.skills.forEach((group) => {
    const Icon = ICONS[group.icon] ?? Code2
    group.items.forEach((item) => byTier[tierOf(item.level)].push({ ...item, Icon }))
  })
  Object.values(byTier).forEach((list) => list.sort((a, b) => b.level - a.level))

  return (
    <Section id="skills" eyebrow={ui.skills.eyebrow} title={ui.skills.title} wide>
      <div className="strail" ref={trailRef}>
        <div className="strail__stage">
          <svg className="strail__svg" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path className="strail__ridge strail__ridge--back" d={RIDGE_BACK} />
            <path className="strail__ridge strail__ridge--front" d={RIDGE_FRONT} />
            {TRAIL.map((d) => <path key={`g-${d}`} className="strail__guide" d={d} />)}
            {TRAIL.map((d) => <path key={`p-${d}`} className="strail__path" d={d} pathLength="1" />)}
          </svg>

          <ol className="strail__camps">
            {TIERS.map(({ key }, i) => (
              <li
                key={key}
                className={`scamp scamp--${key}`}
                style={{ '--x': CAMPS[key].x, '--y': CAMPS[key].y, '--at': (i + 1) / TIERS.length }}
              >
                <span className="scamp__marker" aria-hidden="true" />
                <div className="scamp__card">
                  <h3 className="scamp__title">
                    <span className="u-mono">{ui.skills[key]}</span>
                    {ui.skills[`${key}Desc`]}
                  </h3>
                  <ul className="scamp__skills">
                    {byTier[key].map((item) => (
                      <li key={item.name} className="skill-chip">
                        <SkillIcon name={item.name} CategoryIcon={item.Icon} />
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
