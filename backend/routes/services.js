const express = require("express");
const servicesService = require("../services/services.service");

const router = express.Router();

// LISTA E SHËRBIMEVE
router.get("/", async (req, res) => {
  try {
    const services = await servicesService.getAllServices();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së shërbimeve" });
  }
});

// LISTA E DERMATOLOGËVE
router.get("/dermatologists", async (req, res) => {
  try {
    const dermatologjistet = await servicesService.getDermatologists();
    res.json(dermatologjistet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së dermatologëve" });
  }
});

// ORARET E LIRA TË NJË DERMATOLOGU
router.get("/dermatologists/:id/availability", async (req, res) => {
  try {
    const slots = await servicesService.getAvailability(req.params.id);
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së orareve" });
  }
});

module.exports = router;