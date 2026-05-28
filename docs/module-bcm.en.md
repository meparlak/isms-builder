# Module: Business Continuity Management (BCM)

> BCM ensures the organisation remains operational during severe disruptions —
> ISO 27001 A.5.29/A.5.30, ISO 22301.

---

## Three Sub-Areas

The BCM module consists of three closely linked areas:

| Area | Purpose |
|---|---|
| **BIA** (Business Impact Analysis) | Identify critical processes and assess the impact of outages |
| **Continuity Plans** | Concrete recovery plans for critical processes |
| **Exercises** | Document and track tests of plans |

---

## Business Impact Analysis (BIA)

The BIA answers: **What happens if this process fails — and how long can we afford it?**

**BCM → BIA → "+ New BIA"**

Fields:
- **Process name** — which business process?
- **Process owner and department**
- **Criticality** — `low` / `medium` / `high` / `critical`
- **RTO** (Recovery Time Objective) — maximum tolerable downtime (hours)
- **RPO** (Recovery Point Objective) — maximum tolerable data loss (hours)
- **MTPD** (Maximum Tolerable Period of Disruption) — absolute maximum outage time
- **Dependencies** — which systems/suppliers does this depend on?
- **Affected systems**
- **Status** — `draft` / `reviewed` / `approved`

> **RTO and RPO** are the central metrics of the BIA. RTO defines how quickly the
> process must be restored; RPO defines how old the data may be at the point of recovery.

---

## Continuity Plans (Recovery Plans)

For every critical process (BIA criticality `high`/`critical`) a recovery plan
should exist.

**BCM → Plans → "+ New Plan"**

Fields:
- **Plan name** — e.g. "Production Database Recovery"
- **Linked BIA** — which BIA does this plan relate to?
- **Trigger** — when is the plan activated?
- **Owner**
- **Steps** — numbered action instructions
- **Resources** — required systems, contacts, access credentials (encrypted)
- **Status** — `draft` / `tested` / `approved`

---

## Exercises

BCM plans are only effective if they are regularly practised.
ISO 22301 requires evidence of tests conducted.

**BCM → Exercises → "+ New Exercise"**

Fields:
- **Exercise type** — Tabletop / Simulation / Full test
- **Date and duration**
- **Plans tested**
- **Participants**
- **Outcome** — what worked, what did not?
- **Actions** — what needs to be improved?

---

## Dashboard

The BCM dashboard shows:
- Number of BIAs by criticality
- Processes without an approved plan
- Last exercise and next planned exercise
- Plans with status `draft` (action required)

---

## Audit Note

ISO 27001 A.5.29 requires information security in business continuity.
A.5.30 addresses ICT readiness for business continuity.

The auditor typically checks:
1. Does a BIA exist with documented RTO/RPO values?
2. Are there approved recovery plans for critical processes?
3. Have the plans been tested? (exercise records)
4. Have lessons from exercises been incorporated into the plans?

Recommendation: at least one tabletop exercise per year per critical plan.
