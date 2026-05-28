# Module : Assets (Valeurs informationnelles)

> Le registre des actifs est la base de tout SMSI — ISO 27001 Annexe A.5.9 exige
> un inventaire complet de toutes les valeurs traitant de l'information.

---

## Qu'est-ce qu'un asset ?

Un asset (valeur informationnelle) est tout ce qui a de la valeur pour l'organisation
et doit être protégé : logiciels, matériel, données, personnes, processus, locaux.

Catégories d'assets typiques :
- **Matériel** — serveurs, ordinateurs portables, équipements réseau
- **Logiciels** — systèmes d'exploitation, applications, SaaS
- **Données** — bases de données, supports de sauvegarde, données de configuration
- **Personnes** — collaborateurs ayant des rôles clés
- **Processus** — processus métier critiques
- **Installations** — centres de données, immeubles de bureaux

---

## Rôles et permissions

| Action | Rôle minimum |
|---|---|
| Consulter les assets | `reader` |
| Créer et modifier un asset | `editor` |
| Supprimer / restaurer un asset | `admin` |

---

## Créer un asset

**Assets → « + Nouvel asset »**

Champs :
- **Nom** — désignation unique (p. ex. « Serveur de base de données de production »)
- **Type** — catégorie (Matériel, Logiciel, Données, Personnes, Processus, Installation)
- **Propriétaire** — qui est responsable ?
- **Département / Unité organisationnelle**
- **Classification** — confidentialité : `public` / `internal` / `confidential` / `secret`
- **Criticité** — `low` / `medium` / `high` / `critical`
- **Description** — qu'est-ce que cet asset, où se trouve-t-il ?
- **Risques liés** — quels risques concernent cet asset ?

---

## Classification et criticité

La **classification** décrit le besoin de protection en termes de confidentialité :

| Niveau | Signification |
|---|---|
| `public` | Accessible publiquement, aucun préjudice en cas de divulgation |
| `internal` | Interne uniquement, impact limité |
| `confidential` | Confidentiel, impact significatif |
| `secret` | Strictement confidentiel, impact grave |

La **criticité** décrit l'impact d'une panne ou d'une compromission
sur l'activité de l'organisation.

---

## Lien avec les risques

Via le module Risques, les risques peuvent être directement liés aux assets concernés.
Dans le détail de l'asset, tous les risques liés avec leur statut actuel sont visibles.
Cela rend l'**exposition aux risques** d'un asset transparente.

---

## Tableau de bord

L'aperçu des assets affiche :
- Nombre total d'assets par type
- Répartition par classification et criticité
- Assets sans propriétaire (action requise)

---

## Remarque d'audit

ISO 27001 A.5.9 exige un inventaire des actifs à jour avec attribution des propriétaires.
A.5.10 exige une politique d'utilisation acceptable. A.5.12 exige la classification
des informations. Ces trois exigences sont couvertes par le module Asset conjointement
avec une politique appropriée.

Recommandation : réviser le registre des actifs annuellement et le mettre à jour
immédiatement lors de changements importants dans le paysage informatique.
