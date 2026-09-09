#!/usr/bin/env bash
#
# traffic-snapshot.sh — congela metricas de trafico ANTES de que logrotate las
# borre. Se ejecuta EN el servidor, semanalmente por cron (ver
# infra/cron/traffic-snapshot.cron).
#
#   sudo ./traffic-snapshot.sh              # todos los sitios
#   sudo ./traffic-snapshot.sh portfolio    # solo uno
#
# El problema que resuelve: /etc/logrotate.d/nginx tiene "rotate 14", asi que
# a los 14 dias el log se borra y con el toda posibilidad de saber cuanto
# trafico hubo. traffic-report.sh analiza logs vivos; este guarda el resultado.
#
# Que guarda: UNA LINEA JSON POR DIA Y SITIO en /var/lib/traffic-snapshots/.
# Agregados, nunca IPs ni user-agents en crudo. Motivo: una IP es un dato
# personal y esto se conserva para siempre; ademas mantiene los ficheros en
# kilobytes en vez de megabytes. El precio es que no se puede volver a
# preguntar algo que no este ya agregado aqui.
#
# Idempotente por partida doble: reprocesa toda la ventana de logs disponible
# y reescribe los dias que recalcula, asi que ejecutarlo dos veces seguidas
# deja el mismo fichero. Solo cierra dias COMPLETOS (< hoy): el dia en curso
# se ignora y se recoge en la pasada siguiente, ya entero.
set -euo pipefail

OUT_DIR="${TRAFFIC_SNAPSHOT_DIR:-/var/lib/traffic-snapshots}"

SUDO=""
if [[ $EUID -ne 0 ]]; then
  SUDO="sudo"
fi

TMPS=()
cleanup() { [[ ${#TMPS[@]} -gt 0 ]] && rm -f "${TMPS[@]}" || true; }
trap cleanup EXIT

mktmp() { local f; f=$(mktemp); TMPS+=("$f"); echo "$f"; }

# Agrega un log en formato COMBINED a una linea JSON por dia.
#
#   $1 IP  ...  $4 [dd/Mon/yyyy:hh:mm:ss  $6 "METODO  $7 ruta  $9 estado
#   y el user-agent es el ultimo campo entrecomillado de la linea.
#
# browser_ips es la metrica que de verdad cuenta visitas: IPs distintas que
# pidieron un asset con hash de /assets/. Un escaner pide "/" y se marcha; solo
# un navegador que ejecuta la pagina va a buscar el bundle. Contar "peticiones"
# o "IPs unicas" infla la cifra un orden de magnitud por culpa del escaneo
# automatico, que ademas se disfraza de navegador (--ignore-crawlers de
# GoAccess no lo filtra).
AWK_AGG='
BEGIN {
  split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", mn, " ")
  for (i = 1; i <= 12; i++) mnum[mn[i]] = sprintf("%02d", i)
}
{
  split($4, t, ":")
  split(substr(t[1], 2), d, "/")
  if (d[3] == "" || !(d[2] in mnum)) next
  day = d[3] "-" mnum[d[2]] "-" d[1]

  req[day]++
  ips[day SUBSEP $1] = 1
  if ($7 == "/") root[day]++
  if ($7 ~ /^\/assets\/.+\.(js|css)$/) bips[day SUBSEP $1] = 1

  s = $9
  if (s ~ /^4/) c4[day]++
  else if (s ~ /^5/) c5[day]++

  ua = ""
  if (match($0, /"[^"]*"$/)) ua = substr($0, RSTART + 1, RLENGTH - 2)
  if (ua !~ /^Mozilla/) nonbrowser[day]++
}
END {
  for (k in ips)  { split(k, a, SUBSEP); nip[a[1]]++ }
  for (k in bips) { split(k, a, SUBSEP); nbip[a[1]]++ }
  for (day in req) {
    # El dia en curso esta a medias: se cierra en la pasada siguiente.
    if (day >= today) continue
    printf "{\"date\":\"%s\",\"site\":\"%s\",\"requests\":%d,\"unique_ips\":%d,\"browser_ips\":%d,\"root_hits\":%d,\"non_browser_requests\":%d,\"status_4xx\":%d,\"status_5xx\":%d}\n", \
      day, site, req[day], nip[day], nbip[day] + 0, root[day] + 0, nonbrowser[day] + 0, c4[day] + 0, c5[day] + 0
  }
}
'

snapshot_site() {
  local site="$1" glob="$2"
  local files=()
  # De mas viejo a mas nuevo; zcat -f mezcla .gz rotados y log vivo de una pieza.
  while IFS= read -r f; do files+=("$f"); done < <(ls -1tr ${glob}* 2>/dev/null || true)

  if [[ ${#files[@]} -eq 0 ]]; then
    echo "!! sin logs para ${site} (${glob}*)" >&2
    return 0
  fi

  local out="${OUT_DIR}/${site}.ndjson"
  local new dates merged
  new=$(mktmp); dates=$(mktmp); merged=$(mktmp)

  $SUDO zcat -f "${files[@]}" \
    | awk -v site="$site" -v today="$(date +%F)" "$AWK_AGG" \
    | sort > "$new"

  # Los dias recalculados sustituyen a los ya archivados; el resto se conserva.
  # Sin dias nuevos, grep -vf con patrones vacios copia el archivo tal cual.
  grep -oE '"date":"[0-9]{4}-[0-9]{2}-[0-9]{2}"' "$new" | sort -u > "$dates"
  if [[ -s "$out" ]]; then
    grep -vFf "$dates" "$out" > "$merged" || true
  fi
  cat "$new" >> "$merged"
  # La fecha es la primera clave de cada linea, asi que ordenar por texto
  # ordena por fecha.
  sort -o "$out.tmp" "$merged"
  mv "$out.tmp" "$out"
  chmod 0644 "$out"

  echo "== ${site}: $(wc -l < "$new") dia(s) recalculado(s), $(wc -l < "$out") en el archivo -> ${out}"
}

$SUDO mkdir -p "$OUT_DIR"
$SUDO chmod 0755 "$OUT_DIR"

case "${1:-all}" in
  portfolio) snapshot_site portfolio /var/log/nginx/portfolio.access.log ;;
  app)       snapshot_site app       /var/log/nginx/app.access.log ;;
  legacy)    snapshot_site legacy    /var/log/nginx/access.log ;;
  all)       snapshot_site portfolio /var/log/nginx/portfolio.access.log
             snapshot_site app       /var/log/nginx/app.access.log
             snapshot_site legacy    /var/log/nginx/access.log ;;
  *) echo "uso: $0 {all|portfolio|app|legacy}" >&2; exit 2 ;;
esac
