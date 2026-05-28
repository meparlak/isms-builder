#!/bin/bash
# Demo: Vollständiges Daten-Reset täglich (02:00 UTC)
# Stellt sauberen SQLite-Snapshot und JSON-Dateien wieder her

set -e
APP_DIR=/opt/isms-builder
SNAP_DB=/opt/isms-snapshots/isms-demo-clean-20260318.db
SNAP_JSON=/opt/isms-snapshots/data-clean
LOG=/var/log/demo-reset.log

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [data-reset] start" >> "$LOG"

if [ ! -f "$SNAP_DB" ]; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [data-reset] FEHLER: SQLite-Snapshot nicht gefunden: $SNAP_DB" >> "$LOG"
  exit 1
fi

# Service stoppen
systemctl stop isms-builder
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [data-reset] service gestoppt" >> "$LOG"

# SQLite-Datenbank aus Snapshot wiederherstellen
cp "$SNAP_DB" "$APP_DIR/data/isms.db"
rm -f "$APP_DIR/data/isms.db-shm" "$APP_DIR/data/isms.db-wal"
chown netpoll:netpoll "$APP_DIR/data/isms.db"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [data-reset] SQLite wiederhergestellt" >> "$LOG"

# JSON-Dateien aus Snapshot wiederherstellen (überschreibt user-generierte Daten)
cp -r "$SNAP_JSON"/. "$APP_DIR/data/"
chown -R netpoll:netpoll "$APP_DIR/data/"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [data-reset] JSON-Dateien wiederhergestellt aus $SNAP_JSON" >> "$LOG"

# Service starten
systemctl start isms-builder
sleep 3
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [data-reset] service: $(systemctl is-active isms-builder)" >> "$LOG"

# Passwörter zurücksetzen
bash /root/demo-management/reset-passwords.sh

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [data-reset] done" >> "$LOG"
