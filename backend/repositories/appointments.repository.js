const prisma = require("../lib/prisma");

async function findAvailability(id) {
  return prisma.dermatologistAvailability.findUnique({
    where: { id },
  });
}

async function findServicesForDermatologist(dermatologistId, serviceIds) {
  return prisma.service.findMany({
    where: {
      id: { in: serviceIds },
      dermatologists: {
        some: { dermatologistId },
      },
    },
  });
}

async function bookSlot(availabilityId, dataTakimit, services) {
  return prisma.$transaction(async (tx) => {
    const perditesuar = await tx.dermatologistAvailability.updateMany({
      where: {
        id: availabilityId,
        iZene: false,
      },
      data: {
        iZene: true,
      },
    });

    if (perditesuar.count === 0) {
      return null;
    }

    return tx.appointment.create({
      data: {
        ...dataTakimit,
        services: {
          connect: services.map((service) => ({ id: service.id })),
        },
      },
      include: {
        klient: {
          select: {
            emri: true,
            email: true,
          },
        },
        dermatologist: {
          include: {
            user: {
              select: {
                emri: true,
                email: true,
              },
            },
          },
        },
        services: true,
      },
    });
  });
}

async function getAppointments(userId) {
  return prisma.appointment.findMany({
    where: { klientId: userId },
    include: {
      dermatologist: {
        include: {
          user: {
            select: { emri: true },
          },
        },
      },
      service: true,
      services: true,
    },
    orderBy: { data: "asc" },
  });
}

module.exports = {
  findAvailability,
  findServicesForDermatologist,
  bookSlot,
  getAppointments,
};
