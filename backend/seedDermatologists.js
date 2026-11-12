const bcrypt = require('bcrypt');
const prisma = require('./lib/prisma');

async function main() {
  // Krijo 2 "user" për dermatologë (duhet të jenë edhe User edhe Dermatologist)
  const passwordHash = await bcrypt.hash('derma12345', 10);

  const user1 = await prisma.user.create({
    data: {
      emri: 'Dr. Elena Krasniqi',
      email: 'elena@skincaring.com',
      passwordHash,
      roli: 'dermatolog',
    },
  });

  const derma1 = await prisma.dermatologist.create({
    data: {
      userId: user1.id,
      specializimi: 'Dermatologji e Përgjithshme & Akne',
      bio: '10 vite eksperiencë në trajtimin e lëkurës problematike.',
      vitiEksperience: 10,
      iVerifikuar: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      emri: 'Dr. Ardit Hoxha',
      email: 'ardit@skincaring.com',
      passwordHash,
      roli: 'dermatolog',
    },
  });

  const derma2 = await prisma.dermatologist.create({
    data: {
      userId: user2.id,
      specializimi: 'Anti-Aging & Estetikë',
      bio: 'Specializuar në trajtime anti-moshim dhe facial-e.',
      vitiEksperience: 7,
      iVerifikuar: true,
    },
  });

  // Krijo shërbimet
  const sherbimet = await Promise.all([
    prisma.service.create({
      data: { emri: 'Konsultë Dermatologjike', pershkrimi: 'Vlerësim i përgjithshëm i lëkurës', kohezgjatja: 30, cmimi: 40, tipi: 'konsulte' },
    }),
    prisma.service.create({
      data: { emri: 'Pastrim i Thellë (Deep Cleansing Facial)', pershkrimi: 'Pastrim profesional i poreve', kohezgjatja: 60, cmimi: 55, tipi: 'facial' },
    }),
    prisma.service.create({
      data: { emri: 'Trajtim Anti-Akne', pershkrimi: 'Trajtim i specializuar për lëkurë me akne', kohezgjatja: 45, cmimi: 65, tipi: 'treatment' },
    }),
    prisma.service.create({
      data: { emri: 'Trajtim Anti-Aging', pershkrimi: 'Trajtim kundër shenjave të moshimit', kohezgjatja: 50, cmimi: 80, tipi: 'treatment' },
    }),
  ]);

  // Lidh dermatologët me shërbimet
  await prisma.dermatologistService.createMany({
    data: [
      { dermatologistId: derma1.id, serviceId: sherbimet[0].id },
      { dermatologistId: derma1.id, serviceId: sherbimet[1].id },
      { dermatologistId: derma1.id, serviceId: sherbimet[2].id },
      { dermatologistId: derma2.id, serviceId: sherbimet[0].id },
      { dermatologistId: derma2.id, serviceId: sherbimet[3].id },
    ],
  });

  // Krijo disa orare të lira (7 ditët e ardhshme, 2 slote në ditë, për secilin dermatolog)
  const oraret = ['10:00', '14:00'];
  const sotData = new Date();

  for (const derma of [derma1, derma2]) {
    for (let d = 1; d <= 7; d++) {
      const data = new Date(sotData);
      data.setDate(data.getDate() + d);

      for (const ora of oraret) {
        await prisma.dermatologistAvailability.create({
          data: {
            dermatologistId: derma.id,
            data,
            oraFillimit: ora,
            oraMbarimit: ora,
            iZene: false,
          },
        });
      }
    }
  }

  console.log('✅ Dermatologët, shërbimet dhe oraret u krijuan me sukses!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());