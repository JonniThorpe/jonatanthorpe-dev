/* TEMPORARY — Stage 1 token proof. Delete this file (and its use in
   App.jsx) before Stage 2. It renders the design system so it can be
   eyeballed; it is not part of the real site. */

import { useState } from 'react'
import {
  Sun, Moon, Globe, AtSign, Contact, Mail,
  Download, Copy, Menu, ExternalLink, Code2, Server, Lightbulb,
} from 'lucide-react'
import './style-preview.css'

const COLORS = [
  ['Background', '--color-bg'],
  ['Surface', '--color-surface'],
  ['Text primary', '--color-text'],
  ['Text secondary', '--color-text-secondary'],
  ['Accent primary', '--color-accent'],
  ['Accent secondary', '--color-accent-secondary'],
]

const TYPE = [
  ['--text-3xl', '3.75rem / 60', 'Hero display'],
  ['--text-2xl', '2.75rem / 44', 'Heading 1'],
  ['--text-xl', '2rem / 32', 'Heading 2'],
  ['--text-lg', '1.5rem / 24', 'Heading 3'],
  ['--text-md', '1.125rem / 18', 'Lead paragraph'],
  ['--text-base', '1rem / 16', 'Body copy'],
]

const SPACE = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-8', '--space-10', '--space-12']

const WEIGHTS = [
  ['--weight-regular', 'Regular 400'],
  ['--weight-medium', 'Medium 500'],
  ['--weight-semibold', 'Semibold 600'],
  ['--weight-bold', 'Bold 700'],
]

const ICONS = [Sun, Moon, Globe, AtSign, Contact, Mail, Download, Copy, Menu, ExternalLink, Code2, Server]

export default function StylePreview() {
  // Theme override: null = follow system, else force light/dark via [data-theme]
  const [theme, setTheme] = useState(null)

  const setMode = (mode) => {
    setTheme(mode)
    const root = document.documentElement
    if (mode) root.setAttribute('data-theme', mode)
    else root.removeAttribute('data-theme')
  }

  return (
    <main className="preview">
      <header className="preview__head">
        <div>
          <p className="u-mono">design-foundation.md · stage 1</p>
          <h1>Design foundation</h1>
          <p className="preview__lead">
            Token system proof — colors, typography, spacing, motion, icons.
            Not real content. Toggle the theme to verify the dark override.
          </p>
        </div>
        <div className="preview__theme" role="group" aria-label="Theme">
          <button className={theme === null ? 'is-active' : ''} onClick={() => setMode(null)}>System</button>
          <button className={theme === 'light' ? 'is-active' : ''} onClick={() => setMode('light')} aria-label="Light theme">
            <Sun size={16} /> Light
          </button>
          <button className={theme === 'dark' ? 'is-active' : ''} onClick={() => setMode('dark')} aria-label="Dark theme">
            <Moon size={16} /> Dark
          </button>
        </div>
      </header>

      <section className="preview__block">
        <h2>Color tokens</h2>
        <div className="swatches">
          {COLORS.map(([label, token]) => (
            <figure key={token} className="swatch">
              <div className="swatch__chip" style={{ background: `var(${token})` }} />
              <figcaption>
                <span>{label}</span>
                <code className="u-mono">{token}</code>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="preview__block">
        <h2>Typography — Sora / Inter / JetBrains Mono</h2>
        <div className="type-ramp">
          {TYPE.map(([token, size, label]) => (
            <div key={token} className="type-row">
              <span className="type-sample" style={{ fontSize: `var(${token})` }}>{label}</span>
              <code className="u-mono">{token} · {size}</code>
            </div>
          ))}
        </div>
        <div className="weights">
          {WEIGHTS.map(([token, label]) => (
            <span key={token} style={{ fontWeight: `var(${token})` }}>{label}</span>
          ))}
        </div>
        <p className="mono-sample u-mono">JetBrains Mono · 0123456789 · React · nginx · 2024–2026</p>
      </section>

      <section className="preview__block">
        <h2>Spacing scale (8px base)</h2>
        <div className="spacing">
          {SPACE.map((token) => (
            <div key={token} className="spacing-row">
              <code className="u-mono">{token}</code>
              <div className="spacing-bar" style={{ width: `var(${token})` }} />
            </div>
          ))}
        </div>
      </section>

      <section className="preview__block">
        <h2>Icons — Lucide (outline)</h2>
        <div className="icons">
          {ICONS.map((Icon, i) => <Icon key={i} size={22} strokeWidth={1.75} />)}
        </div>
      </section>

      <section className="preview__block">
        <h2>Accent secondary — in context</h2>
        <p className="preview__note">
          Reserved for subsection headers, callouts and remarkable info —
          used sparingly, never as a large fill. These are its real Stage-2+
          surfaces, shown here only to judge the shade.
        </p>
        <div className="accent2">
          <div>
            <p className="subsection-header u-mono">Problem → Approach → Results</p>
            <p>
              Sample subsection header (e.g. the Scannet case study). Inline{' '}
              <em className="mark">remarkable info</em> also uses it.
            </p>
          </div>

          <aside className="callout">
            <Lightbulb size={18} strokeWidth={1.75} />
            <p>Callout — a highlighted note that should draw the eye without a heavy fill.</p>
          </aside>

          <div className="accent-bars">
            <span className="skill">React<i /></span>
            <span className="skill">nginx<i /></span>
            <span className="skill">Docker<i /></span>
          </div>
        </div>
      </section>

      <section className="preview__block">
        <h2>Motion & elevation</h2>
        <div className="motion">
          <div className="card fade-up">
            <p className="u-mono">.fade-up</p>
            <p>Fade-up entrance (respects prefers-reduced-motion).</p>
          </div>
          <button className="btn btn--primary">Primary button <Download size={16} /></button>
          <button className="btn btn--ghost">Ghost button <ExternalLink size={16} /></button>
          <div className="card card--hover">Hover me — elevation lift</div>
        </div>
      </section>
    </main>
  )
}
