# Module : Business Continuity Management (BCM)

> Le BCM garantit que l'organisation reste opérationnelle en cas de perturbations
> graves — ISO 27001 A.5.29/A.5.30, ISO 22301.

---

## Trois sous-domaines

Le module BCM comprend trois domaines étroitement interconnectés :

| Domaine | Objectif |
|---|---|
| **BIA** (Analyse d'impact sur les activités — Business Impact Analysis) | Identifier les processus critiques et évaluer les conséquences d'une interruption |
| **Plans de continuité** | Plans de reprise concrets pour les processus critiques |
| **Exercices** | Documenter les exercices et tests des plans |

---

## Analyse d'impact sur les activités (BIA)

La BIA répond à la question : **Que se passe-t-il si ce processus s'interrompt —
et combien de temps pouvons-nous nous le permettre ?**

**BCM → BIA → « + Nouvelle BIA »**

Champs :
- **Nom du processus** — quel processus métier ?
- **Responsable du processus et département**
- **Criticité** — `low` / `medium` / `high` / `critical`
- **RTO** (Recovery Time Objective — Délai de reprise) — durée maximale tolérée d'interruption (heures)
- **RPO** (Recovery Point Objective — Point de reprise) — perte de données maximale tolérée (heures)
- **MTPD** (Maximum Tolerable Period of Disruption — Durée maximale d'interruption tolérée) — durée maximale absolue d'interruption
- **Dépendances** — de quels systèmes/fournisseurs dépend ce processus ?
- **Systèmes impactés**
- **Statut** — `draft` / `reviewed` / `approved`

> **RTO et RPO** sont les indicateurs centraux de la BIA. Le RTO définit la rapidité
> avec laquelle le processus doit être rétabli, le RPO définit l'âge maximal admissible
> des données lors de la reprise.

---

## Plans de continuité (plans de reprise)

Pour chaque processus critique (criticité BIA `high`/`critical`), un plan de reprise
doit exister.

**BCM → Plans → « + Nouveau plan »**

Champs :
- **Nom du plan** — p. ex. « Reprise base de données de production »
- **BIA liée** — à quelle BIA ce plan se rapporte-t-il ?
- **Déclencheur** — quand le plan est-il activé ?
- **Responsable**
- **Étapes** — instructions numérotées
- **Ressources** — systèmes requis, contacts, données d'accès (chiffrés)
- **Statut** — `draft` / `tested` / `approved`

---

## Exercices

Les plans BCM ne sont efficaces que s'ils sont régulièrement exercés.
ISO 22301 exige la preuve des tests effectués.

**BCM → Exercices → « + Nouvel exercice »**

Champs :
- **Type d'exercice** — exercice sur table (Tabletop) / exercice de simulation / test complet
- **Date et durée**
- **Plans testés**
- **Participants**
- **Résultat** — qu'est-ce qui a fonctionné, qu'est-ce qui n'a pas fonctionné ?
- **Mesures** — qu'est-ce qui doit être amélioré ?

---

## Tableau de bord

Le tableau de bord BCM affiche :
- Nombre de BIAs par criticité
- Processus sans plan approuvé
- Dernier exercice et prochain exercice prévu
- Plans avec statut `draft` (action requise)

---

## Remarque d'audit

ISO 27001 A.5.29 exige la sécurité de l'information dans la continuité d'activité.
A.5.30 traite de la préparation des TIC pour la continuité d'activité.

L'auditeur vérifie typiquement :
1. Existe-t-il une BIA avec des valeurs RTO/RPO documentées ?
2. Existe-t-il des plans de reprise approuvés pour les processus critiques ?
3. Les plans ont-ils été testés ? (preuves d'exercices)
4. Les enseignements tirés des exercices ont-ils été intégrés dans les plans ?

Recommandation : au minimum un exercice sur table par an par plan critique.
