const {
  findAllProducts,
  countProducts,
  findBestsellingProductIds,
  findProductsByIds,
  findLatestProducts,
  findPromotedProduct,
  findProductById,
  createProduct,
} = require("../repositories/products.repository");

async function getAllProducts(kategoria, faqja = 1, limiti = 9) {
  try {
    const where = {};
    if (kategoria) where.kategoriaId = kategoria;

    const skip = (faqja - 1) * limiti;

    const [produktet, totali] = await Promise.all([
      findAllProducts(where, skip, limiti),
      countProducts(where),
    ]);

    return {
      produktet,
      totali,
      totalFaqe: Math.ceil(totali / limiti),
      faqjaAktuale: faqja,
    };
  } catch (error) {
    throw new Error(error.message || "Gabim gjatë marrjes së produkteve");
  }
}

async function getBestsellers(limiti = 3) {
  try {
    const rezultati = [];
    const idsPerdorura = [];

    const bestsellerIds = await findBestsellingProductIds(1);
    if (bestsellerIds.length > 0) {
      const [bestseller] = await findProductsByIds(bestsellerIds);
      if (bestseller) {
        rezultati.push({ ...bestseller, etiketa: "Bestseller" });
        idsPerdorura.push(bestseller.id);
      }
    }

    if (rezultati.length < limiti) {
      const iPromovuar = await findPromotedProduct(idsPerdorura);
      if (iPromovuar) {
        rezultati.push({ ...iPromovuar, etiketa: "Me Ulje" });
        idsPerdorura.push(iPromovuar.id);
      }
    }

    const saMungojne = limiti - rezultati.length;
    if (saMungojne > 0) {
      const teRinj = await findLatestProducts(saMungojne, idsPerdorura);
      teRinj.forEach((p) => {
        rezultati.push({ ...p, etiketa: "I Ri" });
        idsPerdorura.push(p.id);
      });
    }

    return rezultati;
  } catch (error) {
    throw new Error(
      error.message || "Gabim gjatë marrjes së produkteve kryesore",
    );
  }
}
async function getProductById(id) {
  try {
    const product = await findProductById(id);
    if (!product) {
      throw new Error("PRODUKT_NOT_FOUND");
    }
    return product;
  } catch (error) {
    if (error.message === "PRODUKT_NOT_FOUND") {
      throw error;
    }
    throw new Error(error.message || "Gabim gjatë marrjes së produktit");
  }
}

async function createNewProduct(productData) {
  try {
    return await createProduct(productData);
  } catch (error) {
    throw new Error(error.message || "Gabim gjatë krijimit të produktit");
  }
}

module.exports = {
  getAllProducts,
  getBestsellers,
  getProductById,
  createNewProduct,
};
