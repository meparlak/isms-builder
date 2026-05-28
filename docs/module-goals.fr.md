# Module : Objectifs de sécurité (Goals)

> Les objectifs de sécurité rendent le SMSI mesurable — ISO 27001 chapitre 6.2
> exige explicitement la définition d'objectifs avec des critères mesurables
> et un suivi de la progression.

---

## Que sont les objectifs de sécurité ?

Les objectifs de sécurité traduisent la stratégie du SMSI en projets concrets et mesurables.
Ils répondent à la question : **Que voulons-nous avoir atteint et à quelle date ?**

Exemples :
- « Tous les collaborateurs suivent une formation anti-hameçonnage (phishing) d'ici le T3 »
- « Réduire le temps de correction des vulnérabilités critiques à ≤ 72 heures »
- « Certification ISO 27001 avant la fin de l'exercice fiscal »

---

## Rôles et permissions

| Action | Rôle minimum |
|---|---|
| Consulter les objectifs | `reader` |
| Créer et modifier un objectif | `editor` |
| Supprimer / restaurer un objectif | `admin` |

---

## Créer un objectif

**Objectifs de sécurité → « + Nouvel objectif »**

Champs :
- **Titre** — désignation concise
- **Description** — qu'est-ce qui doit être atteint ?
- **Propriétaire** — personne/rôle responsable
- **Catégorie** — p. ex. Technique, Organisationnel, Conformité
- **Date d'échéance** — jusqu'à quand ?
- **Indicateur (KPI)** — valeur cible mesurable (p. ex. « 100 % taux de formation »)
- **Valeur actuelle** — progression actuelle (p. ex. « 72 % »)
- **Statut** — `not_started` / `in_progress` / `completed` / `cancelled`

---

## Suivi de la progression

La **barre de progression KPI** est calculée automatiquement à partir de
`valeur actuelle / valeur cible × 100`. Elle est visible dans le tableau de bord
et dans l'aperçu des objectifs.

Mettre à jour la progression : ouvrir l'objectif → **« Modifier »** → ajuster la valeur actuelle.

---

## Intégration au tableau de bord

Le tableau de bord affiche :
- Objectifs ouverts avec date d'échéance
- Objectifs dont l'échéance arrive dans ≤ 14 jours (marqués en jaune)
- Objectifs atteints du trimestre en cours

---

## Lien avec les contrôles SoA

Les objectifs peuvent être liés à des contrôles ISO dans le SoA — rendant ainsi
transparent quelle mesure soutient quel objectif stratégique. La liaison s'effectue
via le champ **« Contrôles liés »** dans le formulaire d'objectif.

---

## Remarque d'audit

ISO 27001 chapitre 6.2 exige la preuve que les objectifs :
- sont documentés
- ont des critères mesurables
- sont assortis de responsables et de délais
- sont révisés régulièrement

Le module Goals couvre les quatre exigences. Pour l'audit, il est recommandé
d'effectuer une révision trimestrielle de tous les objectifs avec mise à jour des statuts.
