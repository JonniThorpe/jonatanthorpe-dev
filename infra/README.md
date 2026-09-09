# Runbook de infraestructura — jonatanthorpe.dev

Procedimiento de la **Fase 1** (servidor + estático en producción). El repo es
la fuente de verdad: todo cambio en el servidor debe reflejarse aquí.

```
infra/
├── nginx/
│   ├── jonatanthorpe.dev.conf       # portfolio (se enlaza a sites-enabled)
│   └── app.jonatanthorpe.dev.conf   # subdominio de la app (Fase 3)
├── scripts/
│   ├── bootstrap.sh                 # hardening + setup inicial (como root)
│   ├── deploy.sh                    # build local + sync del dist/ (deploy manual)
│   ├── docker-setup.sh              # Docker + swap + rotacion de logs (Fase 3)
│   ├── traffic-report.sh            # informe GoAccess sobre los logs vivos
│   └── traffic-snapshot.sh          # congela metricas antes de que logrotate las borre
├── cron/
│   └── traffic-snapshot.cron        # -> /etc/cron.d/traffic-snapshot (semanal)
└── README.md                        # este runbook
```

> Para **operar** el servidor y los contenedores en el día a día (logs,
> despliegue, vuelta atrás, restaurar copias), ver `docs/runbook.md`. Este
> fichero cubre el **procedimiento de montaje**.

## Orden de operaciones

### 0. (Manual, Jonatan) Crear el VPS

- Hetzner Cloud → CX22, **Ubuntu 24.04 LTS**, región **Falkenstein (fsn1)**.
- Añade tu **clave SSH pública** (`~/.ssh/id_ed25519.pub`) al crear el servidor,
  para entrar como `root` sin password.
- Apunta la IP pública resultante → es la `SERVIDOR_IP`.

### 1. Bootstrap (hardening)

```bash
# desde tu máquina, en la raíz del repo
scp infra/scripts/bootstrap.sh root@SERVIDOR_IP:/root/
ssh root@SERVIDOR_IP 'bash /root/bootstrap.sh'
```

Crea el usuario `deploy`, copia tu clave, instala nginx + fail2ban +
unattended-upgrades, configura `ufw` (solo SSH, 80, 443) y prepara
`/var/www/jonatanthorpe.dev`. **No** endurece SSH todavía.

Verifica el acceso por clave en una sesión **nueva**:

```bash
ssh deploy@SERVIDOR_IP   # debe entrar sin pedir password
```

Solo cuando eso funcione, endurece SSH (deshabilita root y password):

```bash
ssh deploy@SERVIDOR_IP 'sudo HARDEN_SSH=1 bash /root/bootstrap.sh'
```

### 2. (Manual, Jonatan) DNS en Porkbun

Crea los registros apuntando a la `SERVIDOR_IP`:

| Tipo | Host | Valor          |
|------|------|----------------|
| A    | @    | SERVIDOR_IP    |
| A    | www  | SERVIDOR_IP    |

Espera a que propague (`nslookup jonatanthorpe.dev`).

### 3. nginx sirviendo el sitio

```bash
# copiar la config del repo al servidor
scp infra/nginx/jonatanthorpe.dev.conf deploy@SERVIDOR_IP:/tmp/
ssh deploy@SERVIDOR_IP

# en el servidor:
sudo mv /tmp/jonatanthorpe.dev.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/jonatanthorpe.dev.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default    # quitar el sitio por defecto
sudo nginx -t && sudo systemctl reload nginx
```

### 4. Publicar el build

```bash
# desde tu máquina, en la raíz del repo
SERVER_IP=SERVIDOR_IP bash infra/scripts/deploy.sh
```

### 5. TLS con Let's Encrypt (certbot)

```bash
ssh deploy@SERVIDOR_IP
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jonatanthorpe.dev -d www.jonatanthorpe.dev
sudo certbot renew --dry-run   # verificar renovación automática
```

> `.dev` está en la lista HSTS preload: **http no carga en navegador**, así que
> el certificado va antes de poder ver la web. certbot reescribe la config de
> nginx para añadir `:443` y la redirección — refleja ese resultado en el repo.

## Definition of Done (Fase 1)

`https://jonatanthorpe.dev` carga con candado válido y la SPA resuelve deep links.

---

# Fase 3 — la app en un subdominio

Desplegar **PedidosAutomatizados** en `app.jonatanthorpe.dev`, en el mismo VPS,
sin tocar el portfolio. Completada el **1 de agosto de 2026**.

El orden importa y no es negociable: **DNS → Docker → nginx → certbot → app**.
Pedir el certificado antes de que el DNS resuelva quema intentos contra el
límite de Let's Encrypt (5 por dominio y semana), y `certbot --nginx` necesita
que exista ya un `server` block para el subdominio.

### 6. (Manual, Jonatan) DNS del subdominio

Registro `A` en Porkbun: host `app` → `SERVIDOR_IP`. Verificar **antes** de
seguir:

```bash
nslookup app.jonatanthorpe.dev 8.8.8.8
```

### 7. Docker en el servidor

```bash
scp infra/scripts/docker-setup.sh deploy@SERVIDOR_IP:/tmp/
ssh deploy@SERVIDOR_IP 'sudo bash /tmp/docker-setup.sh'
ssh deploy@SERVIDOR_IP 'docker ps'   # sesión NUEVA: el grupo docker no aplica a una ya abierta
```

Instala Docker Engine + plugin compose del repositorio oficial (no el
`docker.io` de Ubuntu, que va por detrás y no trae compose v2), mete a `deploy`
en el grupo `docker`, crea un **swapfile de 2 GB** (los CX de Hetzner vienen sin
swap) y fija la **rotación de logs** en `daemon.json`. Idempotente.

**No abre ningún puerto**, y no debe hacerlo: la pila entera se publica en
`127.0.0.1` porque Docker se salta `ufw`.

### 8. nginx del subdominio

```bash
scp infra/nginx/app.jonatanthorpe.dev.conf deploy@SERVIDOR_IP:/tmp/
ssh deploy@SERVIDOR_IP
sudo cp /tmp/app.jonatanthorpe.dev.conf /etc/nginx/sites-available/
sudo ln -sfn /etc/nginx/sites-available/app.jonatanthorpe.dev.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Siempre `reload`, nunca `restart`: si el test falla, nginx sigue sirviendo la
config anterior y **el portfolio no se cae**.

Hasta que la app esté levantada dará **502**, y eso es lo correcto: significa
que nginx ya reconoce el subdominio y busca el `127.0.0.1:8081`.

### 9. TLS del subdominio

```bash
sudo certbot --nginx -d app.jonatanthorpe.dev
sudo certbot renew --dry-run
```

**El `-d` explícito no es opcional.** Sin él, certbot podría ampliar el
certificado del portfolio en vez de emitir uno nuevo, y los dos sitios
quedarían atados al mismo. Después, volcar al repo lo que certbot reescriba.

### 10. La aplicación

El repo, los secretos y el despliegue continuo son del **otro repositorio**
(`PedidosAutomatizados`). Aquí solo vive la config del servidor y del dominio.
Operación diaria en `docs/runbook.md` §E.

## Definition of Done (Fase 3)

- `https://app.jonatanthorpe.dev` carga con candado válido y sirve el panel.
- El webhook de Meta verifica **y entrega** mensajes reales.
- El SSE fluye a través de nginx sin cortarse al minuto.
- `https://jonatanthorpe.dev` sigue funcionando exactamente igual.
- El stack sobrevive a un reinicio del VPS.
- Ningún puerto nuevo abierto (`ufw status` y `ss -tlnp` lo confirman).
- Un push a `master` en `PedidosAutomatizados` despliega sin entrar al servidor.
- La copia diaria corre y **se ha restaurado al menos una vez, con datos**.
