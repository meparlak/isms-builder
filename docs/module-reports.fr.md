# Module : Reports et exports

> Le module Reports résume l'état du SMSI dans des rapports exploitables —
> pour la vue d'ensemble interne, la revue de direction et l'auditeur externe.

---

## Reports disponibles

| Report | Contenu |
|---|---|
| **Compliance** | Taux de mise en œuvre de tous les contrôles par framework |
| **Gap Analysis** | Contrôles sans politique ou procédure liée |
| **Framework** | Vue détaillée d'un framework individuel |
| **Templates** | Tous les templates par statut, type et échéance |
| **Audit** | Journal d'audit de toutes les actions utilisateurs (Admin) |
| **Reviews** | Aperçu des révisions de templates arrivant à échéance |
| **Matrix** | Matrice d'affectation contrôle-vers-template |
| **Findings** | Constatations d'audit ouvertes et mesures |
| **Risks** | Aperçu des risques avec statut de traitement |

---

## Rapport de conformité (Compliance)

Le rapport le plus important pour la revue de direction et l'auditeur.
Il montre pour chaque framework activé :
- Nombre total de contrôles
- Nombre `implemented` / `partial` / `not_started`
- Taux de mise en œuvre en pourcentage
- Tendance par rapport au mois précédent

**Reports → Compliance**

---

## Gap Analysis

Montre quels contrôles sont marqués comme `applicable` mais n'ont encore aucune
politique ou procédure liée — c'est-à-dire où se trouve la lacune documentaire.

**Reports → Gap Analysis**

Particulièrement utile dans la phase de préparation à une certification ISO 27001.

---

## Rapport Templates

Aperçu de tous les templates avec :
- Statut (Draft/Review/Approved/Archived)
- Propriétaire
- Prochaine révision
- Contrôles liés

Exportable en **CSV** et **PDF** (optimisé pour l'impression).

---

## Rapport des risques

Aperçu de tous les risques avec :
- Niveau de risque (faible/moyen/élevé/critique)
- Statut de traitement
- Risque résiduel
- Responsable et date d'échéance

Exportable en **CSV** et **PDF**.

---

## Journal d'audit

Enregistrement complet de toutes les actions des utilisateurs dans le système :
qui a modifié quoi et quand. Accessible uniquement aux `admin`.

**Reports → Journal d'audit** — filtrable par utilisateur, action et période.

---

## Formats d'export

Tous les reports sont disponibles en :
- **CSV** — pour traitement ultérieur dans Excel, outils BI
- **PDF** — optimisé pour l'impression via `window.print()`, directement depuis le navigateur

---

## Remarque d'audit

Pour la revue de direction (ISO 27001 chapitre 9.3), les reports suivants sont
recommandés comme documents standard :
1. Rapport de conformité (taux de mise en œuvre par framework)
2. Gap Analysis (lacunes documentaires ouvertes)
3. Rapport des risques (situation actuelle des risques)
4. Rapport Templates filtré sur le statut `review` (révisions arrivant à échéance)

Ces quatre reports donnent ensemble à la direction une vue complète de l'état du SMSI.
