# Modul: Assets (Informationswerte)

> Das Asset-Register ist die Grundlage jedes ISMS — ISO 27001 Annex A.5.9 fordert
> eine vollständige Inventarisierung aller informationsverarbeitenden Werte.

---

## Was ist ein Asset?

Ein Asset (Informationswert) ist alles was für die Organisation von Wert ist und
geschützt werden muss: Software, Hardware, Daten, Personen, Prozesse, Räumlichkeiten.

Typische Asset-Kategorien:
- **Hardware** — Server, Laptops, Netzwerkhardware
- **Software** — Betriebssysteme, Applikationen, SaaS
- **Daten** — Datenbanken, Backup-Medien, Konfigurationsdaten
- **Personen** — Mitarbeitende mit Schlüsselrollen
- **Prozesse** — kritische Geschäftsprozesse
- **Einrichtungen** — Rechenzentren, Bürogebäude

---

## Rollen und Berechtigungen

| Aktion | Mindestrolle |
|---|---|
| Assets einsehen | `reader` |
| Asset anlegen und bearbeiten | `editor` |
| Asset löschen / wiederherstellen | `admin` |

---

## Asset anlegen

**Assets → „+ Neues Asset"**

Felder:
- **Name** — eindeutige Bezeichnung (z.B. „Produktions-Datenbankserver")
- **Typ** — Kategorie (Hardware, Software, Daten, Personen, Prozess, Einrichtung)
- **Eigentümer** — wer ist verantwortlich?
- **Abteilung / Organisationseinheit**
- **Klassifizierung** — Vertraulichkeit: `public` / `internal` / `confidential` / `secret`
- **Kritikalität** — `low` / `medium` / `high` / `critical`
- **Beschreibung** — was ist das Asset, wo befindet es sich?
- **Verknüpfte Risiken** — welche Risiken betreffen dieses Asset?

---

## Klassifizierung und Kritikalität

Die **Klassifizierung** beschreibt den Schutzbedarf bezüglich Vertraulichkeit:

| Stufe | Bedeutung |
|---|---|
| `public` | Öffentlich zugänglich, kein Schaden bei Bekanntwerden |
| `internal` | Nur intern, begrenzte Auswirkung |
| `confidential` | Vertraulich, erhebliche Auswirkung |
| `secret` | Streng vertraulich, schwerwiegende Auswirkung |

Die **Kritikalität** beschreibt die Auswirkung bei Ausfall oder Kompromittierung
auf die Geschäftstätigkeit.

---

## Verknüpfung mit Risiken

Über das Risiko-Modul können Risiken direkt mit betroffenen Assets verknüpft werden.
Im Asset-Detail sind alle verknüpften Risiken mit aktuellem Status sichtbar.
Dies macht die **Risikoexposition** eines Assets transparent.

---

## Dashboard

Die Asset-Übersicht zeigt:
- Gesamtanzahl Assets nach Typ
- Verteilung nach Klassifizierung und Kritikalität
- Assets ohne Eigentümer (Handlungsbedarf)

---

## Audit-Hinweis

ISO 27001 A.5.9 fordert ein gepflegtes Asset-Inventar mit Eigentümerzuordnung.
A.5.10 fordert eine Richtlinie zur akzeptablen Nutzung. A.5.12 verlangt die
Klassifizierung von Informationen. Alle drei Anforderungen werden durch das
Asset-Modul in Verbindung mit einer entsprechenden Policy abgedeckt.

Empfehlung: Asset-Register jährlich überprüfen und bei wesentlichen Änderungen
der IT-Landschaft sofort aktualisieren.
