#!/usr/bin/env bash
#
# docker-setup.sh — preparación del VPS para la Fase 3 (contenedores).
# Instala Docker Engine + plugin compose, mete a deploy en el grupo docker,
# crea un swapfile de 2 GB y fija la rotación de logs del demonio.
# Idempotente: puede correrse varias veces sin romper nada.
#
# NO abre ningún puerto en ufw y NO toca nginx ni el portfolio.
#
# Uso:
#   scp infra/scripts/docker-setup.sh deploy@SERVIDOR_IP:/tmp/
#   ssh deploy@SERVIDOR_IP 'sudo bash /tmp/docker-setup.sh'
#
#   Despues, para que el grupo docker surta efecto, abre una sesion NUEVA:
#     ssh deploy@SERVIDOR_IP 'docker ps'
#
set -euo pipefail

DEPLOY_USER="deploy"
SWAPFILE="/swapfile"
SWAP_SIZE="2G"

log()  { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
warn() { printf '\n\033[1;33m[!] %s\033[0m\n' "$*"; }

if [[ "${EUID}" -ne 0 ]]; then
  echo "Este script debe ejecutarse como root (sudo bash docker-setup.sh)." >&2
  exit 1
fi

if ! id "${DEPLOY_USER}" &>/dev/null; then
  echo "No existe el usuario ${DEPLOY_USER}. Ejecuta antes bootstrap.sh." >&2
  exit 1
fi

# --- 1. Repositorio oficial de Docker ---
# El paquete docker.io de Ubuntu va por detras en version y no trae el plugin
# "docker compose" v2, que es el que usa el compose de la app. Se usa el
# repositorio de Docker con su clave, verificada por apt en cada update.
log "Configurando el repositorio oficial de Docker..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl

install -m 0755 -d /etc/apt/keyrings
if [[ ! -f /etc/apt/keyrings/docker.asc ]]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
else
  log "Clave de Docker ya presente — sin cambios."
fi

ARCH="$(dpkg --print-architecture)"
CODENAME="$(. /etc/os-release && echo "${VERSION_CODENAME}")"
DOCKER_LIST="/etc/apt/sources.list.d/docker.list"
DOCKER_REPO="deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${CODENAME} stable"

if [[ ! -f "${DOCKER_LIST}" ]] || ! grep -qF "${DOCKER_REPO}" "${DOCKER_LIST}"; then
  echo "${DOCKER_REPO}" > "${DOCKER_LIST}"
  log "Repositorio anadido (${CODENAME})."
else
  log "Repositorio ya configurado — sin cambios."
fi

# --- 2. Docker Engine + plugins ---
log "Instalando Docker Engine y el plugin compose..."
apt-get update -y
apt-get install -y \
  docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# --- 3. Rotacion de logs del demonio ---
# Por defecto los logs json-file crecen SIN limite: un contenedor hablador se
# come el disco, y con el disco lleno se cae nginx y falla la renovacion de
# certbot, o sea que se lleva por delante tambien el portfolio.
# Se fija aqui, a nivel de demonio, para que aplique a TODO contenedor
# presente y futuro; un servicio concreto puede afinarlo en su compose.
DAEMON_JSON="/etc/docker/daemon.json"
install -d -m 755 /etc/docker

DESIRED_DAEMON_JSON='{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}'

if [[ -f "${DAEMON_JSON}" ]] && ! diff -q <(echo "${DESIRED_DAEMON_JSON}") "${DAEMON_JSON}" >/dev/null 2>&1; then
  # Ya hay configuracion y no es la nuestra: no la pisamos a ciegas.
  BACKUP="${DAEMON_JSON}.bak.$(date +%Y%m%d%H%M%S)"
  cp -a "${DAEMON_JSON}" "${BACKUP}"
  warn "Habia un ${DAEMON_JSON} distinto. Copia en ${BACKUP}; revisalo si tenia ajustes propios."
fi

if [[ ! -f "${DAEMON_JSON}" ]] || ! diff -q <(echo "${DESIRED_DAEMON_JSON}") "${DAEMON_JSON}" >/dev/null 2>&1; then
  echo "${DESIRED_DAEMON_JSON}" > "${DAEMON_JSON}"
  log "Rotacion de logs fijada (10 MB x 3 por contenedor). Reiniciando docker..."
  systemctl restart docker
else
  log "Rotacion de logs ya configurada — sin cambios."
fi

systemctl enable --now docker

# --- 4. deploy en el grupo docker ---
# Pertenecer al grupo docker equivale a root en la practica (se puede montar /
# dentro de un contenedor). deploy YA tiene sudo sin password, asi que esto no
# amplia el privilegio real; se deja dicho en voz alta igualmente.
log "Anadiendo ${DEPLOY_USER} al grupo docker..."
usermod -aG docker "${DEPLOY_USER}"

# --- 5. Swapfile de 2 GB ---
# Los CX de Hetzner vienen SIN swap. Con 4 GB de RAM y ahora JVM + MySQL 8.4 +
# nginx en la misma caja, un pico deja al OOM killer eligiendo victima, y puede
# elegir nginx: adios portfolio. El swap no es para correr con memoria de mas,
# es una red de seguridad para que un pico se degrade en vez de matar procesos.
if swapon --show=NAME --noheadings | grep -qx "${SWAPFILE}"; then
  log "Swap ya activo en ${SWAPFILE} — sin cambios."
else
  log "Creando swapfile de ${SWAP_SIZE}..."
  if [[ ! -f "${SWAPFILE}" ]]; then
    fallocate -l "${SWAP_SIZE}" "${SWAPFILE}" || dd if=/dev/zero of="${SWAPFILE}" bs=1M count=2048
  fi
  chmod 600 "${SWAPFILE}"
  mkswap "${SWAPFILE}" >/dev/null
  swapon "${SWAPFILE}"
fi

# Que sobreviva al reinicio (DoD: el stack aguanta un reboot).
if ! grep -qE "^${SWAPFILE}[[:space:]]" /etc/fstab; then
  echo "${SWAPFILE} none swap sw 0 0" >> /etc/fstab
  log "Swapfile anadido a /etc/fstab."
else
  log "Swapfile ya en /etc/fstab — sin cambios."
fi

# --- 6. Verificacion ---
log "Verificacion:"
docker --version
docker compose version
echo
free -h
echo
swapon --show
echo
ufw status verbose

warn "Recordatorio: Docker escribe reglas en iptables POR DELANTE de ufw."
warn "Un puerto publicado como '-p 8081:80' quedaria abierto a internet aunque"
warn "ufw diga que esta cerrado. Por eso TODO se publica en 127.0.0.1: y la"
warn "base de datos no publica ningun puerto. No abras puertos nuevos en ufw."

log "docker-setup.sh completado. Abre una sesion SSH NUEVA para que ${DEPLOY_USER}"
log "tenga el grupo docker activo: ssh ${DEPLOY_USER}@SERVIDOR_IP 'docker ps'"
