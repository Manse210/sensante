# Tests IA — SénSanté
**Auteur** : Le Médecin  
**Date** : 07/05/2026  
**Branch** : medecin/tests-ia

---

## Test 1
- **Patient** : Anta Ba
- **Région** : Matam
- **Symptômes** : Fatigue, Toux, Vertiges
- **Diagnostic IA** : Infection respiratoire (pneumonie ou grippe) ou infection parasitaire (paludisme). Les vertiges pourraient être liés à une anémie ou déshydratation.
- **Confiance** : 60%
- **Pertinent ?** : Oui — le contexte de Matam (zone endémique paludisme) est bien pris en compte
- **Remarque** : Diagnostic prudent, plusieurs pistes proposées

---

## Test 2
- **Patient** : Mame Awa Bakhoum Sarr
- **Région** : Kaffrine
- **Symptômes** : Fièvre, Toux, Diarrhée, Fatigue
- **Diagnostic IA** : Infection gastro-intestinale ou paludisme, possiblement associée à une infection respiratoire
- **Confiance** : 60%
- **Pertinent ?** : Oui — combinaison de symptômes bien analysée
- **Remarque** : L'IA hésite entre deux pathologies, ce qui est cohérent avec les symptômes mixtes

---

## Test 3
- **Patient** : Assane Ka
- **Région** : Tambacounda
- **Symptômes** : Toux, Douleur thoracique, Vertiges, Essoufflement, Frissons, Vomissements, Fatigue
- **Notes** : peut-être la tuberculose
- **Diagnostic IA** : Infection respiratoire grave, possiblement tuberculose ou pneumonie. La région de Tambacounda est mentionnée comme zone à risque tuberculose.
- **Confiance** : 70%
- **Pertinent ?** : Oui — très pertinent, le contexte géographique influence bien le diagnostic
- **Remarque** : C'est le diagnostic le plus précis. La confiance monte à 70% avec plus de symptômes.

---

## Test 4
- **Patient** : Saynabou Gueye
- **Région** : Louga
- **Symptômes** : Vomissements
- **Diagnostic IA** : Gastro-entérite aiguë ou infection gastro-intestinale, contamination alimentaire/hydrique ou rotavirus. Infection bactérienne ou parasitaire possible dans le contexte sénégalais.
- **Confiance** : 60%
- **Pertinent ?** : Oui — mais diagnostic limité car un seul symptôme fourni
- **Remarque** : Avec un seul symptôme, l'IA reste vague. Plus de symptômes = meilleur diagnostic.

---

## Test 5
- **Patient** : Mame Awa Bakhoum Sarr
- **Région** : Kaffrine
- **Symptômes** : Fièvre, Fatigue
- **Diagnostic IA** : Infection virale ou bactérienne, possibilité de paludisme ou dengue. Contexte géographique de Kaffrine (zone endémique) pris en compte.
- **Confiance** : 60%
- **Pertinent ?** : Oui — la région influence bien le diagnostic
- **Remarque** : Même patient, moins de symptômes → diagnostic plus vague qu'au test 2

---

## Test 6
- **Patient** : Moussa Ba
- **Région** : Thiès
- **Symptômes** : Douleur abdominale, Éruption cutanée, Vomissements
- **Diagnostic IA** : Infection gastro-intestinale (bactérie, virus ou parasite). Salmonella, Shigella, paludisme ou dengue évoqués dans le contexte sénégalais.
- **Confiance** : 60%
- **Pertinent ?** : Oui — bonne prise en compte du contexte local
- **Remarque** : L'éruption cutanée aurait pu orienter davantage vers la dengue

---

## Observations générales

| Observation | Détail |
|-------------|--------|
| Confiance moyenne | 60-70% — cohérent pour un pré-diagnostic |
| Contexte géographique | ✅ Bien pris en compte (Matam, Tambacounda, Kaffrine) |
| Pathologies locales | ✅ Paludisme, dengue, tuberculose bien mentionnés |
| Plus de symptômes = meilleur diagnostic | ✅ Test 3 (7 symptômes) → 70% vs Test 4 (1 symptôme) → 60% |
| Disclaimer affiché | ✅ "Ceci n'est pas un diagnostic médical" présent partout |

---

## Conclusion

Le diagnostic IA fonctionne correctement. Il tient bien compte du contexte sénégalais 
et des pathologies endémiques par région. La qualité du diagnostic dépend directement 
du nombre de symptômes fournis. Le disclaimer médical est systématiquement affiché.