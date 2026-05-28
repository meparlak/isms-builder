# Modul: Legal (Verträge und Rechtsdokumente)

> Verträge, NDAs und Lizenzen mit Bezug zur Informationssicherheit zentral
> verwalten — ISO 27001 A.5.31 (Rechtliche Anforderungen), A.5.32 (IP-Rechte).

---

## Was gehört ins Legal-Modul?

Das Legal-Modul ist kein vollständiges Vertragsmanagement-System, sondern ein
**sicherheitsrelevantes Dokumentenregister** für:

- **Verträge** — IT-Dienstleistungsverträge, SLAs, Wartungsverträge
- **NDAs** — Vertraulichkeitsvereinbarungen mit Mitarbeitenden, Lieferanten, Partnern
- **Lizenzen** — Software-Lizenzen mit Sicherheitsrelevanz (z.B. Ablaufdaten)

---

## Rollen und Berechtigungen

| Aktion | Mindestrolle |
|---|---|
| Einträge einsehen | `reader` |
| Eintrag anlegen und bearbeiten | `contentowner` |
| Eintrag löschen / wiederherstellen | `admin` |

---

## Verträge

**Legal → Verträge → „+ Neuer Vertrag"**

Felder:
- **Titel** — Vertragsbezeichnung
- **Vertragspartner**
- **Typ** — Dienstleistung / SLA / Wartung / Sonstiges
- **Laufzeit** — Beginn und Ende
- **Kündigungsfrist**
- **Status** — `active` / `expired` / `terminated`
- **Sicherheitsklauseln** — sind Sicherheitsanforderungen enthalten? (ja/nein + Notiz)
- **Anhang** — Vertragstext als PDF hochladen (max. 25 MB)

**Ablaufwarnung:** Verträge die in ≤ 30 Tagen ablaufen erscheinen im Dashboard
und im Kalender.

---

## NDAs (Vertraulichkeitsvereinbarungen)

**Legal → NDAs → „+ Neues NDA"**

Felder: Vertragspartner, Typ (einseitig/gegenseitig), Abschlussdatum, Laufzeit,
Geltungsbereich, Anhang (PDF).

---

## Lizenzen

**Legal → Lizenzen → „+ Neue Lizenz"**

Felder: Softwarename, Anbieter, Lizenztyp (Einzel/Volumen/Subscription),
Anzahl, Ablaufdatum, Kosten, Anhang.

---

## Export

Alle drei Bereiche unterstützen **CSV-Export** für Audit-Nachweise und
interne Berichte.

---

## Audit-Hinweis

ISO 27001 A.5.31 fordert die Identifikation und Dokumentation aller relevanten
gesetzlichen, behördlichen und vertraglichen Anforderungen. Das Legal-Modul
bietet dafür den strukturierten Nachweis.

Besonders wichtig: Verträge mit Sicherheitsklauseln (A.5.20 — Lieferantenverträge)
sollten hier ebenso verzeichnet sein wie im Lieferantenmodul.
