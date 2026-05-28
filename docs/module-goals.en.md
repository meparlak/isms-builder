# Module: Security Goals

> Security goals make the ISMS measurable — ISO 27001 clause 6.2 explicitly requires
> the definition of objectives with measurable criteria and progress tracking.

---

## What are Security Goals?

Security goals translate the ISMS strategy into concrete, measurable objectives.
They answer the question: **What do we want to achieve by when?**

Examples:
- "All staff complete a phishing awareness training by Q3"
- "Reduce patch time for critical vulnerabilities to ≤ 72 hours"
- "Achieve ISO 27001 certification by end of financial year"

---

## Roles and Permissions

| Action | Minimum role |
|---|---|
| View goals | `reader` |
| Create and edit goals | `editor` |
| Delete / restore goals | `admin` |

---

## Creating a Goal

**Security Goals → "+ New Goal"**

Fields:
- **Title** — concise name
- **Description** — what should be achieved?
- **Owner** — responsible person or role
- **Category** — e.g. Technical, Organisational, Compliance
- **Due date** — by when?
- **KPI** — measurable target value (e.g. "100% training completion rate")
- **Current value** — current progress (e.g. "72%")
- **Status** — `not_started` / `in_progress` / `completed` / `cancelled`

---

## Tracking Progress

The **KPI progress bar** is calculated automatically from
`current value / target value × 100`. It is visible on the dashboard and in the
goals overview.

To update progress: open goal → **"Edit"** → adjust current value.

---

## Dashboard Integration

The dashboard shows:
- Open goals with due date
- Goals whose deadline is ≤ 14 days away (highlighted yellow)
- Goals completed in the current quarter

---

## Linking to SoA Controls

Goals can be linked to ISO controls in the SoA — making it transparent which measure
supports which strategic objective. Linking is done via the **"Linked controls"**
field in the goal form.

---

## Audit Note

ISO 27001 clause 6.2 requires evidence that objectives:
- are documented
- have measurable criteria
- are assigned to responsible persons with timeframes
- are regularly reviewed

The Goals module covers all four requirements. For the audit a quarterly review of
all goals with status updates is recommended.
