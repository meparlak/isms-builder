# Module: Trainingen en bewustwording (Training)

> Medewerkers zijn de belangrijkste — en vaak meest kwetsbare — factor in het ISMS.
> ISO 27001 hoofdstukken 7.2 en 7.3 alsmede A.6.3 vereisen aantoonbare competentie
> en beveiligingsbewustzijn.

---

## Wat wordt hier gedocumenteerd?

Het Training-module registreert alle trainingsmaatregelen op het gebied van
informatiebeveiliging:
- Verplichte trainingen (onboarding, jaarlijkse training)
- Phishing-simulaties
- Workshops en externe seminars
- E-learning-voltooiingen
- Rolspecifieke trainingen (Admin, CISO, DPO)

---

## Rollen en rechten

| Actie | Minimale rol |
|---|---|
| Trainingen inzien | `reader` |
| Training aanmaken en bewerken | `editor` |
| Training verwijderen / herstellen | `admin` |

---

## Training aanmaken

**Training → « + Nieuwe training »**

Velden:
- **Titel** — bijv. « Phishing-bewustwording Q1 2026 »
- **Type** — Verplichte training / Phishing-simulatie / Workshop / E-Learning / Overig
- **Datum** — wanneer vond de training plaats?
- **Duur** — in uren
- **Trainer / Aanbieder**
- **Doelgroep** — alle medewerkers / IT-afdeling / leidinggevenden, enz.
- **Aantal deelnemers** — hoeveel personen zijn getraind?
- **Dekkingsgraad** — welk percentage van de doelgroep is bereikt?
- **Resultaat / Notities** — beoordeling, bevindingen, verbeterpunten
- **Status** — `planned` / `completed` / `cancelled`

---

## Voortgang en indicatoren

Het trainingsoverzicht toont:
- Dekkingsgraad over alle trainingen (doel: 100% van de verplichte trainingen)
- Geplande vs. uitgevoerde trainingen
- Trainingen per type en periode

---

## Koppeling met SoA

Trainingsmaatregelen kunnen worden gekoppeld als implementatiebewijs voor controls,
bijvoorbeeld:
- ISO A.6.3 (Security Awareness Training) → Jaarlijkse training
- ISO A.8.7 (Protection against malware) → Phishing-simulatie

---

## Auditremark

ISO 27001 hoofdstuk 7.2 vereist het bewijs dat medewerkers de noodzakelijke
competentie bezitten. Hoofdstuk 7.3 vereist bewustzijn van het ISMS-beleid
en hun persoonlijke rol daarin.

De auditor verwacht:
1. Een trainingsplan voor het lopende jaar
2. Bewijzen van uitgevoerde trainingen (presentielijsten, certificaten)
3. Een dekkingsgraad die alle relevante medewerkers omvat

Aanbeveling: trainingsbewijzen als bijlage (PDF) toevoegen aan de betreffende
trainingsvermelding, zodat ze direct beschikbaar zijn bij de audit.
