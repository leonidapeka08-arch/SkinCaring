const prisma = require("../lib/prisma");

const KATEGORITE = [
  "Cleanser",
  "Toner",
  "Serum",
  "Cream",
  "Mask",
  "SPF",
  "Të tjera",
];

function gjejKategorineEmrin(emri = "") {
  const e = emri.toLowerCase();

  if (e.includes("cleanser") || e.includes("wash") || e.includes("micellar")) {
    return "Cleanser";
  }
  if (e.includes("toner")) {
    return "Toner";
  }
  if (
    e.includes("serum") ||
    e.includes("acid") ||
    e.includes("essence") ||
    e.includes("treatment")
  ) {
    return "Serum";
  }
  if (e.includes("mask") || e.includes("clay") || e.includes("scrub")) {
    return "Mask";
  }
  if (e.includes("spf") || e.includes("sun")) {
    return "SPF";
  }
  if (
    e.includes("cream") ||
    e.includes("moistur") ||
    e.includes("balm") ||
    e.includes("oil")
  ) {
    return "Cream";
  }

  return "Të tjera";
}

async function run() {
  console.log("Duke krijuar kategoritë...");

  const kategoriaIdSipasEmrit = {};

  for (const emri of KATEGORITE) {
    const kategoria = await prisma.category.upsert({
      where: { emri },
      update: {},
      create: { emri },
    });
    kategoriaIdSipasEmrit[emri] = kategoria.id;
    console.log(`  ✓ ${emri}`);
  }

  console.log("\nDuke lidhur produktet me kategoritë...");

  const produktet = await prisma.product.findMany();

  let numriPerditesuar = 0;

  for (const produkt of produktet) {
    const emriKategorise = gjejKategorineEmrin(produkt.emri);
    const kategoriaId = kategoriaIdSipasEmrit[emriKategorise];

    if (produkt.kategoriaId !== kategoriaId) {
      await prisma.product.update({
        where: { id: produkt.id },
        data: { kategoriaId },
      });
      numriPerditesuar++;
      console.log(`  ${produkt.emri} → ${emriKategorise}`);
    }
  }

  console.log(
    `\nU përditësuan ${numriPerditesuar} nga ${produktet.length} produkte.`,
  );
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
