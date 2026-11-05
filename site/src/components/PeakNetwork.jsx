import { useEffect, useRef } from 'react'
import './PeakNetwork.css'

/* Animated network strung between the mountain peaks of the hero photo:
   sagging cables, breathing nodes and glowing signals hopping peak to peak.
   Coordinates are in pixels of hero-mountains-3840.webp (3840x2560). The SVG
   doesn't carry the photo; it overlays the CSS background in .hero__bg, so a
   <g> transform reproduces that background's cover + position math. */

const PEAKS = {
  a: [1041, 1066], b: [503, 1244], c: [467, 1329], d: [1920, 1075], e: [1642, 1175],
  f: [2655, 1085], g: [3773, 1089], h: [3473, 1089], i: [1344, 1749], j: [3575, 1797],
  k: [2780, 1302], l: [3216, 1302], m: [2429, 1411], n: [1142, 1261], o: [3734, 1286],
}
const EDGES = [
  ['b', 'c'], ['b', 'a'], ['c', 'n'], ['a', 'n'], ['a', 'd'], ['a', 'e'], ['e', 'd'], ['e', 'n'],
  ['d', 'f'], ['e', 'm'], ['f', 'k'], ['f', 'h'], ['h', 'g'], ['h', 'l'], ['k', 'l'], ['l', 'o'],
  ['g', 'o'], ['k', 'm'], ['m', 'i'], ['n', 'i'], ['m', 'j'], ['l', 'j'], ['o', 'j'],
]
const SAG = 0.1 // how much the cables droop (fraction of their length)
const SPAWN_MS = 420 // how often a new signal is fired
const HOP_CHANCE = 0.55 // chance a signal keeps travelling to a neighbour

/* Which part of the 3840 photo each background shows, and its
   background-position (Hero.css). The phone image is a crop of the same
   photo at x 826-2072, y 0-1780 (measured by matching the two files). */
const FRAMES = {
  landscape: { x: 0, y: 0, w: 3840, h: 2560, posX: 0.5, posY: 0.62 },
  portrait: { x: 826, y: 0, w: 1246, h: (1246 * 1571) / 1100, posX: 0.5, posY: 0.5 },
}
const PORTRAIT_MQ = '(max-width: 640px)'

// A sagging cable between two points, as a quadratic curve
const curve = ([x1, y1], [x2, y2]) => {
  const len = Math.hypot(x2 - x1, y2 - y1)
  return `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + len * SAG} ${x2} ${y2}`
}

const neighbours = {}
for (const [u, v] of EDGES) {
  ;(neighbours[u] ||= []).push(v)
  ;(neighbours[v] ||= []).push(u)
}

export default function PeakNetwork() {
  const svgRef = useRef(null)
  const sceneRef = useRef(null)
  const pulsesRef = useRef(null)
  const nodesRef = useRef({})

  // Keep the peaks glued to the photo: same maths as background-size: cover
  useEffect(() => {
    const svg = svgRef.current
    const mq = matchMedia(PORTRAIT_MQ)
    const fit = () => {
      const f = mq.matches ? FRAMES.portrait : FRAMES.landscape
      const { width, height } = svg.getBoundingClientRect()
      const s = Math.max(width / f.w, height / f.h)
      const ox = (width - f.w * s) * f.posX - f.x * s
      const oy = (height - f.h * s) * f.posY - f.y * s
      sceneRef.current.setAttribute('transform', `translate(${ox} ${oy}) scale(${s})`)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(svg)
    mq.addEventListener('change', fit)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', fit)
    }
  }, [])

  // Signals: built imperatively, they're short-lived decorations, not state
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const NS = 'http://www.w3.org/2000/svg'
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag)
      for (const k in attrs) n.setAttribute(k, attrs[k])
      parent.appendChild(n)
      return n
    }
    const timers = new Set()
    const later = (fn, ms) => {
      const t = setTimeout(() => { timers.delete(t); fn() }, ms)
      timers.add(t)
    }

    // Ring that expands when a signal arrives at a peak
    const ping = (id) => {
      const [x, y] = PEAKS[id]
      const c = el('circle', { cx: x, cy: y, r: 14, class: 'pnet__ping' }, nodesRef.current[id])
      c.animate([{ transform: 'scale(1)', opacity: 0.9 }, { transform: 'scale(4)', opacity: 0 }],
        { duration: 900, easing: 'ease-out' }).onfinish = () => c.remove()
    }

    // A glowing streak travelling from one peak to another
    const send = (from, to, hops = 0) => {
      const d = curve(PEAKS[from], PEAKS[to])
      const g = el('g', {}, pulsesRef.current)
      const glow = el('path', { d, class: 'pnet__pulse-glow' }, g)
      const core = el('path', { d, class: 'pnet__pulse-core' }, g)
      const L = core.getTotalLength()
      const seg = Math.min(220, L * 0.35)
      const duration = 700 + L * 1.1
      for (const p of [glow, core]) {
        p.style.strokeDasharray = `${seg} ${L + seg}`
        p.animate([{ strokeDashoffset: seg }, { strokeDashoffset: -L }],
          { duration, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' })
      }
      later(() => {
        g.remove()
        ping(to)
        if (hops < 4 && Math.random() < HOP_CHANCE) {
          const next = neighbours[to].filter((n) => n !== from)
          if (next.length) send(to, next[Math.floor(Math.random() * next.length)], hops + 1)
        }
      }, duration)
    }

    const ids = Object.keys(PEAKS)
    const fire = () => {
      if (document.hidden) return
      const from = ids[Math.floor(Math.random() * ids.length)]
      const nb = neighbours[from]
      send(from, nb[Math.floor(Math.random() * nb.length)])
    }
    const interval = setInterval(fire, SPAWN_MS)
    fire()
    fire()
    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
      pulsesRef.current?.replaceChildren()
    }
  }, [])

  return (
    <svg ref={svgRef} className="pnet" aria-hidden="true" focusable="false">
      <defs>
        <filter id="pnet-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g ref={sceneRef}>
        <g>
          {EDGES.map(([u, v]) => {
            const d = curve(PEAKS[u], PEAKS[v])
            return [
              <path key={`${u}${v}`} d={d} className="pnet__cable" />,
              <path key={`${u}${v}-flow`} d={d} className="pnet__cable-flow" />,
            ]
          })}
        </g>
        <g ref={pulsesRef} />
        <g>
          {Object.entries(PEAKS).map(([id, [x, y]]) => (
            <g key={id} ref={(n) => { nodesRef.current[id] = n }}>
              <circle cx={x} cy={y} r={18} className="pnet__halo"
                style={{ animationDelay: `${-((x * 7 + y * 13) % 320) / 100}s` }} />
              <circle cx={x} cy={y} r={10} className="pnet__node" />
              <circle cx={x} cy={y} r={4} className="pnet__node-core" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}
