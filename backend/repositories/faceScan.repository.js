const prisma = require("../lib/prisma");

async function createFaceScan(data) {
  return await prisma.faceScan.create({ data });
}

async function getFaceScans(userId) {
  return await prisma.faceScan.findMany({
    where: { userId },
    orderBy: { data: "desc" },
  });
}

module.exports = {
  createFaceScan,
  getFaceScans,
};
