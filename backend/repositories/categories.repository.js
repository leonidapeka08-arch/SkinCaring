const prisma = require("../lib/prisma");

async function findAllCategories() {
  return await prisma.category.findMany({
    orderBy: { emri: "asc" },
  });
}

module.exports = { findAllCategories };
