const express = require("express");
const authService = require("../services/auth.service");

const router = express.Router();

// REGJISTRIM
router.post("/register", async (req, res) => {
  try {
    const { emri, email, password, telefon } = req.body;

    if (!emri || !email || !password) {
      return res.status(400).json({
        error: "Emri, email dhe password janë të detyrueshëm",
      });
    }

    const result = await authService.register(emri, email, password, telefon);

    res.status(201).json({
      message: "Regjistrimi u krye me sukses",
      ...result,
    });
  } catch (error) {
    if (error.message === "Ky email është përdorur tashmë") {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({ error: "Gabim gjatë regjistrimit" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email dhe password janë të detyrueshëm",
      });
    }

    const result = await authService.login(email, password);

    res.json({
      message: "Login i suksesshëm",
      ...result,
    });
  } catch (error) {
    if (error.message === "Email ose password gabim") {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({ error: "Gabim gjatë login" });
  }
});

module.exports = router;
