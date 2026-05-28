# Module: Business Continuity Management (BCM)

> BCM zorgt ervoor dat de organisatie operationeel blijft bij ernstige verstoringen —
> ISO 27001 A.5.29/A.5.30, ISO 22301.

---

## Drie deelgebieden

Het BCM-module bestaat uit drie nauw verweven gebieden:

| Gebied | Doel |
|---|---|
| **BIA** (Business Impact Analysis — Bedrijfsimpactanalyse) | Kritieke processen identificeren en gevolgen van uitval beoordelen |
| **Continuïteitsplannen** | Concrete herstelplannen voor kritieke processen |
| **Oefeningen** | Oefeningen en tests van plannen documenteren |

---

## Business Impact Analysis (BIA)

De BIA beantwoordt de vraag: **Wat gebeurt er als dit proces uitvalt —
en hoe lang kunnen we dat tolereren?**

**BCM → BIA → « + Nieuwe BIA »**

Velden:
- **Procesnaam** — welk bedrijfsproces?
- **Proceseigenaar en afdeling**
- **Kritikaliteit** — `low` / `medium` / `high` / `critical`
- **RTO** (Recovery Time Objective — Hersteltijddoelstelling) — maximaal tolereerbare uitvalduur (uren)
- **RPO** (Recovery Point Objective — Herstelpuntdoelstelling) — maximaal tolereerbaar gegevensverlies (uren)
- **MTPD** (Maximum Tolerable Period of Disruption — Maximaal tolereerbare verstoringsperiode) — absolute maximale uitvalduur
- **Afhankelijkheden** — van welke systemen/leveranciers is het proces afhankelijk?
- **Betrokken systemen**
- **Status** — `draft` / `reviewed` / `approved`

> **RTO en RPO** zijn de centrale indicatoren van de BIA. RTO definieert hoe snel
> het proces hersteld moet zijn, RPO definieert hoe oud de gegevens bij het herstel
> maximaal mogen zijn.

---

## Continuïteitsplannen (herstelplannen)

Voor elk kritiek proces (BIA-kritikaliteit `high`/`critical`) dient een
herstelplan te bestaan.

**BCM → Plannen → « + Nieuw plan »**

Velden:
- **Plannaam** — bijv. « Herstel productiedatabase »
- **Gekoppelde BIA** — op welke BIA heeft het plan betrekking?
- **Activeringstrigger** — wanneer wordt het plan geactiveerd?
- **Verantwoordelijke**
- **Stappen** — genummerde handelingsinstructies
- **Middelen** — benodigde systemen, contacten, toegangsgegevens (versleuteld)
- **Status** — `draft` / `tested` / `approved`

---

## Oefeningen

BCM-plannen zijn alleen effectief als ze regelmatig worden geoefend.
ISO 22301 vereist het bewijs van uitgevoerde tests.

**BCM → Oefeningen → « + Nieuwe oefening »**

Velden:
- **Type oefening** — tafeloefening (Tabletop) / simulatieoefening / volledige test
- **Datum en duur**
- **Geteste plannen**
- **Deelnemers**
- **Resultaat** — wat werkte wel, wat niet?
- **Maatregelen** — wat moet worden verbeterd?

---

## Dashboard

Het BCM-dashboard toont:
- Aantal BIA's per kritikaliteit
- Processen zonder goedgekeurd plan
- Laatste oefening en volgende geplande oefening
- Plannen met status `draft` (actie vereist)

---

## Auditremark

ISO 27001 A.5.29 vereist informatiebeveiliging in de bedrijfscontinuïteit.
A.5.30 behandelt ICT-gereedheid voor bedrijfscontinuïteit.

De auditor controleert doorgaans:
1. Is er een BIA met gedocumenteerde RTO/RPO-waarden?
2. Zijn er goedgekeurde herstelplannen voor kritieke processen?
3. Zijn de plannen getest? (oefeningsbewijzen)
4. Zijn lessen uit oefeningen in de plannen verwerkt?

Aanbeveling: minimaal één tafeloefening per jaar per kritiek plan.
