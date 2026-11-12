const { findAllCategories } = require("../repositories/categories.repository");

async function getAllCategories() {
  try {
    return await findAllCategories();
  } catch (error) {
    throw new Error(error.message || "Gabim gjatë marrjes së kategorive");
  }
}

module.exports = { getAllCategories };
