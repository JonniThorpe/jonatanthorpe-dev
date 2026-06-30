# jonatanthorpe.dev

Portfolio web personal de Jonatan, autoalojado en un VPS gestionado a mano.
El objetivo del proyecto es aprender DevOps real y sin lock-in (provisión,
hardening, nginx, TLS, DNS, firewall y pipeline de despliegue propio).

Monorepo: el sitio (`site/`) y la infraestructura como código (`infra/`)
viven juntos y versionados. Ver [`CLAUDE.md`](./CLAUDE.md) para el contexto
completo, las decisiones tomadas y el roadmap por fases.

## Estructura

```
site/    Portfolio (Vite + React, build estático)
infra/   nginx, scripts de bootstrap/deploy (próximas fases)
docs/    Runbook y procedimientos
```

## Desarrollo (site/)

Requiere **Node 22 LTS** (Vite 8 exige Node ≥ 20.19 / 22.12).

```bash
cd site
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # build estático → dist/
npm run preview  # previsualizar el build
```

## Fase actual

**Fase 0 — Esqueleto local.** Landing con secciones placeholder
(hero, sobre mí, proyectos, contacto). El diseño lo lleva Jonatan.
