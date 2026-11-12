const { GoogleGenAI } = require("@google/genai");

const MODELET = [
  ...new Set([
    process.env.GEMINI_MODEL || "gemini-3.8-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
  ]),
];

const TIPET_LEKURES = ["normale", "e_thate", "e_yndyrshme", "e_perzier"];
const PROBLEMET = [
  "akne",
  "skuqje",
  "ndjeshmeri",
  "njolla_pigmentuese",
  "rrudha_te_holla",
  "pore_te_medha",
  "thatesi",
  "yndyrshmeri_teper",
  "rrathe_te_zeza",
];
const PROBLEMET_FOTOS = [
  "nuk_ka_fytyre",
  "e_turbullt",
  "shume_erret",
  "teper_e_ndritshme",
  "fytyre_e_mbuluar",
  "makeup_i_rende",
  "filter",
  "shume_fytyra",
];
const CILESITE = ["e_mire", "e_pranueshme", "e_dobet"];
const BESUESHMERITE = ["e_ulet", "mesatare", "e_larte"];

const SKEMA = {
  type: "object",
  properties: {
    faceDetected: { type: "boolean" },
    sasiaFytyrave: { type: "integer" },
    cilesiaFotos: { type: "string", enum: CILESITE },
    problemeFoto: {
      type: "array",
      items: { type: "string", enum: PROBLEMET_FOTOS },
    },
    tipiLekure: { type: "string", enum: TIPET_LEKURES },
    problemet: { type: "array", items: { type: "string", enum: PROBLEMET } },
    besueshmeria: { type: "string", enum: BESUESHMERITE },
    vezhgimet: { type: "array", items: { type: "string" } },
    pershkrimi: { type: "string" },
    keshilla: { type: "array", items: { type: "string" } },
    duhetDermatolog: { type: "boolean" },
    arsyejaDermatolog: { type: "string" },
  },
  required: [
    "faceDetected",
    "sasiaFytyrave",
    "cilesiaFotos",
    "problemeFoto",
    "tipiLekure",
    "problemet",
    "besueshmeria",
    "vezhgimet",
    "pershkrimi",
    "keshilla",
    "duhetDermatolog",
    "arsyejaDermatolog",
  ],
};

const UDHEZIMET = `
You are a cosmetic skin-assessment assistant for a skincare shop. You look at ONE selfie and describe only what is VISIBLE.

Rules:
- You are NOT a doctor. Never diagnose diseases and never name medical conditions (no acne vulgaris, rosacea, eczema, melanoma...). Use plain cosmetic terms only.
- Never guess or mention age, gender, ethnicity, attractiveness or identity.
- faceDetected=true only if exactly one clear human face is visible. Otherwise faceDetected=false, set problemeFoto accordingly (nuk_ka_fytyre or shume_fytyra), tipiLekure="normale", problemet=[], besueshmeria="e_ulet".
- Judge photo quality honestly: cilesiaFotos="e_dobet" if the skin cannot be assessed (blurry, very dark, face covered, heavy filter). List every issue in problemeFoto.
- besueshmeria="e_larte" ONLY with sharp image, good natural light, no makeup, no filter. Makeup, filters, strong shadows or colored light must lower it.
- tipiLekure: normale, e_thate (dry), e_yndyrshme (oily), e_perzier (oily T-zone + dry/normal cheeks).
- problemet: include a concern only if you can clearly see evidence for it. Do not invent concerns. An empty list is a valid answer.
- vezhgimet: 2-5 short, concrete visible observations (e.g. "shkëlqim në ballë dhe hundë"). Each must justify a choice above.
- pershkrimi: 1-2 sentences summary. keshilla: 2-4 short, safe skincare tips (cleansing, moisturizer, SPF). No medication advice.
- duhetDermatolog=true only if something looks unusual and worth a professional look (e.g. a single dark/irregular spot, an open or bleeding lesion, severe widespread inflammation). Then explain briefly in arsyejaDermatolog; otherwise leave it "".
- Write ALL free-text fields (vezhgimet, pershkrimi, keshilla, arsyejaDermatolog) in Albanian. Enum values must be copied exactly from the schema.
`;

let klienti = null;
function merrKlientin() {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error("GEMINI_API_KEY mungon te .env");
    err.kodi = "AI_KONFIGURIM";
    throw err;
  }
  if (!klienti) {
    klienti = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return klienti;
}

const pauze = (ms) => new Promise((r) => setTimeout(r, ms));

function zgjidh(vlera, lista, fallback) {
  return lista.includes(vlera) ? vlera : fallback;
}

function listaMeVlera(vlerat, lista) {
  if (!Array.isArray(vlerat)) return [];
  return [...new Set(vlerat.filter((v) => lista.includes(v)))];
}

function listaTekstesh(vlerat, max) {
  if (!Array.isArray(vlerat)) return [];
  return vlerat
    .filter((v) => typeof v === "string" && v.trim())
    .map((v) => v.trim().slice(0, 200))
    .slice(0, max);
}

function pastro(raw) {
  const faceDetected = raw.faceDetected === true;
  return {
    faceDetected,
    sasiaFytyrave: Number.isInteger(raw.sasiaFytyrave)
      ? raw.sasiaFytyrave
      : faceDetected
        ? 1
        : 0,
    cilesiaFotos: zgjidh(raw.cilesiaFotos, CILESITE, "e_dobet"),
    problemeFoto: listaMeVlera(raw.problemeFoto, PROBLEMET_FOTOS),
    tipiLekure: zgjidh(raw.tipiLekure, TIPET_LEKURES, "normale"),
    problemet: listaMeVlera(raw.problemet, PROBLEMET),
    besueshmeria: zgjidh(raw.besueshmeria, BESUESHMERITE, "e_ulet"),
    vezhgimet: listaTekstesh(raw.vezhgimet, 5),
    pershkrimi:
      typeof raw.pershkrimi === "string" ? raw.pershkrimi.slice(0, 400) : "",
    keshilla: listaTekstesh(raw.keshilla, 4),
    duhetDermatolog: raw.duhetDermatolog === true,
    arsyejaDermatolog:
      typeof raw.arsyejaDermatolog === "string"
        ? raw.arsyejaDermatolog.slice(0, 300)
        : "",
  };
}

function shenoGabimin(err) {
  if (err.status === 429 || err.status === 503) err.kodi = "AI_E_ZENE";
  else if ([400, 401, 403].includes(err.status)) err.kodi = "AI_KONFIGURIM";
  else err.kodi = "AI_GABIM";
  return err;
}

async function analizoFoton(buffer, mimeType) {
  const ai = merrKlientin();
  const data = buffer.toString("base64");

  const dergo = (modeli) =>
    ai.models.generateContent({
      model: modeli,
      contents: [
        { inlineData: { mimeType, data } },
        {
          text: "Analizo këtë selfie sipas udhëzimeve dhe ktheje rezultatin në JSON.",
        },
      ],
      config: {
        systemInstruction: UDHEZIMET,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: SKEMA,
      },
    });

  let gabimiFundit = null;

  for (const modeli of MODELET) {
    for (let provimi = 1; provimi <= 2; provimi++) {
      try {
        const pergjigja = await dergo(modeli);
        return pastro(JSON.parse(pergjigja.text));
      } catch (err) {
        gabimiFundit = err;
        console.error(
          `Gemini (${modeli}, provimi ${provimi}):`,
          err.status,
          err.message,
        );

        if (err.status === 503 && provimi === 1) {
          await pauze(1500);
          continue;
        }
        if (err.status === 503 || err.status === 429 || err.status === 404) {
          break;
        }
        throw shenoGabimin(err);
      }
    }
  }

  throw shenoGabimin(gabimiFundit);
}

module.exports = { analizoFoton };
