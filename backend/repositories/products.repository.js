const prisma = require("../lib/prisma");

async function findAllProducts(where, skip, take) {
  return await prisma.product.findMany({
    where,
    include: { images: true, kategoria: true },
    skip,
    take,
  });
}

async function countProducts(where) {
  return await prisma.product.count({ where });
}

async function findBestsellingProductIds(limiti) {
  const grupuar = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { sasia: true },
    orderBy: { _sum: { sasia: "desc" } },
    take: limiti,
  });
  return grupuar.map((g) => g.productId);
}

async function findProductsByIds(ids) {
  return prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: true },
  });
}

async function findLatestProducts(limiti, excludeIds = []) {
  return prisma.product.findMany({
    where: { id: { notIn: excludeIds } },
    take: limiti,
    orderBy: { dataShtimit: "desc" },
    include: { images: true },
  });
}

async function findPromotedProduct(excludeIds = []) {
  return prisma.product.findFirst({
    where: { nePromovim: true, id: { notIn: excludeIds } },
    orderBy: { dataShtimit: "desc" },
    include: { images: true },
  });
}

async function findProductById(id) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      kategoria: true,
      ingredients: { include: { ingredient: true } },
    },
  });
}

async function createProduct(data) {
  return await prisma.product.create({
    data: {
      emri: data.emri,
      pershkrimi: data.pershkrimi,
      cmimi: parseFloat(data.cmimi),
      marka: data.marka,
      kategoriaId: data.kategoriaId,
      stoku: parseInt(data.stoku) || 0,
      tipiLekurePershtatshem: JSON.stringify(data.tipiLekurePershtatshem || []),
    },
  });
}

module.exports = {
  findAllProducts,
  countProducts,
  findBestsellingProductIds,
  findProductsByIds,
  findLatestProducts,
  findPromotedProduct,
  findProductById,
  createProduct,
};
