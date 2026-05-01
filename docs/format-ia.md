# Format des données pour l'IA — SénSanté

**Auteur :** L'Oracle  
**Version :** v0.5 (Lab IA)  
**Date :** 2025–2026  

---

## Contexte

Les consultations sont enregistrées avec un tableau JSON de symptômes (Lab v0.4).
Dans ce lab (v0.5), L'Oracle connecte l'API **Groq (Llama 3)** pour analyser
ces symptômes et proposer un pré-diagnostic automatique.

---

## 1. Structure d'une consultation envoyée à Groq

Lors de l'appel à l'API Groq, on envoie les données suivantes :

```json
{
  "symptomes": ["Fièvre", "Toux", "Fatigue"],
  "notes": "Patient se plaint de fièvre depuis 3 jours"
}
```

> Les symptômes proviennent directement du champ `symptomes` (type `Json`)
> de la table `Consultation` en base PostgreSQL.

---

## 2. Prompt envoyé à Llama 3

```
Tu es un assistant médical d'aide au diagnostic dans un contexte africain (Sénégal).
Un patient présente les symptômes suivants : {symptomes}.
Notes cliniques : {notes}.

Réponds UNIQUEMENT en JSON valide, sans texte autour, avec ce format :
{
  "diagnosticIa": "Nom de la maladie probable",
  "confiance": 85
}
```

- `{symptomes}` → remplacé par la liste jointe : `"Fièvre, Toux, Fatigue"`
- `{notes}` → remplacé par les notes du médecin (ou `"Aucune note"` si null)
- `confiance` → un entier entre 0 et 100 (pourcentage de confiance du modèle)

---

## 3. Réponse attendue de Groq

```json
{
  "diagnosticIa": "Paludisme probable",
  "confiance": 78
}
```

En cas d'erreur ou de réponse invalide, on stocke :

```json
{
  "diagnosticIa": "Diagnostic indisponible",
  "confiance": 0
}
```

---

## 4. Champs Prisma concernés

| Champ         | Type      | Description                              |
|---------------|-----------|------------------------------------------|
| `symptomes`   | `Json`    | Tableau de symptômes cochés par le médecin |
| `diagnosticIa`| `String?` | Résultat renvoyé par le modèle Groq       |
| `confiance`   | `Int?`    | Pourcentage de confiance (0–100)          |
| `statut`      | `String`  | `"en_attente"` → `"termine"` après l'IA  |

---

## 5. Mise à jour de la consultation après diagnostic

Après l'appel Groq, on met à jour la consultation avec Prisma :

```typescript
await prisma.consultation.update({
  where: { id: consultationId },
  data: {
    diagnosticIa: result.diagnosticIa,
    confiance: result.confiance,
    statut: "termine",
  },
});
```

---

## 6. Modèle Groq utilisé

| Paramètre   | Valeur                  |
|-------------|-------------------------|
| Modèle      | `llama3-8b-8192`        |
| Temperature | `0.3` (réponses stables)|
| Max tokens  | `200`                   |
| Format      | JSON strict             |

---

## 7. Symptômes disponibles (référence)

Ces symptômes sont définis dans `ConsultationForm.tsx` :

```
Fièvre · Toux · Maux de tête · Fatigue · Diarrhée · Vomissements
Douleur abdominale · Éruption cutanée · Frissons · Douleur thoracique
Essoufflement · Vertiges
```

---

*Ce document sera mis à jour lors de l'implémentation effective dans le Lab IA (v0.5).*
