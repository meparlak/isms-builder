# Modul: Sicherheitsziele (Goals)

> Sicherheitsziele machen das ISMS messbar — ISO 27001 fordert in Kapitel 6.2
> explizit die Festlegung von Zielen mit messbaren Kriterien und Fortschrittsverfolgung.

---

## Was sind Sicherheitsziele?

Sicherheitsziele übersetzen die ISMS-Strategie in konkrete, messbare Vorhaben.
Sie beantworten die Frage: **Was wollen wir bis wann erreicht haben?**

Beispiele:
- „Alle Mitarbeitenden absolvieren bis Q3 eine Phishing-Schulung"
- „Patch-Zeit für kritische Schwachstellen auf ≤ 72 Stunden reduzieren"
- „ISO-27001-Zertifizierung bis Ende des Geschäftsjahres"

---

## Rollen und Berechtigungen

| Aktion | Mindestrolle |
|---|---|
| Ziele einsehen | `reader` |
| Ziel anlegen und bearbeiten | `editor` |
| Ziel löschen / wiederherstellen | `admin` |

---

## Ziel anlegen

**Sicherheitsziele → „+ Neues Ziel"**

Felder:
- **Titel** — prägnante Bezeichnung
- **Beschreibung** — was soll erreicht werden?
- **Eigentümer** — verantwortliche Person/Rolle
- **Kategorie** — z.B. Technisch, Organisatorisch, Compliance
- **Fälligkeitsdatum** — bis wann?
- **Kennzahl (KPI)** — messbarer Zielwert (z.B. „100 % Schulungsquote")
- **Aktueller Wert** — aktueller Fortschritt (z.B. „72 %")
- **Status** — `not_started` / `in_progress` / `completed` / `cancelled`

---

## Fortschritt verfolgen

Der **KPI-Fortschrittsbalken** berechnet sich automatisch aus
`aktueller Wert / Zielwert × 100`. Er ist im Dashboard und in der Zielübersicht sichtbar.

Den Fortschritt aktualisieren: Ziel öffnen → **„Bearbeiten"** → aktuellen Wert anpassen.

---

## Dashboard-Integration

Das Dashboard zeigt:
- Offene Ziele mit Fälligkeitsdatum
- Ziele deren Frist in ≤ 14 Tagen abläuft (gelb markiert)
- Abgeschlossene Ziele des laufenden Quartals

---

## Verknüpfung mit SoA-Controls

Ziele können mit ISO-Controls im SoA verknüpft werden — damit wird transparent
welche Maßnahme welches strategische Ziel unterstützt. Verknüpfung erfolgt
über das Feld **„Verknüpfte Controls"** im Ziel-Formular.

---

## Audit-Hinweis

ISO 27001 Kapitel 6.2 verlangt den Nachweis dass Ziele:
- dokumentiert sind
- messbare Kriterien haben
- mit Verantwortlichen und Zeitrahmen versehen sind
- regelmäßig überprüft werden

Das Goals-Modul deckt alle vier Anforderungen ab. Für den Audit empfiehlt sich
ein Quartals-Review aller Ziele mit Statusaktualisierung.
