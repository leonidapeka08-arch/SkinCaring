const cloudinary = require("cloudinary").v2;
const prisma = require("../lib/prisma");
const { analizoFoton } = require("./gemini.service");
const { rekomandoProdukte } = require("./skinRecommendation.service");

// këto probleme e bëjnë analizën të pasigurt, ndaj e refuzojmë foton
const SHKAQET_BLLOKUESE = [
  "nuk_ka_fytyre",
  "e_turbullt",
  "shume_erret",
  "fytyre_e_mbuluar",
  "shume_fytyra",
  "filter",
];

const KESHILLAT_FOTOS = {
  nuk_ka_fytyre: "Nuk u pa një fytyrë e qartë. Vendose fytyrën drejt kamerës.",
  e_turbullt: "Fotoja është e turbullt. Mbaje telefonin të qëndrueshëm.",
  shume_erret:
    "Fotoja është shumë e errët. Provo me dritë natyrale (pranë dritares).",
  fytyre_e_mbuluar:
    "Fytyra është pjesërisht e mbuluar. Hiq syzet, flokët ose maskën.",
  shume_fytyra: "Në foto duhet të jetë vetëm një fytyrë.",
  filter: "Duket se fotoja ka filter. Provo një foto pa filter.",
};

class GabimFoto extends Error {
  constructor(mesazhi, keshilla) {
    super(mesazhi);
    this.status = 422;
    this.keshilla = keshilla;
  }
}

async function analizoDheRuaj({ userId, buffer, mimetype }) {
  // 1. analiza (para se ta ruajmë foton fare)
  const analiza = await analizoFoton(buffer, mimetype);

  // 2. kontrollo cilësinë e fotos
  const shkaqet = new Set(analiza.problemeFoto);
  if (!analiza.faceDetected) shkaqet.add("nuk_ka_fytyre");

  const bllokuese = [...shkaqet].filter((s) => SHKAQET_BLLOKUESE.includes(s));
  if (bllokuese.length || analiza.cilesiaFotos === "e_dobet") {
    const keshilla = bllokuese.map((s) => KESHILLAT_FOTOS[s]).filter(Boolean);
    if (!keshilla.length) {
      keshilla.push(
        "Provo një foto më të qartë, me dritë natyrale, pa makeup dhe pa filter.",
      );
    }
    throw new GabimFoto(
      "Fotoja nuk është e mjaftueshme për analizë.",
      keshilla,
    );
  }

  // 3. produktet nga DB
  const rekomandimet = await rekomandoProdukte(analiza, 5);

  // 4. ruaj foton (vetëm tani që është e vlefshme)
  const b64 = buffer.toString("base64");
  const dataURI = `data:${mimetype};base64,${b64}`;
  const ngarkimi = await cloudinary.uploader.upload(dataURI, {
    folder: "skincaring/face-scans",
  });

  const faceScan = await prisma.faceScan.create({
    data: {
      userId,
      imageUrl: ngarkimi.secure_url,
      aiAnaliza: JSON.stringify({
        analiza,
        produktetId: rekomandimet.map((r) => r.id),
      }),
    },
  });

  return {
    message: "Analiza u krye me sukses",
    faceScan: {
      id: faceScan.id,
      imageUrl: faceScan.imageUrl,
      data: faceScan.data,
    },
    analiza,
    paralajmerime: [...shkaqet]
      .filter((s) => !SHKAQET_BLLOKUESE.includes(s))
      .map((s) =>
        s === "makeup_i_rende"
          ? "Makeup-i mund ta fshehë lëkurën e vërtetë, ndaj rezultati është më pak i besueshëm."
          : "Drita e fortë mund ta ndryshojë pamjen e lëkurës.",
      ),
    rekomandimet,
  };
}

module.exports = { analizoDheRuaj };
