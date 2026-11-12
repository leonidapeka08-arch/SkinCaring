const express = require("express");
const quizService = require("../services/quiz.service");
const verifikoAuth = require("../middleware");

const router = express.Router();

// MERR PYETJET E KUIZIT
router.get("/questions", async (req, res) => {
  try {
    const questions = await quizService.getQuizQuestions();
    return res.json(questions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Gabim gjatë marrjes së pyetjeve",
    });
  }
});

// DËRGO PËRGJIGJET DHE MERR REZULTATIN
router.post("/submit", verifikoAuth, async (req, res) => {
  try {
    const { optionIds } = req.body;

    if (!Array.isArray(optionIds)) {
      return res.status(400).json({
        error: "optionIds duhet të jetë array",
      });
    }

    const data = await quizService.submitQuiz(req.userId, optionIds);

    return res.status(201).json({
      message: "Rezultati u ruajt",
      ...data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Gabim gjatë përpunimit të kuizit",
    });
  }
});

module.exports = router;
