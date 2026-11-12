const prisma = require("../lib/prisma");

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function createUser(data) {
  return await prisma.user.create({
    data,
  });
}

module.exports = {
  findUserByEmail,
  createUser,
};
