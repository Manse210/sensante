import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage rapide si nécessaire
  await prisma.consultation.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // Création d'utilisateurs
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'medecin@sensante.fr',
      password: hashedPassword,
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'MEDECIN',
    },
  });

  // Création de patients
  const patient = await prisma.patient.create({
    data: {
      nom: 'Martin',
      prenom: 'Alice',
      dateNaissance: new Date('1985-05-15'),
      sexe: 'F',
      adresse: '12 rue des Fleurs, Paris',
      telephone: '0601020304',
      region: 'Île-de-France',
    },
  });

  // Création de consultations
  await prisma.consultation.create({
    data: {
      date: new Date(),
      symptomes: { liste: ['Fièvre', 'Toux'] },
      diagnosticIa: 'Grippe probable',
      confiance: 0.85,
      statut: 'terminee',
      notes: 'Patient calme, traitement prescrit.',
      patientId: patient.id,
      userId: user.id,
    },
  });

  console.log('Données de test insérées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
