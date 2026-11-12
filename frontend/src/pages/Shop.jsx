import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { fotoProduktit } from "../utils/fotoProduktit";
import { njoftoShportenUNdryshua } from "../utils/cartEvents";
import { formatoCmimin } from "../utils/formatoCmimin";
import { PlusIcon } from "../components/shared/Icons";
import {
  klasaFaqja,
  klasaKonteinerShop,
  klasaEyebrow,
  klasaTitulli4xl,
  klasaChipKategoriBaze,
  klasaChipKategoriAktiv,
  klasaChipKategoriJoaktiv,
  klasaToast,
  klasaGridProduktet,
  klasaKornizaProdukt,
  klasaFotoProdukt,
  klasaButoniShtoShporteVogel,
  klasaCmimiProdukt,
  klasaPaginimi,
  klasaButoniFaqe,
  klasaPikatPaginim,
  klasaFaqeBaze,
  klasaFaqeAktive,
  klasaFaqeJoaktive,
  klasaShikoDetajet,
  klasaTitulliProdukt,
} from "../components/shared/classNames";

const PRODUKTE_PER_FAQE = 9;

function gjeneroFaqet(aktuale, total) {
  const faqet = [];
  for (let i = 1; i <= total; i++) {
    const eshtePara = i === 1 || i === total;
    const eshteAfer = i >= aktuale - 1 && i <= aktuale + 1;
    if (eshtePara || eshteAfer) {
      faqet.push(i);
    } else if (faqet[faqet.length - 1] !== "...") {
      faqet.push("...");
    }
  }
  return faqet;
}

function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const faqjaAktuale = parseInt(searchParams.get("faqja")) || 1;
  const kategoriaAktuale = searchParams.get("kategoria") || "";

  const [produktet, setProduktet] = useState([]);
  const [totalFaqe, setTotalFaqe] = useState(1);
  const [kategorite, setKategorite] = useState([]);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [mesazhi, setMesazhi] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setKategorite(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setDukeNgarkuar(true);
    const query = new URLSearchParams({
      faqja: faqjaAktuale,
      limiti: PRODUKTE_PER_FAQE,
    });
    if (kategoriaAktuale) query.set("kategoria", kategoriaAktuale);

    api
      .get(`/products?${query.toString()}`)
      .then((res) => {
        setProduktet(res.data.produktet);
        setTotalFaqe(res.data.totalFaqe);
        setDukeNgarkuar(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => {
        console.error(err);
        setDukeNgarkuar(false);
      });
  }, [faqjaAktuale, kategoriaAktuale]);

  const shtoNeShporte = async (productId) => {
    try {
      await api.post("/cart/add", { productId, sasia: 1 });
      njoftoShportenUNdryshua();
      setMesazhi("U shtua në shportë ✓");
    } catch (err) {
      console.error(err);
      setMesazhi("Duhet të jesh i kyçur për të shtuar në shportë");
    } finally {
      setTimeout(() => setMesazhi(""), 2500);
    }
  };

  const shkoNeFaqe = (nr) => {
    const params = { faqja: nr };
    if (kategoriaAktuale) params.kategoria = kategoriaAktuale;
    setSearchParams(params);
  };

  const zgjidhKategorine = (kategoriaId) => {
    const params = { faqja: 1 };
    if (kategoriaId) params.kategoria = kategoriaId;
    setSearchParams(params);
  };

  const stilKategorie = (aktive) =>
    `${klasaChipKategoriBaze} ${
      aktive ? klasaChipKategoriAktiv : klasaChipKategoriJoaktiv
    }`;

  return (
    <div className={klasaFaqja}>
      <div className={klasaKonteinerShop}>
        <p className={`mb-4 ${klasaEyebrow}`}>ROUTINE ESSENTIALS</p>
        <h1 className={`mb-3 leading-tight ${klasaTitulli4xl}`}>
          Kind to skin.
          <br />
          Serious about results.
        </h1>
        <p className="text-gray-600 max-w-md mb-10">
          Produkte të rekomanduara nga dermatologë, për lëkurë të qetë dhe
          rezultate të garantuara.
        </p>

        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => zgjidhKategorine("")}
            className={stilKategorie(kategoriaAktuale === "")}
          >
            Të gjitha
          </button>
          {kategorite.map((k) => (
            <button
              key={k.id}
              onClick={() => zgjidhKategorine(k.id)}
              className={stilKategorie(kategoriaAktuale === k.id)}
            >
              {k.emri}
            </button>
          ))}
        </div>

        {mesazhi && <div className={klasaToast}>{mesazhi}</div>}

        {dukeNgarkuar ? (
          <p className="text-gray-500">Duke ngarkuar produktet...</p>
        ) : produktet.length === 0 ? (
          <p className="text-gray-500">Nuk ka produkte në këtë kategori.</p>
        ) : (
          <>
            <div className={klasaGridProduktet}>
              {produktet.map((p) => (
                <div
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className={klasaKornizaProdukt}>
                    <img
                      src={fotoProduktit(p.emri, 400, 300)}
                      alt={p.emri}
                      className={`${klasaFotoProdukt} transition duration-500 group-hover:scale-105`}
                    />
                    <span className={klasaShikoDetajet}>Shiko detajet →</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shtoNeShporte(p.id);
                      }}
                      className={klasaButoniShtoShporteVogel}
                      title="Shto në shportë"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <p className={klasaTitulliProdukt}>{p.emri}</p>
                    <p className={klasaCmimiProdukt}>
                      {formatoCmimin(p.cmimi)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalFaqe > 1 && (
              <div className={klasaPaginimi}>
                <button
                  onClick={() => shkoNeFaqe(Math.max(1, faqjaAktuale - 1))}
                  disabled={faqjaAktuale === 1}
                  className={klasaButoniFaqe}
                >
                  ← Mbrapa
                </button>

                {gjeneroFaqet(faqjaAktuale, totalFaqe).map((nr, idx) =>
                  nr === "..." ? (
                    <span key={`dot-${idx}`} className={klasaPikatPaginim}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={nr}
                      onClick={() => shkoNeFaqe(nr)}
                      className={`${klasaFaqeBaze} ${
                        nr === faqjaAktuale
                          ? klasaFaqeAktive
                          : klasaFaqeJoaktive
                      }`}
                    >
                      {nr}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    shkoNeFaqe(Math.min(totalFaqe, faqjaAktuale + 1))
                  }
                  disabled={faqjaAktuale === totalFaqe}
                  className={klasaButoniFaqe}
                >
                  Para →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;
