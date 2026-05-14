import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Ajout de nouveaux utilisateurs, patients et consultations sans supprimer l'existant
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'nouveau.medecin@sensante.fr',
      password: hashedPassword,
      nom: 'Durand',
      prenom: 'Pierre',
      role: 'MEDECIN',
    },
  });

  const patient = await prisma.patient.create({
    data: {
      nom: 'Petit',
      prenom: 'Sophie',
      dateNaissance: new Date('1992-08-20'),
      sexe: 'F',
      adresse: '45 avenue des Lilas, Lyon',
      telephone: '0611223344',
      region: 'Auvergne-Rhône-Alpes',
    },
  });

  await prisma.consultation.create({
    data: {
      date: new Date(),
      symptomes: { liste: ['Maux de tête'] },
      diagnosticIa: 'Migraine',
      confiance: 0.92,
      statut: 'en_attente',
      notes: 'Consultation de suivi.',
      patientId: patient.id,
      userId: user.id,
    },
  });

  console.log('Nouvelles données de test ajoutées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
