import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PagesaMeKarte from "../components/PagesaMeKarte";
import { formatoCmimin } from "../utils/formatoCmimin";

const TARIFA_TRANSPORTIT = 500;

function Checkout() {
  const [artikujt, setArtikujt] = useState([]);
  const [subtotali, setSubtotali] = useState(0);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [dukeDerguar, setDukeDerguar] = useState(false);
  const [gabimi, setGabimi] = useState("");
  const navigate = useNavigate();
  const paguesRef = useRef(null);

  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [shteti, setShteti] = useState("Shqipëri");
  const [adresa, setAdresa] = useState("");
  const [qyteti, setQyteti] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [email, setEmail] = useState("");
  const [shenime, setShenime] = useState("");
  const [metodaPageses, setMetodaPageses] = useState("dorezim");

  useEffect(() => {
    api
      .get("/cart")
      .then((res) => {
        const items = res.data.items || [];
        if (items.length === 0) {
          navigate("/shop");
          return;
        }
        setArtikujt(items);
        setSubtotali(res.data.totali || 0);
        setDukeNgarkuar(false);
      })
      .catch((err) => {
        console.error(err);
        setDukeNgarkuar(false);
      });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.email) setEmail(user.email);
    if (user.emri) setEmri(user.emri);
  }, [navigate]);

  const totali = Number(subtotali || 0) + TARIFA_TRANSPORTIT;

  const beniPorosine = async (e) => {
    e.preventDefault();
    setGabimi("");
    setDukeDerguar(true);
    try {
      const adresaKomplete = `${emri} ${mbiemri}, ${adresa}, ${qyteti}, ${shteti} | Tel: ${telefoni} | Email: ${email} | Pagesa: ${
        metodaPageses === "dorezim" ? "Në dorëzim" : "Kartë krediti"
      }${shenime ? " | Shënim: " + shenime : ""}`;

      let paymentIntentId;
      if (metodaPageses === "karte") {
        if (!paguesRef.current) {
          setGabimi("Forma e kartës nuk është gati ende.");
          return;
        }
        const pagesa = await paguesRef.current();
        if (pagesa.error) {
          setGabimi(pagesa.error);
          return;
        }
        paymentIntentId = pagesa.paymentIntentId;
      }

      await api.post("/orders/checkout", {
        adresa: adresaKomplete,
        paymentIntentId,
      });
      navigate("/shop");
    } catch (err) {
      console.error(err);
      setGabimi("Diçka shkoi keq, provo përsëri.");
    } finally {
      setDukeDerguar(false);
    }
  };

  if (dukeNgarkuar) {
    return (
      <div className="min-h-screen bg-cream">
        <p className="text-center mt-20 text-gray-500">Duke ngarkuar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-gray-900 mb-10">Checkout</h1>

        <form onSubmit={beniPorosine} className="grid lg:grid-cols-2 gap-12">
          {/* ===== BILLING DETAILS ===== */}
          <div>
            <h2 className="font-serif text-xl text-gray-900 mb-6">
              Të dhënat e faturimit
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Emri <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emri}
                  onChange={(e) => setEmri(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Mbiemri <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={mbiemri}
                  onChange={(e) => setMbiemri(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Shteti / Rajoni <span className="text-red-500">*</span>
              </label>
              <select
                value={shteti}
                onChange={(e) => setShteti(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
              >
                <option>Shqipëri</option>
                <option>Kosovë</option>
                <option>Maqedoni e Veriut</option>
                <option>Tjetër</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Adresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Numri i shtëpisë dhe emri i rrugës"
                value={adresa}
                onChange={(e) => setAdresa(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Qyteti <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={qyteti}
                onChange={(e) => setQyteti(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Telefoni <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={telefoni}
                onChange={(e) => setTelefoni(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
              />
            </div>

            <h2 className="font-serif text-xl text-gray-900 mb-3">
              Informacion shtesë
            </h2>
            <label className="block text-sm text-gray-600 mb-1">
              Shënime porosie (opsionale)
            </label>
            <textarea
              value={shenime}
              onChange={(e) => setShenime(e.target.value)}
              rows={3}
              placeholder="Shënime për dorëzimin, p.sh. koha më e mirë..."
              className="w-full px-4 py-3 rounded-xl border border-forest/15 focus:outline-none focus:border-forest bg-white"
            />
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <div>
            <h2 className="font-serif text-xl text-gray-900 mb-6">
              Porosia jote
            </h2>

            <div className="bg-white rounded-2xl border border-forest/10 p-6">
              <div className="flex justify-between text-sm text-gray-500 font-medium pb-3 border-b border-forest/10">
                <span>Produkti</span>
                <span>Nëntotali</span>
              </div>

              {artikujt.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-4 border-b border-forest/10"
                >
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(item.product?.emri || "produkt")}/60/60`}
                    alt={item.product?.emri}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {item.product?.emri}
                    </p>
                    <p className="text-xs text-gray-400">sasia: {item.sasia}</p>
                  </div>
                  <span className="text-sm text-gray-700">
                    {formatoCmimin(
                      Number(item.product?.cmimi || 0) * item.sasia,
                    )}
                  </span>
                </div>
              ))}

              <div className="flex justify-between py-3 border-b border-forest/10 text-sm">
                <span className="text-gray-600">Nëntotali</span>
                <span className="text-gray-900">
                  {formatoCmimin(subtotali)}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-forest/10 text-sm">
                <span className="text-gray-600">Transporti</span>
                <span className="text-gray-900">
                  Tarifë fikse: {formatoCmimin(TARIFA_TRANSPORTIT)}
                </span>
              </div>

              <div className="flex justify-between py-4 font-serif text-lg">
                <span className="text-gray-900">Totali</span>
                <span className="text-forest">{formatoCmimin(totali)}</span>
              </div>

              <div className="space-y-3 mb-5">
                <label className="flex items-start gap-2 p-3 rounded-xl border border-forest/15 cursor-pointer has-[:checked]:border-forest has-[:checked]:bg-sage/40">
                  <input
                    type="radio"
                    name="pagesa"
                    checked={metodaPageses === "dorezim"}
                    onChange={() => setMetodaPageses("dorezim")}
                    className="mt-1 accent-forest"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Paguaj në dorëzim
                    </p>
                    {metodaPageses === "dorezim" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Pagesa kryhet në momentin që merrni porosinë.
                      </p>
                    )}
                  </div>
                </label>

                <label className="flex items-start gap-2 p-3 rounded-xl border border-forest/15 cursor-pointer has-[:checked]:border-forest has-[:checked]:bg-sage/40">
                  <input
                    type="radio"
                    name="pagesa"
                    checked={metodaPageses === "karte"}
                    onChange={() => setMetodaPageses("karte")}
                    className="mt-1 accent-forest"
                  />
                  <p className="text-sm font-medium text-gray-900">
                    Paguaj me Kartë Krediti
                  </p>
                </label>

                {metodaPageses === "karte" && (
                  <PagesaMeKarte paguesRef={paguesRef} />
                )}
              </div>

              {gabimi && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                  {gabimi}
                </div>
              )}

              <p className="text-xs text-gray-400 mb-5">
                Të dhënat tuaja personale përdoren për të përpunuar porosinë dhe
                për të përmirësuar përvojën tuaj në këtë faqe.
              </p>

              <button
                type="submit"
                disabled={dukeDerguar}
                className="w-full py-4 bg-forest text-cream rounded-full font-medium hover:bg-forest-dark transition disabled:opacity-50"
              >
                {dukeDerguar
                  ? "Duke dërguar..."
                  : metodaPageses === "karte"
                    ? "Paguaj dhe porosit"
                    : "Bëj Porosinë"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
