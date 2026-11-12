const prisma = require("./lib/prisma");

async function main() {
  const products = [
    {
      emri: "Gentle Foaming Cleanser",
      pershkrimi: "Pastrues i butë për lëkurë të thatë dhe sensitive",
      cmimi: 18.99,
      marka: "CeraVe",
      stoku: 50,
      tipiLekurePershtatshem: ["e_thate", "sensitive"],
    },
    {
      emri: "Niacinamide 10% Serum",
      pershkrimi: "Ser që kontrollon yndyrën dhe zvogëlon puçrrat",
      cmimi: 12.5,
      marka: "The Ordinary",
      stoku: 80,
      tipiLekurePershtatshem: ["e_yndyrshme", "akne_prone"],
    },
    {
      emri: "Moisturizing Cream",
      pershkrimi: "Krem i pasur me ceramide për hidratim afatgjatë",
      cmimi: 16.99,
      marka: "CeraVe",
      stoku: 60,
      tipiLekurePershtatshem: ["e_thate", "normale"],
    },
    {
      emri: "Ultra Light SPF 50",
      pershkrimi: "Mbrojtje diellore e lehtë, jo yndyrshme",
      cmimi: 22.0,
      marka: "La Roche-Posay",
      stoku: 40,
      tipiLekurePershtatshem: [
        "e_thate",
        "e_yndyrshme",
        "normale",
        "sensitive",
      ],
    },
    {
      emri: "Calming Redness Relief Serum",
      pershkrimi: "Qetëson skuqjen dhe irritimin",
      cmimi: 19.99,
      marka: "La Roche-Posay",
      stoku: 35,
      tipiLekurePershtatshem: ["sensitive"],
    },
    {
      emri: "Balancing Toner",
      pershkrimi: "Toner pa alkool, ekuilibron pH-in e lëkurës",
      cmimi: 9.99,
      marka: "Neutrogena",
      stoku: 70,
      tipiLekurePershtatshem: ["e_yndyrshme", "normale"],
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        tipiLekurePershtatshem: JSON.stringify(p.tipiLekurePershtatshem),
      },
    });
  }

  console.log(`✅ ${products.length} produkte u shtuan me sukses!`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
