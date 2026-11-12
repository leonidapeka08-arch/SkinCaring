const express = require("express");
const {
  getAllProducts,
  getBestsellers,
  getProductById,
  createNewProduct,
} = require("../services/products.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { kategoria, faqja, limiti } = req.query;

    const rezultati = await getAllProducts(
      kategoria,
      parseInt(faqja) || 1,
      parseInt(limiti) || 9,
    );

    res.json(rezultati);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së produkteve" });
  }
});

router.get("/bestsellers", async (req, res) => {
  try {
    const limiti = parseInt(req.query.limiti) || 3;
    const produktet = await getBestsellers(limiti);
    res.json(produktet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së bestsellerëve" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    if (error.message === "PRODUKT_NOT_FOUND") {
      return res.status(404).json({ error: "Produkti s'u gjet" });
    }
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së produktit" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await createNewProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë krijimit të produktit" });
  }
});

module.exports = router;
