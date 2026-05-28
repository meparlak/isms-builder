# Module: Beveiligingsdoelstellingen (Goals)

> Beveiligingsdoelstellingen maken het ISMS meetbaar — ISO 27001 hoofdstuk 6.2
> vereist expliciet het vastleggen van doelstellingen met meetbare criteria
> en voortgangsregistratie.

---

## Wat zijn beveiligingsdoelstellingen?

Beveiligingsdoelstellingen vertalen de ISMS-strategie in concrete, meetbare projecten.
Ze beantwoorden de vraag: **Wat willen we bereikt hebben en wanneer?**

Voorbeelden:
- « Alle medewerkers volgen vóór Q3 een phishingtraining »
- « Hersteltijd voor kritieke kwetsbaarheden terugbrengen tot ≤ 72 uur »
- « ISO 27001-certificering voor het einde van het boekjaar »

---

## Rollen en rechten

| Actie | Minimale rol |
|---|---|
| Doelstellingen inzien | `reader` |
| Doelstelling aanmaken en bewerken | `editor` |
| Doelstelling verwijderen / herstellen | `admin` |

---

## Doelstelling aanmaken

**Beveiligingsdoelstellingen → « + Nieuwe doelstelling »**

Velden:
- **Titel** — bondige benaming
- **Beschrijving** — wat moet worden bereikt?
- **Eigenaar** — verantwoordelijke persoon/rol
- **Categorie** — bijv. Technisch, Organisatorisch, Compliance
- **Vervaldatum** — wanneer?
- **Meetindicator (KPI)** — meetbare doelwaarde (bijv. « 100% trainingsgraad »)
- **Huidige waarde** — huidige voortgang (bijv. « 72% »)
- **Status** — `not_started` / `in_progress` / `completed` / `cancelled`

---

## Voortgang bijhouden

De **KPI-voortgangsbalk** wordt automatisch berekend op basis van
`huidige waarde / doelwaarde × 100`. Deze is zichtbaar in het dashboard
en in het doelstellingenoverzicht.

Voortgang bijwerken: doelstelling openen → **« Bewerken »** → huidige waarde aanpassen.

---

## Dashboard-integratie

Het dashboard toont:
- Open doelstellingen met vervaldatum
- Doelstellingen waarvan de termijn in ≤ 14 dagen verloopt (geel gemarkeerd)
- Afgeronde doelstellingen van het lopende kwartaal

---

## Koppeling met SoA-controls

Doelstellingen kunnen worden gekoppeld aan ISO-controls in de SoA — waardoor
transparant wordt welke maatregel welke strategische doelstelling ondersteunt.
Koppeling vindt plaats via het veld **« Gekoppelde controls »** in het doelstellingenformulier.

---

## Auditremark

ISO 27001 hoofdstuk 6.2 vereist het bewijs dat doelstellingen:
- gedocumenteerd zijn
- meetbare criteria hebben
- voorzien zijn van verantwoordelijken en tijdkaders
- regelmatig worden beoordeeld

Het Goals-module dekt alle vier vereisten. Voor de audit wordt een kwartaalreview
van alle doelstellingen met statusupdate aanbevolen.
