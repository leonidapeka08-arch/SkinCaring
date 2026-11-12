import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { fotoProduktit } from "../utils/fotoProduktit";
import { njoftoShportenUNdryshua } from "../utils/cartEvents";
import { formatoCmimin } from "../utils/formatoCmimin";
import { PlusIcon } from "../components/shared/Icons";
import {
  klasaFaqja,
  klasaEyebrow,
  klasaToast,
  klasaTitulli4xl,
  klasaButoniShtoShporteVogel,
  klasaTitulliProdukt,
  klasaCmimiProdukt,
  klasaKonteinerDetaj,
  klasaNgarkimDetaj,
  klasaBreadcrumb,
  klasaBreadcrumbLink,
  klasaGridDetaj,
  klasaFotoKryesore,
  klasaFotoDetaj,
  klasaMiniaturat,
  klasaMiniaturaBaze,
  klasaMiniaturaAktive,
  klasaMiniaturaJoaktive,
  klasaTitulliDetaj,
  klasaCmimiDetaj,
  klasaPershkrimDetaj,
  klasaEtiketaDetaj,
  klasaChipTipi,
  klasaRreshtiBlerje,
  klasaSasiaKonteiner,
  klasaButoniSasiaDetaj,
  klasaButoniKryesorDetaj,
  klasaButoniDyteDetaj,
  klasaRreshtiNdaj,
  klasaLinkNdaj,
  klasaKonteinerPaGjetur,
  klasaButoniKthehu,
  klasaSeksioniTeNgjashme,
  klasaGridTeNgjashme,
  klasaKornizaTeNgjashme,
  klasaFotoTeNgjashme,
  klasaStokuBaze,
  klasaStokuOk,
  klasaStokuPak,
  klasaStokuNul,
  klasaPikaStoku,
  klasaTabelaInfo,
  klasaRreshtiInfo,
  klasaEtiketaInfo,
  klasaVleraInfo,
  klasaGridPerberes,
  klasaKartaPerberes,
  klasaEmriPerberes,
  klasaPerfitimiPerberes,
} from "../components/shared/classNames";

const ETIKETA_TIPI = {
  normale: "Normale",
  e_thate: "E thatë",
  e_yndyrshme: "E yndyrshme",
  sensitive: "Ndjeshme",
  akne_prone: "Me prirje ndaj aknes",
};

function lexoTipet(produkti) {
  try {
    const tipet = JSON.parse(produkti.tipiLekurePershtatshem || "[]");
    return Array.isArray(tipet) ? tipet : [];
  } catch (e) {
    return [];
  }
}

function infoStoku(stoku) {
  if (stoku <= 0) return { tekst: "Jashtë stoku", klasa: klasaStokuNul };
  if (stoku <= 5)
    return { tekst: `Vetëm ${stoku} copë mbeten`, klasa: klasaStokuPak };
  return { tekst: "Në stok", klasa: klasaStokuOk };
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produkti, setProdukti] = useState(null);
  const [teNgjashme, setTeNgjashme] = useState([]);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [nukGjendet, setNukGjendet] = useState(false);
  const [sasia, setSasia] = useState(1);
  const [fotoAktive, setFotoAktive] = useState(0);
  const [dukeShtuar, setDukeShtuar] = useState(false);
  const [mesazhi, setMesazhi] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setDukeNgarkuar(true);
    setNukGjendet(false);
    setSasia(1);
    setFotoAktive(0);

    api
      .get(`/products/${id}`)
      .then((res) => {
        setProdukti(res.data);
        setDukeNgarkuar(false);

        const query = new URLSearchParams({ faqja: 1, limiti: 5 });
        if (res.data.kategoriaId) query.set("kategoria", res.data.kategoriaId);
        return api.get(`/products?${query.toString()}`);
      })
      .then((res) => {
        setTeNgjashme(
          (res.data.produktet || []).filter((p) => p.id !== id).slice(0, 4),
        );
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 404) setNukGjendet(true);
        setDukeNgarkuar(false);
      });
  }, [id]);

  const shfaqMesazh = (tekst) => {
    setMesazhi(tekst);
    setTimeout(() => setMesazhi(""), 2500);
  };

  const shtoNeShporte = async (productId, sasiaZgjedhur = 1) => {
    try {
      await api.post("/cart/add", { productId, sasia: sasiaZgjedhur });
      njoftoShportenUNdryshua();
      shfaqMesazh("U shtua në shportë ✓");
      return true;
    } catch (err) {
      console.error(err);
      shfaqMesazh("Duhet të jesh i kyçur për të shtuar në shportë");
      return false;
    }
  };

  const shtoTani = async () => {
    setDukeShtuar(true);
    await shtoNeShporte(produkti.id, sasia);
    setDukeShtuar(false);
  };

  const bliTani = async () => {
    setDukeShtuar(true);
    const ok = await shtoNeShporte(produkti.id, sasia);
    setDukeShtuar(false);
    if (ok) navigate("/cart");
  };

  const kopjoLinkun = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      shfaqMesazh("Linku u kopjua ✓");
    } catch (err) {
      shfaqMesazh("Nuk u kopjua linku");
    }
  };

  if (dukeNgarkuar) {
    return (
      <div className={klasaFaqja}>
        <p className={klasaNgarkimDetaj}>Duke ngarkuar produktin...</p>
      </div>
    );
  }

  if (nukGjendet || !produkti) {
    return (
      <div className={klasaFaqja}>
        <div className={klasaKonteinerPaGjetur}>
          <h1 className={`mb-3 ${klasaTitulli4xl}`}>Produkti nuk u gjet</h1>
          <p className="mb-6 text-gray-600">
            Ky produkt nuk ekziston ose është hequr.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className={klasaButoniKthehu}
          >
            Kthehu te Shopi
          </button>
        </div>
      </div>
    );
  }

  const fotot =
    produkti.images?.length > 0
      ? produkti.images.map((f) => f.url)
      : [fotoProduktit(produkti.emri, 800, 900)];
  const tipet = lexoTipet(produkti);
  const perberesit = produkti.ingredients || [];
  const stoku = Number(produkti.stoku) || 0;
  const maksimumi = Math.max(1, Math.min(10, stoku));

  const rreshtatInfo = [
    produkti.marka && { etiketa: "Marka", vlera: produkti.marka },
    produkti.kategoria && {
      etiketa: "Kategoria",
      vlera: produkti.kategoria.emri,
    },
  ].filter(Boolean);

  return (
    <div className={klasaFaqja}>
      {mesazhi && <div className={klasaToast}>{mesazhi}</div>}

      <div className={klasaKonteinerDetaj}>
        <nav className={klasaBreadcrumb}>
          <Link to="/shop" className={klasaBreadcrumbLink}>
            Shop
          </Link>
          {produkti.kategoria && (
            <>
              <span>/</span>
              <Link
                to={`/shop?kategoria=${produkti.kategoria.id}`}
                className={klasaBreadcrumbLink}
              >
                {produkti.kategoria.emri}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{produkti.emri}</span>
        </nav>

        <div className={klasaGridDetaj}>
          <div>
            <div className={klasaFotoKryesore}>
              <img
                src={fotot[fotoAktive]}
                alt={produkti.emri}
                className={klasaFotoDetaj}
              />
            </div>
            {fotot.length > 1 && (
              <div className={klasaMiniaturat}>
                {fotot.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => setFotoAktive(i)}
                    className={`${klasaMiniaturaBaze} ${
                      i === fotoAktive
                        ? klasaMiniaturaAktive
                        : klasaMiniaturaJoaktive
                    }`}
                  >
                    <img src={url} alt="" className={klasaFotoDetaj} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {produkti.kategoria && (
              <p className={`mb-3 ${klasaEyebrow}`}>
                {produkti.kategoria.emri.toUpperCase()}
              </p>
            )}

            <h1 className={klasaTitulliDetaj}>{produkti.emri}</h1>

            <p className={klasaCmimiDetaj}>{formatoCmimin(produkti.cmimi)}</p>

            {stoku <= 0 && (
              <p className={`${klasaStokuBaze} ${klasaStokuNul}`}>
                <span className={klasaPikaStoku} />
                Jashtë stoku
              </p>
            )}

            {produkti.pershkrimi && (
              <p className={klasaPershkrimDetaj}>{produkti.pershkrimi}</p>
            )}

            {tipet.length > 0 && (
              <div className="mt-6">
                <p className={klasaEtiketaDetaj}>I PËRSHTATSHËM PËR</p>
                <div className="flex flex-wrap gap-2">
                  {tipet.map((t) => (
                    <span key={t} className={klasaChipTipi}>
                      {ETIKETA_TIPI[t] || t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={klasaRreshtiBlerje}>
              <div className={klasaSasiaKonteiner}>
                <button
                  onClick={() => setSasia((s) => Math.max(1, s - 1))}
                  className={klasaButoniSasiaDetaj}
                  aria-label="Zvogëlo sasinë"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{sasia}</span>
                <button
                  onClick={() => setSasia((s) => Math.min(maksimumi, s + 1))}
                  className={klasaButoniSasiaDetaj}
                  aria-label="Rrit sasinë"
                >
                  +
                </button>
              </div>
              <button
                onClick={shtoTani}
                disabled={dukeShtuar || stoku <= 0}
                className={klasaButoniKryesorDetaj}
              >
                Shto në shportë
              </button>
              <button
                onClick={bliTani}
                disabled={dukeShtuar || stoku <= 0}
                className={klasaButoniDyteDetaj}
              >
                Bli tani
              </button>
            </div>

            <div className={klasaRreshtiNdaj}>
              <span className="font-medium text-gray-900">Ndaje:</span>
              <button onClick={kopjoLinkun} className={klasaLinkNdaj}>
                Kopjo linkun
              </button>
            </div>

            <div className={klasaTabelaInfo}>
              {rreshtatInfo.map((r) => (
                <div key={r.etiketa} className={klasaRreshtiInfo}>
                  <span className={klasaEtiketaInfo}>{r.etiketa}</span>
                  <span className={klasaVleraInfo}>{r.vlera}</span>
                </div>
              ))}
            </div>

            {perberesit.length > 0 && (
              <div className="mt-8">
                <p className={klasaEtiketaDetaj}>PËRBËRËSIT KRYESORË</p>
                <div className={klasaGridPerberes}>
                  {perberesit.map((pi) => (
                    <div key={pi.ingredient.id} className={klasaKartaPerberes}>
                      <p className={klasaEmriPerberes}>{pi.ingredient.emri}</p>
                      {pi.ingredient.perfitimi && (
                        <p className={klasaPerfitimiPerberes}>
                          {pi.ingredient.perfitimi}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {teNgjashme.length > 0 && (
          <section className={klasaSeksioniTeNgjashme}>
            <p className={`mb-3 ${klasaEyebrow}`}>TË NGJASHME</p>
            <h2 className={`mb-10 ${klasaTitulli4xl}`}>
              Mund të të pëlqejnë edhe
            </h2>

            <div className={klasaGridTeNgjashme}>
              {teNgjashme.map((p) => (
                <div
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className={klasaKornizaTeNgjashme}>
                    <img
                      src={fotoProduktit(p.emri, 400, 400)}
                      alt={p.emri}
                      className={klasaFotoTeNgjashme}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shtoNeShporte(p.id, 1);
                      }}
                      className={klasaButoniShtoShporteVogel}
                      title="Shto në shportë"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-start justify-between">
                    <p className={klasaTitulliProdukt}>{p.emri}</p>
                    <p
                      className={`ml-3 whitespace-nowrap ${klasaCmimiProdukt}`}
                    >
                      {formatoCmimin(p.cmimi)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
