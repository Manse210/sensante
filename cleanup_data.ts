import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Suppression des utilisateurs, patients et consultations dont les noms contiennent des chiffres (données génériques)
  // On cible les enregistrements créés lors des tests précédents basés sur des patterns comme 'Nom1', 'Prenom1'
  
  const resultConsultations = await prisma.consultation.deleteMany({
    where: {
      OR: [
        { notes: { contains: 'Notes de consultation' } },
        { diagnosticIa: { contains: 'Diagnostic test' } }
      ]
    }
  });

  const resultPatients = await prisma.patient.deleteMany({
    where: {
      OR: [
        { nom: { contains: 'PatientNom' } },
        { prenom: { contains: 'PatientPrenom' } }
      ]
    }
  });

  const resultUsers = await prisma.user.deleteMany({
    where: {
      OR: [
        { nom: { contains: 'Nom' } },
        { prenom: { contains: 'Prenom' } }
      ],
      // On garde uniquement les utilisateurs qui ont des noms réalistes (Alice, Thomas, etc.)
      NOT: {
        nom: { in: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'] }
      }
    }
  });

  console.log(`Suppression effectuée: ${resultConsultations.count} consultations, ${resultPatients.count} patients, ${resultUsers.count} utilisateurs supprimés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
