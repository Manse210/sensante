import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const prenoms = ['Alice', 'Thomas', 'Sophie', 'Julien', 'Clara', 'Lucas', 'Emma', 'Hugo', 'Chloé', 'Antoine'];
const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (let i = 0; i < 10; i++) {
    const prenom = prenoms[i];
    const nom = noms[i];

    // Création d'utilisateurs
    const user = await prisma.user.create({
      data: {
        email: `${prenom.toLowerCase()}.${nom.toLowerCase()}${i}@sensante.fr`,
        password: hashedPassword,
        nom: nom,
        prenom: prenom,
        role: 'MEDECIN',
      },
    });

    // Création de patients
    const patient = await prisma.patient.create({
      data: {
        nom: noms[(i + 5) % 10],
        prenom: prenoms[(i + 5) % 10],
        dateNaissance: new Date('1980-01-01'),
        sexe: i % 2 === 0 ? 'M' : 'F',
        adresse: `${i + 1} rue de la République, Lyon`,
        telephone: `060102030${i}`,
        region: 'Auvergne-Rhône-Alpes',
      },
    });

    // Création de consultations
    await prisma.consultation.create({
      data: {
        date: new Date(),
        symptomes: { liste: ['Douleur localisée'] },
        diagnosticIa: 'Consultation standard',
        confiance: 0.85,
        statut: 'terminee',
        notes: 'Examen complet effectué.',
        patientId: patient.id,
        userId: user.id,
      },
    });
  }

  console.log('10 nouvelles lignes avec des noms réalistes ajoutées !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
