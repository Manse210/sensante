# Métriques IA — Dashboard SénSanté

## Objectif
Ce document liste les métriques issues des diagnostics IA
à afficher dans le tableau de bord (Lab Dashboard — v0.6).

## Métriques retenues

### 1. Nombre total de diagnostics IA
- **Source** : `consultation.count({ where: { diagnosticIa: { not: null } } })`
- **Affichage** : KPI "Diagnostics IA" sur le dashboard

### 2. Taux de diagnostics urgents
- **Source** : consultations avec `confiance >= 60` et `diagnosticIa not null`
- **Affichage** : KPI "Alertes urgentes" sur le dashboard

### 3. Répartition par niveau d'urgence
- faible : confiance < 40
- moyen : confiance entre 40 et 69
- urgent : confiance >= 70

### 4. Évolution mensuelle des diagnostics
- **Source** : `consultation.findMany` filtrées sur les 6 derniers mois
- **Affichage** : BarChart "Consultations par mois"

### 5. Répartition géographique
- **Source** : `patient.groupBy({ by: ["region"] })`
- **Affichage** : PieChart "Patients par région"

## Notes
- Le disclaimer médical est affiché à chaque résultat IA.
- SénSanté n'est pas un outil médical.