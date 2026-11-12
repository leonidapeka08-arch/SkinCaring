import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { fotoProduktit } from "../utils/fotoProduktit";
import { njoftoShportenUNdryshua } from "../utils/cartEvents";
import { PlusIcon } from "./shared/Icons";
import {
  klasaEyebrow,
  klasaTitulli4xl,
  klasaButoniPrimar,
  klasaButoniShtoShporteVogel,
  klasaToast,
  klasaChipEksperience,
} from "./shared/classNames";

const ETIKETA_TIPI = {
  normale: "normale",
  e_thate: "e thatë",
  e_yndyrshme: "e yndyrshme",
  e_perzier: "e përzier",
};

const ETIKETA_PROBLEMI = {
  akne: "Akne",
  skuqje: "Skuqje",
  ndjeshmeri: "Ndjeshmëri",
  njolla_pigmentuese: "Njolla pigmentuese",
  rrudha_te_holla: "Rrudha të holla",
  pore_te_medha: "Pore të mëdha",
  thatesi: "Thatësi",
  yndyrshmeri_teper: "Yndyrshmëri e tepërt",
  rrathe_te_zeza: "Rrathë të errët",
};

const ETIKETA_BESUESHMERIA = {
  e_ulet: "Besueshmëri e ulët",
  mesatare: "Besueshmëri mesatare",
  e_larte: "Besueshmëri e lartë",
};

// stilet vetëm për këtë komponent
const klasaKarta = "rounded-3xl border border-forest/10 bg-white p-6 sm:p-8";
const klasaNentitulli =
  "mb-3 text-xs font-semibold tracking-wider text-gray-500";

function SkinResults({ rezultati }) {
  const navigate = useNavigate();
  const rrjedha = useRef(null);
  const [mesazhi, setMesazhi] = useState("");

  useEffect(() => {
    rrjedha.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [rezultati]);

  if (!rezultati?.analiza) return null;

  const { analiza, rekomandimet = [], paralajmerime = [] } = rezultati;

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

  return (
    <section ref={rrjedha} className="mx-auto mt-14 w-full max-w-5xl text-left">
      {mesazhi && <div className={klasaToast}>{mesazhi}</div>}

      <p className={`mb-3 ${klasaEyebrow}`}>ANALIZA JOTE</p>
      <h2 className={`mb-4 ${klasaTitulli4xl}`}>
        Lëkurë {ETIKETA_TIPI[analiza.tipiLekure] || analiza.tipiLekure}
      </h2>

      <div className="mb-8 flex flex-wrap gap-2">
        <span className={klasaChipEksperience}>
          {ETIKETA_BESUESHMERIA[analiza.besueshmeria]}
        </span>
        {analiza.problemet.map((p) => (
          <span
            key={p}
            className="rounded-full border border-forest/20 bg-white px-3.5 py-1.5 text-xs font-medium text-forest-dark"
          >
            {ETIKETA_PROBLEMI[p] || p}
          </span>
        ))}
      </div>

      <div className={`${klasaKarta} mb-6`}>
        {analiza.pershkrimi && (
          <p className="mb-6 text-gray-700 leading-7">{analiza.pershkrimi}</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2">
          {analiza.vezhgimet.length > 0 && (
            <div>
              <p className={klasaNentitulli}>ÇFARË VËZHGUAM</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {analiza.vezhgimet.map((v, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {analiza.keshilla.length > 0 && (
            <div>
              <p className={klasaNentitulli}>KËSHILLA</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {analiza.keshilla.map((k, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {paralajmerime.length > 0 && (
          <div className="mt-6 rounded-xl bg-sage p-3 text-sm text-forest-dark">
            {paralajmerime.join(" ")}
          </div>
        )}
      </div>

      {analiza.duhetDermatolog && (
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-forest p-6 text-cream sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-xl">Rekomandojmë një dermatolog</p>
            <p className="mt-1 text-sm text-cream/80">
              {analiza.arsyejaDermatolog ||
                "Diçka në foto ia vlen të shihet nga një specialist."}
            </p>
          </div>
          <button
            onClick={() => navigate("/dermatologists")}
            className="shrink-0 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-forest transition hover:bg-sage"
          >
            Rezervo konsultë →
          </button>
        </div>
      )}

      <p className={klasaNentitulli}>PRODUKTE PËR TY</p>
      {rekomandimet.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nuk gjetëm produkte që përputhen saktë me këtë analizë.{" "}
          <button
            onClick={() => navigate("/shop")}
            className="font-medium text-forest underline underline-offset-2"
          >
            Shiko të gjitha produktet
          </button>
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rekomandimet.map((p) => (
            <div key={p.id} className="group">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-sage sm:aspect-auto sm:h-56">
                <img
                  src={fotoProduktit(p.emri, 400, 300)}
                  alt={p.emri}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => shtoNeShporte(p.id)}
                  className={klasaButoniShtoShporteVogel}
                  title="Shto në shportë"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-start justify-between">
                <p className="font-serif text-lg text-gray-900">{p.emri}</p>
                <p className="ml-4 whitespace-nowrap font-serif text-lg text-forest">
                  ${Number(p.cmimi).toFixed(0)}
                </p>
              </div>
              {p.arsyeja && (
                <p className="mt-1 text-xs text-forest">{p.arsyeja}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-xs leading-5 text-gray-400">
        Ky është një vlerësim kozmetik i bazuar në foto, jo diagnozë mjekësore.
        Për shqetësime të vazhdueshme ose të pazakonta, konsultohu me një
        dermatolog.
      </p>

      <div className="mt-6">
        <button onClick={() => navigate("/shop")} className={klasaButoniPrimar}>
          Shiko të gjitha produktet
        </button>
      </div>
    </section>
  );
}

export default SkinResults;
