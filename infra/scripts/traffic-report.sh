#!/usr/bin/env bash
#
# traffic-report.sh — informe de visitas por sitio, con GoAccess sobre los
# logs de nginx del propio servidor. Se ejecuta EN el servidor.
#
#   ./traffic-report.sh portfolio          # dashboard interactivo en terminal
#   ./traffic-report.sh app --html         # informe HTML a /tmp
#   ./traffic-report.sh both --json        # resumen JSON (para pipes/scripts)
#   ./traffic-report.sh legacy             # log mezclado anterior al 2026-08-03
#
# El modo terminal es un dashboard ncurses: necesita una TTY. Si lo lanzas por
# `ssh servidor ./traffic-report.sh ...` sin `-t`, GoAccess detecta que no hay
# terminal y escupe HTML crudo por stdout. El script lo detecta y usa --json en
# ese caso, que es lo que quieres si estas canalizando la salida.
#
# Por que GoAccess y no un analytics de cliente: analiza logs que ya se
# escriben, no mete JS ni cookies en el navegador del visitante, no manda
# datos a terceros y no deja un servicio extra comiendo RAM en una caja de
# 4 GB que ya corre la JVM y MySQL.
#
# Lee los .gz rotados ademas del log vivo, asi que la ventana es la de
# logrotate: 14 dias.
set -euo pipefail

SITE="${1:-}"
FORMAT="terminal"
case "${2:-}" in
  --html) FORMAT="html" ;;
  --json) FORMAT="json" ;;
esac
# Sin TTY el dashboard ncurses no se puede pintar y GoAccess cae a HTML por
# stdout. Degradar a JSON es mas util que volcar 500 KB de markup a un pipe.
[[ "$FORMAT" == "terminal" && ! -t 1 ]] && FORMAT="json"

# --ignore-crawlers importa mas de lo que parece: el VPS recibe escaneo
# constante (/wp-admin, /.git, /1.php). Sin filtrar, el ruido de bots se
# cuela en el recuento de "visitas" y lo infla.
GOACCESS_OPTS=(
  --log-format=COMBINED
  --ignore-crawlers
  --agent-list
)

report() {
  local label="$1" glob="$2"
  local files=()
  # El orden importa: los .gz rotados van de mas viejo a mas nuevo.
  while IFS= read -r f; do files+=("$f"); done < <(ls -1tr ${glob}* 2>/dev/null || true)

  if [[ ${#files[@]} -eq 0 ]]; then
    echo "!! Sin logs para ${label} (${glob})" >&2
    return 1
  fi

  echo "== ${label} — ${#files[@]} fichero(s) ==" >&2

  # zcat -f pasa en claro los ficheros sin comprimir y descomprime los .gz,
  # asi el log vivo y los rotados se analizan de una pieza.
  case "$FORMAT" in
    html)
      local out="/tmp/traffic-${label}-$(date +%F).html"
      sudo zcat -f "${files[@]}" | goaccess - "${GOACCESS_OPTS[@]}" -o "$out"
      echo "-> ${out}" >&2
      ;;
    json)
      sudo zcat -f "${files[@]}" | goaccess - "${GOACCESS_OPTS[@]}" -o json
      ;;
    *)
      sudo zcat -f "${files[@]}" | goaccess - "${GOACCESS_OPTS[@]}"
      ;;
  esac
}

case "$SITE" in
  portfolio) report portfolio /var/log/nginx/portfolio.access.log ;;
  app)       report app       /var/log/nginx/app.access.log ;;
  legacy)    report legacy    /var/log/nginx/access.log ;;
  both)      report portfolio /var/log/nginx/portfolio.access.log
             report app       /var/log/nginx/app.access.log ;;
  *) echo "uso: $0 {portfolio|app|both|legacy} [--html]" >&2; exit 2 ;;
esac
