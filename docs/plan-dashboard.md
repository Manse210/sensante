# Plan Dashboard — SénSanté v0.6

**Rôle :** Le Pilote  
**Lab cible :** v0.6 — Dashboard  
**Date de rédaction :** 30 avril 2026

---

## 1. Objectif

Le dashboard est la vue centrale de l'application SénSanté. Il donne une vue d'ensemble
de l'activité médicale : patients enregistrés, consultations effectuées, diagnostics IA
générés. Il est destiné aux médecins et administrateurs connectés.

---

## 2. Métriques prévues

### 2.1 Métriques principales (KPIs)

| Métrique | Description | Source (Prisma) |
|---|---|---|
| Total patients | Nombre total de patients enregistrés | `prisma.patient.count()` |
| Consultations du jour | Consultations créées aujourd'hui | `prisma.consultation.count({ where: { createdAt: { gte: today } } })` |
| Total consultations | Toutes les consultations enregistrées | `prisma.consultation.count()` |
| Diagnostics IA générés | Nombre de diagnostics produits par l'IA | `prisma.consultation.count({ where: { diagnostic: { not: null } } })` |

### 2.2 Répartition des patients

- Par **sexe** (Homme / Femme) — graphique en camembert (pie chart)
- Par **région** — graphique en barres horizontales (top 5 régions)
- Par **tranche d'âge** (0–17, 18–35, 36–60, 60+) — graphique en barres

### 2.3 Activité dans le temps

- Nombre de **nouveaux patients par mois** — graphique en courbe (line chart)
- Nombre de **consultations par semaine** — graphique en barres

---

## 3. Graphiques prévus

| Graphique | Type | Bibliothèque envisagée |
|---|---|---|
| Répartition par sexe | Pie chart | Recharts |
| Patients par région | Bar chart horizontal | Recharts |
| Répartition par âge | Bar chart | Recharts |
| Nouveaux patients/mois | Line chart | Recharts |
| Consultations/semaine | Bar chart | Recharts |

> Recharts est compatible avec Next.js et React. Léger, bien documenté.

---

## 4. Structure des fichiers prévue

```
src/
  app/
    dashboard/
      page.tsx          ← Page principale du dashboard
  components/
    StatCard.tsx        ← Carte affichant un KPI (nombre + label)
    PatientsByRegion.tsx ← Graphique barres par région
    PatientsBySexe.tsx  ← Graphique camembert sexe
    ConsultationsChart.tsx ← Graphique consultations dans le temps
  app/
    api/
      dashboard/
        route.ts        ← API Route qui agrège toutes les stats
```

---

## 5. API Route prévue

**GET /api/dashboard** — renvoie un objet JSON avec toutes les statistiques :

```json
{
  "totalPatients": 120,
  "totalConsultations": 85,
  "consultationsAujourdhui": 4,
  "diagnosticsIA": 72,
  "parSexe": { "M": 63, "F": 57 },
  "parRegion": [
    { "region": "Dakar", "total": 45 },
    { "region": "Thiès", "total": 20 }
  ],
  "parMois": [
    { "mois": "2025-11", "total": 10 },
    { "mois": "2025-12", "total": 18 }
  ]
}
```

---

## 6. Dépendances à installer

```bash
npm install recharts
```

---

## 7. Points d'attention

- Le dashboard ne doit être accessible qu'aux utilisateurs **connectés** (dépend du Lab Auth v0.3).
- Les données doivent être **agrégées côté serveur** (API Route) pour ne pas surcharger le navigateur.
- Prévoir un état de **chargement** (`loading`) et un état **vide** si aucune donnée n'existe encore.
- Les graphiques doivent être **responsives** (adaptés mobile et desktop).

---

## 8. Prochaines étapes

1. Attendre que le Lab Auth (v0.3) et le Lab Consultations (v0.4) soient terminés.
2. Implémenter l'API Route `/api/dashboard` avec les agrégations Prisma.
3. Créer le composant `StatCard` pour les KPIs.
4. Intégrer les graphiques Recharts un par un.
5. Connecter la page dashboard à l'API.
6. Tester avec des données réelles issues de PostgreSQL.
