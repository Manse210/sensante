import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (let i = 1; i <= 10; i++) {
    // 1. Création d'utilisateurs
    const user = await prisma.user.create({
      data: {
        email: `medecin${i}@sensante.fr`,
        password: hashedPassword,
        nom: `Nom${i}`,
        prenom: `Prenom${i}`,
        role: 'MEDECIN',
      },
    });

    // 2. Création de patients
    const patient = await prisma.patient.create({
      data: {
        nom: `PatientNom${i}`,
        prenom: `PatientPrenom${i}`,
        dateNaissance: new Date(`1980-01-01`),
        sexe: i % 2 === 0 ? 'M' : 'F',
        adresse: `${i} rue de la Paix`,
        telephone: `060000000${i}`,
        region: 'Bretagne',
      },
    });

    // 3. Création de consultations
    await prisma.consultation.create({
      data: {
        date: new Date(),
        symptomes: { liste: ['Symptome' + i] },
        diagnosticIa: 'Diagnostic test ' + i,
        confiance: 0.8 + (i * 0.01),
        statut: 'terminee',
        notes: 'Notes de consultation ' + i,
        patientId: patient.id,
        userId: user.id,
      },
    });
  }

  console.log('10 nouvelles lignes ajoutées dans chaque table avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
