const prisma = require("../lib/prisma");

const ORARET = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
const DITE = 14;

const shtoOre = (ora) => {
  const [h, m] = ora.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

async function main() {
  const fshire = await prisma.dermatologistAvailability.deleteMany({
    where: { iZene: false },
  });
  console.log(`U fshinë ${fshire.count} orare të lira të vjetra`);

  const dermatologet = await prisma.dermatologist.findMany();
  const tani = new Date();
  const rreshta = [];

  for (const d of dermatologet) {
    for (let i = 1; i <= DITE; i++) {
      const dita = new Date(
        tani.getFullYear(),
        tani.getMonth(),
        tani.getDate() + i,
        12,
        0,
        0,
      );
      const javaDita = dita.getDay();
      if (javaDita === 0 || javaDita === 6) continue;
      for (const ora of ORARET) {
        rreshta.push({
          dermatologistId: d.id,
          data: dita,
          oraFillimit: ora,
          oraMbarimit: shtoOre(ora),
        });
      }
    }
  }

  await prisma.dermatologistAvailability.createMany({ data: rreshta });
  console.log(
    `U krijuan ${rreshta.length} orare të reja për ${dermatologet.length} dermatologë`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
