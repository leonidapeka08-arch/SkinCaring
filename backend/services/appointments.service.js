const appointmentsRepository = require("../repositories/appointments.repository");
const { dergoKonfirmimTakimi } = require("./email.service");

function gabim(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function neMinuta(ora) {
  const [ore, minuta] = ora.split(":").map(Number);

  if (
    !Number.isInteger(ore) ||
    !Number.isInteger(minuta) ||
    ore < 0 ||
    ore > 23 ||
    minuta < 0 ||
    minuta > 59
  ) {
    throw gabim("Formati i orarit nuk është i vlefshëm");
  }

  return ore * 60 + minuta;
}

async function bookAppointment(
  userId,
  dermatologistId,
  serviceIds,
  availabilityId,
) {
  if (!dermatologistId || !availabilityId) {
    throw gabim("dermatologistId dhe availabilityId janë të detyrueshme");
  }

  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    throw gabim("Duhet të zgjidhni të paktën një shërbim");
  }

  const idsUnike = [...new Set(serviceIds)];

  if (idsUnike.some((id) => typeof id !== "string" || !id.trim())) {
    throw gabim("Lista e shërbimeve nuk është e vlefshme");
  }

  // Kontrollohet orari.
  const slot = await appointmentsRepository.findAvailability(availabilityId);

  if (!slot || slot.iZene || slot.dermatologistId !== dermatologistId) {
    throw gabim("Ky orar s'është më i lirë", 409);
  }

  // Merr vetëm shërbimet që i përkasin këtij dermatologu.
  const services = await appointmentsRepository.findServicesForDermatologist(
    dermatologistId,
    idsUnike,
  );

  if (services.length !== idsUnike.length) {
    throw gabim("Një ose më shumë shërbime nuk i përkasin këtij dermatologu");
  }

  // Kontrollohet kohëzgjatja e shërbimeve.
  if (
    services.some(
      (service) =>
        !Number.isInteger(service.kohezgjatja) || service.kohezgjatja <= 0,
    )
  ) {
    throw gabim("Një ose më shumë shërbime nuk kanë kohëzgjatje të vlefshme");
  }

  const cmimiTotal = services.reduce(
    (total, service) => total + service.cmimi,
    0,
  );

  const kohezgjatjaTotal = services.reduce(
    (total, service) => total + service.kohezgjatja,
    0,
  );

  const fillimiSlotit = neMinuta(slot.oraFillimit);
  const mbarimiSlotit = neMinuta(slot.oraMbarimit);
  console.log("ORARI NGA DATABASE:", {
    oraFillimit: slot.oraFillimit,
    oraMbarimit: slot.oraMbarimit,
    data: slot.data,
  });
  if (mbarimiSlotit <= fillimiSlotit) {
    throw gabim("Orari i disponueshëm nuk është i vlefshëm");
  }

  const kohezgjatjaSlotit = mbarimiSlotit - fillimiSlotit;

  if (kohezgjatjaTotal > kohezgjatjaSlotit) {
    throw gabim(
      `Shërbimet zgjasin ${kohezgjatjaTotal} minuta, ndërsa orari i lirë ka vetëm ${kohezgjatjaSlotit} minuta`,
    );
  }

  // Krijohet takimi dhe ruhen shërbimet në databazë.
  const appointment = await appointmentsRepository.bookSlot(
    availabilityId,
    {
      klientId: userId,
      dermatologistId,
      // Ruhet shërbimi i parë edhe në fushën e vjetër,
      // për kompatibilitet me kodin ekzistues.
      serviceId: services[0].id,
      data: slot.data,
      ora: slot.oraFillimit,
      statusi: "pritje",
    },
    services,
  );

  if (!appointment) {
    throw gabim("Ky orar s'është më i lirë", 409);
  }

  // Dërgohet email-i i konfirmimit.
  try {
    await dergoKonfirmimTakimi({
      email: appointment.klient.email,
      emriKlientit: appointment.klient.emri,
      emriDermatologut: appointment.dermatologist.user.emri,
      data: appointment.data,
      ora: appointment.ora,
      sherbimet: services.map((service) => service.emri),
      cmimiTotal,
      kohezgjatjaTotal,
    });
  } catch (err) {
    console.error("Email konfirmimi dështoi:", err.message);
  }

  return {
    id: appointment.id,
    data: appointment.data,
    ora: appointment.ora,
    statusi: appointment.statusi,
    sherbimet: services.map((service) => ({
      id: service.id,
      emri: service.emri,
      cmimi: service.cmimi,
      kohezgjatja: service.kohezgjatja,
    })),
    cmimiTotal,
    kohezgjatjaTotal,
  };
}

async function getMyAppointments(userId) {
  const appointments = await appointmentsRepository.getAppointments(userId);

  return appointments.map((a) => {
    const sherbimet = a.services.map((item) => ({
      id: item.id,
      emri: item.emri,
      cmimi: item.cmimi,
      kohezgjatja: item.kohezgjatja,
    }));

    return {
      id: a.id,
      dermatologu: a.dermatologist.user.emri,
      sherbimet,
      // Mbështetje për takimet e vjetra.
      sherbimi:
        sherbimet.length > 0
          ? sherbimet.map((s) => s.emri).join(", ")
          : a.service
            ? a.service.emri
            : "Konsultë e Përgjithshme",
      cmimiTotal: sherbimet.reduce(
        (total, service) => total + service.cmimi,
        0,
      ),
      kohezgjatjaTotal: sherbimet.reduce(
        (total, service) => total + (service.kohezgjatja || 0),
        0,
      ),
      data: a.data,
      ora: a.ora,
      statusi: a.statusi,
    };
  });
}

module.exports = {
  bookAppointment,
  getMyAppointments,
};
