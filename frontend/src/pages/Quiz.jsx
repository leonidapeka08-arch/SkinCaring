import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  klasaFaqja,
  klasaTekstNgarkim,
  klasaEyebrow,
  klasaTitulli4xl,
  klasaTitulli3xl,
  klasaKonteinerRezultat,
  klasaKonteinerPyetje,
  klasaArtikull,
  klasaFotoArtikull,
  klasaButoniForest,
  klasaTekstFundit,
  klasaLinkSubliniuar,
  klasaShiriti,
  klasaShiritiPlot,
  klasaOpsioniBaze,
  klasaOpsioniAktiv,
  klasaOpsioniJoaktiv,
  klasaButoniPrapa,
  klasaButoniPara,
} from "../components/shared/classNames";

function Quiz() {
  const [pyetjet, setPyetjet] = useState([]);
  const [indeksiAktual, setIndeksiAktual] = useState(0);
  const [pergjigjet, setPergjigjet] = useState({});
  const [rezultati, setRezultati] = useState(null);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [dukeDerguar, setDukeDerguar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/quiz/questions")
      .then((res) => {
        setPyetjet(res.data);
        setDukeNgarkuar(false);
      })
      .catch((err) => {
        console.error(err);
        setDukeNgarkuar(false);
      });
  }, []);

  const pyetja = pyetjet[indeksiAktual];
  const eshteFundi = indeksiAktual === pyetjet.length - 1;
  const opsioniZgjedhur = pyetja ? pergjigjet[pyetja.id] : null;
  const perqindja = pyetjet.length
    ? ((indeksiAktual + 1) / pyetjet.length) * 100
    : 0;

  const zgjidhOpsionin = (optionId) => {
    setPergjigjet((prev) => ({ ...prev, [pyetja.id]: optionId }));
  };

  const shkoPrapa = () => {
    if (indeksiAktual > 0) setIndeksiAktual(indeksiAktual - 1);
  };

  const shkoPara = () => {
    if (!opsioniZgjedhur) return;
    if (!eshteFundi) {
      setIndeksiAktual(indeksiAktual + 1);
    } else {
      dergoRezultatet();
    }
  };

  const dergoRezultatet = async () => {
    setDukeDerguar(true);
    try {
      const optionIds = pyetjet.map((p) => pergjigjet[p.id]);
      const res = await api.post("/quiz/submit", { optionIds });
      setRezultati(res.data);
    } catch (err) {
      console.error(err);
      alert("Duhet të jesh i kyçur për të përfunduar kuizin!");
      navigate("/login");
    } finally {
      setDukeDerguar(false);
    }
  };

  if (dukeNgarkuar) {
    return (
      <div className={klasaFaqja}>
        <p className={klasaTekstNgarkim}>Duke ngarkuar...</p>
      </div>
    );
  }

  // ===== REZULTATET =====
  if (rezultati) {
    return (
      <div className={klasaFaqja}>
        <div className={klasaKonteinerRezultat}>
          <p className={`mb-4 ${klasaEyebrow}`}>YOUR RESULT</p>
          <h1 className={`mb-3 ${klasaTitulli4xl}`}>
            Tipi yt i lëkurës: {rezultati.tipiLekure}
          </h1>
          <p className="text-gray-600 mb-10 max-w-xl">
            Bazuar në përgjigjet e tua, këto janë produktet që rekomandojmë për
            rutinën tënde.
          </p>

          <div className="space-y-4">
            {(rezultati.rekomandimet || []).map((r, i) => (
              <div key={i} className={klasaArtikull}>
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(r.produkti || "produkt")}/90/90`}
                  alt={r.produkti}
                  className={klasaFotoArtikull}
                />
                <div className="flex-1">
                  <p className="font-serif text-lg text-gray-900">
                    {r.produkti}
                  </p>
                  <p className="text-sm text-gray-600">{r.pershkrimi}</p>
                  {r.arsyeja && (
                    <p className="text-xs text-forest mt-1">{r.arsyeja}</p>
                  )}
                </div>
                <p className="font-serif text-lg text-forest">{r.cmimi}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/shop")}
            className={`mt-10 ${klasaButoniForest}`}
          >
            Shiko Shop-in e Plotë →
          </button>
          <p className={klasaTekstFundit}>
            Dëshiron saktësi më të madhe?{" "}
            <a href="/skin-analysis" className={klasaLinkSubliniuar}>
              Bëj një skanim foto →
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ===== PYETJET =====
  return (
    <div className={klasaFaqja}>
      <div className={klasaKonteinerPyetje}>
        <div className={klasaShiriti}>
          <div
            className={klasaShiritiPlot}
            style={{ width: `${perqindja}%` }}
          />
        </div>

        <p className={`mb-4 ${klasaEyebrow}`}>
          PYETJA {indeksiAktual + 1} NGA {pyetjet.length}
        </p>
        <h1 className={`mb-8 ${klasaTitulli3xl}`}>{pyetja?.teksti}</h1>

        <div className="space-y-3 mb-10">
          {pyetja?.options?.map((opt) => (
            <button
              key={opt.id}
              onClick={() => zgjidhOpsionin(opt.id)}
              className={`${klasaOpsioniBaze} ${
                opsioniZgjedhur === opt.id
                  ? klasaOpsioniAktiv
                  : klasaOpsioniJoaktiv
              }`}
            >
              {opt.teksti}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={shkoPrapa}
            disabled={indeksiAktual === 0}
            className={klasaButoniPrapa}
          >
            ← Prapa
          </button>
          <button
            onClick={shkoPara}
            disabled={!opsioniZgjedhur || dukeDerguar}
            className={klasaButoniPara}
          >
            {dukeDerguar
              ? "Duke dërguar..."
              : eshteFundi
                ? "Përfundo"
                : "Para →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
