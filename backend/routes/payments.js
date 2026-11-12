const express = require("express");
const verifikoAuth = require("../middleware");
const { krijoPagesen } = require("../services/payment.service");

const router = express.Router();

router.post("/create-intent", verifikoAuth, async (req, res) => {
  try {
    const pagesa = await krijoPagesen(req.userId);
    res.json(pagesa);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
