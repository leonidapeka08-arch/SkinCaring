const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const prisma = require("../lib/prisma");
const verifikoAuth = require("../middleware");
const { analizoDheRuaj } = require("../services/skinScan.service");

const router = express.Router();

const MIME_TE_LEJUARA = ["image/jpeg", "image/png", "image/webp"];

// Multer - merr file nga memoria (jo disku), maksimumi 8 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

router.use(verifikoAuth);

function marrFoton(req, res, next) {
  upload.single("foto")(req, res, (err) => {
    if (err) {
      const mesazhi =
        err.code === "LIMIT_FILE_SIZE"
          ? "Fotoja është shumë e madhe (maksimumi 8 MB)."
          : "Gabim gjatë leximit të fotos.";
      return res.status(400).json({ error: mesazhi });
    }
    next();
  });
}

// UPLOAD + ANALIZË AI
router.post("/upload", marrFoton, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Asnjë foto s'u ngarkua." });
  }
  if (!MIME_TE_LEJUARA.includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ error: "Lejohen vetëm foto JPG, PNG ose WEBP." });
  }

  try {
    const rezultati = await analizoDheRuaj({
      userId: req.userId,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
    });
    res.status(201).json(rezultati);
  } catch (error) {
    if (error.status === 422) {
      return res
        .status(422)
        .json({ error: error.message, keshilla: error.keshilla });
    }
    if (error.kodi === "AI_E_ZENE") {
      return res.status(503).json({
        error: "Shërbimi i analizës është i zënë tani. Provo pas pak.",
      });
    }
    if (error.kodi === "AI_KONFIGURIM") {
      console.error("Kontrollo GEMINI_API_KEY te .env");
      return res
        .status(500)
        .json({ error: "Analiza AI nuk është konfiguruar saktë." });
    }
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë analizës së fotos." });
  }
});

// HISTORIKU I FACE SCAN-EVE TË MIA
router.get("/", async (req, res) => {
  try {
    const scans = await prisma.faceScan.findMany({
      where: { userId: req.userId },
      orderBy: { data: "desc" },
    });

    res.json(
      scans.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        analiza: s.aiAnaliza ? JSON.parse(s.aiAnaliza) : null,
        data: s.data,
      })),
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së historikut" });
  }
});

module.exports = router;
