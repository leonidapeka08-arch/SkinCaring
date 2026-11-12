const express = require("express");
const appointmentsService = require("../services/appointments.service");
const verifikoAuth = require("../middleware");

const router = express.Router();

router.use(verifikoAuth);

// POST - Rezervimi i një takimi me një ose disa shërbime
router.post("/", async (req, res) => {
  try {
    const { dermatologistId, serviceIds, serviceId, availabilityId } = req.body;

    // Mbështetje edhe për formatin e vjetër serviceId
    const sherbimet = Array.isArray(serviceIds)
      ? serviceIds
      : serviceId
        ? [serviceId]
        : [];

    if (!dermatologistId || !availabilityId) {
      return res.status(400).json({
        error: "dermatologistId dhe availabilityId janë të detyrueshme",
      });
    }

    if (
      sherbimet.length === 0 ||
      sherbimet.some((id) => typeof id !== "string" || !id.trim())
    ) {
      return res.status(400).json({
        error: "Duhet të zgjidhni të paktën një shërbim",
      });
    }

    const appointment = await appointmentsService.bookAppointment(
      req.userId,
      dermatologistId,
      [...new Set(sherbimet)],
      availabilityId,
    );

    return res.status(201).json({
      message: "Takimi u rezervua me sukses",
      appointment,
    });
  } catch (error) {
    console.error("Gabim gjatë rezervimit:", error);

    const statusCode =
      error.statusCode ||
      (error.message === "Ky orar s'është më i lirë"
        ? 409
        : error.message ===
              "dermatologistId dhe availabilityId janë të detyrueshme" ||
            error.message === "Duhet të zgjidhni të paktën një shërbim"
          ? 400
          : 500);

    return res.status(statusCode).json({
      error: statusCode === 500 ? "Gabim gjatë rezervimit" : error.message,
    });
  }
});

// GET - Merr takimet e përdoruesit
router.get("/", async (req, res) => {
  try {
    const appointments = await appointmentsService.getMyAppointments(
      req.userId,
    );

    return res.json(appointments);
  } catch (error) {
    console.error("Gabim gjatë marrjes së takimeve:", error);

    return res.status(500).json({
      error: "Gabim gjatë marrjes së takimeve",
    });
  }
});

module.exports = router;
