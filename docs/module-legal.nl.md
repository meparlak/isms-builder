# Module: Legal (Contracten en juridische documenten)

> Centraal beheren van contracten, NDA's en licenties met betrekking tot
> informatiebeveiliging — ISO 27001 A.5.31 (Wettelijke vereisten), A.5.32 (IE-rechten).

---

## Wat hoort in het Legal-module?

Het Legal-module is geen volledig contractbeheersysteem, maar een
**veiligheidsgerelateerd documentenregister** voor:

- **Contracten** — IT-dienstverleningscontracten, SLA's, onderhoudscontracten
- **NDA's** — geheimhoudingsovereenkomsten met medewerkers, leveranciers, partners
- **Licenties** — softwarelicenties met beveiligingsrelevantie (bijv. vervaldatums)

---

## Rollen en rechten

| Actie | Minimale rol |
|---|---|
| Vermeldingen inzien | `reader` |
| Vermelding aanmaken en bewerken | `contentowner` |
| Vermelding verwijderen / herstellen | `admin` |

---

## Contracten

**Legal → Contracten → « + Nieuw contract »**

Velden:
- **Titel** — contractbenaming
- **Contractpartij**
- **Type** — Dienstverlening / SLA / Onderhoud / Overig
- **Looptijd** — begin en einde
- **Opzegtermijn**
- **Status** — `active` / `expired` / `terminated`
- **Beveiligingsclausules** — zijn beveiligingsvereisten opgenomen? (ja/nee + notitie)
- **Bijlage** — contracttekst als PDF uploaden (max. 25 MB)

**Vervalwaarschuwing:** Contracten die binnen ≤ 30 dagen verlopen verschijnen
in het dashboard en in de kalender.

---

## NDA's (Geheimhoudingsovereenkomsten)

**Legal → NDA's → « + Nieuwe NDA »**

Velden: contractpartij, type (eenzijdig/wederzijds), sluitingsdatum, looptijd,
toepassingsgebied, bijlage (PDF).

---

## Licenties

**Legal → Licenties → « + Nieuwe licentie »**

Velden: softwarenaam, aanbieder, licentietype (enkelvoudig/volume/abonnement),
aantal, vervaldatum, kosten, bijlage.

---

## Export

Alle drie gebieden ondersteunen **CSV-export** voor auditbewijzen en
interne rapporten.

---

## Auditremark

ISO 27001 A.5.31 vereist de identificatie en documentatie van alle relevante
wettelijke, regelgevende en contractuele vereisten. Het Legal-module biedt
daarvoor het gestructureerde bewijs.

Bijzonder belangrijk: contracten met beveiligingsclausules (A.5.20 — leverancierscontracten)
dienen hier eveneens te worden opgenomen als in het leveranciersmodule.
