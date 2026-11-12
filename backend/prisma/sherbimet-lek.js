const prisma = require("../lib/prisma");

const KURSI = 95;
const rrumbullako = (v) => Math.round((v * KURSI) / 50) * 50;

async function main() {
  const sherbimet = await prisma.service.findMany();
  for (const s of sherbimet) {
    if (s.cmimi >= 1000) {
      console.log(`Kalohet: ${s.emri} (${s.cmimi} Lek)`);
      continue;
    }
    const cmimiRi = rrumbullako(s.cmimi);
    await prisma.service.update({
      where: { id: s.id },
      data: { cmimi: cmimiRi },
    });
    console.log(`${s.emri}: ${s.cmimi} -> ${cmimiRi} Lek`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
