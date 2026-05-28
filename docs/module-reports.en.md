# Module: Reports and Exports

> The reports module summarises the ISMS status in evaluable reports —
> for internal oversight, the management review, and the external auditor.

---

## Available Reports

| Report | Content |
|---|---|
| **Compliance** | Implementation rate of all controls per framework |
| **Gap Analysis** | Controls without a linked policy or procedure |
| **Framework** | Detailed overview of a single framework |
| **Templates** | All templates by status, type and review date |
| **Audit** | Audit log of all user actions (admin) |
| **Reviews** | Overview of templates with overdue reviews |
| **Matrix** | Control-to-template assignment matrix |
| **Findings** | Open audit findings and measures |
| **Risks** | Risk overview with treatment status |

---

## Compliance Report

The most important report for the management review and the auditor.
For each activated framework it shows:
- Total number of controls
- Number `implemented` / `partial` / `not_started`
- Implementation rate as a percentage
- Trend compared to the previous month

**Reports → Compliance**

---

## Gap Analysis

Shows which controls are marked as `applicable` but have no linked policy or
procedure — i.e. where the documentation gap is.

**Reports → Gap Analysis**

Particularly useful in the preparation phase for an ISO 27001 certification.

---

## Template Report

Overview of all templates with:
- Status (Draft/Review/Approved/Archived)
- Owner
- Next review date
- Linked controls

Exportable as **CSV** and **PDF** (print-optimised).

---

## Risk Report

Overview of all risks with:
- Risk level (low/medium/high/critical)
- Treatment status
- Residual risk
- Owner and due date

Exportable as **CSV** and **PDF**.

---

## Audit Log

Complete log of all user actions in the system: who changed what and when.
Accessible to `admin` only.

**Reports → Audit Log** — filterable by user, action and time period.

---

## Export Formats

All reports are available as:
- **CSV** — for further processing in Excel or BI tools
- **PDF** — print-optimised via `window.print()`, directly from the browser

---

## Audit Note

For the management review (ISO 27001 clause 9.3) the following reports are
recommended as standard supporting documents:
1. Compliance report (implementation rate per framework)
2. Gap analysis (open documentation gaps)
3. Risk report (current risk situation)
4. Template report filtered to `review` status (overdue reviews)

These four reports together give leadership a complete picture of the ISMS status.
