const quizRepository = require("../repositories/quiz.repository");

async function getQuizQuestions() {
  return quizRepository.getQuestions();
}

async function submitQuiz(userId, optionIds) {
  const options = await quizRepository.getOptions(optionIds);

  const totali = {
    thatesi: 0,
    yndyre: 0,
    ndjeshmeri: 0,
    akne: 0,
  };

  options.forEach((opt) => {
    totali.thatesi += opt.pikeThatesi;
    totali.yndyre += opt.pikeYndyre;
    totali.ndjeshmeri += opt.pikeNdjeshmeri;
    totali.akne += opt.pikeAkne;
  });

  const entries = Object.entries(totali);
  entries.sort((a, b) => b[1] - a[1]);

  const mapTipi = {
    thatesi: "e_thate",
    yndyre: "e_yndyrshme",
    ndjeshmeri: "sensitive",
    akne: "akne_prone",
  };

  const tipiLekure = mapTipi[entries[0][0]] || "normale";

  const problemet = [];
  if (totali.akne >= 3) problemet.push("akne");
  if (totali.ndjeshmeri >= 3) problemet.push("ndjeshmeri");

  const result = await quizRepository.createQuizResult({
    userId,
    tipiLekure,
    problemet: JSON.stringify(problemet),
  });

  const produktet = await quizRepository.getProducts();

  const produktetPershtatshme = produktet.filter((p) => {
    const tipet = JSON.parse(p.tipiLekurePershtatshem || "[]");
    return tipet.includes(tipiLekure);
  });

  const rekomandimet = [];

  for (let i = 0; i < Math.min(produktetPershtatshme.length, 5); i++) {
    const produkti = produktetPershtatshme[i];

    const rec = await quizRepository.createRecommendedProduct({
      quizResultId: result.id,
      productId: produkti.id,
      arsyeja: `I përshtatshëm për lëkurë ${tipiLekure}`,
      renditjaHapi: i + 1,
    });

    rekomandimet.push(rec);
  }

  return {
    result: {
      id: result.id,
      tipiLekure: result.tipiLekure,
      problemet: JSON.parse(result.problemet),
    },
    rekomandimet: rekomandimet.map((r) => ({
      produkti: r.product.emri,
      pershkrimi: r.product.pershkrimi,
      cmimi: `$${Number(r.product.cmimi).toFixed(2)}`,
      arsyeja: r.arsyeja,
    })),
  };
}

module.exports = {
  getQuizQuestions,
  submitQuiz,
};
