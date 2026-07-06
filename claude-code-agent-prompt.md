# Prompt for Claude Code — Portfolio Scaffold

I'm building my personal portfolio site (jonatanthorpe.dev) using Vite + React, deployed via nginx on a Hetzner VPS with GitHub Actions CI/CD.

I have three spec files that fully define this project:
1. `design-foundation.md` — color tokens (light/dark), typography, icon system, motion rules, layout rules, quality floor
2. `portfolio-sections-spec.md` — all page sections in order (Hero, About, Projects, Experience, Studies, Skills, Hobbies, Contact), each with purpose, content, and layout/behavior notes
3. `global-functionality-spec.md` — navbar social icons, language toggle (EN/ES), theme toggle (light/dark), responsiveness rules, and a "Copy for LLM" button

Read all three files fully before writing any code.

## Build order — work in this exact sequence, one stage at a time

**Stage 1 — Design foundation.** Implement the design tokens from `design-foundation.md` as code (CSS variables or Tailwind config, whichever fits the stack better) — colors for light/dark, typography (Sora/Inter/JetBrains Mono), spacing scale, icon library setup (Lucide), and the motion rules. No page content yet — just the token system, provable with a small style-preview if useful.

**Stage 2 — Layout & sections.** Scaffold every section from `portfolio-sections-spec.md` as its own component, wired into the `sections.config.js` pattern described there (so navbar order is driven by config, not hardcoded). Use realistic placeholder content, not real copy yet. Implement each section's specific layout/behavior (timeline for Experience, card-list for Studies, icon-grid + filter for Skills, hover/expand behavior for Projects, roulettes for Hobbies) — but exact real content comes later.

**Stage 3 — Global functionality.** Implement everything in `global-functionality-spec.md`: navbar social icons (LinkedIn/Instagram/GitHub), language toggle, theme toggle, mobile bottom-tab-bar-with-expanding-hamburger nav, and the "Copy for LLM" button (clipboard copy of a structured markdown summary aggregating all section content).

**Stage 4 — Content.** Do NOT do this yet — I'll provide real copy for each section separately once the above stages are reviewed and approved.

## Working mode — important
- Work through Stage 1, then STOP and show me the result before moving to Stage 2. Same for every subsequent stage — I review and approve before you continue.
- Don't skip ahead or batch stages together, even if it seems more efficient.
- If something in the specs is ambiguous, ask me rather than assuming.

## Confirm-by-Jonatan checkpoint (required after every stage)
Each stage must be built on its own feature branch (e.g. `feature/stage-1-design-foundation`, `feature/stage-2-layout`, etc.) — never directly on `main`.

At the end of each stage:
1. Stop and tell me the branch is ready.
2. I will pull/check out that branch and run the project locally to review it myself.
3. Only after I confirm it's correct do we merge that branch into `main` and move to the next stage.
4. If I flag issues, stay on the same branch and fix them — don't start the next stage until I've explicitly confirmed the current one is approved.

This applies to all four stages, including Content once we get there.

## Crawlability requirement (applies across all stages)
The "Copy for LLM" button only helps visitors who click it — but AI crawlers/search agents reading the site won't click buttons, they parse HTML. So build the site itself to be legible to those agents independent of that button:
- Semantic HTML5 throughout (proper landmark regions, one clear heading hierarchy, no div-soup)
- Descriptive alt text on all images (project screenshots, book/podcast covers, profile photo)
- ARIA labels on icon-only controls (social icons, toggles, hamburger)
- Meta description + Open Graph tags
- JSON-LD structured data (schema.org Person) summarizing candidate info
- A static `/llms.txt` file at site root mirroring the same aggregated content the "Copy for LLM" button produces, so non-JS crawlers/agents can find it via that convention too

Confirm you've read all three spec files and understood the 4-stage order and the feature-branch confirm-by-Jonatan workflow before starting Stage 1.
