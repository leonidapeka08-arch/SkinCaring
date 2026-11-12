const prisma = require("./lib/prisma");

async function main() {
  await prisma.quizOption.deleteMany();
  await prisma.quizQuestion.deleteMany();

  const pyetjet = [
    {
      teksti: "Si ndihet lëkura jote 2-3 orë pas larjes së fytyrës?",
      options: [
        { teksti: "E tendosur dhe e thatë", pikeThatesi: 3 },
        { teksti: "E yndyrshme, veçanërisht në ballë/hundë", pikeYndyre: 3 },
        { teksti: "Normale, e ekuilibruar", pikeThatesi: 1, pikeYndyre: 1 },
        {
          teksti: "E përzier (yndyrshme në qendër, e thatë anash)",
          pikeThatesi: 1,
          pikeYndyre: 2,
        },
      ],
    },
    {
      teksti: "A ke shpesh puçrra ose pika të zeza?",
      options: [
        { teksti: "Po, shpesh", pikeAkne: 3 },
        { teksti: "Ndonjëherë", pikeAkne: 1 },
        { teksti: "Rrallë ose asnjëherë", pikeAkne: 0 },
      ],
    },
    {
      teksti: "A skuqet ose irritohet lehtë lëkura jote?",
      options: [
        {
          teksti: "Po, shpesh reagon ndaj produkteve të reja",
          pikeNdjeshmeri: 3,
        },
        { teksti: "Ndonjëherë", pikeNdjeshmeri: 1 },
        { teksti: "Jo, toleron pothuajse gjithçka", pikeNdjeshmeri: 0 },
      ],
    },
    {
      teksti: "Si duken poret e tua?",
      options: [
        { teksti: "Të dukshme dhe të mëdha", pikeYndyre: 2, pikeAkne: 1 },
        { teksti: "Të vogla, mezi dallohen", pikeThatesi: 2 },
        { teksti: "Normale", pikeThatesi: 1, pikeYndyre: 1 },
      ],
    },
    {
      teksti: "Në fund të ditës, si ndihet lëkura?",
      options: [
        { teksti: "E shndritshme/yndyrshme", pikeYndyre: 3 },
        { teksti: "E ngurtë dhe e thatë", pikeThatesi: 3 },
        { teksti: "E kuqe ose e irrituar", pikeNdjeshmeri: 2 },
        { teksti: "Normale, s'ndryshon shumë", pikeThatesi: 1, pikeYndyre: 1 },
      ],
    },
    {
      teksti: "Si reagon lëkura jote kur provon një produkt të ri?",
      options: [
        { teksti: "Shpesh skuqet ose më djeg", pikeNdjeshmeri: 3 },
        { teksti: "Ndonjëherë ka reaksion të lehtë", pikeNdjeshmeri: 1 },
        { teksti: "Zakonisht s'ka problem", pikeNdjeshmeri: 0 },
      ],
    },
    {
      teksti: "Sa shpesh ke skuqje në faqe?",
      options: [
        { teksti: "Shpesh, pa arsye të qartë", pikeNdjeshmeri: 2 },
        { teksti: "Vetëm kur bën nxehtë ose stres", pikeNdjeshmeri: 1 },
        { teksti: "Pothuajse kurrë", pikeNdjeshmeri: 0 },
      ],
    },
    {
      teksti: 'A shndrit "T-zona" (ballë, hundë, mjekër) në mes të ditës?',
      options: [
        { teksti: "Po, shumë, duhet ta fshij", pikeYndyre: 3 },
        { teksti: "Pak", pikeYndyre: 1 },
        { teksti: "Jo fare, mbetet mat", pikeThatesi: 2 },
      ],
    },
    {
      teksti: "Si do ta përshkruaje teksturën e lëkurës tënde?",
      options: [
        { teksti: "E ashpër, me vende të thara", pikeThatesi: 3 },
        { teksti: "E butë por e yndyrshme", pikeYndyre: 2 },
        { teksti: "E lëmuar dhe e ekuilibruar", pikeThatesi: 1, pikeYndyre: 1 },
      ],
    },
    {
      teksti: "A të dalin puçrra kur je nën stres ose para ciklit?",
      options: [
        { teksti: "Po, shpesh", pikeAkne: 3 },
        { teksti: "Ndonjëherë, pak", pikeAkne: 1 },
        { teksti: "Jo", pikeAkne: 0 },
      ],
    },
    {
      teksti: "Si ndihet lëkura jote në dimër (mot i ftohtë)?",
      options: [
        { teksti: "Shumë e thatë dhe e ashpër", pikeThatesi: 3 },
        { teksti: "Normale, pak ndryshim", pikeThatesi: 1 },
        { teksti: "Ende yndyrshme", pikeYndyre: 2 },
      ],
    },
    {
      teksti: "A vëren rrudha ose vija të imëta rreth syve/gojës?",
      options: [
        { teksti: "Po, disa", pikeThatesi: 2 },
        { teksti: "Vetëm pak, mezi dallohen", pikeThatesi: 1 },
        { teksti: "Jo ende", pikeThatesi: 0 },
      ],
    },
    {
      teksti: "Si reagon lëkura jote pas ekspozimit në diell?",
      options: [
        { teksti: "Digjet/skuqet lehtë", pikeNdjeshmeri: 3 },
        { teksti: "Nxihet pa problem", pikeNdjeshmeri: 0 },
        { teksti: "Bëhet më e yndyrshme", pikeYndyre: 1 },
      ],
    },
    {
      teksti: "A ke pika të zeza (blackheads) në hundë ose mjekër?",
      options: [
        { teksti: "Po, shumë", pikeAkne: 2, pikeYndyre: 1 },
        { teksti: "Pak", pikeAkne: 1 },
        { teksti: "Jo", pikeAkne: 0 },
      ],
    },
    {
      teksti: "Si ndihet lëkura menjëherë pas larjes me sapun/pastrues?",
      options: [
        { teksti: 'Shumë e tendosur, si "kërcet"', pikeThatesi: 3 },
        { teksti: "Normale", pikeThatesi: 1, pikeYndyre: 1 },
        { teksti: "Ende pak yndyrshme", pikeYndyre: 2 },
      ],
    },
  ];

  for (let i = 0; i < pyetjet.length; i++) {
    const p = pyetjet[i];
    await prisma.quizQuestion.create({
      data: {
        teksti: p.teksti,
        renditja: i + 1,
        options: { create: p.options },
      },
    });
  }

  console.log(`✅ ${pyetjet.length} pyetje u shtuan me sukses!`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
