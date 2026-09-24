import { Code2, Layers, Brain, Database, Wrench, Workflow } from 'lucide-react'

/* Icon map for CATEGORY icons (Languages, Frameworks, …), used as the
   fallback mark for skills without a brand logo. */
const ICONS = { Code2, Layers, Brain, Database, Wrench, Workflow }

export const categoryIcon = (name) => ICONS[name] ?? Code2

/* name → category icon, from the skills data, so a tech shows the same
   fallback mark wherever it appears (Skills, Experience…) */
export const iconsBySkill = (skills) => Object.fromEntries(
  skills.flatMap((group) => group.items.map((item) => [item.name, categoryIcon(group.icon)])),
)
