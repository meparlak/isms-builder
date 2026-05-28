# Module: Legal (Contracts and Legal Documents)

> Centrally manage contracts, NDAs and licences relevant to information security —
> ISO 27001 A.5.31 (Legal requirements), A.5.32 (IP rights).

---

## What Belongs in the Legal Module?

The legal module is not a full contract management system but a
**security-relevant document register** for:

- **Contracts** — IT service contracts, SLAs, maintenance agreements
- **NDAs** — confidentiality agreements with staff, suppliers, partners
- **Licences** — software licences with security relevance (e.g. expiry dates)

---

## Roles and Permissions

| Action | Minimum role |
|---|---|
| View entries | `reader` |
| Create and edit entries | `contentowner` |
| Delete / restore entries | `admin` |

---

## Contracts

**Legal → Contracts → "+ New Contract"**

Fields:
- **Title** — contract name
- **Contracting party**
- **Type** — Service / SLA / Maintenance / Other
- **Term** — start and end date
- **Notice period**
- **Status** — `active` / `expired` / `terminated`
- **Security clauses** — are security requirements included? (yes/no + note)
- **Attachment** — upload contract as PDF (max. 25 MB)

**Expiry warning:** Contracts expiring in ≤ 30 days appear on the dashboard and
in the calendar.

---

## NDAs (Non-Disclosure Agreements)

**Legal → NDAs → "+ New NDA"**

Fields: contracting party, type (unilateral/mutual), execution date, term, scope,
attachment (PDF).

---

## Licences

**Legal → Licences → "+ New Licence"**

Fields: software name, vendor, licence type (single/volume/subscription), quantity,
expiry date, cost, attachment.

---

## Export

All three areas support **CSV export** for audit evidence and internal reports.

---

## Audit Note

ISO 27001 A.5.31 requires the identification and documentation of all relevant
legal, regulatory and contractual requirements. The legal module provides the
structured evidence for this.

Particularly important: contracts containing security clauses (A.5.20 — supplier
contracts) should be recorded here as well as in the supplier module.
