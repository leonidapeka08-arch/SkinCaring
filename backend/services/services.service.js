const servicesRepository = require("../repositories/services.repository");

async function getAllServices() {
  return await servicesRepository.getAllServices();
}

async function getDermatologists() {
  const dermatologjistet = await servicesRepository.getDermatologists();

  return dermatologjistet.map((d) => ({
    id: d.id,
    emri: d.user.emri,
    specializimi: d.specializimi,
    bio: d.bio,
    vitiEksperience: d.vitiEksperience,
    fotoUrl: d.fotoUrl,
    sherbimet: d.services.map((s) => ({
      id: s.service.id,
      emri: s.service.emri,
      cmimi: s.service.cmimi,
      kohezgjatja: s.service.kohezgjatja,
    })),
  }));
}

async function getAvailability(id) {
  const [slots, takimet] = await Promise.all([
    servicesRepository.getAvailability(id),
    servicesRepository.getBookedAppointments(id),
  ]);

  const zena = new Set(
    takimet.map((t) => `${new Date(t.data).getTime()}|${t.ora}`),
  );
  const pare = new Set();

  return slots
    .filter((s) => {
      const celesi = `${new Date(s.data).getTime()}|${s.oraFillimit}`;
      if (zena.has(celesi) || pare.has(celesi)) return false;
      pare.add(celesi);
      return true;
    })
    .map((s) => ({
      id: s.id,
      data: s.data,
      ora: s.oraFillimit,
      oraMbarimit: s.oraMbarimit,
    }));
}

module.exports = {
  getAllServices,
  getDermatologists,
  getAvailability,
};
