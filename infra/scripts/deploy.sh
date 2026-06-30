#!/usr/bin/env bash
#
# deploy.sh — build local + sync del estatico al servidor (deploy manual, Fase 1).
# En Fase 2 esto lo hara GitHub Actions; mientras tanto sirve para publicar a mano.
#
# Requiere: Node 22, rsync y acceso SSH como deploy con clave.
# Uso:
#   SERVER_IP=<ip> bash infra/scripts/deploy.sh
#
set -euo pipefail

SERVER_IP="${SERVER_IP:?Define SERVER_IP=<ip del VPS>}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
WEB_ROOT="/var/www/jonatanthorpe.dev"
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../site" && pwd)"

echo "==> Build en ${SITE_DIR}"
cd "${SITE_DIR}"
npm ci
npm run build

echo "==> Sync dist/ -> ${DEPLOY_USER}@${SERVER_IP}:${WEB_ROOT}"
rsync -avz --delete dist/ "${DEPLOY_USER}@${SERVER_IP}:${WEB_ROOT}/"

echo "==> Hecho. Revisa https://jonatanthorpe.dev"
