const prisma = require("../lib/prisma");

// si përkthehet rezultati i AI në vlerat që ke te produktet (tipiLekurePershtatshem)
const TIPI_NE_DB = {
  normale: ["normale"],
  e_thate: ["e_thate"],
  e_yndyrshme: ["e_yndyrshme"],
  e_perzier: ["normale", "e_yndyrshme"],
};

const PROBLEMI_NE_DB = {
  akne: "akne_prone",
  skuqje: "sensitive",
  ndjeshmeri: "sensitive",
};

const ETIKETA_TIPI = {
  normale: "normale",
  e_thate: "e thatë",
  e_yndyrshme: "e yndyrshme",
  e_perzier: "e përzier",
};

const ETIKETA_PROBLEMI = {
  akne: "akne",
  skuqje: "skuqje",
  ndjeshmeri: "ndjeshmëri",
  njolla_pigmentuese: "njolla pigmentuese",
  rrudha_te_holla: "rrudha të holla",
  pore_te_medha: "pore të mëdha",
  thatesi: "thatësi",
  yndyrshmeri_teper: "yndyrshmëri të tepërt",
  rrathe_te_zeza: "rrathë të errët",
};

// fjalë kyçe në emrin, përshkrimin ose përbërësit e produktit
const FJALET_KYCE = {
  akne: ["salicylic", "niacinamide", "zinc", "benzoyl", "tea tree", "clay"],
  skuqje: [
    "centella",
    "aloe",
    "panthenol",
    "allantoin",
    "soothing",
    "calming",
    "azelaic",
  ],
  ndjeshmeri: [
    "centella",
    "aloe",
    "panthenol",
    "allantoin",
    "soothing",
    "calming",
    "fragrance-free",
  ],
  njolla_pigmentuese: [
    "vitamin c",
    "ascorbic",
    "niacinamide",
    "brightening",
    "arbutin",
    "kojic",
    "spf",
  ],
  rrudha_te_holla: [
    "retinol",
    "peptide",
    "collagen",
    "bakuchiol",
    "anti-aging",
    "spf",
  ],
  pore_te_medha: ["niacinamide", "salicylic", "bha", "clay"],
  thatesi: [
    "hyaluronic",
    "ceramide",
    "glycerin",
    "squalane",
    "hydrat",
    "moistur",
  ],
  yndyrshmeri_teper: [
    "niacinamide",
    "zinc",
    "gel",
    "mattif",
    "oil-free",
    "oil free",
  ],
  rrathe_te_zeza: ["caffeine", "eye", "vitamin k"],
};

function lexoTipet(produkti) {
  try {
    const tipet = JSON.parse(produkti.tipiLekurePershtatshem || "[]");
    return Array.isArray(tipet) ? tipet : [];
  } catch (e) {
    return [];
  }
}

async function rekomandoProdukte(analiza, limiti = 5) {
  const produktet = await prisma.product.findMany({
    include: { ingredients: { include: { ingredient: true } } },
  });

  const tipetKerkuara = new Set(TIPI_NE_DB[analiza.tipiLekure] || ["normale"]);
  const etiketaTipit = ETIKETA_TIPI[analiza.tipiLekure] || "normale";

  const rezultatet = [];

  for (const p of produktet) {
    const tipet = lexoTipet(p);
    const tekst = [
      p.emri,
      p.pershkrimi || "",
      ...p.ingredients.map((pi) => pi.ingredient.emri),
    ]
      .join(" ")
      .toLowerCase();

    let pike = 0;
    const arsyet = [];

    if (tipet.some((t) => tipetKerkuara.has(t))) {
      pike += 3;
      arsyet.push(`I përshtatshëm për lëkurë ${etiketaTipit}`);
    }

    const problemetPerputhur = [];
    for (const problemi of analiza.problemet) {
      const tipiDb = PROBLEMI_NE_DB[problemi];
      const nePerputhjeDb = tipiDb && tipet.includes(tipiDb);
      const fjalet = FJALET_KYCE[problemi] || [];
      const nePerputhjeTekst = fjalet.some((f) => tekst.includes(f));
      if (nePerputhjeDb || nePerputhjeTekst) {
        problemetPerputhur.push(ETIKETA_PROBLEMI[problemi] || problemi);
        pike += 2;
      }
    }
    if (problemetPerputhur.length) {
      arsyet.push(`Ndihmon me: ${problemetPerputhur.join(", ")}`);
    }

    if (pike > 0) {
      rezultatet.push({
        id: p.id,
        emri: p.emri,
        pershkrimi: p.pershkrimi,
        cmimi: p.cmimi,
        arsyeja: arsyet.join(". "),
        pike,
      });
    }
  }

  rezultatet.sort((a, b) => b.pike - a.pike || a.emri.localeCompare(b.emri));

  return rezultatet.slice(0, limiti).map(({ pike, ...pjesa }) => pjesa);
}

module.exports = { rekomandoProdukte };
