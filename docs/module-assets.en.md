# Module: Assets (Information Assets)

> The asset register is the foundation of every ISMS — ISO 27001 Annex A.5.9 requires
> a complete inventory of all information-processing assets.

---

## What is an Asset?

An asset (information asset) is anything of value to the organisation that needs
to be protected: software, hardware, data, people, processes, facilities.

Typical asset categories:
- **Hardware** — servers, laptops, network equipment
- **Software** — operating systems, applications, SaaS
- **Data** — databases, backup media, configuration data
- **People** — staff in key roles
- **Processes** — critical business processes
- **Facilities** — data centres, office buildings

---

## Roles and Permissions

| Action | Minimum role |
|---|---|
| View assets | `reader` |
| Create and edit assets | `editor` |
| Delete / restore assets | `admin` |

---

## Creating an Asset

**Assets → "+ New Asset"**

Fields:
- **Name** — unique identifier (e.g. "Production Database Server")
- **Type** — category (Hardware, Software, Data, People, Process, Facility)
- **Owner** — who is responsible?
- **Department / Organisational unit**
- **Classification** — confidentiality: `public` / `internal` / `confidential` / `secret`
- **Criticality** — `low` / `medium` / `high` / `critical`
- **Description** — what is the asset, where is it located?
- **Linked risks** — which risks affect this asset?

---

## Classification and Criticality

**Classification** describes the protection requirement regarding confidentiality:

| Level | Meaning |
|---|---|
| `public` | Publicly accessible, no harm if disclosed |
| `internal` | Internal use only, limited impact |
| `confidential` | Confidential, significant impact |
| `secret` | Strictly confidential, severe impact |

**Criticality** describes the impact on business operations if the asset is
unavailable or compromised.

---

## Linking to Risks

Via the risk module, risks can be directly linked to affected assets. In the asset
detail view, all linked risks with their current status are visible. This makes the
**risk exposure** of an asset transparent.

---

## Dashboard

The asset overview shows:
- Total number of assets by type
- Distribution by classification and criticality
- Assets without an owner (action required)

---

## Audit Note

ISO 27001 A.5.9 requires a maintained asset inventory with owner assignments.
A.5.10 requires a policy on acceptable use. A.5.12 requires information classification.
All three requirements are covered by the asset module together with an appropriate policy.

Recommendation: review the asset register annually and update it immediately whenever
there are significant changes to the IT landscape.
