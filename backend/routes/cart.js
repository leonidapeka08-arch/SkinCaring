const express = require("express");
const cartService = require("../services/cart.service");
const prisma = require("../lib/prisma");
const verifikoAuth = require("../middleware");

const router = express.Router();

router.use(verifikoAuth);

router.get("/count", async (req, res) => {
  try {
    const rezultati = await cartService.getCartCount(req.userId);
    res.json(rezultati);
  } catch (error) {
    res.status(500).json({ error: "Gabim gjatë marrjes së numrit" });
  }
});

// MERR SHPORTËN
router.get("/", async (req, res) => {
  try {
    const cart = await cartService.getUserCart(req.userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Gabim gjatë marrjes së shportës" });
  }
});

// SHTO PRODUKT NË SHPORTË
router.post("/add", async (req, res) => {
  try {
    const { productId, sasia } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId është i detyrueshëm" });
    }

    const item = await cartService.addToCart(req.userId, productId, sasia || 1);

    res.status(201).json({ message: "U shtua në shportë", item });
  } catch (error) {
    res
      .status(error.message === "Produkti s'u gjet" ? 404 : 500)
      .json({ error: error.message });
  }
});

// NDRYSHO SASINË
router.put("/:itemId", async (req, res) => {
  try {
    const { sasia } = req.body;

    if (!sasia || sasia < 1) {
      return res.status(400).json({ error: "Sasia duhet të jetë të paktën 1" });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
    });

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({ error: "Artikulli s'u gjet" });
    }

    const updated = await cartService.updateCart(req.params.itemId, sasia);

    res.json({ message: "Sasia u përditësua", item: updated });
  } catch (error) {
    res.status(500).json({ error: "Gabim gjatë përditësimit" });
  }
});

// HIQ PRODUKT NGA SHPORTA
router.delete("/:itemId", async (req, res) => {
  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
    });

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({ error: "Artikulli s'u gjet" });
    }

    await cartService.removeFromCart(req.params.itemId);

    res.json({ message: "U hoq nga shporta" });
  } catch (error) {
    res.status(500).json({ error: "Gabim gjatë heqjes" });
  }
});

module.exports = router;
