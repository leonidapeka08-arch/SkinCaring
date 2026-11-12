const ordersRepository = require("../repositories/orders.repository");

const menyraPagesaveLejuara = ["karte", "cash"];

async function checkout(userId, adresa, menyraPageses) {
  if (!adresa || !adresa.trim()) {
    throw new Error("Adresa është e detyrueshme");
  }

  if (!menyraPageses) {
    throw new Error("Zgjidhni mënyrën e pagesës");
  }

  if (!menyraPagesaveLejuara.includes(menyraPageses)) {
    throw new Error("Mënyra e pagesës nuk është e vlefshme");
  }

  const cartItems = await ordersRepository.getCartItems(userId);

  if (cartItems.length === 0) {
    throw new Error("Shporta është bosh");
  }

  const totali = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.product.cmimi) * item.sasia,
    0
  );

  const order = await ordersRepository.createOrder({
    userId,
    adresa,
    menyraPageses,
    totali,
    statusi: "ne_pritje",
    items: {
      create: cartItems.map((item) => ({
        productId: item.productId,
        sasia: item.sasia,
        cmimiAthere: item.product.cmimi,
      })),
    },
  });

  await ordersRepository.clearCart(userId);

  return formatOrder(order);
}

async function getOrderHistory(userId) {
  const orders = await ordersRepository.getOrders(userId);
  return orders.map(formatOrder);
}

function formatOrder(order) {
  return {
    id: order.id,
    totali: order.totali,
    statusi: order.statusi,
    adresa: order.adresa,
    menyraPageses: order.menyraPageses,
    data: order.data,
    items: order.items.map((item) => ({
      produkti: item.product.emri,
      sasia: item.sasia,
      cmimi: item.cmimiAthere,
      nentotali: Number(item.cmimiAthere) * item.sasia,
    })),
  };
}

module.exports = {
  checkout,
  getOrderHistory,
};