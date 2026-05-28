# Modul: Reports und Exporte

> Das Reports-Modul fasst den ISMS-Zustand in auswertbaren Berichten zusammen —
> für den internen Überblick, das Management Review und den externen Auditor.

---

## Verfügbare Reports

| Report | Inhalt |
|---|---|
| **Compliance** | Implementierungsquote aller Controls je Framework |
| **Gap Analysis** | Controls ohne verknüpfte Policy oder Procedure |
| **Framework** | Detailübersicht eines einzelnen Frameworks |
| **Templates** | Alle Templates nach Status, Typ und Fälligkeit |
| **Audit** | Audit-Log aller Nutzeraktionen (Admin) |
| **Reviews** | Übersicht fälliger Template-Reviews |
| **Matrix** | Control-zu-Template-Zuordnungsmatrix |
| **Findings** | Offene Audit-Findings und Maßnahmen |
| **Risks** | Risikoübersicht mit Behandlungsstatus |

---

## Compliance-Report

Der wichtigste Report für das Management Review und den Auditor.
Er zeigt für jedes aktivierte Framework:
- Gesamtanzahl Controls
- Anzahl `implemented` / `partial` / `not_started`
- Implementierungsquote in Prozent
- Trend im Vergleich zum Vormonat

**Reports → Compliance**

---

## Gap Analysis

Zeigt welche Controls zwar als `applicable` markiert sind aber noch keine
verknüpfte Policy oder Procedure haben — also wo die dokumentarische Lücke ist.

**Reports → Gap Analysis**

Besonders nützlich in der Vorbereitungsphase auf eine ISO-27001-Zertifizierung.

---

## Template-Report

Übersicht aller Templates mit:
- Status (Draft/Review/Approved/Archived)
- Eigentümer
- Nächste Überprüfung
- Verknüpfte Controls

Exportierbar als **CSV** und **PDF** (druckoptimiert).

---

## Risiko-Report

Übersicht aller Risiken mit:
- Risikostufe (niedrig/mittel/hoch/kritisch)
- Behandlungsstatus
- Restrisiko
- Verantwortlicher und Fälligkeitsdatum

Exportierbar als **CSV** und **PDF**.

---

## Audit-Log

Vollständige Protokollierung aller Nutzeraktionen im System:
wer hat wann was geändert. Nur für `admin` zugänglich.

**Reports → Audit-Log** — filterbar nach Nutzer, Aktion und Zeitraum.

---

## Export-Formate

Alle Reports sind verfügbar als:
- **CSV** — für Weiterverarbeitung in Excel, BI-Tools
- **PDF** — druckoptimiert über `window.print()`, direkt aus dem Browser

---

## Audit-Hinweis

Für das Management Review (ISO 27001 Kapitel 9.3) empfehlen sich folgende Reports
als Standardunterlagen:
1. Compliance-Report (Implementierungsquote je Framework)
2. Gap Analysis (offene Dokumentationslücken)
3. Risiko-Report (aktuelle Risikolage)
4. Template-Report gefiltert auf `review`-Status (fällige Überprüfungen)

Diese vier Reports zusammen geben der Leitung ein vollständiges Bild des ISMS-Zustands.
