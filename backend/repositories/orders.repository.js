const prisma = require("../lib/prisma");

async function getCartItems(userId) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
}

async function createOrder(data) {
  return prisma.order.create({
    data,
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

async function clearCart(userId) {
  return prisma.cartItem.deleteMany({
    where: { userId },
  });
}

async function getOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { data: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

module.exports = {
  getCartItems,
  createOrder,
  clearCart,
  getOrders,
};