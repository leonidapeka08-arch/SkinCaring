const prisma = require("./lib/prisma");

async function main() {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });

  const pareShembull = new Set();
  const perFshirje = [];

  for (const p of products) {
    const celesi = `${p.emri}|${p.marka}`;
    if (pareShembull.has(celesi)) {
      perFshirje.push(p.id);
    } else {
      pareShembull.add(celesi);
    }
  }

  console.log(
    `Gjetën ${perFshirje.length} produkte të dyfishta për t'u fshirë...`,
  );

  // Fshi lidhjet e rekomanduara që i referojnë këto produkte 
  await prisma.recommendedProduct.deleteMany({
    where: { productId: { in: perFshirje } },
  });

  // Fshi produktet e dyfishta
  const rezultat = await prisma.product.deleteMany({
    where: { id: { in: perFshirje } },
  });

  console.log(`✅ U fshinë ${rezultat.count} produkte të dyfishta!`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
