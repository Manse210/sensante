# SénSanté

Assistant de santé communautaire avec IA.

## Stack technique

- Next.js 14 (App Router)
- Tailwind CSS
- Prisma + PostgreSQL
- Groq API (Llama 3)
- NextAuth.js
- Docker Compose

## Installation

```bash
npm install
cp .env.example .env  # puis remplir les valeurs
npx prisma db push
npm run dev

## Authentification

L'application utilise NextAuth.js avec le provider Credentials (email + mot de passe).

### Installation des dépendances

```bash
npm install next-auth bcrypt
npm install --save-dev @types/bcrypt
```

### Configuration

1. Copie le fichier d'exemple :
```bash
cp .env.example .env
```

2. Génère un secret sécurisé :
```bash
openssl rand -base64 32
```

3. Colle le résultat dans `.env` :
