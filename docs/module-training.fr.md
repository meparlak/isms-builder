# Module : Formations et sensibilisation (Training)

> Les collaborateurs sont le facteur le plus important — et souvent le plus vulnérable —
> dans le SMSI. ISO 27001 chapitres 7.2 et 7.3 ainsi que A.6.3 exigent une
> compétence et une sensibilisation à la sécurité attestées.

---

## Qu'est-ce qui est documenté ici ?

Le module Training enregistre toutes les mesures de formation à la sécurité
de l'information :
- Formations obligatoires (intégration, formation annuelle)
- Simulations de phishing (hameçonnage)
- Ateliers et séminaires externes
- Achèvements d'e-learning
- Formations spécifiques aux rôles (Admin, CISO, DPO)

---

## Rôles et permissions

| Action | Rôle minimum |
|---|---|
| Consulter les formations | `reader` |
| Créer et modifier une formation | `editor` |
| Supprimer / restaurer une formation | `admin` |

---

## Créer une formation

**Training → « + Nouvelle formation »**

Champs :
- **Titre** — p. ex. « Sensibilisation au phishing T1 2026 »
- **Type** — Formation obligatoire / Simulation de phishing / Atelier / E-Learning / Autre
- **Date** — quand la formation a-t-elle eu lieu ?
- **Durée** — en heures
- **Formateur / Prestataire**
- **Public cible** — tous les collaborateurs / département informatique / cadres, etc.
- **Nombre de participants** — combien de personnes ont été formées ?
- **Taux de couverture** — quel pourcentage du public cible a été atteint ?
- **Résultat / Notes** — évaluation, enseignements, points d'amélioration
- **Statut** — `planned` / `completed` / `cancelled`

---

## Progression et indicateurs

L'aperçu des formations affiche :
- Taux de couverture sur l'ensemble des formations (objectif : 100 % des formations obligatoires)
- Formations planifiées vs. réalisées
- Formations par type et période

---

## Lien avec le SoA

Les mesures de formation peuvent être liées comme preuve de mise en œuvre
de contrôles, par exemple :
- ISO A.6.3 (Security Awareness Training) → Formation annuelle
- ISO A.8.7 (Protection against malware) → Simulation de phishing

---

## Remarque d'audit

ISO 27001 chapitre 7.2 exige la preuve que les collaborateurs possèdent
les compétences nécessaires. Le chapitre 7.3 exige la conscience de la politique
du SMSI et de leur rôle personnel au sein de celle-ci.

L'auditeur attend :
1. Un plan de formation pour l'année en cours
2. Les preuves des formations réalisées (listes de présence, certificats)
3. Un taux de couverture qui englobe tous les collaborateurs concernés

Recommandation : joindre les preuves de formation en annexe (PDF) à l'entrée
de formation correspondante, pour qu'elles soient immédiatement disponibles lors de l'audit.
