# Plan des consultations - SénSanté

## Objectif
Définir la structure et les champs nécessaires pour le module de consultation médicale.

## 1. Relation avec les patients
- Une consultation appartient à un seul patient (clé étrangère `patientId`)
- Un patient peut avoir plusieurs consultations
- Relation : `Patient 1 → n Consultation`

## 2. Champs proposés pour la table Consultation

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `id` | Int | Oui (auto-incrément) | Identifiant unique |
| `patientId` | Int | Oui | Référence vers Patient |
| `dateConsultation` | DateTime | Oui | Date et heure de la consultation |
| `symptomes` | String (long) | Oui | Description des symptômes |
| `diagnostic` | String (long) | Non | Diagnostic posé |
| `prescription` | String (long) | Non | Traitement prescrit |
| `notes` | String (long) | Non | Notes complémentaires |
| `createdAt` | DateTime | Auto | Date de création dans le système |
| `updatedAt` | DateTime | Auto | Date de dernière modification |

## 3. Format des symptômes

Deux options possibles :

### Option A : Texte libre
- Simple à implémenter
- Laisse la liberté au médecin
- Moins adapté pour l’IA

### Option B : Tags prédéfinis (recommandé pour l’IA)
- Liste fermée : "fièvre", "toux", "fatigue", "maux de tête", "douleur thoracique", "nausées", etc.
- Permet une analyse plus simple par l’IA
- À discuter avec l’Oracle (Lab IA)

→ **Proposition** : combiner les deux : champs `symptomesTags` (tableau de tags) + `symptomesLibre` (texte complémentaire)

## 4. Réflexions supplémentaires
- Ajouter un champ `statut` (en attente / terminé / annulé) ?
- La consultation doit-elle être modifiable après création ?
- Ajouter les signes vitaux : tension, pouls, température ?

## 5. Prochaines étapes
- Valider la structure avec Le Gardien (cohérence avec la table Patient)
- Implémenter le CRUD des consultations (Lab v0.4)
- Intégrer avec l’IA pour analyse des symptômes (Lab v0.5)

---

*Document préparé par Le Médecin - Lab Patients v0.2*