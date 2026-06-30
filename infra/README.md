# Runbook de infraestructura — jonatanthorpe.dev

Procedimiento de la **Fase 1** (servidor + estático en producción). El repo es
la fuente de verdad: todo cambio en el servidor debe reflejarse aquí.

```
infra/
├── nginx/
│   └── jonatanthorpe.dev.conf   # config del sitio (se enlaza a sites-enabled)
├── scripts/
│   ├── bootstrap.sh             # hardening + setup inicial (como root)
│   └── deploy.sh                # build local + sync del dist/ (deploy manual)
└── README.md                    # este runbook
```

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
