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

## E. Reglas de oro

- Todo cambio en el server se refleja como **código en `infra/`**. El server no es
  la fuente de verdad; el repo lo es.
- Antes de cualquier cambio de SSH/firewall, **deja una sesión abierta** como
  salvavidas hasta confirmar que el nuevo estado funciona.
- Nada de secretos ni claves privadas en el repo.
- `ufw`: sólo SSH, 80 y 443 (mínimo privilegio).
