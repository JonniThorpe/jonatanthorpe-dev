import { Code2 } from 'lucide-react'
import { TECH_ICONS } from '../lib/techIcons.js'
import './TechChip.css'

/* Per-skill brand mark when one exists, else the category icon as a
   neutral fallback (SQL, RunPod, JBoss, Unsloth, GWT, Mockito and a few
   AI/ML terms have no logo in any icon set checked — see techIcons.js). */
function TechIcon({ name, FallbackIcon }) {
  const brand = TECH_ICONS[name]
  if (!brand) return <FallbackIcon size={16} strokeWidth={1.5} aria-hidden="true" className="skill-item__icon" />
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

/* Pill with the tech's mark + name; rendered as a list item */
export default function TechChip({ name, FallbackIcon = Code2 }) {
  return (
    <li className="skill-chip">
      <TechIcon name={name} FallbackIcon={FallbackIcon} />
      {name}
    </li>
  )
}
