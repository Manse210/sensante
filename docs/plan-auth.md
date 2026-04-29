# Plan — Lab Auth (v0.3)

## Objectif
Protéger l'accès à SénSanté : inscription, connexion, sessions, rôles.

## Stack prévu
- NextAuth.js (bibliothèque d'authentification pour Next.js)
- Provider : Credentials (email + mot de passe)
- Base de données : PostgreSQL via Prisma (table User)

## Étapes prévues

### 1. Installation
npm install next-auth bcryptjs
npm install --save-dev @types/bcryptjs

### 2. Modèle Prisma à ajouter (schema.prisma)
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      String   @default("medecin")
  createdAt DateTime @default(now())
}

### 3. Fichiers à créer
- src/app/api/auth/[...nextauth]/route.ts  → config NextAuth
- src/app/api/auth/register/route.ts       → inscription
- src/app/login/page.tsx                   → page de connexion
- src/middleware.ts                         → protection des routes

### 4. Rôles prévus
- admin    : accès total
- medecin  : accès patients + consultations
- (extensible selon besoins)

### 5. Protection des routes
Toutes les routes /patients, /consultations, /dashboard
doivent être inaccessibles sans session active.

## Ressources
- https://next-auth.js.org/getting-started/introduction
- https://next-auth.js.org/configuration/providers/credentials
- https://next-auth.js.org/configuration/callbacks
