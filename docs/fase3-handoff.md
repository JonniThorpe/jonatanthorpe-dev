# Fase 3 — Handoff para el agente que despliega `app.jonatanthorpe.dev`

> Documento de traspaso. Contiene el **estado real** de la infraestructura (verificado
> contra el repo el 2026-08-01) y el **encargo** de la Fase 3.
> El plan de arquitectura está en [`fase3-plan.md`](./fase3-plan.md); las reglas del
> proyecto, en `CLAUDE.md` (raíz). **Léelos ambos enteros antes de tocar nada.**

---

## 0. Encargo en una frase

Desplegar **PedidosAutomatizados** (app propia de Jonatan, repo aparte) en
`app.jonatanthorpe.dev`, en el **mismo VPS** que ya sirve el portfolio estático, con
Docker Compose detrás del **nginx que ya existe**, con TLS propio del subdominio,
**sin tocar el portfolio** y dejando la config del servidor reflejada en `infra/`.

---

## 1. La aplicación

**Qué es:** panel de gestión de pedidos por WhatsApp para fruterías. Los clientes mandan
el pedido por WhatsApp (texto o foto), la app los recibe **por webhook de Meta**, los
persiste y los muestra en un panel web donde el operador responde sin salir del navegador.
**Multi-tenant**, con aislamiento por operador.

**Estado:** código **listo para producción**, no un esqueleto. 27 tests en verde, esquema
gobernado por **Flyway** (6 migraciones), tres fases de trabajo cerradas. Lo único
pendiente es el despliegue.

**Repo:** `github.com/JonniThorpe/PedidosAutomatizados` — **privado y separado** del
monorepo del portfolio. No se fusiona: se despliega como servicio independiente.

### Stack

| Capa | Detalle |
|---|---|
| Backend | Spring Boot (Java 17 JRE en runtime), API en **8080**, atada a loopback |
| Frontend | React 19, Vite 7, TypeScript, TailwindCSS 3, axios, react-router |
| Base de datos | **MySQL 8.4** en contenedor, volumen `mysql_data`, **sin puerto publicado** (solo red interna de compose) |
| Ficheros | Adjuntos de WhatsApp en disco, volumen `media_data`. No se re-piden a Meta; se purgan a los ~30 días |
| Orquestación | `docker compose`, perfil `prod`. Servicios: `db`, `springboot`, `web` (Caddy), `backup` (copia diaria) |
| Build | Docker multi-etapa. Backend: Maven → JRE 17. Frontend: Node 22 → imagen Caddy con el `dist`. **En el servidor no hace falta ni Java ni Node** |

**Reparto de rutas (interno, lo hace Caddy):** `/api/*` → backend; el resto → estático del
frontend con fallback a `index.html`.

### Dos requisitos que condicionan la infraestructura

1. **HTTPS es requisito funcional, no una mejora.** Meta **no entrega webhooks a URLs sin
   TLS**. Sin certificado válido en `app.jonatanthorpe.dev`, la app no recibe pedidos.
2. **SSE en tiempo real.** El panel se actualiza por `text/event-stream` en
   `/api/sse/stream`. **Cualquier proxy por delante debe ir sin buffering en esa ruta**
   o el tiempo real deja de funcionar. Ver §5.

### Limitación asumida

Los *emitters* de SSE se guardan **en memoria** → **una sola instancia**. No hay escalado
horizontal ni despliegue *rolling*: cada deploy corta las conexiones SSE abiertas (los
clientes reconectan solos). Se acepta y se documenta; no se intenta arreglar en esta fase.

---

## 2. DECISIÓN CRÍTICA — quién es el dueño de los puertos 80/443

**El conflicto es real.** El compose de la app asume que su **Caddy** es dueño de 80 y 443
(+443/udp para HTTP/3). Pero el portfolio **vive en este mismo VPS** y **nginx ya ocupa
esos puertos**, con certificado emitido y renovación automática funcionando. Los dos no
pueden escuchar ahí: el segundo en arrancar falla con *address already in use*.

### Resolución adoptada: **nginx sigue siendo el único front door**

```
Internet :443 ──► nginx (TLS, certbot)
                    ├─ jonatanthorpe.dev / www  → estático del portfolio (SIN CAMBIOS)
                    └─ app.jonatanthorpe.dev    → proxy_pass 127.0.0.1:8081
                                                     │
                                                     └─► Caddy (contenedor `web`)
                                                           ├─ /api/*  → springboot:8080
                                                           └─ resto   → dist/ + index.html
                                                                          │
                                                                          └─ db (MySQL, red interna)
```

**Qué cambia en el repo de la app** (mínimo, un solo punto de costura):
- El servicio `web` deja de publicar `80:80` / `443:443` y publica **`127.0.0.1:8081:80`**.
- El Caddyfile pasa de dirección de sitio con dominio (que dispara ACME automático) a
  **`:80`** (o `http://`), con **`auto_https off`**. Caddy deja de gestionar certificados:
  el TLS lo termina nginx. **Caddy sigue haciendo su reparto `/api/*` vs. estático** — su
  routing interno no se toca.
- Se añade `trusted_proxies` para que la IP real del cliente llegue bien desde nginx.
- Spring Boot: `server.forward-headers-strategy` activo, para que respete
  `X-Forwarded-Proto: https` al generar URLs y validar el webhook.

**Consecuencia aceptada:** se pierde **HTTP/3** (443/udp), porque lo aportaba Caddy y
nginx del sistema no lo sirve. Irrelevante para el caso de uso; `ufw` se queda tal cual
en 22/80/443 tcp, sin abrir UDP.

### Por qué no las otras dos opciones

| Opción | Veredicto |
|---|---|
| **Caddy único al frente sirviendo ambos sitios** | ❌ nginx es decisión cerrada en `CLAUDE.md` §3, la config del portfolio y su certbot ya funcionan, y migrarlo a Caddy es reescribir la Fase 1 entera para no ganar nada. Además el objetivo del proyecto es entender nginx a mano. |
| **Servidor aparte para la app** | ❌ Coste extra y contradice el encargo de la Fase 3 (convivencia en el mismo VPS). Se reconsideraría solo si los recursos se quedan cortos de verdad. |

**Un único punto de terminación TLS** es además lo más sano: un solo sitio donde miran los
certificados, un solo certbot, un solo lugar donde depurar cabeceras.

---

## 3. Estado actual de la infraestructura (Fases 1 y 2, COMPLETADAS)

### Servidor

| Dato | Valor |
|---|---|
| Proveedor | Hetzner Cloud, CX23 (2 vCPU / 4 GB RAM / 40 GB disco), Nuremberg (nbg1) |
| SO | Ubuntu 24.04 LTS |
| IP pública | `167.235.151.15` (IPv4; el server tiene también IPv6) |
| Usuario de trabajo | `deploy` (grupo `sudo`, **NOPASSWD** vía `/etc/sudoers.d/deploy`) |
| Acceso SSH | **solo por clave**, puerto 22. `PermitRootLogin no`, `PasswordAuthentication no` |
| Huella del host | `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBOGZSjgc/uQYEwE+as6kVBEq6Odg9ZA7TIIyrylHiNX` |
| Firewall | `ufw`: **solo** OpenSSH, 80/tcp, 443/tcp |
| Endurecido con | `fail2ban` (jail sshd) + `unattended-upgrades` |

Aprovisionado por `infra/scripts/bootstrap.sh` (idempotente, re-ejecutable).

### Web / TLS

- **nginx** de apt; config del sitio en `/etc/nginx/sites-available/jonatanthorpe.dev.conf`,
  enlazada a `sites-enabled`; el sitio `default` fue desenlazado.
- Fuente de verdad: `infra/nginx/jonatanthorpe.dev.conf`.
- Raíz del estático: `/var/www/jonatanthorpe.dev` (propiedad de `deploy`).
- **certbot + `python3-certbot-nginx`** ya instalados. Certificado emitido para apex y www;
  renovación automática por systemd timer.
- El bloque `:80` actual hace 301 → https **solo** para apex y www, y `return 404` para el
  resto. `app.…` necesita **su propio bloque**.

### CI/CD del portfolio (Fase 2)

- `.github/workflows/deploy.yml`: push a `main` que toque `site/**` → build + `rsync` a
  `/var/www/jonatanthorpe.dev`. Secreto: `SSH_PRIVATE_KEY` (clave `deploy_ci`).
  Concurrency group `deploy-production`.

### Lo que **NO** existe todavía en el servidor

Docker, docker-compose, el registro DNS de `app`, ningún certificado que no sea apex+www,
ningún puerto abierto más allá de 22/80/443.

---

## 4. Reglas del proyecto que el agente DEBE respetar

Resumen operativo; el detalle en `CLAUDE.md` §3, §7, §8, §9.

1. **Sin PaaS propietario.** Vercel, Netlify, Cloudflare Pages, Render, Railway: prohibidos.
   El objetivo es aprender la infra a mano, sin lock-in.
2. **El repo es la fuente de verdad.** Reparto de responsabilidades entre repos:
   - Config de **nginx del subdominio, scripts del servidor y runbook** → **monorepo**
     (`infra/`, `docs/`), porque son config del servidor y del dominio.
   - **Dockerfile, docker-compose, Caddyfile, workflow de deploy de la app** → **repo
     `PedidosAutomatizados`**, porque son de la aplicación.
   - Ambos documentan la costura (el `127.0.0.1:8081`) para que nadie la rompa por accidente.
3. **Idempotencia** en los scripts de servidor.
4. **Cero secretos en los repos.** Contraseña de MySQL, token de Meta, app secret y verify
   token viven en el servidor con `chmod 600`, o en GitHub Secrets. Nunca commiteados.
5. **Mínimo privilegio en `ufw`:** no abrir puertos nuevos (ver aviso Docker/ufw en §5).
6. **No sobre-ingeniar.** Sin Kubernetes, sin Traefik, sin Coolify/Dokploy, sin réplicas.
7. **No tocar el portfolio.** Ver §8.
8. **Confirmar antes de acciones destructivas o irreversibles** (firewall, SSH, borrados,
   reinicios). Nunca dejar a Jonatan fuera del servidor.
9. **Pasos manuales de Jonatan:** DNS en Porkbun, GitHub Secrets, tokens, panel de Hetzner,
   configuración del webhook en Meta. El agente **no tiene acceso**: se para y los pide.
   **No asumir que ya están hechos.**
10. **Comunicación:** español, técnico y directo, explicando el *porqué* de cada paso de
    infra (el objetivo es aprender). Varias opciones → pros/contras y recomendación clara.
11. **Commits:** Conventional Commits, en inglés, cortos. Rama de feature, nunca a `main`.

---

## 5. Trampas conocidas (léelas, ahorran horas)

**Específicas de esta app:**

- **SSE y buffering.** `location /api/sse/stream` en nginx necesita, sí o sí:
  `proxy_buffering off;`, `proxy_cache off;`, `gzip off;`, `proxy_http_version 1.1;`,
  `proxy_set_header Connection "";` y un `proxy_read_timeout` largo (p. ej. `3600s`) —
  si no, nginx corta la conexión al minuto y el panel deja de actualizarse. Lo ideal es
  que además el backend emita `X-Accel-Buffering: no`. **Caddy no hace buffering por
  defecto**, así que el eslabón a vigilar es nginx.
- **Webhook de Meta.** Solo entrega a **443 con TLS válido** (Let's Encrypt sirve). La
  verificación inicial es un `GET` con `hub.challenge` que debe responder en claro.
  La firma `X-Hub-Signature-256` se calcula sobre el **cuerpo exacto**: nginx no debe
  alterar el body (nada de módulos de reescritura de contenido). Ajustar
  `client_max_body_size` si llegan adjuntos por el webhook.
- **Orden de arranque.** Flyway migra al levantar el backend: `depends_on` con
  `condition: service_healthy` sobre `db`, o el primer arranque falla.
- **Una sola instancia** (SSE en memoria): el deploy implica micro-corte. No configurar
  réplicas ni balanceo.

**Del servidor compartido:**

- **Docker se salta `ufw`.** Docker escribe reglas en `iptables` por delante de ufw: un
  puerto publicado como `-p 8081:80` queda **expuesto a internet aunque ufw diga que está
  cerrado**. Por eso **todo se publica en `127.0.0.1:`**. MySQL, ningún puerto.
- **El bloque `:80` actual devuelve 404** a cualquier host que no sea apex/www. Sin un
  `server` con `server_name app.…` en el 80, el reto ACME falla.
- **DNS antes que certbot.** Pedir el cert sin DNS propagado quema intentos contra el rate
  limit de Let's Encrypt.
- **RAM: 4 GB, y ahora hay JVM + MySQL 8.4 + nginx.** Es el riesgo real de esta fase.
  MySQL de fábrica reserva alegremente y la JVM sin tope se expande: hay que **fijar límites
  de memoria en compose**, **acotar el heap de la JVM** (`-XX:MaxRAMPercentage`), y ajustar
  `innodb_buffer_pool_size`. Recomendable **crear un swapfile de 2 GB** (los CX de Hetzner
  vienen sin swap) como red de seguridad: sin él, el OOM killer puede matar nginx y tirar
  también el portfolio.
- **Disco: 40 GB**, y ahora crecen `media_data`, `mysql_data`, los backups diarios y las
  imágenes de Docker. Hace falta **retención de backups**, rotación de logs de Docker
  (`max-size`/`max-file`) y `docker image prune` periódico. Disco lleno = nginx roto =
  portfolio caído **y** renovación de certificados fallida.
- **`deploy` tiene sudo sin password** y estará en el **grupo `docker`**: eso equivale a
  root. Comprometer la app compromete el host, portfolio incluido. Se asume, pero se dice
  en voz alta.

---

## 6. Trabajo a realizar (una fase a la vez, con checkpoint de Jonatan)

**Paso 1 — DNS (manual, Jonatan).** Registro `A` en Porkbun: host `app` → `167.235.151.15`
(+ `AAAA` si se quiere IPv6). Verificar con `nslookup app.jonatanthorpe.dev` **antes** de
tocar certbot.

**Paso 2 — Docker en el servidor.** Docker Engine + plugin `compose` desde el repositorio
oficial de Docker (no el `docker.io` de Ubuntu). Añadir `deploy` al grupo `docker`. Crear
el swapfile de 2 GB. Todo como `infra/scripts/docker-setup.sh` **idempotente**, en el
monorepo — no comandos sueltos.

**Paso 3 — Adaptar el compose de la app** (en `PedidosAutomatizados`): quitar el bind de
80/443 del servicio `web`, publicar `127.0.0.1:8081:80`, `auto_https off` en el Caddyfile,
`trusted_proxies`, límites de memoria por servicio, rotación de logs, `restart:
unless-stopped` y `healthcheck` en `springboot` y `db`. `.env.example` en el repo con las
claves vacías; el `.env` real en `/srv/pedidos/.env` (chmod 600, dueño `deploy`).

**Paso 4 — nginx reverse proxy.** Nuevo `infra/nginx/app.jonatanthorpe.dev.conf` en el
monorepo, independiente del portfolio: `server_name app.jonatanthorpe.dev`,
`proxy_pass http://127.0.0.1:8081;`, cabeceras `Host` / `X-Real-IP` / `X-Forwarded-For` /
`X-Forwarded-Proto`, y el bloque especial de SSE de §5. Enlazar a `sites-enabled`,
`nginx -t` y `reload` (nunca `restart`).

**Paso 5 — TLS del subdominio.** `sudo certbot --nginx -d app.jonatanthorpe.dev`
(**siempre con `-d` explícito**, nunca sobre el certificado del portfolio). Luego
`sudo certbot renew --dry-run`. Reflejar en el repo lo que certbot reescriba.

**Paso 6 — Arranque y verificación funcional.** Levantar el stack, comprobar migraciones
de Flyway, panel accesible, **SSE fluyendo** (`curl -N https://app.jonatanthorpe.dev/api/sse/stream`
debe quedarse abierto y emitir, no cortar), y solo entonces registrar el webhook en Meta.

**Paso 7 — CI/CD de la app.** Workflow **en el repo `PedidosAutomatizados`** (no en el
monorepo): build de imágenes → GHCR → SSH al servidor → `docker compose pull && up -d`.
Ver §7.

**Paso 8 — Documentación.** Actualizar `infra/README.md` y `docs/runbook.md` (operar
contenedores: logs, restart, rollback, restaurar un backup de MySQL, prune) y cerrar el DoD.

---

## 7. Despliegue: estrategia recomendada

**Construir en CI, no en el servidor.** Un build de Maven + un build de Vite en una caja
de 4 GB que además corre MySQL, la JVM y nginx es la vía rápida al OOM. GitHub Actions
construye las imágenes, las publica en **GHCR** (`ghcr.io/jonnithorpe/pedidos-*`) y el
servidor solo hace `docker compose pull && docker compose up -d`. Ventajas: deploy rápido,
**rollback trivial por tag**, y cero lock-in (GHCR es un registro OCI estándar, migrable).

Como el repo es **privado**, las imágenes son privadas → el servidor necesita autenticarse
para el `pull`. Ver el PAT en §9.

---

## 8. Impacto sobre el portfolio actual — no negociable

El portfolio **sigue funcionando exactamente igual**. La separación es real a nivel de
configuración, pero **no** a nivel de recursos: comparten VPS.

**Aislamiento de config (garantizado por diseño):**
- `infra/nginx/jonatanthorpe.dev.conf` **no se edita**. La app va en fichero y `server`
  block propios, enrutados por `server_name`. Vhosts independientes.
- `certbot` **siempre con `-d app.jonatanthorpe.dev` explícito**. Nunca sin `-d` ni con
  `--expand` sobre el certificado existente.
- `/var/www/jonatanthorpe.dev` no se toca. Ningún `rsync --delete` de la app apunta ahí.
- El workflow de la app vive en **otro repo**, con clave SSH propia y **concurrency group
  distinto** de `deploy-production`.
- Antes de cualquier recarga: `nginx -t && systemctl reload nginx`. Nunca `restart`. Si el
  test falla, nginx sigue sirviendo la config anterior y el portfolio no se cae.
- El contenedor **no puede robarle el 80/443 a nginx**: publica en loopback. Si alguien
  intentara publicar en 80, el contenedor fallaría al arrancar — ruidoso, no silencioso.

**Aislamiento de recursos (hay que construirlo, no viene gratis):**
- Límites de memoria explícitos por servicio + heap de la JVM acotado + `innodb_buffer_pool_size`
  ajustado + swapfile de 2 GB.
- Rotación de logs de Docker y retención de backups: un disco lleno rompe nginx **y** la
  renovación de certbot.
- `docker image prune` periódico.

**Verificación obligatoria:** comprobar que `https://jonatanthorpe.dev` y
`https://www.jonatanthorpe.dev` siguen cargando con candado válido y resolviendo deep links
**después de cada paso** que toque nginx, certbot o los recursos del servidor.

---

## 9. Tokens y accesos necesarios (los consigue Jonatan)

✅ = ya existe.

| Qué | Para qué | ¿Hace falta? |
|---|---|---|
| ✅ `SSH_PRIVATE_KEY` en el monorepo | Deploy del portfolio | Ya está, no se toca |
| ✅ Acceso a Porkbun | Registro `A` de `app` | Manual, sin token |
| **Par de claves SSH nuevo (`pedidos_ci`)** | Que el CI del repo de la app entre al servidor | **Sí.** Pública → `~deploy/.ssh/authorized_keys`; privada → Secret del repo `PedidosAutomatizados`. Clave separada = si se filtra, se revoca sin afectar al portfolio |
| `GITHUB_TOKEN` para publicar en GHCR | Push de imágenes desde Actions | **No hay que crearlo**: es automático, basta `permissions: packages: write` |
| **PAT classic con `read:packages`** | Que el **servidor** haga `docker login ghcr.io` y baje imágenes privadas | **Sí.** El repo es privado → las imágenes también. Se guarda en el servidor, nunca en el repo |
| **Credenciales de Meta / WhatsApp Cloud API** | Recibir y responder mensajes | **Sí:** Phone Number ID, **token permanente**, **App Secret** (firma del webhook) y **Verify Token** (lo eliges tú). Todo a `/srv/pedidos/.env` |
| Contraseña de MySQL | BD de la app | Se **genera en el servidor**, va al `.env`, jamás al repo |
| Token de API de Hetzner | — | **No** |
| API key/secret de Porkbun | Solo para DNS-01 / wildcard | **No** |

---

## 10. Definition of Done de la Fase 3

- `https://app.jonatanthorpe.dev` carga con candado válido y sirve el panel.
- El **webhook de Meta** verifica y entrega mensajes reales.
- El **SSE fluye a través de nginx** sin cortes (`curl -N` mantiene la conexión y recibe eventos).
- `https://jonatanthorpe.dev` sigue funcionando exactamente igual que antes.
- El stack sobrevive a un **reinicio del VPS** (`restart: unless-stopped`) y arranca en orden.
- Ningún puerto nuevo abierto al exterior (`ufw status` y `ss -tlnp` lo confirman; MySQL no
  escucha fuera de la red de compose).
- Un push a `main` en `PedidosAutomatizados` despliega sin entrar al servidor a mano.
- El backup diario corre, y **se ha probado una restauración** al menos una vez.
- Config del servidor reflejada en `infra/`, operación documentada en `docs/runbook.md`,
  cero secretos en ninguno de los dos repos.
