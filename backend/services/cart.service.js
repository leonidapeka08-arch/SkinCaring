const cartRepository = require("../repositories/cart.repository");

async function getUserCart(userId) {
  try {
    const items = await cartRepository.getCart(userId);

    const totali = items.reduce(
      (sum, item) => sum + item.product.cmimi * item.sasia,
      0
    );

    return { items, totali };
  } catch (error) {
    throw error;
  }
}

async function getCartCount(userId) {
  try {
    const items = await cartRepository.getCartCount(userId);
    const numriArtikujve = items.reduce((sum, item) => sum + item.sasia, 0);
    return { numriArtikujve };
  } catch (error) {
    throw error;
  }
}

async function addToCart(userId, productId, sasia = 1) {
  try {
    const product = await cartRepository.findProduct(productId);

    if (!product) throw new Error("Produkti s'u gjet");

    const item = await cartRepository.findCartItem(userId, productId);

    if (item) {
      return await cartRepository.updateCartItem(item.id, {
        sasia: item.sasia + sasia,
      });
    }

    return await cartRepository.createCartItem({
      userId,
      productId,
      sasia,
    });
  } catch (error) {
    throw error;
  }
}

async function updateCart(id, sasia) {
  return await cartRepository.updateCartItem(id, { sasia });
}

async function removeFromCart(id) {
  return await cartRepository.deleteCartItem(id);
}

module.exports = {
  getUserCart,
  getCartCount,
  addToCart,
  updateCart,
  removeFromCart,
};