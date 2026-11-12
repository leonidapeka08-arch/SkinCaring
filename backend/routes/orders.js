const express = require("express");
const ordersService = require("../services/orders.service");
const verifikoAuth = require("../middleware");

const router = express.Router();

router.use(verifikoAuth);

// BËJ POROSI NGA SHPORTA
router.post("/checkout", async (req, res) => {
  try {
    const { adresa, menyraPageses } = req.body || {};

    const order = await ordersService.checkout(
      req.userId,
      adresa,
      menyraPageses
    );

    return res.status(201).json({
      message: "Porosia u krye me sukses",
      order,
    });
  } catch (error) {
    const errors = [
      "Adresa është e detyrueshme",
      "Zgjidhni mënyrën e pagesës",
      "Mënyra e pagesës nuk është e vlefshme",
      "Shporta është bosh",
    ];

    if (errors.includes(error.message)) {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({
      error: "Gabim gjatë porosisë",
    });
  }
});

// HISTORIKU I POROSIVE
router.get("/", async (req, res) => {
  try {
    const orders = await ordersService.getOrderHistory(req.userId);
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Gabim gjatë marrjes së porosive",
    });
  }
});

module.exports = router;