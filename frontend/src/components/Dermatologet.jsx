import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { formatoCmimin } from "../utils/formatoCmimin";

// Foto fallback nëse mungon fusha fotoUrl në DB
const DEFAULT_FOTO =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800";

function Dermatologet() {
  const navigate = useNavigate();
  const [dermatologet, setDermatologet] = useState([]);
  const [indeksi, setIndeksi] = useState(0);
  const [dukshmeria, setDukshmeria] = useState(true);

  useEffect(() => {
    api
      .get("/services/dermatologists")
      .then((res) => setDermatologet(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (dermatologet.length <= 1) return;

    const intervali = setInterval(() => {
      setDukshmeria(false);
      setTimeout(() => {
        setIndeksi((i) => (i + 1) % dermatologet.length);
        setDukshmeria(true);
      }, 400);
    }, 5000); // Ekzaktsisht 5 sekonda

    return () => clearInterval(intervali);
  }, [dermatologet.length]);

  if (!dermatologet.length) return null;

  const d = dermatologet[indeksi];

  return (
    <section className="bg-forest px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-cream shadow-2xl p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* FOTO ME KORNIZË EDHE MADHËSI EKZAKTËSISHT TË NJËJTË */}
          <div className="flex justify-center items-center w-full">
            <div className="relative w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[360px] aspect-[4/5] rounded-[1.8rem] overflow-hidden border-2 border-forest/15 shadow-xl bg-white/50 p-2">
              <div className="relative w-full h-full rounded-[1.3rem] overflow-hidden">
                <img
                  src={d.fotoUrl || DEFAULT_FOTO}
                  alt={d.emri}
                  className={`w-full h-full object-cover object-top transition-all duration-700 ease-in-out ${
                    dukshmeria ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                />
                <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3.5 py-1.5 text-xs font-semibold text-gray-900 shadow-md backdrop-blur-md border border-white/40">
                  Dermatolog i verifikuar
                </span>
              </div>
            </div>
          </div>

          {/* INFORMACIONET E DERMATOLOGUT */}
          <div
            className={`flex flex-col justify-between transition-opacity duration-500 ease-in-out ${
              dukshmeria ? "opacity-100" : "opacity-0"
            }`}
          >
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-forest">
                KUJDES EKSPERT
              </p>
              <h2 className="mb-4 font-serif text-3xl font-normal leading-tight text-gray-900 sm:text-4xl">
                Flit për lëkurën me dikë që e kupton.
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
                {d.bio ||
                  "Rezervo një takim privat me video me një dermatolog të certifikuar."}
              </p>

              <div className="mb-8 flex items-center justify-between border-t border-gray-200/80 pt-5">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {d.emri}
                  </p>
                  <p className="text-sm text-gray-500">
                    {d.specializimi} · {d.vitiEksperience} vite eksperiencë
                  </p>
                </div>
                {d.sherbimet?.[0]?.cmimi != null && (
                  <div className="text-right min-w-fit">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">
                      Konsulta nga
                    </p>
                    <p className="font-serif text-3xl font-semibold text-forest">
                      {formatoCmimin(d.sherbimet[0].cmimi)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate("/dermatologists")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-sage px-8 py-4 text-sm font-semibold text-gray-900 hover:bg-sage/80 transition shadow-sm"
            >
              Rezervo konsultën tani →
            </button>
          </div>
        </div>

        {/* PIKAT POSHTË */}
        <div className="flex justify-center gap-2 pt-8">
          {dermatologet.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDukshmeria(false);
                setTimeout(() => {
                  setIndeksi(i);
                  setDukshmeria(true);
                }, 300);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === indeksi
                  ? "w-7 bg-forest"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dermatologet;
