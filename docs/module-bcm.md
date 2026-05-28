# Modul: Business Continuity Management (BCM)

> BCM stellt sicher dass die Organisation bei schwerwiegenden Störungen
> handlungsfähig bleibt — ISO 27001 A.5.29/A.5.30, ISO 22301.

---

## Drei Teilbereiche

Das BCM-Modul besteht aus drei eng verzahnten Bereichen:

| Bereich | Zweck |
|---|---|
| **BIA** (Business Impact Analysis) | Kritische Prozesse identifizieren und Ausfallfolgen bewerten |
| **Continuity Plans** | Konkrete Wiederanlaufpläne für kritische Prozesse |
| **Exercises** | Übungen und Tests der Pläne dokumentieren |

---

## Business Impact Analysis (BIA)

Die BIA beantwortet: **Was passiert wenn dieser Prozess ausfällt — und wie lange
können wir uns das leisten?**

**BCM → BIA → „+ Neue BIA"**

Felder:
- **Prozessname** — welcher Geschäftsprozess?
- **Prozessverantwortlicher und Abteilung**
- **Kritikalität** — `low` / `medium` / `high` / `critical`
- **RTO** (Recovery Time Objective) — maximale tolerierbare Ausfallzeit (Stunden)
- **RPO** (Recovery Point Objective) — maximaler tolerierbarer Datenverlust (Stunden)
- **MTPD** (Maximum Tolerable Period of Disruption) — absolute Maximalausfallzeit
- **Abhängigkeiten** — von welchen Systemen/Lieferanten abhängig?
- **Betroffene Systeme**
- **Status** — `draft` / `reviewed` / `approved`

> **RTO und RPO** sind die zentralen Kennzahlen der BIA. RTO definiert wie schnell
> der Prozess wiederhergestellt sein muss, RPO wie alt die Daten beim Recovery
> maximal sein dürfen.

---

## Continuity Plans (Wiederanlaufpläne)

Für jeden kritischen Prozess (BIA-Kritikalität `high`/`critical`) sollte ein
Wiederanlaufplan existieren.

**BCM → Pläne → „+ Neuer Plan"**

Felder:
- **Planname** — z.B. „Wiederanlauf Produktionsdatenbank"
- **Verknüpfte BIA** — auf welche BIA bezieht sich der Plan?
- **Auslöser** — wann wird der Plan aktiviert?
- **Verantwortlicher**
- **Schritte** — nummerierte Handlungsanweisungen
- **Ressourcen** — benötigte Systeme, Kontakte, Zugangsdaten (verschlüsselt)
- **Status** — `draft` / `tested` / `approved`

---

## Exercises (Übungen)

BCM-Pläne sind nur wirksam wenn sie regelmäßig geübt werden.
ISO 22301 fordert den Nachweis durchgeführter Tests.

**BCM → Übungen → „+ Neue Übung"**

Felder:
- **Übungstyp** — Tischübung (Tabletop) / Simulationsübung / Volltest
- **Datum und Dauer**
- **Getestete Pläne**
- **Teilnehmer**
- **Ergebnis** — was hat funktioniert, was nicht?
- **Maßnahmen** — was muss verbessert werden?

---

## Dashboard

Das BCM-Dashboard zeigt:
- Anzahl BIAs nach Kritikalität
- Prozesse ohne genehmigten Plan
- Letzte Übung und nächste geplante Übung
- Pläne mit Status `draft` (Handlungsbedarf)

---

## Audit-Hinweis

ISO 27001 A.5.29 fordert Informationssicherheit in der Betriebskontinuität.
A.5.30 behandelt IKT-Bereitschaft für Betriebskontinuität.

Der Auditor prüft typischerweise:
1. Existiert eine BIA mit dokumentierten RTO/RPO-Werten?
2. Gibt es genehmigte Wiederanlaufpläne für kritische Prozesse?
3. Wurden die Pläne getestet? (Übungsnachweise)
4. Wurden Erkenntnisse aus Übungen in die Pläne eingearbeitet?

Empfehlung: Mindestens eine Tischübung pro Jahr pro kritischem Plan.
