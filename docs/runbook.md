# Runbook — lanzar y operar el servidor

Guía práctica para **crear un VPS desde cero**, **conectarte** y **operarlo** sin
improvisar. Complementa a `infra/README.md` (que cubre el procedimiento de la
Fase 1: bootstrap → DNS → nginx → deploy → TLS).

---

## A. Crear el VPS en Hetzner Cloud

Entra por **Console** (`console.hetzner.cloud`), **no** por Robot/konsoleH/DNS:

- **Console** = Hetzner Cloud (los VPS tipo CX/CPX/CAX). Es lo nuestro.
- **Robot** = servidores dedicados físicos. No.
- **konsoleH** = hosting compartido (lock-in). No.
- **DNS** = DNS gestionado de Hetzner. No lo usamos (DNS va en Porkbun).

Pasos en *Create a server*:

1. **Location:** Nuremberg (nbg1) o Falkenstein (fsn1) — ambas Alemania, latencia
   casi idéntica desde España. Elige la que tenga stock del plan barato.
2. **Image:** Ubuntu 24.04 LTS (más rodada y documentada que la última).
3. **Type → Shared Resources:**
   - **Cost-Optimized (CX, Intel/x86)** es lo más barato (~€6.64/mes el CX23:
     2 vCPU / 4 GB / 40 GB). Tiene **stock limitado**; si sale "Not available",
     prueba otra región o, si urge, la columna **Regular Performance (CPX, AMD)**.
   - Para un sitio estático, cualquiera de estos sobra. No cojas
     "Dedicated / General Purpose" (sobredimensionado y caro).
4. **Networking:** IPv4 + IPv6 (la IPv4 cuesta ~€0.61/mes aparte).
5. **SSH keys:** añade tu **clave pública** (`~/.ssh/id_ed25519.pub`). Esto es lo
   que te deja entrar como `root` sin password. Imprescindible.
6. **Resto** (Volumes, Firewalls, Backups, Placement groups, Labels, Cloud
   config): **déjalo vacío** en Fase 1. El firewall lo gestionamos con `ufw` en el
   propio server; los backups (+20%) no hacen falta (el repo es la fuente de verdad).
7. **Name:** sólo una etiqueta del panel (sin impacto en seguridad). Usa algo
   descriptivo, p. ej. `jonatanthorpe-dev`.
8. **Create & Buy now** → copia la **IPv4 pública** resultante.

> Apunta la IPv4 en `CLAUDE.md` (§2, `SERVIDOR_IP`). El repo es la fuente de verdad.

---

## B. Conectarte: SSH vs. consola del navegador

- **SSH desde tu terminal** (lo normal, día a día). Usa tu clave, sin password:
  ```bash
  ssh root@SERVIDOR_IP        # primer acceso, antes del hardening
  ssh deploy@SERVIDOR_IP      # acceso normal una vez creado deploy
  ```
  La primera vez te pedirá aceptar la huella del host (`yes`): se guarda en
  `~/.ssh/known_hosts` y no vuelve a preguntar.

- **Console del navegador** (Hetzner → server → *Console*): es una pantalla **VNC**,
  como estar físicamente delante. Pide **usuario + password**, no usa tu clave SSH.
  Es **sólo para emergencias** (si te quedas sin SSH). En el día a día, no la uses.

---

## C. Primer arranque seguro (bootstrap + hardening)

El patrón clave: **nunca te bloquees a ti mismo**. Endurece el SSH sólo cuando
hayas confirmado que el usuario `deploy` entra por clave, y hazlo con una sesión
`root` abierta de red de seguridad.

```bash
# 1) subir el script (terminal LOCAL, raíz del repo)
scp infra/scripts/bootstrap.sh root@SERVIDOR_IP:/root/

# 2) primera pasada: crea deploy, ufw, fail2ban, paquetes (NO bloquea SSH)
ssh root@SERVIDOR_IP 'bash /root/bootstrap.sh'

# 3) verificar acceso de deploy en una sesión NUEVA (deja root abierta)
ssh deploy@SERVIDOR_IP
sudo whoami        # debe responder: root

# 4) sólo si lo anterior funciona: endurecer SSH (sin root, sin password)
ssh deploy@SERVIDOR_IP 'sudo HARDEN_SSH=1 bash /root/bootstrap.sh'

# 5) comprobar que no nos hemos dejado fuera
ssh deploy@SERVIDOR_IP    # debe entrar
ssh root@SERVIDOR_IP      # debe ser RECHAZADO (Permission denied) -> correcto
```

`bootstrap.sh` es **idempotente**: puedes re-ejecutarlo sin romper nada.

---

## D. Operación diaria (chuleta)

```bash
# entrar
ssh deploy@SERVIDOR_IP

# estado del firewall
sudo ufw status verbose

# nginx: test de config y recarga (nunca 'restart' a ciegas)
sudo nginx -t && sudo systemctl reload nginx

# logs de nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# fail2ban: ver IPs baneadas en SSH
sudo fail2ban-client status sshd

# parches de seguridad (los automáticos van solos; forzar a mano):
sudo apt update && sudo apt upgrade

# espacio en disco / memoria
df -h ; free -h
```

---

## E. Operar la app en contenedores (Fase 3)

`app.jonatanthorpe.dev` sirve **PedidosAutomatizados**, que vive en su **propio
repositorio** (`JonniThorpe/PedidosAutomatizados`) y corre en Docker detrás del
mismo nginx que sirve el portfolio.

### E.1 Cómo encaja — la costura

```
Internet :443 ──► nginx (TLS, certbot)
                    ├─ jonatanthorpe.dev / www  → estático del portfolio
                    └─ app.jonatanthorpe.dev    → proxy_pass 127.0.0.1:8081
                                                     └─► Caddy (contenedor web)
                                                           ├─ /api/*  → springboot:8080
                                                           └─ resto   → SPA
```

**nginx es el único dueño de 80/443 y el único que termina TLS.** El contenedor
Caddy publica en `127.0.0.1:8081` y solo reparte por dentro. Ese `127.0.0.1` no
es decorativo: **Docker escribe sus reglas de `iptables` por delante de `ufw`**,
así que un `-p 8081:80` a secas quedaría abierto a internet aunque `ufw` diga
que está cerrado.

Dónde vive cada cosa en el servidor:

| Ruta | Qué es |
|---|---|
| `/srv/pedidos/.env` | Secretos de producción (`chmod 600`, dueño `deploy`). **Nunca en un repo** |
| `/srv/pedidos/app/backend/` | `docker-compose.yml` y `scripts/`, que el CI actualiza por `scp` |
| Volúmenes Docker | `mysql_data`, `media_data` (fotos de los clientes), `backups_data` |

### E.2 Chuleta de operación

```bash
cd /srv/pedidos/app/backend

docker compose --profile prod ps                  # estado de los 4 contenedores
docker compose logs -f springboot                 # logs de la API
docker compose logs backup                        # ¿se hizo la copia?
docker compose --profile prod restart springboot  # reiniciar un servicio
curl -f http://127.0.0.1:8080/actuator/health     # salud (no sale a internet)
```

Ojo con `--profile prod`: **sin él, `docker compose` no ve el servicio `web`**
y un `up -d` te dejaría la aplicación sin nada que la sirva.

### E.3 Desplegar y volver atrás

El despliegue es automático: un push a `master` en `PedidosAutomatizados` que
toque `backend/**` o `frontend-react/**` construye las imágenes en GitHub
Actions, las publica en GHCR y el servidor solo hace `pull`. **No se construye
en el VPS**: Maven y Vite en 4 GB compartidos con MySQL, la JVM y nginx es la
vía rápida al OOM killer, y podría llevarse nginx por delante — y con él, el
portfolio.

Cada despliegue publica dos etiquetas: `latest` y el sha del commit. Para
**volver atrás** sin reconstruir nada:

```bash
echo "IMAGE_TAG=<sha-del-commit-bueno>" >> /srv/pedidos/.env
cd /srv/pedidos/app/backend && docker compose --profile prod up -d
```

Para volver al último, borra esa línea del `.env` y repite el `up -d`.

### E.4 Restaurar una copia de seguridad

Las copias diarias están en el volumen `backups_data` (14 días de retención).

**Nunca restaures directamente sobre la base viva:** el volcado lleva
`CREATE DATABASE`, así que la sobrescribiría. Se restaura en una instancia
desechable y se comprueba antes de decidir nada:

```bash
docker cp fruteria-backup:/backups/bd-AAAA-MM-DD.sql.gz /tmp/copia.sql.gz

docker run -d --rm --name mysql-restore-test --memory 512m \
  -e MYSQL_ROOT_PASSWORD=desechable mysql:8.4

# esperar a que acepte conexiones, y entonces:
gunzip -c /tmp/copia.sql.gz | docker exec -i mysql-restore-test mysql -uroot -pdesechable
docker exec mysql-restore-test mysql -uroot -pdesechable Peidilio_BD -e "SELECT COUNT(*) FROM mensaje;"

docker stop mysql-restore-test && rm /tmp/copia.sql.gz
```

Comprueba **filas, no tablas**: restaurar el esquema no demuestra nada. Si sale
0 en una base que debería tener datos, la copia no sirve.

### E.5 Disco y memoria — lo que puede tirar el portfolio

Son 4 GB y 40 GB **compartidos**. Si esta pila se desmadra, el OOM killer puede
elegir nginx, y un disco lleno rompe nginx **y** la renovación de certbot.

Protecciones ya puestas: topes de memoria por servicio en el compose, heap de
la JVM al 70 % de su límite, `performance_schema` apagado en MySQL, swapfile de
2 GB, y rotación de logs en `/etc/docker/daemon.json` (10 MB × 3).

```bash
free -h ; df -h /                                   # lo primero ante cualquier rareza
docker stats --no-stream                            # consumo por contenedor
docker system df                                    # qué ocupa Docker
docker image prune -f                               # solo borra huérfanas
```

**No uses `docker image prune -a`**: se llevaría también las imágenes
etiquetadas con el sha, que son las que permiten volver atrás.

### E.6 Si `app.jonatanthorpe.dev` da 502

502 significa que nginx llega pero el `127.0.0.1:8081` no responde: casi
siempre el contenedor `web` caído. **El portfolio no se ve afectado**, son
vhosts independientes.

```bash
docker ps                                  # ¿está fruteria-web arriba?
curl -I http://127.0.0.1:8081              # ¿responde Caddy?
cd /srv/pedidos/app/backend && docker compose --profile prod up -d
```

Si el 502 es solo en `/api/*` pero el panel carga, el caído es `springboot`, no
Caddy: mira `docker compose logs springboot`.

### E.7 Si el panel deja de actualizarse solo

El tiempo real va por SSE (`/api/sse/stream`), y el eslabón que lo rompe es
**nginx bufferizando**. Su bloque en `infra/nginx/app.jonatanthorpe.dev.conf`
necesita sí o sí `proxy_buffering off`, `gzip off`, HTTP/1.1 con `Connection`
vacío y `proxy_read_timeout` largo. Con el timeout por defecto (60 s) la
conexión se corta al minuto de silencio y el panel se queda mudo sin dar error.

Prueba: abre el stream y comprueba que **aguanta más de un minuto**.

---

## F. Reglas de oro

- Todo cambio en el server se refleja como **código en `infra/`**. El server no es
  la fuente de verdad; el repo lo es.
- Antes de cualquier cambio de SSH/firewall, **deja una sesión abierta** como
  salvavidas hasta confirmar que el nuevo estado funciona.
- Nada de secretos ni claves privadas en el repo.
- `ufw`: sólo SSH, 80 y 443 (mínimo privilegio).
