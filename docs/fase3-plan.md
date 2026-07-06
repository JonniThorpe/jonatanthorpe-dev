# Fase 3 — Plan (dinámico)

> Estado: **planificado, no iniciado.** Acordado el 2026-07-06.
> No arrancar hasta que Jonatan lo pida explícitamente. Antes va el contenido del portfolio.

## Caso de uso

El portfolio es estático y **no necesita base de datos**; se queda como está. La Fase 3
consiste en **desplegar una aplicación web propia de Jonatan en un subdominio** del mismo
VPS, conviviendo con el portfolio.

## Decisión de arquitectura: subdominio

Routing elegido: **subdominio** `app.jonatanthorpe.dev` (nombre real por decidir).
Descartados subpath (`/app`) y dominio aparte.

Razones:
- Independencia total app ↔ portfolio; cada uno con su propio certificado TLS.
- Sin conflictos con el catch-all `/` de la SPA del portfolio (`try_files … /index.html`).
- Escalable a N apps (`app2.`, `blog.`, …) sin tocar el portfolio.

### Esquema

```
Internet → nginx (reverse proxy + TLS)
   ├─ jonatanthorpe.dev / www   → estático (portfolio, sin cambios)
   └─ app.jonatanthorpe.dev     → contenedor de la app (Docker)
                                     └─ BD (p. ej. Postgres) en otro contenedor,
                                        SOLO si la app la necesita
```

## Stack

- **Docker + docker-compose** (decisión ya tomada en CLAUDE.md §3).
- **nginx** como reverse proxy, enrutando por `server_name`.
- **Base de datos** en su propio contenedor con volumen persistente **solo si la app la
  requiere** (no montar BD "porque toca" — anti-objetivo §9: no sobre-ingeniar).

## Trabajo que implicará

- Nuevo registro DNS en Porkbun para el subdominio (manual, Jonatan).
- Certificado TLS para el subdominio (certbot).
- `docker-compose.yml` para la app (+ BD si aplica), con secretos/env en el servidor
  (nunca en el repo).
- Adaptar el pipeline de CI: pasar de sincronizar ficheros estáticos a construir/desplegar
  contenedores.
- Reflejar toda la config nueva en `infra/` (reproducibilidad, §7).

## Las 3 preguntas a resolver al retomar

Definen la arquitectura concreta (si hace falta BD, qué backend, cómo se despliega):

1. **¿Qué hace la aplicación?** (a grandes rasgos)
2. **¿Ya hay código** de esa app, o se parte de cero?
3. **¿Con qué está/estará hecha?** (Node, Python, SPA + API, framework full-stack…)

## Orden de trabajo

1. **Antes de la Fase 3:** construir el **contenido y estilo del portfolio** (hoy con
   placeholders). El diseño lo lleva Jonatan (CLAUDE.md §3/§8); el agente no impone estética
   ni framework CSS, parte de sus directrices.
2. **Fase 3:** cuando Jonatan lo pida, con el plan de este documento.
