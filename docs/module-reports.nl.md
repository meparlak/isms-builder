# Module: Reports en exports

> Het Reports-module vat de ISMS-toestand samen in analyseerbare rapporten —
> voor het interne overzicht, de directiebeoordeling en de externe auditor.

---

## Beschikbare rapporten

| Rapport | Inhoud |
|---|---|
| **Compliance** | Implementatiegraad van alle controls per framework |
| **Gap Analysis** | Controls zonder gekoppeld beleid of procedure |
| **Framework** | Detailoverzicht van een individueel framework |
| **Templates** | Alle templates per status, type en vervaldatum |
| **Audit** | Auditlogboek van alle gebruikersacties (Admin) |
| **Reviews** | Overzicht van templates waarvan de beoordeling vervalt |
| **Matrix** | Control-naar-template-toewijzingsmatrix |
| **Findings** | Open auditbevindingen en maatregelen |
| **Risks** | Risicooverzicht met behandelingsstatus |

---

## Compliance-rapport

Het belangrijkste rapport voor de directiebeoordeling en de auditor.
Het toont voor elk geactiveerd framework:
- Totaal aantal controls
- Aantal `implemented` / `partial` / `not_started`
- Implementatiegraad in procenten
- Trend ten opzichte van de vorige maand

**Reports → Compliance**

---

## Gap Analysis

Toont welke controls als `applicable` zijn gemarkeerd maar nog geen
gekoppeld beleid of procedure hebben — met andere woorden: waar de documentaire
lacune zit.

**Reports → Gap Analysis**

Bijzonder nuttig in de voorbereidingsfase op een ISO 27001-certificering.

---

## Template-rapport

Overzicht van alle templates met:
- Status (Draft/Review/Approved/Archived)
- Eigenaar
- Volgende beoordeling
- Gekoppelde controls

Exporteerbaar als **CSV** en **PDF** (drukgeoptimaliseerd).

---

## Risico-rapport

Overzicht van alle risico's met:
- Risiconiveau (laag/middel/hoog/kritiek)
- Behandelingsstatus
- Restrisico
- Verantwoordelijke en vervaldatum

Exporteerbaar als **CSV** en **PDF**.

---

## Auditlogboek

Volledige registratie van alle gebruikersacties in het systeem:
wie heeft wat wanneer gewijzigd. Alleen toegankelijk voor `admin`.

**Reports → Auditlogboek** — filterbaar op gebruiker, actie en periode.

---

## Exportformaten

Alle rapporten zijn beschikbaar als:
- **CSV** — voor verwerking in Excel, BI-tools
- **PDF** — drukgeoptimaliseerd via `window.print()`, direct vanuit de browser

---

## Auditremark

Voor de directiebeoordeling (ISO 27001 hoofdstuk 9.3) worden de volgende rapporten
aanbevolen als standaarddocumenten:
1. Compliance-rapport (implementatiegraad per framework)
2. Gap Analysis (open documentatielacunes)
3. Risico-rapport (actuele risicosituatie)
4. Template-rapport gefilterd op status `review` (vervallende beoordelingen)

Deze vier rapporten geven de directie samen een volledig beeld van de ISMS-toestand.
