# Plan IA — L'Oracle
## Projet SénSanté — Lab v0.2 → v0.5

**Auteur :** L'Oracle  
**Lab actuel :** v0.2 — Patients CRUD  
**Lab ciblé :** v0.5 — Intégration IA  

---

## 1. Objectif du module IA

Le module IA de SénSanté permettra d'assister le médecin lors des consultations en
analysant les symptômes saisis et en proposant des diagnostics ou des orientations
cliniques. L'IA ne remplace pas le médecin — elle l'assiste.

Flux prévu :

```
Médecin saisit les symptômes
        ↓
Formulaire de consultation (Le Médecin)
        ↓
API Route /api/ia/diagnostic
        ↓
Groq API (LLM : llama3-8b-8192)
        ↓
Réponse structurée JSON → affichée au médecin
```

---

## 2. Choix technologique : Groq

### Pourquoi Groq ?

| Critère         | Groq                        | OpenAI GPT-4        |
|-----------------|-----------------------------|---------------------|
| Vitesse         | Très rapide (LPU)           | Moyenne             |
| Prix            | Gratuit (tier free)         | Payant              |
| Modèles dispo   | LLaMA 3, Mixtral, Gemma     | GPT-3.5 / GPT-4     |
| Intégration     | API REST compatible OpenAI  | API REST            |
| Adapté au projet| ✅ Oui                      | ⚠️ Coût élevé       |

Groq offre une API compatible avec le format OpenAI, ce qui facilite l'intégration
dans Next.js. Le modèle retenu est `llama3-8b-8192` — rapide, gratuit, et suffisant
pour l'analyse de symptômes simples.

---

## 3. Création du compte Groq et obtention de la clé API

### Étapes réalisées

1. Aller sur [https://console.groq.com](https://console.groq.com)
2. Créer un compte (email ou GitHub)
3. Aller dans **API Keys** → **Create API Key**
4. Copier la clé générée (format : `gsk_...`)
5. Stocker la clé dans le fichier `.env.local` du projet :

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Ne jamais commiter `.env.local`. Vérifier que `.gitignore` contient bien `.env.local`.

---

## 4. Test de la clé API avec curl

Commande de test exécutée dans le terminal :

```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3-8b-8192",
    "messages": [
      {
        "role": "user",
        "content": "Patient de 35 ans avec fièvre à 39°C, toux sèche et maux de tête depuis 3 jours. Quelles sont les hypothèses diagnostiques ?"
      }
    ],
    "max_tokens": 500
  }'
```

### Résultat attendu (réponse JSON de Groq)

```json
{
  "id": "chatcmpl-xxxx",
  "object": "chat.completion",
  "model": "llama3-8b-8192",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Sur la base des symptômes décrits (fièvre à 39°C, toux sèche, céphalées depuis 3 jours), les hypothèses diagnostiques incluent : 1. Infection virale respiratoire (grippe, COVID-19)... [suite]"
      }
    }
  ]
}
```

✅ Test validé — la clé API fonctionne correctement.

---

## 5. Plan d'implémentation — Lab v0.5

### 5.1 Fichiers à créer

```
src/
├── app/
│   └── api/
│       └── ia/
│           └── diagnostic/
│               └── route.ts      ← API Route POST
├── lib/
│   └── groq.ts                   ← Client Groq (singleton)
└── components/
    └── DiagnosticResult.tsx      ← Affichage du résultat IA
```

### 5.2 Le client Groq (`src/lib/groq.ts`)

```typescript
// src/lib/groq.ts
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-8b-8192";

export async function analyserSymptomes(symptomes: string): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: `Tu es un assistant médical pour SénSanté, une application de santé sénégalaise.
Tu assistes les médecins (pas les patients directement).
Réponds en français. Sois précis, structuré et prudent.
Rappelle toujours que le diagnostic final appartient au médecin.`,
        },
        {
          role: "user",
          content: symptomes,
        },
      ],
      max_tokens: 800,
      temperature: 0.3, // Réponses plus déterministes pour un usage médical
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "Aucune réponse générée.";
}
```

### 5.3 L'API Route (`src/app/api/ia/diagnostic/route.ts`)

```typescript
// src/app/api/ia/diagnostic/route.ts
import { NextResponse } from "next/server";
import { analyserSymptomes } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.symptomes || body.symptomes.trim() === "") {
      return NextResponse.json(
        { error: "Les symptômes sont requis." },
        { status: 400 }
      );
    }

    const prompt = `
Patient : ${body.age ?? "âge inconnu"} ans, sexe ${body.sexe ?? "non précisé"}, région ${body.region ?? "non précisée"}.
Symptômes rapportés : ${body.symptomes}
Durée : ${body.duree ?? "non précisée"}.

En tant qu'assistant médical, propose :
1. Les hypothèses diagnostiques les plus probables
2. Les examens complémentaires recommandés
3. Les orientations thérapeutiques de première intention
    `;

    const analyse = await analyserSymptomes(prompt);

    return NextResponse.json({ analyse }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'analyse IA." },
      { status: 500 }
    );
  }
}
```

### 5.4 Intégration dans la consultation (Le Médecin)

Le formulaire de consultation (géré par Le Médecin) appellera cette API :

```typescript
// Dans le formulaire de consultation
const res = await fetch("/api/ia/diagnostic", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    symptomes: formData.get("symptomes"),
    age: patient.age,
    sexe: patient.sexe,
    region: patient.region,
    duree: formData.get("duree"),
  }),
});

const { analyse } = await res.json();
// Afficher `analyse` dans DiagnosticResult
```

---

## 6. Considérations importantes

### Sécurité
- La clé `GROQ_API_KEY` est **uniquement côté serveur** (API Route, jamais exposée au navigateur).
- Valider et nettoyer les inputs avant de les envoyer à l'API Groq.
- Ne jamais exposer la clé dans un composant `"use client"`.

### Limites du modèle
- L'IA ne pose **pas** de diagnostic officiel — elle propose des pistes.
- Le médecin reste responsable de toute décision clinique.
- Prévoir un **disclaimer** affiché à côté des résultats IA dans l'UI.

### Rate limits Groq (tier gratuit)
- 30 requêtes / minute
- 14 400 tokens / minute
- Suffisant pour un prototype et les démonstrations en cours.

---

## 7. Checklist L'Oracle — Lab v0.2

- [x] Compte Groq créé sur https://console.groq.com
- [x] Clé API générée et stockée dans `.env.local`
- [x] Test curl exécuté avec succès
- [x] Ce fichier `docs/plan-ia.md` rédigé et commité
- [ ] *(Lab v0.5)* Implémenter `src/lib/groq.ts`
- [ ] *(Lab v0.5)* Implémenter l'API Route `/api/ia/diagnostic`
- [ ] *(Lab v0.5)* Créer `DiagnosticResult.tsx`
- [ ] *(Lab v0.5)* Intégration avec le formulaire de consultation

---

## 8. Commandes Git

```bash
# Depuis la racine du projet
mkdir -p docs
# (après avoir créé ce fichier)
git add docs/plan-ia.md
git commit -m "Plan IA : compte Groq, test curl, architecture prévue (L'Oracle)"
git push
```

---

*L'Oracle — SénSanté v0.2 — 2025-2026*
