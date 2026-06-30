# CLAUDE.md — jonatanthorpe.dev

> Contexto operativo para el agente. Léelo entero antes de proponer o ejecutar nada.
> Si algo aquí choca con una petición puntual, pregunta antes de asumir.

---

## 1. Norte del proyecto

Alojar **tu portfolio web personal** (Jonatan) en un **servidor propio (VPS)**, gestionado a mano de principio a fin.

El objetivo **no es solo que la web funcione** — eso ya se hizo en Vercel. El objetivo es **aprender DevOps real y sin lock-in**: provisionar el servidor, endurecerlo, servir con nginx, gestionar TLS, DNS, firewall y un pipeline de despliegue propio, entendiendo cada capa. Toda decisión se evalúa por: ¿esto enseña la infraestructura de verdad y mantiene la portabilidad? Si una opción esconde la infra detrás de magia propietaria, **no es válida aquí** aunque sea más cómoda.

Dueño del proyecto: **Jonatan** (decide; el agente ejecuta y propone, no impone).

---

## 2. Variables del proyecto

Rellena los `<...>` a medida que se creen. No inventes valores.

```
DOMINIO          = jonatanthorpe.dev      # ya registrado en Porkbun
SERVIDOR_IP      = 167.235.151.15
SSH_USER         = deploy                 # usuario no-root que crearemos
SSH_PORT         = 22                      # (endurecible más tarde)
HETZNER_REGION   = Nuremberg (nbg1)        # CX23 sin stock en Falkenstein; nbg1 misma latencia (Alemania)
SO               = Ubuntu 24.04 LTS
GITHUB_REPO      = JonniThorpe/jonatanthorpe-dev
```

---

## 3. Decisiones ya tomadas — NO re-litigar

Estas están cerradas tras una fase de planificación. No las cuestiones salvo que aparezca un bloqueante técnico real:

- **Hosting:** VPS **Hetzner CX23** (2 vCPU / 4 GB / 40 GB, x86), Ubuntu 24.04 LTS. (El "CX22" del plan original se renombró a CX23 en Hetzner; mismas specs. Creado en Nuremberg por falta de stock en Falkenstein.)
- **Registrador / DNS:** dominio en **Porkbun**, nameservers apuntando al VPS (sin lock-in).
- **Web server:** **nginx**, configurado a mano.
- **TLS:** **Let's Encrypt** vía certbot, renovación automática.
- **Firewall / hardening:** `ufw` + `fail2ban` + `unattended-upgrades`, SSH con clave (sin password).
- **Framework del portfolio:** **Vite + React** (SPA con build estático servido por nginx; sin runtime de Node en fase 1).
- **Diseño / estilo:** lo lleva **Jonatan**. El agente NO impone framework de CSS ni rediseña; solo toca estilos si se le pide explícitamente.
- **CI/CD:** **GitHub Actions** desplegando por SSH.
- **Fase dinámica (futura):** **Docker + docker-compose**, nginx como reverse proxy.

**Prohibido reintroducir** Vercel, Netlify, Cloudflare Pages, Render, Railway ni ningún PaaS propietario. Coolify/Dokploy se valorarán **solo** en una fase posterior y de forma explícita, nunca por defecto.

---

## 4. Estructura del repositorio

Monorepo: el sitio y la infraestructura como código viven juntos y versionados.

```
jonatanthorpe-dev/
├── CLAUDE.md
├── site/                      # portfolio (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   ├── sections/         # hero, sobre-mí, proyectos, contacto…
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                # assets estáticos
│   ├── index.html
│   └── vite.config.js         # build → dist/
├── infra/
│   ├── nginx/
│   │   └── jonatanthorpe.dev.conf
│   ├── scripts/
│   │   ├── bootstrap.sh        # hardening + setup inicial del servidor
│   │   └── deploy.sh           # build local + sync al servidor
│   └── README.md               # runbook de infra
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD
└── docs/
    └── runbook.md              # comandos y procedimientos
```

---

## 5. Roadmap por fases (con Definition of Done)

Avanza **una fase a la vez**. No empieces la siguiente sin que la actual cumpla su DoD y Jonatan lo confirme.

**Fase 0 — Esqueleto local**
- Repo inicializado, Vite + React arrancado, landing con secciones (hero, sobre mí, proyectos, contacto) con contenido placeholder, build estático OK en local.
- *DoD:* `npm run build` genera `dist/` servible; repo en GitHub.

**Fase 1 — Servidor + estático en producción**
- VPS creado (manual), `bootstrap.sh` aplica usuario `deploy`, SSH por clave, `ufw`, `fail2ban`, `unattended-upgrades`.
- DNS de Porkbun apuntando a `SERVIDOR_IP` (manual). nginx sirviendo el `dist/`.
- certbot emite el certificado y configura HTTPS + renovación.
- *DoD:* `https://jonatanthorpe.dev` carga con candado válido. (Recuerda: por HSTS preload de `.dev`, **http no sirve** — el cert va antes de poder verlo en navegador.)

**Fase 2 — Despliegue automatizado**
- `deploy.yml` en GitHub Actions: en push a `main`, build + sync por SSH al servidor.
- Secretos (clave SSH de deploy, host, usuario) en **GitHub Secrets**, nunca en el repo.
- *DoD:* un push a `main` publica cambios sin tocar el servidor a mano.

**Fase 3 — Dinámico (cuando se decida)**
- Docker + docker-compose, nginx como reverse proxy hacia un backend.
- *DoD:* por definir cuando llegue el caso de uso.

---

## 6. Reparto de responsabilidades

**El agente hace** (en repo / vía comandos que propone y ejecuta tras OK):
- Código del portfolio, configs de nginx, scripts de bootstrap/deploy, workflow de CI.
- Comandos de servidor vía SSH **una vez Jonatan ha dado acceso** y confirmado el paso.

**Jonatan hace a mano** (el agente NO tiene acceso; debe guiarle paso a paso, no asumir que está hecho):
- Crear el VPS en el panel de Hetzner y pasar la `SERVIDOR_IP`.
- Configurar los registros DNS en Porkbun.
- Generar el par de claves SSH y subir la pública al servidor.
- Cargar los secretos en GitHub Secrets.

Cuando un paso dependa de una de estas acciones manuales, **párate y pídela explícitamente** antes de continuar.

---

## 7. Convenciones

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`). Mensajes en inglés, cortos.
- **nginx:** una config por sitio en `infra/nginx/`, simbólicamente enlazada a `sites-enabled`. Nada de editar a ciegas en el servidor sin reflejarlo en el repo. Al ser SPA, la config debe incluir el fallback de routing (`try_files $uri $uri/ /index.html;`) para que los deep links no den 404.
- **Seguridad:** ningún secreto, clave privada ni `.env` en el repo. La `SERVIDOR_IP` sí puede estar. Principio de mínimo privilegio en `ufw` (solo 80, 443 y SSH).
- **Reproducibilidad:** todo cambio de infra que se haga en el servidor debe quedar reflejado como código en `infra/`. El servidor no es la fuente de verdad; el repo lo es.
- **Idempotencia:** `bootstrap.sh` debe poder ejecutarse dos veces sin romper nada.

---

## 8. Cómo trabajar con Jonatan

- **Confírmate antes** de acciones destructivas o irreversibles en el servidor (borrados, cambios de firewall que puedan dejarte fuera, reescrituras grandes).
- **No añadas** dependencias, librerías, "mejoras" o contenido que no se hayan pedido. Si crees que algo aporta, propónlo en una línea y espera OK.
- **Explica el porqué** de cada paso de infra (el objetivo es aprender), pero **sin paja**: directo, técnico, en español.
- **Output estructurado.** Cuando haya varias opciones, ventajas/desventajas y una recomendación clara.
- Si una petición parece llevar a un anti-objetivo (sección 9), dilo antes de ejecutar.

---

## 9. Anti-objetivos (qué NO hacer)

- NO usar ni proponer PaaS propietario (ver sección 3).
- NO instalar Docker ni complejidad de fase 2 durante la fase 1: mantén la base limpia y entendible.
- NO ejecutar comandos destructivos en el servidor sin confirmación.
- NO meter secretos en el repositorio.
- NO sobre-ingeniar: nada de SSR, Next ni backend en fase 1. El build de Vite es estático y eso es lo que sirve nginx.
- NO asumir que un paso manual de Jonatan ya está hecho.

---

## 10. Runbook — comandos clave (referencia)

> Referencia, no script a ejecutar a ciegas. El agente adapta y confirma.

**Bootstrap del servidor (resumen de `bootstrap.sh`):**
```bash
# como root, primer acceso al VPS recién creado
adduser deploy && usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy   # copiar clave pública
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable
apt update && apt install -y nginx fail2ban
# unattended-upgrades para parches de seguridad automáticos
dpkg-reconfigure --priority=low unattended-upgrades
# endurecer SSH: PasswordAuthentication no, PermitRootLogin no  (tras verificar acceso por clave)
```

**TLS (tras DNS propagado y nginx sirviendo):**
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d jonatanthorpe.dev -d www.jonatanthorpe.dev
# certbot programa la renovación automática; verificar con: certbot renew --dry-run
```

**Deploy manual (resumen de `deploy.sh`, antes de tener CI):**
```bash
cd site && npm run build
rsync -avz --delete dist/ deploy@$SERVIDOR_IP:/var/www/jonatanthorpe.dev/
```

---

## 11. Punto de partida sugerido

Arrancar por **Fase 0** (esqueleto Astro + repo), porque tener algo desplegable simplifica validar toda la cadena de la Fase 1. Confirmar con Jonatan antes de teclear.
