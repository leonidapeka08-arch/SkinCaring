const prisma = require("../lib/prisma");
async function getQuestions() {
  return prisma.quizQuestion.findMany({
    orderBy: { renditja: "asc" },
    include: { options: true },
  });
}
async function getOptions(optionIds) {
  return prisma.quizOption.findMany({ where: { id: { in: optionIds } } });
}
async function createQuizResult(data) {
  return prisma.quizResult.create({ data });
}
async function getProducts() {
  return prisma.product.findMany();
}
async function createRecommendedProduct(data) {
  return prisma.recommendedProduct.create({ data, include: { product: true } });
}
module.exports = {
  getQuestions,
  getOptions,
  createQuizResult,
  getProducts,
  createRecommendedProduct,
};
