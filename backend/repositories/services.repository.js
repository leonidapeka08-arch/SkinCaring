const prisma = require("../lib/prisma");

async function getAllServices() {
  return await prisma.service.findMany();
}

async function getDermatologists() {
  return await prisma.dermatologist.findMany({
    include: {
      user: { select: { emri: true } },
      services: { include: { service: true } },
    },
  });
}

async function getAvailability(id) {
  const tani = new Date();
  const fillimiDites = new Date(
    tani.getFullYear(),
    tani.getMonth(),
    tani.getDate(),
  );
  return await prisma.dermatologistAvailability.findMany({
    where: { dermatologistId: id, iZene: false, data: { gte: fillimiDites } },
    orderBy: [{ data: "asc" }, { oraFillimit: "asc" }],
  });
}

async function getBookedAppointments(dermatologistId) {
  return await prisma.appointment.findMany({
    where: { dermatologistId, statusi: { not: "anuluar" } },
    select: { data: true, ora: true },
  });
}

module.exports = {
  getAllServices,
  getDermatologists,
  getAvailability,
  getBookedAppointments,
};