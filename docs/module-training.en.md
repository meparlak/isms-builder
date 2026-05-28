# Module: Training and Security Awareness

> Staff are the most important — and often most vulnerable — factor in the ISMS.
> ISO 27001 clauses 7.2 and 7.3 and A.6.3 require demonstrable competence
> and security awareness.

---

## What is Documented Here?

The training module records all security awareness measures:
- Mandatory training (onboarding, annual training)
- Phishing simulations
- Workshops and external seminars
- E-learning completions
- Role-specific training (admins, CISO, DPO)

---

## Roles and Permissions

| Action | Minimum role |
|---|---|
| View training records | `reader` |
| Create and edit training records | `editor` |
| Delete / restore training records | `admin` |

---

## Creating a Training Record

**Training → "+ New Training"**

Fields:
- **Title** — e.g. "Phishing Awareness Q1 2026"
- **Type** — Mandatory / Phishing simulation / Workshop / E-learning / Other
- **Date** — when did the training take place?
- **Duration** — in hours
- **Trainer / Provider**
- **Target audience** — all staff / IT department / management etc.
- **Number of participants** — how many people were trained?
- **Coverage rate** — what percentage of the target audience was reached?
- **Outcome / Notes** — assessment, findings, areas for improvement
- **Status** — `planned` / `completed` / `cancelled`

---

## Progress and Metrics

The training overview shows:
- Coverage rate across all training (target: 100% of mandatory training)
- Planned vs. completed training
- Training by type and period

---

## Linking to SoA

Training measures can be linked as implementation evidence for controls, e.g.:
- ISO A.6.3 (Security Awareness Training) → annual training
- ISO A.8.7 (Protection against malware) → phishing simulation

---

## Audit Note

ISO 27001 clause 7.2 requires evidence that staff have the necessary competence.
Clause 7.3 requires awareness of the ISMS policy and their personal role within it.

The auditor expects:
1. A training plan for the current year
2. Evidence of completed training (attendance lists, certificates)
3. A coverage rate that captures all relevant staff

Recommendation: attach training evidence as a PDF to the respective training record
so it is immediately available during the audit.
