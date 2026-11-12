const prisma = require("../lib/prisma");

async function getCart(userId) {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
}

async function getCartCount(userId) {
  return await prisma.cartItem.findMany({
    where: { userId },
    select: { sasia: true },
  });
}

async function findProduct(productId) {
  return await prisma.product.findUnique({
    where: { id: productId },
  });
}

async function findCartItem(userId, productId) {
  return await prisma.cartItem.findFirst({
    where: { userId, productId },
  });
}

async function createCartItem(data) {
  return await prisma.cartItem.create({ data });
}

async function updateCartItem(id, data) {
  return await prisma.cartItem.update({
    where: { id },
    data,
  });
}

async function deleteCartItem(id) {
  return await prisma.cartItem.delete({
    where: { id },
  });
}

module.exports = {
  getCart,
  getCartCount,
  findProduct,
  findCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
