# Sécurité API IA — Rapport du Bouclier

## Tests effectués

### Test 1 — Appel sans session (401)
- Méthode : curl sans cookie de session
- Commande : `curl -X POST http://localhost:3000/api/ia/diagnostic -H "Content-Type: application/json" -d '{"consultationId": 1}'`
- Résultat obtenu : `{"error":"Non autorisé"}` avec HTTP 401 ✅

### Test 2 — Clé API absente du code source
- Commande : `grep -r "gsk_" src/`
- Résultat : aucun résultat ✅

### Test 3 — .env dans .gitignore
- Vérification : `cat .gitignore` → .env présent ✅
- Vérification : `git log --all -- .env` → aucun commit ✅

### Test 4 — Appel avec session valide
- Résultat : diagnostic affiché avec badge urgence + disclaimer ✅

## Conclusion
L'API /api/ia/diagnostic est correctement protégée.
La clé GROQ_API_KEY n'est jamais exposée dans le code ou Git.
