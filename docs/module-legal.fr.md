# Module : Legal (Contrats et documents juridiques)

> Gérer de manière centralisée les contrats, NDA et licences liés à la sécurité
> de l'information — ISO 27001 A.5.31 (Exigences légales), A.5.32 (Droits de propriété intellectuelle).

---

## Qu'appartient au module Legal ?

Le module Legal n'est pas un système complet de gestion des contrats, mais un
**registre de documents liés à la sécurité** pour :

- **Contrats** — contrats de services informatiques, SLAs, contrats de maintenance
- **NDAs** — accords de confidentialité avec les collaborateurs, fournisseurs, partenaires
- **Licences** — licences logicielles ayant une pertinence sécuritaire (p. ex. dates d'expiration)

---

## Rôles et permissions

| Action | Rôle minimum |
|---|---|
| Consulter les entrées | `reader` |
| Créer et modifier une entrée | `contentowner` |
| Supprimer / restaurer une entrée | `admin` |

---

## Contrats

**Legal → Contrats → « + Nouveau contrat »**

Champs :
- **Titre** — désignation du contrat
- **Partenaire contractuel**
- **Type** — Service / SLA / Maintenance / Autre
- **Durée** — début et fin
- **Préavis de résiliation**
- **Statut** — `active` / `expired` / `terminated`
- **Clauses de sécurité** — des exigences de sécurité sont-elles incluses ? (oui/non + note)
- **Annexe** — télécharger le texte du contrat en PDF (max. 25 Mo)

**Alerte d'expiration :** Les contrats expirant dans ≤ 30 jours apparaissent
dans le tableau de bord et dans le calendrier.

---

## NDAs (Accords de confidentialité)

**Legal → NDAs → « + Nouveau NDA »**

Champs : partenaire contractuel, type (unilatéral/mutuel), date de conclusion,
durée, champ d'application, annexe (PDF).

---

## Licences

**Legal → Licences → « + Nouvelle licence »**

Champs : nom du logiciel, fournisseur, type de licence (individuelle/volume/abonnement),
quantité, date d'expiration, coût, annexe.

---

## Export

Les trois domaines prennent en charge l'**export CSV** pour les preuves d'audit
et les rapports internes.

---

## Remarque d'audit

ISO 27001 A.5.31 exige l'identification et la documentation de toutes les exigences
légales, réglementaires et contractuelles pertinentes. Le module Legal offre
la preuve structurée à cet effet.

Particulièrement important : les contrats avec clauses de sécurité (A.5.20 — contrats
fournisseurs) doivent être référencés ici de même que dans le module fournisseurs.
