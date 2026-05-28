# Modul: Schulungen und Awareness (Training)

> Mitarbeitende sind der wichtigste — und häufig angreifbarste — Faktor im ISMS.
> ISO 27001 Kapitel 7.2 und 7.3 sowie A.6.3 fordern nachweisbare Kompetenz
> und Sicherheitsbewusstsein.

---

## Was wird hier dokumentiert?

Das Training-Modul erfasst alle Schulungsmaßnahmen zur Informationssicherheit:
- Pflichtschulungen (Onboarding, Jahresschulung)
- Phishing-Simulationen
- Workshops und externe Seminare
- E-Learning-Abschlüsse
- Rollenspezifische Trainings (Admin, CISO, DPO)

---

## Rollen und Berechtigungen

| Aktion | Mindestrolle |
|---|---|
| Schulungen einsehen | `reader` |
| Schulung anlegen und bearbeiten | `editor` |
| Schulung löschen / wiederherstellen | `admin` |

---

## Schulung anlegen

**Training → „+ Neue Schulung"**

Felder:
- **Titel** — z.B. „Phishing-Awareness Q1 2026"
- **Typ** — Pflichtschulung / Phishing-Simulation / Workshop / E-Learning / Sonstiges
- **Datum** — wann fand die Schulung statt?
- **Dauer** — in Stunden
- **Trainer / Anbieter**
- **Zielgruppe** — alle Mitarbeitenden / IT-Abteilung / Führungskräfte etc.
- **Teilnehmerzahl** — wie viele Personen wurden geschult?
- **Abdeckungsquote** — wie viel Prozent der Zielgruppe wurden erreicht?
- **Ergebnis / Notizen** — Bewertung, Erkenntnisse, Verbesserungspunkte
- **Status** — `planned` / `completed` / `cancelled`

---

## Fortschritt und Kennzahlen

Die Schulungsübersicht zeigt:
- Abdeckungsquote über alle Schulungen (Ziel: 100 % der Pflichtschulungen)
- Geplante vs. durchgeführte Schulungen
- Schulungen nach Typ und Zeitraum

---

## Verknüpfung mit SoA

Schulungsmaßnahmen können als Umsetzungsnachweis für Controls verknüpft werden,
z.B.:
- ISO A.6.3 (Security Awareness Training) → Jahresschulung
- ISO A.8.7 (Protection against malware) → Phishing-Simulation

---

## Audit-Hinweis

ISO 27001 Kapitel 7.2 fordert den Nachweis dass Mitarbeitende die notwendige
Kompetenz besitzen. Kapitel 7.3 verlangt Bewusstsein für die ISMS-Politik
und ihre persönliche Rolle darin.

Der Auditor erwartet:
1. Einen Schulungsplan für das laufende Jahr
2. Nachweise durchgeführter Schulungen (Teilnehmerlisten, Zertifikate)
3. Eine Abdeckungsquote die alle relevanten Mitarbeitenden erfasst

Empfehlung: Schulungsnachweise als Anhang (PDF) an den jeweiligen Schulungseintrag
anfügen, damit sie beim Audit sofort verfügbar sind.
