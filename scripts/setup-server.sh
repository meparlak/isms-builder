#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# ISMS Builder — Server Setup Script
# Getestet auf Ubuntu 24.04 ARM64 (Hetzner CAX11 / CX23)
#
# Einrichten:
#   1. DNS-Einträge in Hetzner gesetzt (isms-builder.de, demo.isms-builder.de)
#   2. Script auf den Server kopieren:
#        scp -i ~/.ssh/hetzner_isms scripts/setup-server.sh root@46.62.193.204:/root/
#   3. Auf dem Server ausführen:
#        bash /root/setup-server.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e
export DEBIAN_FRONTEND=noninteractive

DOMAIN_MAIN="isms-builder.de"
DOMAIN_DEMO="demo.isms-builder.de"
DOMAIN_COM="isms-builder.com"
APP_DIR="/opt/isms-builder"
LANDING_DIR="/var/www/isms-builder"
APP_PORT=3000
EMAIL="claude.hecker@pm.me"

echo ""
echo "═══════════════════════════════════════════════"
echo "  ISMS Builder — Server Setup"
echo "  $(date)"
echo "═══════════════════════════════════════════════"

# ── System-Update ─────────────────────────────────
echo ""
echo "→ System aktualisieren…"
apt-get update -qq && apt-get upgrade -y -qq

# ── Node.js 20 ────────────────────────────────────
echo "→ Node.js 20 installieren…"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y -qq nodejs

echo "   Node.js: $(node -v)  npm: $(npm -v)"

# ── nginx + certbot ───────────────────────────────
echo "→ nginx + certbot installieren…"
apt-get install -y -qq nginx certbot python3-certbot-nginx git ufw

# ── Firewall (ufw) ────────────────────────────────
echo "→ Firewall konfigurieren…"
ufw --force enable
ufw allow OpenSSH
ufw allow 'Nginx Full'
echo "   ufw status:"
ufw status verbose | grep -E "Status|22|80|443"

# ── Landing Page ──────────────────────────────────
echo "→ Landing Page einrichten…"
mkdir -p "$LANDING_DIR"
# Wird nach dem Setup per scp übertragen — Platzhalter bis dahin
cat > "$LANDING_DIR/index.html" <<'PLACEHOLDER'
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>ISMS Builder</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0f1117;color:#e8eaf0;}
h1{font-size:2rem;}p{color:#8b93a8;}</style></head>
<body><div style="text-align:center"><h1>ISMS Builder</h1><p>Coming soon…</p></div></body></html>
PLACEHOLDER
echo "   Platzhalter gesetzt — Landing Page wird separat deployt."

# ── ISMS Builder klonen ───────────────────────────
echo "→ ISMS Builder klonen…"
if [ -d "$APP_DIR" ]; then
  echo "   Verzeichnis existiert — git pull…"
  cd "$APP_DIR" && git pull
else
  git clone https://github.com/coolstartnow/isms-builder.git "$APP_DIR"
fi

cd "$APP_DIR"
echo "→ npm ci…"
npm ci --omit=dev --quiet

# ── .env für Demo ─────────────────────────────────
echo "→ .env für Demo-Instanz erstellen…"
if [ ! -f "$APP_DIR/.env" ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  cat > "$APP_DIR/.env" <<EOF
PORT=$APP_PORT
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
STORAGE_BACKEND=sqlite
# Demo läuft mit englischen Seed-Daten
EOF
  echo "   .env erstellt (JWT_SECRET generiert)."
else
  echo "   .env bereits vorhanden — nicht überschrieben."
fi

# ── systemd Service ───────────────────────────────
echo "→ systemd Service anlegen…"
cat > /etc/systemd/system/isms-builder.service <<EOF
[Unit]
Description=ISMS Builder Demo
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
EnvironmentFile=$APP_DIR/.env
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

chown -R www-data:www-data "$APP_DIR"
systemctl daemon-reload
systemctl enable isms-builder
systemctl start isms-builder
echo "   Service gestartet: $(systemctl is-active isms-builder)"

# ── nginx Konfiguration ───────────────────────────
echo "→ nginx konfigurieren…"

# Landing Page (isms-builder.de + .com + www)
cat > /etc/nginx/sites-available/isms-builder-landing <<EOF
server {
    listen 80;
    server_name $DOMAIN_MAIN www.$DOMAIN_MAIN $DOMAIN_COM www.$DOMAIN_COM;
    root $LANDING_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location /pgp.txt {
        add_header Content-Type text/plain;
    }
}
EOF

# Demo (demo.isms-builder.de)
cat > /etc/nginx/sites-available/isms-builder-demo <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN_DEMO;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $DOMAIN_DEMO;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_MAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_MAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = / {
        return 301 https://\$host/ui/;
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        client_max_body_size 25M;
    }
}
EOF

ln -sf /etc/nginx/sites-available/isms-builder-landing /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/isms-builder-demo    /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
echo "   nginx konfiguriert."

# ── SSL-Zertifikate (Let's Encrypt) ───────────────
echo ""
echo "→ SSL-Zertifikate anfordern…"
echo "   (DNS muss bereits auf diese IP zeigen!)"
echo ""

certbot --nginx \
  -d "$DOMAIN_MAIN" -d "www.$DOMAIN_MAIN" \
  -d "$DOMAIN_COM"  -d "www.$DOMAIN_COM" \
  -d "$DOMAIN_DEMO" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive \
  --redirect

echo "   SSL eingerichtet."

# ── Automatische Zertifikatserneuerung ────────────
echo "→ Certbot-Timer prüfen…"
systemctl is-enabled certbot.timer && echo "   certbot.timer aktiv." || \
  (systemctl enable certbot.timer && systemctl start certbot.timer && echo "   certbot.timer aktiviert.")

# ── Demo-Seed auf Englisch ────────────────────────
echo "→ Demo-Daten auf Englisch setzen…"
mkdir -p "$APP_DIR/data"
echo '{"lang":"en","setAt":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > "$APP_DIR/data/.demo_lang_set"
chown www-data:www-data "$APP_DIR/data/.demo_lang_set"
systemctl restart isms-builder
sleep 2
echo "   Service: $(systemctl is-active isms-builder)"

# ── Fertig ────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  ✅  Setup abgeschlossen!"
echo ""
echo "  Landing Page : https://$DOMAIN_MAIN"
echo "  Demo         : https://$DOMAIN_DEMO"
echo ""
echo "  Nächster Schritt: Landing Page deployen"
echo "  (lokal ausführen):"
echo ""
echo "  scp -i ~/.ssh/hetzner_isms \\"
echo "    landing/index.html landing/pgp.txt \\"
echo "    root@46.62.193.204:$LANDING_DIR/"
echo "═══════════════════════════════════════════════"
