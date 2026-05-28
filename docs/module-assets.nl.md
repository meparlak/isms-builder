# Module: Assets (Informatiewaarden)

> Het activaregister is de basis van elk ISMS — ISO 27001 Bijlage A.5.9 vereist
> een volledig inventaris van alle informatieverwerkte waarden.

---

## Wat is een asset?

Een asset (informatiewaarde) is alles wat voor de organisatie van waarde is en
beschermd moet worden: software, hardware, gegevens, personen, processen, ruimten.

Typische asset-categorieën:
- **Hardware** — servers, laptops, netwerkapparatuur
- **Software** — besturingssystemen, applicaties, SaaS
- **Gegevens** — databases, back-upmedia, configuratiegegevens
- **Personen** — medewerkers met sleutelrollen
- **Processen** — kritieke bedrijfsprocessen
- **Faciliteiten** — datacenters, kantoorgebouwen

---

## Rollen en rechten

| Actie | Minimale rol |
|---|---|
| Assets inzien | `reader` |
| Asset aanmaken en bewerken | `editor` |
| Asset verwijderen / herstellen | `admin` |

---

## Asset aanmaken

**Assets → « + Nieuw asset »**

Velden:
- **Naam** — unieke benaming (bijv. « Productiedatabaseserver »)
- **Type** — categorie (Hardware, Software, Gegevens, Personen, Proces, Faciliteit)
- **Eigenaar** — wie is verantwoordelijk?
- **Afdeling / Organisatorische eenheid**
- **Classificatie** — vertrouwelijkheid: `public` / `internal` / `confidential` / `secret`
- **Kritikaliteit** — `low` / `medium` / `high` / `critical`
- **Beschrijving** — wat is dit asset, waar bevindt het zich?
- **Gekoppelde risico's** — welke risico's betreffen dit asset?

---

## Classificatie en kritikaliteit

De **classificatie** beschrijft de beschermingsbehoefte met betrekking tot vertrouwelijkheid:

| Niveau | Betekenis |
|---|---|
| `public` | Openbaar toegankelijk, geen schade bij bekendwording |
| `internal` | Alleen intern, beperkte impact |
| `confidential` | Vertrouwelijk, aanzienlijke impact |
| `secret` | Strikt vertrouwelijk, ernstige impact |

De **kritikaliteit** beschrijft de impact van uitval of compromittering
op de bedrijfsactiviteiten.

---

## Koppeling met risico's

Via het Risico-module kunnen risico's direct worden gekoppeld aan betrokken assets.
In het assetdetail zijn alle gekoppelde risico's met hun huidige status zichtbaar.
Dit maakt de **risicoblootstelling** van een asset transparant.

---

## Dashboard

Het assetoverzicht toont:
- Totaal aantal assets per type
- Verdeling per classificatie en kritikaliteit
- Assets zonder eigenaar (actie vereist)

---

## Auditremark

ISO 27001 A.5.9 vereist een bijgehouden activainventaris met eigenaarstoewijzing.
A.5.10 vereist een beleid voor aanvaardbaar gebruik. A.5.12 vereist de classificatie
van informatie. Alle drie vereisten worden gedekt door het Asset-module in combinatie
met een passend beleid.

Aanbeveling: het activaregister jaarlijks controleren en direct bijwerken bij
wezenlijke wijzigingen in het IT-landschap.
