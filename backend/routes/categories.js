const express = require("express");
const { getAllCategories } = require("../services/categories.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const kategorite = await getAllCategories();
    res.json(kategorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gabim gjatë marrjes së kategorive" });
  }
});

module.exports = router;
