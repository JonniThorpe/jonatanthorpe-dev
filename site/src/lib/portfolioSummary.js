/* Builds a structured markdown summary of the whole portfolio from the
   content object. Pure (no React/DOM) so it's shared by:
     - the "Copy for LLM" button (runtime clipboard)
     - scripts/gen-llms.mjs (build-time static /llms.txt)
   Keeping one generator means the button and llms.txt can never drift. */

export function buildMarkdown(content) {
  const { profile, about, featuredProject, projects, experience, studies, skills, hobbies } = content
  const L = []
  const push = (...lines) => L.push(...lines)

  // Header
  push(`# ${profile.name}`)
  push('')
  push(`**${profile.role}**`)
  push('')
  push(profile.focus)
  push('')
  push(`- Location: ${profile.location}`)
  push(`- Email: ${profile.email}`)
  push(`- LinkedIn: ${profile.social.linkedin}`)
  push(`- GitHub: ${profile.social.github}`)
  push(`- GitHub (alt): ${profile.social.github2}`)
  push('')

  // About
  push('## About')
  push('')
  about.paragraphs.forEach((p) => { push(p); push('') })
  if (about.note) { push(`_${about.note}_`); push('') }

  // Projects
  push('## Projects')
  push('')
  push(`### Featured: ${featuredProject.name}`)
  push('')
  push(featuredProject.tagline)
  push('')
  push(`- Stack: ${featuredProject.stack.join(', ')}`)
  push(`- Problem: ${featuredProject.problem}`)
  push(`- Approach: ${featuredProject.approach}`)
  push(`- Debugging story: ${featuredProject.story}`)
  push('- Results:')
  featuredProject.results.forEach((r) => push(`  - ${r}`))
  push('')
  projects.forEach((p) => {
    push(`### ${p.name}`)
    push('')
    push(p.summary)
    push('')
    if (p.need) push(`- Need: ${p.need}`)
    if (p.idea) push(`- Idea: ${p.idea}`)
    push(`- Stack: ${p.stack.join(', ')}`)
    push('')
  })

  // Experience
  push('## Experience')
  push('')
  experience.forEach((job) => {
    push(`### ${job.role} — ${job.company}`)
    push(`_${job.dates} · ${job.location}_`)
    push('')
    push(job.description)
    push('')
  })

  // Studies & certifications
  push('## Studies & certifications')
  push('')
  studies.forEach((s) => {
    const kind = s.type === 'certification' ? 'Certification' : 'Study'
    push(`- **${s.qualification}** (${kind}) — ${s.institution}, ${s.dates}, ${s.location}`)
  })
  push('')

  // Skills
  push('## Skills')
  push('')
  skills.forEach((g) => push(`- **${g.category}:** ${g.items.map((i) => i.name).join(', ')}`))
  push('')

  // Hobbies
  push('## Hobbies')
  push('')
  Object.entries(hobbies).forEach(([cat, items]) => {
    push(`- **${cat}:** ${items.map((i) => i.title).join(', ')}`)
  })
  push('')

  return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
