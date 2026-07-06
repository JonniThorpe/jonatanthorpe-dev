/* Generates public/llms.txt from the portfolio content using the same
   buildMarkdown() the "Copy for LLM" button uses. Run via `npm run gen:llms`
   and automatically on `prebuild`, so the static file never drifts from the
   button. English content is used (primary language). */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dictionary } from '../src/i18n/strings.js'
import { buildMarkdown } from '../src/lib/portfolioSummary.js'

const here = dirname(fileURLToPath(import.meta.url))
const markdown = buildMarkdown(dictionary.en.content)
const out = resolve(here, '../public/llms.txt')

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, markdown, 'utf8')
console.log(`Wrote ${out} (${markdown.length} bytes)`)
