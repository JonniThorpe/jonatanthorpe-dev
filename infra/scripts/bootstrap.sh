#!/usr/bin/env bash
#
# bootstrap.sh — provisión y hardening inicial del VPS (Fase 1).
# Se ejecuta como root en el primer acceso al servidor recién creado.
# Idempotente: puede correrse varias veces sin romper nada.
#
# Uso:
#   1) Copia este script al servidor y ejecútalo como root:
#        scp infra/scripts/bootstrap.sh root@SERVIDOR_IP:/root/
#        ssh root@SERVIDOR_IP 'bash /root/bootstrap.sh'
#   2) Verifica que puedes entrar como deploy con tu clave (sesion NUEVA):
#        ssh deploy@SERVIDOR_IP
#   3) Solo cuando el paso 2 funcione, endurece SSH (sin root, sin password):
#        ssh deploy@SERVIDOR_IP 'sudo HARDEN_SSH=1 bash /root/bootstrap.sh'
#
set -euo pipefail

DEPLOY_USER="deploy"
WEB_ROOT="/var/www/jonatanthorpe.dev"

log()  { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
warn() { printf '\n\033[1;33m[!] %s\033[0m\n' "$*"; }

if [[ "${EUID}" -ne 0 ]]; then
  echo "Este script debe ejecutarse como root." >&2
  exit 1
fi

# --- 1. Usuario deploy (no-root, con sudo) ---
if id "${DEPLOY_USER}" &>/dev/null; then
  log "Usuario ${DEPLOY_USER} ya existe — sin cambios."
else
  log "Creando usuario ${DEPLOY_USER}..."
  adduser --disabled-password --gecos "" "${DEPLOY_USER}"
fi
usermod -aG sudo "${DEPLOY_USER}"

# sudo sin password para deploy: el acceso ya esta protegido por la clave SSH
# (el login por password se deshabilita en el paso 8) y permite automatizar
# el deploy en la fase 2. Validamos la sintaxis con visudo antes de dejarlo.
SUDOERS_FILE="/etc/sudoers.d/${DEPLOY_USER}"
echo "${DEPLOY_USER} ALL=(ALL) NOPASSWD:ALL" > "${SUDOERS_FILE}"
chmod 440 "${SUDOERS_FILE}"
visudo -c -f "${SUDOERS_FILE}"

# --- 2. Clave SSH: copiar authorized_keys de root a deploy ---
if [[ -f /root/.ssh/authorized_keys ]]; then
  log "Copiando authorized_keys de root a ${DEPLOY_USER}..."
  install -d -m 700 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
  install -m 600 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" \
    /root/.ssh/authorized_keys "/home/${DEPLOY_USER}/.ssh/authorized_keys"
else
  warn "No hay /root/.ssh/authorized_keys. Sube tu clave publica al crear el VPS."
fi

# --- 3. Paquetes base ---
log "Actualizando indices e instalando paquetes..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx fail2ban unattended-upgrades ufw

# --- 4. Firewall ufw (minimo privilegio: SSH, 80, 443) ---
log "Configurando ufw..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status verbose

# --- 5. unattended-upgrades (parches de seguridad automaticos) ---
log "Habilitando unattended-upgrades..."
cat >/etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
systemctl enable --now unattended-upgrades

# --- 6. fail2ban (proteccion de fuerza bruta en SSH) ---
log "Habilitando fail2ban..."
systemctl enable --now fail2ban

# --- 7. Directorio web (lo servira nginx) ---
log "Preparando ${WEB_ROOT}..."
install -d -m 755 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "${WEB_ROOT}"

# --- 8. Hardening SSH (solo con HARDEN_SSH=1, tras verificar acceso por clave) ---
if [[ "${HARDEN_SSH:-0}" == "1" ]]; then
  if [[ ! -s "/home/${DEPLOY_USER}/.ssh/authorized_keys" ]]; then
    warn "No hay clave para ${DEPLOY_USER}; abortando hardening para no dejarte fuera."
    exit 1
  fi
  log "Endureciendo SSH: sin root, sin password..."
  install -d -m 755 /etc/ssh/sshd_config.d
  cat >/etc/ssh/sshd_config.d/10-hardening.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
EOF
  sshd -t
  systemctl reload ssh 2>/dev/null || systemctl reload sshd
  log "SSH endurecido. Abre una sesion NUEVA como deploy antes de cerrar esta."
else
  warn "SSH sin endurecer todavia. Verifica 'ssh ${DEPLOY_USER}@SERVIDOR_IP' y re-ejecuta con HARDEN_SSH=1."
fi

log "bootstrap.sh completado."
