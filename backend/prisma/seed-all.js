const path = require("path");
const { execFileSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const { PERBERESIT, ne_lek } = require("./seed-real");

const prisma = new PrismaClient();

const N = "normale";
const T = "e_thate";
const Y = "e_yndyrshme";
const S = "sensitive";
const A = "akne_prone";

const GRUPET = {
  Cleanser: /^(cleansers?|pastrues\w*)$/i,
  Sunscreen: /^(spf|sunscreens?|sun\s*care|sun)$/i,
};

const PERBERES_EXTRA = {
  ...PERBERESIT,
  caffeine: ["Caffeine", "Ndihmon në zvogëlimin e fryrjes rreth syve"],
  ginseng: ["Ginseng Extract", "Ushqen dhe freskon lëkurën"],
  avocado: ["Avocado Oil", "Ushqen dhe zbut lëkurën e thatë"],
  petrolatum: [
    "Petrolatum",
    "Krijon një shtresë mbrojtëse që mban lagështinë në lëkurë",
  ],
};

const EXTRAS = [
  {
    kategoria: "Eye Cream",
    alias: /^(eye\s*(cream|care|serum)?|syte|sy)$/i,
    produktet: [
      [
        "CeraVe",
        "Eye Repair Cream",
        17,
        [N, T, S],
        ["ceramides", "hyaluronic", "niacinamide"],
        "Krem për zonën e syve me ceramide, hyaluronic acid dhe niacinamide. Hidraton lëkurën e hollë rreth syve dhe ndihmon që të duket më pak e lodhur.",
        [
          "Hidraton zonën e syve",
          "Teksturë e lehtë, pa aromë",
          "Aplikohet në mëngjes dhe mbrëmje",
        ],
        false,
      ],
      [
        "The INKEY List",
        "Caffeine Eye Cream",
        12,
        [N, T, Y],
        ["caffeine"],
        "Krem për syrin me kafeinë, që ndihmon në zvogëlimin e fryrjes dhe të pamjes së lodhur. Përdoret me një prekje të lehtë rreth syve.",
        [
          "Ndihmon kundër fryrjes",
          "Teksturë e lehtë",
          "Përdoret në mëngjes dhe mbrëmje",
        ],
        false,
      ],
      [
        "Kiehl's",
        "Creamy Eye Treatment with Avocado",
        34,
        [T, N],
        ["avocado"],
        "Krem i pasur për zonën e syve me vaj avokadoje. Ushqen dhe zbut lëkurën e thatë rreth syve.",
        [
          "Ushqim intensiv për lëkurën e thatë",
          "Teksturë kremoze",
          "Aplikohet në mëngjes dhe mbrëmje",
        ],
        false,
      ],
      [
        "Beauty of Joseon",
        "Revive Eye Serum: Ginseng + Retinal",
        17,
        [N, T, Y],
        ["ginseng", "retinal"],
        "Serum për syrin me ginseng dhe retinal, për rrudha të holla dhe lëkurë më të ngurtë rreth syve. Përdoret me kujdes dhe në sasi të vogël.",
        [
          "Ndihmon kundër rrudhave të holla",
          "Ushqen me ginseng",
          "Gjatë ditës nevojitet SPF",
        ],
        false,
      ],
      [
        "COSRX",
        "Advanced Snail Peptide Eye Cream",
        22,
        [N, T, S],
        ["snail", "peptides"],
        "Krem për zonën e syve me mucinë kërmilli dhe peptide. Hidraton dhe mbështet elasticitetin e lëkurës së hollë rreth syve.",
        [
          "Hidratim dhe elasticitet",
          "Peptide për lëkurën e pjekur",
          "Aplikohet në mëngjes dhe mbrëmje",
        ],
        false,
      ],
    ],
  },
  {
    kategoria: "Lip Care",
    alias: /^(lip\s*(care|balm)?|buzet|buzë\w*)$/i,
    produktet: [
      [
        "Laneige",
        "Lip Sleeping Mask",
        24,
        [N, T, Y, S],
        [],
        "Maskë nate për buzët, që aplikohet para gjumit dhe i lë buzët të buta dhe të hidratuara në mëngjes.",
        [
          "Hidratim gjatë natës",
          "Teksturë e trashë dhe kremoze",
          "Përdoret si hapi i fundit i rutinës",
        ],
        true,
      ],
      [
        "Vanicream",
        "Lip Protectant SPF 30",
        5,
        [N, T, S],
        [],
        "Balsam buzësh pa aromë me SPF 30, për buzë të thata dhe të ndjeshme. Mbron nga era dhe nga dielli.",
        [
          "Mbron nga dielli me SPF 30",
          "Pa aromë dhe pa ngjyrues",
          "Për buzë të ndjeshme",
        ],
        false,
      ],
      [
        "La Roche-Posay",
        "Cicaplast Lèvres B5",
        11,
        [S, T, N],
        ["panthenol"],
        "Balsam riparues për buzë të çara dhe të irrituara, me panthenol. Qetëson dhe mbron buzët.",
        [
          "Qetëson buzët e çara",
          "Panthenol për riparim",
          "Përdoret sa herë të duhet",
        ],
        false,
      ],
      [
        "NIVEA",
        "Essential Care Lip Balm",
        3,
        [N, T],
        [],
        "Balsam i thjeshtë për buzë të thata. Mban buzët të buta dhe i mbron nga tharja.",
        [
          "Përdorim ditor",
          "I lehtë për t'u mbajtur me vete",
          "Për buzë normale deri të thata",
        ],
        false,
      ],
    ],
  },
  {
    kategoria: "Body Care",
    alias: /^(body\s*(care|lotion|cream)?|trupi|trup)$/i,
    produktet: [
      [
        "CeraVe",
        "Moisturizing Lotion",
        17,
        [N, T, S],
        ["ceramides", "hyaluronic"],
        "Locion trupi me ceramide dhe hyaluronic acid, i lehtë por hidratues. Ndihmon barrierën e lëkurës dhe absorbohet shpejt.",
        [
          "Hidratim për tërë ditën",
          "Pa aromë",
          "Për lëkurë normale deri shumë të thatë",
        ],
        false,
      ],
      [
        "CeraVe",
        "SA Lotion for Rough & Bumpy Skin",
        20,
        [N, T, Y],
        ["ceramides", "salicylic", "hyaluronic"],
        "Locion trupi me salicylic acid për lëkurë të ashpër dhe me gunga të vogla. Lëmon lëkurën dhe e hidraton.",
        [
          "Lëmon lëkurën e ashpër",
          "Ceramide për hidratim",
          "Aplikohet pas dushit",
        ],
        false,
      ],
      [
        "Cetaphil",
        "Daily Hydrating Lotion",
        16,
        [N, T, S],
        ["hyaluronic", "glycerin"],
        "Locion ditor me hyaluronic acid, i lehtë dhe pa aromë. Hidraton trupin pa lënë ndjesi yndyrore.",
        [
          "Hidratim i lehtë ditor",
          "Absorbohet shpejt",
          "Për lëkurë të ndjeshme",
        ],
        false,
      ],
      [
        "Aveeno",
        "Daily Moisturizing Lotion",
        12,
        [N, T, S],
        ["oat"],
        "Locion trupi me tërshërë koloidale, për lëkurë të thatë. Hidraton dhe qetëson lëkurën gjatë gjithë ditës.",
        ["Qetëson lëkurën e thatë", "Teksturë e lehtë", "Përdoret çdo ditë"],
        false,
      ],
      [
        "Eucerin",
        "Original Healing Rich Creme",
        15,
        [T, S],
        [],
        "Krem i pasur për lëkurë shumë të thatë dhe të ashpër, për duar, kyçe dhe trup. Mbron dhe zbut lëkurën.",
        ["Për lëkurë shumë të thatë", "Teksturë e pasur", "Pa aromë"],
        false,
      ],
    ],
  },
  {
    kategoria: "Face Oil",
    alias: /^(face\s*oils?|oils?|vajra?|vaj)$/i,
    produktet: [
      [
        "The Ordinary",
        "100% Plant-Derived Squalane",
        9,
        [N, T, Y, S],
        ["squalane"],
        "Vaj i lehtë squalane që hidraton pa e rënduar lëkurën. Mund të përdoret vetëm ose pas serumit.",
        [
          "Hidraton pa u ndjerë yndyror",
          "Mund të përdoret edhe për flokë ose duar",
          "1-2 pika janë të mjaftueshme",
        ],
        false,
      ],
      [
        "The Ordinary",
        "100% Cold-Pressed Virgin Marula Oil",
        10,
        [T, N],
        ["oils"],
        "Vaj marula i shtypur në të ftohtë, për lëkurë të thatë. Ushqen dhe jep shkëlqim të shëndetshëm.",
        [
          "Ushqim për lëkurën e thatë",
          "Antioksidantë natyralë",
          "Aplikohet si hapi i fundit natën",
        ],
        false,
      ],
    ],
  },
  {
    kategoria: "Spot Treatment",
    alias: /^(spot\s*treatments?|treatments?|acne|patch\w*)$/i,
    produktet: [
      [
        "COSRX",
        "Acne Pimple Master Patch",
        5,
        [Y, A],
        [],
        "Pllaka të vogla hidrokoloidi që vendosen mbi puçrrat. Thithin lëngjet dhe e mbrojnë pikën nga prekja.",
        [
          "Mbron puçrrën nga prekja",
          "Thith lëngjet e tepërta",
          "Vendoset mbi lëkurë të pastër dhe të thatë",
        ],
        false,
      ],
      [
        "Hero Cosmetics",
        "Mighty Patch Original",
        13,
        [Y, A],
        [],
        "Pllaka hidrokoloidi për puçrra që kanë filluar të plasen. Pastrojnë dhe mbrojnë pikën gjatë natës.",
        [
          "Thith përmbajtjen e puçrrës",
          "Mbron nga prekja dhe infeksioni",
          "Mund të mbahet gjatë natës",
        ],
        false,
      ],
      [
        "The Ordinary",
        "Salicylic Acid 2% Solution",
        8,
        [Y, A],
        ["salicylic"],
        "Trajtim me 2% salicylic acid për puçrra dhe pore të bllokuara. Aplikohet mbi zonat me problem.",
        [
          "Pastron poret e bllokuara",
          "Ndihmon kundër puçrrave",
          "Përdoret natën; gjatë ditës SPF",
        ],
        false,
      ],
    ],
  },
  {
    kategoria: "Mist",
    alias: /^(mists?|toning\s*mists?|thermal\s*water)$/i,
    produktet: [
      [
        "Avène",
        "Thermal Spring Water",
        14,
        [S, N, T],
        ["thermal"],
        "Ujë termal në sprej që qetëson dhe freskon lëkurën e ndjeshme. Mund të spërkatet në çdo kohë gjatë ditës.",
        [
          "Qetëson dhe freskon",
          "Për lëkurë të ndjeshme",
          "Spërkatet nga një distancë",
        ],
        false,
      ],
      [
        "La Roche-Posay",
        "Thermal Spring Water",
        11,
        [S, N, T],
        ["thermal"],
        "Ujë termal në sprej, i pasur me selen, që qetëson lëkurën e irrituar. Mund të përdoret mbi make-up.",
        [
          "Qetëson lëkurën e irrituar",
          "Mund të përdoret mbi make-up",
          "Për lëkurë të ndjeshme",
        ],
        false,
      ],
      [
        "Uriage",
        "Thermal Water",
        11,
        [S, N, T],
        ["thermal"],
        "Ujë termal Uriage në sprej, i pasur me minerale. Freskon dhe qetëson lëkurën e ndjeshme.",
        [
          "Freskon lëkurën",
          "Qetëson skuqjen",
          "Për të gjitha llojet e lëkurës",
        ],
        false,
      ],
    ],
  },
  {
    kategoria: "Cleansing Oil",
    alias: /^(cleansing\s*(oil|balm)s?|balm|cleansing)$/i,
    produktet: [
      [
        "Beauty of Joseon",
        "Radiance Cleansing Balm",
        18,
        [N, T, Y, S],
        ["oils"],
        "Balsam pastrues që shkrihet në vaj dhe heq make-up-in dhe kremin e diellit. Hapi i parë i pastrimit të dyfishtë.",
        [
          "Heq make-up-in dhe SPF-në",
          "Teksturë balsami që shkrihet",
          "Pasohet nga një pastrues me ujë",
        ],
        false,
      ],
      [
        "Anua",
        "Heartleaf Pore Control Cleansing Oil",
        20,
        [Y, A, N, S],
        ["heartleaf"],
        "Vaj pastrues me heartleaf që heq make-up-in dhe yndyrën e tepërt. Hapi i parë i pastrimit të dyfishtë.",
        [
          "Heq make-up-in dhe papastërtitë",
          "Heartleaf për lëkurë të irrituar",
          "Pasohet nga pastrues me ujë",
        ],
        false,
      ],
      [
        "DHC",
        "Deep Cleansing Oil",
        30,
        [N, T, Y],
        ["oils"],
        "Vaj pastrues me vaj ulliri që heq make-up-in e rëndë dhe papastërtitë. Shpëlahet lehtë me ujë.",
        [
          "Heq make-up-in rezistent",
          "Vaj ulliri i pastër",
          "Përdoret mbi lëkurë të thatë",
        ],
        false,
      ],
    ],
  },
  {
    kategoria: "Cream",
    alias: /^(creams?|krem\w*)$/i,
    produktet: [
      [
        "Beauty of Joseon",
        "Dynasty Cream",
        18,
        [N, T, Y],
        ["rice", "ginseng"],
        "Krem hidratues me oriz dhe ginseng, me teksturë të lehtë që absorbohet shpejt. Lëkura mbetet e butë dhe me shkëlqim të shëndetshëm.",
        [
          "Hidraton pa e rënduar lëkurën",
          "Ushqen me oriz dhe ginseng",
          "Përdoret në mëngjes dhe mbrëmje",
        ],
        true,
      ],
      [
        "Purito",
        "Oat-in Calming Gel Cream",
        20,
        [S, A, N, Y],
        ["oat"],
        "Gel-krem qetësues me tërshërë, për lëkurë të ndjeshme ose të irrituar. Hidraton butësisht dhe nuk e rëndon lëkurën.",
        [
          "Qetëson lëkurën e irrituar",
          "Teksturë e lehtë gel-krem",
          "Për lëkurë të ndjeshme",
        ],
        false,
      ],
      [
        "Laneige",
        "Water Bank Blue Hyaluronic Cream Moisturizer",
        38,
        [N, T, Y],
        ["hyaluronic"],
        "Krem hidratues me hyaluronic acid blu, për lëkurë që ka nevojë për lagështi të vazhdueshme. Ka teksturë të lehtë dhe të freskët.",
        [
          "Hidratim i vazhdueshëm",
          "Teksturë e freskët, jo yndyrore",
          "Për lëkurë normale deri të thatë",
        ],
        false,
      ],
      [
        "Avène",
        "Tolérance Control Soothing Skin Recovery Cream",
        34,
        [S, T, N],
        ["thermal"],
        "Krem qetësues me ujë termal Avène, për lëkurë shumë të ndjeshme dhe reaktive. Formulë me pak përbërës dhe pa aromë.",
        [
          "Qetëson lëkurën reaktive",
          "Formulë minimale, pa aromë",
          "Për lëkurë shumë të ndjeshme",
        ],
        false,
      ],
      [
        "La Roche-Posay",
        "Toleriane Double Repair Face Moisturizer",
        22,
        [S, N, T],
        ["ceramides", "niacinamide", "glycerin"],
        "Krem fytyre me ceramide-3, niacinamide dhe glicerinë, për lëkurë të ndjeshme. Rimëkëmb barrierën e lëkurës dhe hidraton.",
        [
          "Forcon barrierën e lëkurës",
          "Hidratim ditor, pa aromë",
          "Për lëkurë të ndjeshme",
        ],
        false,
      ],
      [
        "Aestura",
        "Atobarrier 365 Cream",
        30,
        [T, S],
        ["ceramides"],
        "Krem barrierë me ceramide, për lëkurë të thatë dhe të ndjeshme. Ndihmon lëkurën të mbajë lagështinë dhe të rikuperohet.",
        [
          "Riparon barrierën e lëkurës",
          "Teksturë e pasur",
          "Për lëkurë të thatë dhe të ndjeshme",
        ],
        false,
      ],
    ],
  },
  {
    kategoria: "Të tjera",
    alias: /^(t[eë]\s*tjera|others?|misc\w*)$/i,
    produktet: [
      [
        "Aquaphor",
        "Healing Ointment",
        9,
        [T, S],
        ["panthenol", "glycerin", "petrolatum"],
        "Pomadë mbrojtëse për lëkurë shumë të thatë, të çarë ose të irrituar. Mund të përdoret në buzë, bërryla, këmbë dhe zona të tjera të thata.",
        [
          "Mbron dhe riparon lëkurën e thatë",
          "Përdorim i shumëfishtë",
          "Aplikohet në shtresë të hollë",
        ],
        false,
      ],
      [
        "Vaseline",
        "Original Petroleum Jelly",
        4,
        [T, N, S],
        ["petrolatum"],
        "Xhel klasik me vazelinë që mbyll lagështinë në lëkurë. Përdoret për buzë, duar, kyçe dhe lëkurë të thatë.",
        ["Mban lagështinë në lëkurë", "Përdorim i shumëfishtë", "Pa aromë"],
        false,
      ],
      [
        "Neutrogena",
        "Norwegian Formula Hand Cream",
        6,
        [T, N, S],
        ["glycerin"],
        "Krem duarsh i pasur me glicerinë, për duar shumë të thata dhe të çara. Absorbohet pa lënë shtresë yndyrore.",
        [
          "Hidratim intensiv për duart",
          "Mirë për sezonin e ftohtë",
          "Përdoret sa herë të duhet",
        ],
        false,
      ],
      [
        "La Roche-Posay",
        "Posthelios Hydrating After Sun Gel",
        22,
        [N, T, S],
        [],
        "Xhel i freskët që qetëson dhe hidraton lëkurën pas ekspozimit në diell. Aplikohet në fytyrë dhe në trup pas plazhit.",
        [
          "Qetëson lëkurën pas diellit",
          "Teksturë e freskët",
          "Aplikohet pas dushit",
        ],
        false,
      ],
    ],
  },
];

async function lexoKategorite() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { emri: "asc" },
  });
}

async function bashkoKategorite() {
  const kategorite = await lexoKategorite();
  let ndryshime = 0;

  for (const [kanonik, regex] of Object.entries(GRUPET)) {
    const perputhen = kategorite.filter((k) => regex.test(k.emri.trim()));
    if (perputhen.length === 0) continue;

    const objektivi =
      perputhen.find((k) => k.emri === kanonik) ||
      perputhen.reduce((a, b) =>
        b._count.products > a._count.products ? b : a,
      );
    const tjerat = perputhen.filter((k) => k.id !== objektivi.id);

    for (const k of tjerat) {
      await prisma.product.updateMany({
        where: { kategoriaId: k.id },
        data: { kategoriaId: objektivi.id },
      });
      await prisma.category.delete({ where: { id: k.id } });
      console.log(
        `  "${k.emri}" (${k._count.products} produkte) -> "${kanonik}"`,
      );
      ndryshime++;
    }

    if (objektivi.emri !== kanonik) {
      await prisma.category.update({
        where: { id: objektivi.id },
        data: { emri: kanonik },
      });
      console.log(`  "${objektivi.emri}" riemërtohet në "${kanonik}"`);
      ndryshime++;
    }
  }

  if (ndryshime === 0) console.log("  Nuk ka kategori të dyfishta.");
}

async function merrPerberesin(celesi) {
  const [emri, perfitimi] = PERBERES_EXTRA[celesi];
  const ekzistues = await prisma.ingredient.findFirst({ where: { emri } });
  if (ekzistues) return ekzistues;
  return prisma.ingredient.create({ data: { emri, perfitimi } });
}

function ndertoPershkrimin(paragrafi, pikat) {
  return `${paragrafi}\n\n${pikat.map((p) => `• ${p}`).join("\n")}`;
}

async function plotesoKategoriteBosh() {
  const kategorite = await lexoKategorite();
  const boshet = kategorite.filter((k) => k._count.products === 0);
  const pambuluara = [];
  let shtuar = 0;

  for (const k of boshet) {
    const grupi = EXTRAS.find((g) => g.alias.test(k.emri.trim()));
    if (!grupi) {
      pambuluara.push(k.emri);
      continue;
    }

    console.log(
      `  "${k.emri}" është bosh -> po shtoj ${grupi.produktet.length} produkte`,
    );

    for (const [
      marka,
      emri,
      usd,
      tipet,
      perberesit,
      paragrafi,
      pikat,
      promovim,
    ] of grupi.produktet) {
      const emriPlote = `${marka} ${emri}`;
      const lidhje = [];
      for (const celesi of perberesit) {
        const p = await merrPerberesin(celesi);
        lidhje.push({ ingredient: { connect: { id: p.id } } });
      }

      const ekziston = await prisma.product.findFirst({
        where: { emri: emriPlote },
      });
      const te_dhenat = {
        pershkrimi: ndertoPershkrimin(paragrafi, pikat),
        cmimi: ne_lek(usd),
        marka,
        tipiLekurePershtatshem: JSON.stringify(tipet),
        nePromovim: promovim,
        kategoria: { connect: { id: k.id } },
      };

      if (ekziston) {
        await prisma.product.update({
          where: { id: ekziston.id },
          data: {
            ...te_dhenat,
            ingredients: { deleteMany: {}, create: lidhje },
          },
        });
      } else {
        await prisma.product.create({
          data: {
            emri: emriPlote,
            stoku: 20 + Math.floor(Math.random() * 80),
            ...te_dhenat,
            ingredients: { create: lidhje },
          },
        });
      }
      shtuar++;
    }
  }

  return { shtuar, pambuluara };
}

async function main() {
  console.log("1) Po bashkoj kategoritë e dyfishta...");
  await bashkoKategorite();

  if (!process.argv.includes("--pa-seed")) {
    console.log("\n2) Po ekzekutoj seed-in e produkteve...");
    execFileSync(process.execPath, [path.join(__dirname, "seed-real.js")], {
      stdio: "inherit",
    });
  }

  console.log("\n3) Po plotësoj kategoritë bosh...");
  const { shtuar, pambuluara } = await plotesoKategoriteBosh();
  if (shtuar === 0 && pambuluara.length === 0) {
    console.log("  Asnjë kategori nuk është bosh.");
  }

  console.log("\nKategoritë tani:");
  for (const k of await lexoKategorite()) {
    console.log(`  ${String(k._count.products).padStart(3)}  ${k.emri}`);
  }

  if (pambuluara.length) {
    console.log(
      `\nKategori bosh që nuk i njoh ende: ${pambuluara.join(", ")}. Më thuaj emrat dhe i shtoj produktet.`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
