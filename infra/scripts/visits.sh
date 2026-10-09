#!/usr/bin/env bash
#
# visits.sh — visitas REALES al portfolio y cuales son nuevas desde la ultima
# vez que lo miraste. Se ejecuta EN el servidor:
#
#   ssh deploy@167.235.151.15 ./visits.sh          # muestra y marca como vistas
#   ssh deploy@167.235.151.15 ./visits.sh --peek   # muestra sin marcar
#
# Una "visita real" es una IP en un dia que:
#   - pide una pagina HTML y ademas el JS y el CSS de /assets/ (un escaner pide
#     "/" y se va; solo un navegador que pinta la pagina va a por el bundle),
#   - tiene user-agent de navegador sin marcas de bot,
#   - no ha pedido NUNCA una ruta de escaner ni hecho un POST en la ventana de
#     logs (los escaneres falsifican UA y referer de Google, pero acaban
#     pidiendo /.env o /wp-login.php),
#   - no es la IP desde la que lanzas el script (tu).
#
# Origen de cada visita: si el enlace lleva ?ref=<etiqueta> (p. ej. el del CV
# con ?ref=cv y el de LinkedIn con ?ref=linkedin) se muestra la etiqueta; si
# no, el dominio del referer; si tampoco hay, "directo".
#
# Despues se mira el operador de cada IP en whois.cymru.com (sin dependencias,
# una consulta por lote) y se apartan las de centros de datos: casi siempre
# navegadores automaticos (Google Cloud, Azure, AWS...).
#
# La ventana es la de logrotate (14 dias): si pasan mas de dos semanas entre
# comprobaciones, lo anterior ya no esta en los logs.
set -euo pipefail

LOG_GLOB=/var/log/nginx/portfolio.access.log
STATE="${HOME}/.visits-last-check"
PEEK=0
[[ "${1:-}" == "--peek" ]] && PEEK=1

ME="${SSH_CLIENT%% *}"
SERVER_IP=167.235.151.15
LAST=$(cat "$STATE" 2>/dev/null || echo "0000-00-00 00:00:00")
NOW=$(date -u '+%F %T')

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# shellcheck disable=SC2086
sudo zcat -f $(ls -1tr ${LOG_GLOB}*) > "$TMP/log"

# Una linea por visita candidata:
#   ip<TAB>primera hora (UTC)<TAB>paginas<TAB>dispositivo<TAB>referer
awk -F'"' -v me="$ME" -v srv="$SERVER_IP" '
BEGIN {
  split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", mn, " ")
  for (i = 1; i <= 12; i++) mnum[mn[i]] = sprintf("%02d", i)
}
{
  split($1, a, " "); ip = a[1]
  if (ip == me || ip == srv) next
  split($2, q, " "); meth = q[1]; path = q[2]
  tag = ""
  if (match(path, /[?&]ref=[A-Za-z0-9_-]+/)) { tag = substr(path, RSTART + 5, RLENGTH - 5) }
  sub(/\?.*/, "", path)
  ua = $6

  if (meth != "GET" && meth != "HEAD" || path ~ /(\.env|\.git|\.aws|wp-|\.php|actuator|xmlrpc|cgi-bin|credentials|server-status|config|backup|\.sql)/) bad[ip] = 1
  if (ua !~ /^Mozilla\/5\.0 \(/ || ua ~ /[Bb]ot|crawl|spider|compatible;|[Hh]eadless|[Pp]review|[Ss]canner/) bad[ip] = 1

  # [09/Oct/2026:09:23:43 -> 2026-10-09 09:23:43
  split(a[4], t, /[\[\/:]/)
  ts = t[4] "-" mnum[t[3]] "-" t[2] " " t[5] ":" t[6] ":" t[7]
  k = ip SUBSEP substr(ts, 1, 10)

  if (!(k in first)) { first[k] = ts; dev[k] = ua }
  if (path ~ /^\/assets\/.+\.js$/)  js[k] = 1
  if (path ~ /^\/assets\/.+\.css$/) css[k] = 1
  if (path !~ /\./ && !index(pages[k], " " path " ")) pages[k] = pages[k] " " path " "
  # Origen: la etiqueta ?ref= gana al referer, porque el referer lo puede
  # omitir el navegador o la app (LinkedIn, lectores de PDF) y la etiqueta no.
  if (tag != "" && !(k in reftag)) reftag[k] = "ref=" tag
  if ($4 != "-" && $4 !~ /jonatanthorpe\.dev/ && !(k in ref)) { r = $4; sub(/^https?:\/\//, "", r); sub(/\/.*/, "", r); ref[k] = r }
}
END {
  for (k in first) {
    split(k, b, SUBSEP)
    if (b[1] in bad || !(k in js) || !(k in css) || pages[k] == "") continue
    d = dev[k]
    os = d ~ /iPhone|iPad/ ? "iOS" : d ~ /Android/ ? "Android" : d ~ /Windows/ ? "Windows" : d ~ /Mac OS/ ? "Mac" : d ~ /Linux/ ? "Linux" : "?"
    p = pages[k]; gsub(/  /, ",", p); gsub(/ /, "", p)
    printf "%s\t%s\t%s\t%s\t%s\n", b[1], first[k], p, os, (k in reftag ? reftag[k] : k in ref ? ref[k] : "directo")
  }
}' "$TMP/log" | sort -t$'\t' -k2 > "$TMP/cand"

# Operador y pais de cada IP en un solo lote.
if [[ -s "$TMP/cand" ]]; then
  { echo begin; echo verbose; cut -f1 "$TMP/cand" | sort -u; echo end; } \
    | timeout 20 nc whois.cymru.com 43 2>/dev/null \
    | awk -F' *[|] *' 'NF >= 7 { print $2 "\t" $4 "\t" $7 }' > "$TMP/asn" || true
fi
touch "$TMP/asn"

DC='google|amazon|microsoft|akamai|linode|digitalocean|ovh|hetzner|ibm|oracle|alibaba|tencent|level ?3|lumen|centurylink|vultr|choopa|contabo|leaseweb|m247|datacamp|scaleway|hosting|host|server|cloud|data ?cent'

awk -F'\t' -v last="$LAST" -v dc="$DC" '
NR == FNR { cc[$1] = $2; org[$1] = $3; next }
{
  o = ($1 in org) ? org[$1] : "?"
  if (tolower(o) ~ dc) { robots++; next }
  real++
  if ($2 > last) { new++; out = out sprintf("  %s UTC  %-8s %-3s %-20s %s  [%s]\n", substr($2, 1, 16), $4, cc[$1], $5, $3, substr(o, 1, 40)) }
}
END {
  printf "Visitas reales (ultimos 14 dias): %d\n", real
  printf "Nuevas desde tu ultima comprobacion (%s): %d\n", (last ~ /^0000/ ? "nunca" : substr(last, 1, 16) " UTC"), new
  if (new) printf "%s", out
  printf "(%d visitas de navegadores en centros de datos descartadas)\n", robots
}' "$TMP/asn" "$TMP/cand"

if [[ $PEEK -eq 0 ]]; then
  echo "$NOW" > "$STATE"
fi
