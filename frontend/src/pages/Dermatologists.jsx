import { useState, useEffect } from "react";
import api from "../api/axios";
import { klasaEtiketaVerifikuar } from "../components/shared/classNames";
import { formatoCmimin } from "../utils/formatoCmimin";

const DEFAULT_FOTO =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800";

function Dermatologists() {
  const [dermatologet, setDermatologet] = useState([]);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);

  const [dermatologuZgjedhur, setDermatologuZgjedhur] = useState(null);
  const [oraret, setOraret] = useState([]);
  const [dataZgjedhur, setDataZgjedhur] = useState("");
  const [slotZgjedhur, setSlotZgjedhur] = useState(null);
  const [sherbimetZgjedhura, setSherbimetZgjedhura] = useState([]);

  const [mesazhi, setMesazhi] = useState(null);
  const [duke, setDuke] = useState(false);
  const [dukeNgarkuarOrare, setDukeNgarkuarOrare] = useState(false);

  useEffect(() => {
    api
      .get("/services/dermatologists")
      .then((res) => {
        setDermatologet(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setDukeNgarkuar(false);
      });
  }, []);

  // Ngrin faqen në sfond sa kohë modali është i hapur.
  useEffect(() => {
    if (!dermatologuZgjedhur) return;

    const gjeresiaScrollbar =
      window.innerWidth - document.documentElement.clientWidth;
    const overflowVjeter = document.body.style.overflow;
    const paddingVjeter = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${gjeresiaScrollbar}px`;

    return () => {
      document.body.style.overflow = overflowVjeter;
      document.body.style.paddingRight = paddingVjeter;
    };
  }, [dermatologuZgjedhur]);

  // Hap modalin dhe ngarkon oraret e lira.
  const hapRezervimin = async (dermatologu) => {
    setDermatologuZgjedhur(dermatologu);
    setOraret([]);
    setDataZgjedhur("");
    setSlotZgjedhur(null);
    setSherbimetZgjedhura([]);
    setMesazhi(null);
    setDukeNgarkuarOrare(true);

    try {
      const res = await api.get(
        `/services/dermatologists/${dermatologu.id}/availability`,
      );

      const lira = (res.data || []).filter((slot) => !slot.iZene);

      setOraret(lira);
    } catch (err) {
      console.error(err);
      setMesazhi({
        tipi: "gabim",
        teksti: "Nuk arritëm të ngarkojmë oraret. Provo përsëri.",
      });
    } finally {
      setDukeNgarkuarOrare(false);
    }
  };

  const mbyllModalin = () => {
    if (duke) return;

    setDermatologuZgjedhur(null);
    setOraret([]);
    setDataZgjedhur("");
    setSlotZgjedhur(null);
    setSherbimetZgjedhura([]);
  };

  // Merr datat unike nga oraret e lira.
  const datatDisponueshme = [
    ...new Set(oraret.map((slot) => slot.data.substring(0, 10))),
  ].sort();

  // Merr oraret e lira për datën e zgjedhur.
  const oraretPerDaten = oraret.filter(
    (slot) => slot.data.substring(0, 10) === dataZgjedhur,
  );

  const formatoDaten = (data) => {
    return new Date(`${data}T12:00:00`).toLocaleDateString("sq-AL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatoOren = (slot) => {
    return slot.oraFillimit || slot.ora;
  };

  // Zgjidhet vetëm një shërbim.
  const toggleSherbim = (serviceId) => {
    setSherbimetZgjedhura([serviceId]);
  };

  const sherbimet = dermatologuZgjedhur?.sherbimet || [];

  const sherbimetAktuale = sherbimet.filter((s) =>
    sherbimetZgjedhura.includes(s.id),
  );

  const cmimiTotal = sherbimetAktuale.reduce(
    (total, service) => total + Number(service.cmimi || 0),
    0,
  );

  const kohezgjatjaTotal = sherbimetAktuale.reduce(
    (total, service) => total + Number(service.kohezgjatja || 0),
    0,
  );

  // Kalimi nga zgjedhja e orarit te zgjedhja e shërbimeve.
  const vazhdoTeSherbimet = () => {
    if (!slotZgjedhur) {
      setMesazhi({
        tipi: "gabim",
        teksti: "Zgjidh fillimisht një orar të lirë.",
      });
      return;
    }

    setMesazhi(null);
    setSherbimetZgjedhura([]);
  };

  // Konfirmimi i rezervimit.
  const rezervo = async () => {
    if (duke || !slotZgjedhur || sherbimetZgjedhura.length === 0) {
      return;
    }

    setDuke(true);
    setMesazhi(null);

    try {
      await api.post("/appointments", {
        dermatologistId: dermatologuZgjedhur.id,
        serviceIds: sherbimetZgjedhura,
        availabilityId: slotZgjedhur.id,
      });

      setMesazhi({
        tipi: "sukses",
        teksti: `Takimi u rezervua me sukses për ${formatoDaten(
          slotZgjedhur.data.substring(0, 10),
        )} në orën ${formatoOren(slotZgjedhur)}. Të dërguam një email konfirmimi.`,
      });

      // Përditëso oraret pas rezervimit.
      const res = await api.get(
        `/services/dermatologists/${dermatologuZgjedhur.id}/availability`,
      );

      setOraret((res.data || []).filter((slot) => !slot.iZene));

      setDermatologuZgjedhur(null);
      setSlotZgjedhur(null);
      setDataZgjedhur("");
      setSherbimetZgjedhura([]);
    } catch (err) {
      console.error(err);

      const status = err.response?.status;

      setMesazhi({
        tipi: "gabim",
        teksti:
          status === 401
            ? "Duhet të jesh i kyçur për të rezervuar."
            : err.response?.data?.error ||
              "Rezervimi nuk u krye. Provo përsëri.",
      });

      if (status === 409) {
        try {
          const res = await api.get(
            `/services/dermatologists/${dermatologuZgjedhur.id}/availability`,
          );

          const lira = (res.data || []).filter((slot) => !slot.iZene);

          setOraret(lira);
          setSlotZgjedhur(null);
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setDuke(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.2em] text-forest font-semibold mb-4">
          KUJDES EKSPERT
        </p>

        <h1 className="font-serif text-4xl text-gray-900 mb-10">
          Flit për lëkurën me dikë që e kupton.
        </h1>

        {mesazhi && (
          <div
            className={`mb-6 rounded-2xl px-5 py-3 text-sm ${
              mesazhi.tipi === "sukses"
                ? "bg-sage text-forest"
                : "bg-red-50 text-red-700"
            }`}
          >
            {mesazhi.teksti}
          </div>
        )}

        {dukeNgarkuar ? (
          <p className="text-gray-500 animate-pulse">
            Duke ngarkuar dermatologët...
          </p>
        ) : (
          <div className="space-y-8">
            {dermatologet.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-[2rem] border border-forest/10 overflow-hidden md:flex shadow-sm p-4 sm:p-6 gap-6 items-center"
              >
                <div className="relative w-full md:w-64 aspect-[4/5] rounded-[1.3rem] overflow-hidden border border-forest/15 shadow-sm bg-gray-50 flex-shrink-0">
                  <img
                    src={d.fotoUrl || DEFAULT_FOTO}
                    alt={d.emri}
                    className="w-full h-full object-cover object-top"
                  />

                  <span
                    className={`absolute left-3 top-3 ${klasaEtiketaVerifikuar}`}
                  >
                    Dermatolog i verifikuar
                  </span>
                </div>

                <div className="flex-1 mt-4 md:mt-0">
                  <h3 className="font-serif text-2xl text-gray-900 mb-1">
                    {d.emri}
                  </h3>

                  <p className="text-sm font-medium text-forest mb-2">
                    {d.specializimi} · {d.vitiEksperience} vite eksperiencë
                  </p>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {d.bio ||
                      "Specializuar në trajtimin dhe kujdesin profesional të lëkurës."}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {d.sherbimet?.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                      >
                        <p className="text-sm font-semibold text-gray-800 mb-3">
                          {s.emri}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatoCmimin(s.cmimi)}
                          </span>

                          {s.kohezgjatja != null && (
                            <span className="text-xs text-gray-500">
                              {s.kohezgjatja} min
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => hapRezervimin(d)}
                    className="px-6 py-3 bg-forest text-cream rounded-full text-sm font-medium hover:bg-forest-dark transition shadow-sm"
                  >
                    Rezervo takim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALI I REZERVIMIT */}
      {dermatologuZgjedhur && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={mbyllModalin}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2rem] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto overscroll-contain p-6 sm:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:my-8 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-forest/30 [@supports(-moz-appearance:none)]:[scrollbar-width:thin]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs tracking-[0.2em] text-forest font-semibold mb-2">
                    REZERVIM TAKIMI
                  </p>

                  <h2 className="font-serif text-2xl text-gray-900">
                    {dermatologuZgjedhur.emri}
                  </h2>
                </div>

                <button
                  onClick={mbyllModalin}
                  disabled={duke}
                  className="text-gray-400 hover:text-gray-900 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* HAPI 1 - DATA DHE ORARI */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-sm">
                    1
                  </span>

                  <h3 className="font-semibold text-gray-900">
                    Zgjidh datën dhe orarin
                  </h3>
                </div>

                {dukeNgarkuarOrare ? (
                  <p className="text-sm text-gray-500 animate-pulse">
                    Duke ngarkuar oraret e lira...
                  </p>
                ) : datatDisponueshme.length === 0 ? (
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
                    Nuk ka orare të lira për këtë dermatolog tani.
                  </p>
                ) : (
                  <>
                    <label className="block text-sm text-gray-600 mb-2">
                      Datat e disponueshme
                    </label>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {datatDisponueshme.map((data) => (
                        <button
                          key={data}
                          onClick={() => {
                            setDataZgjedhur(data);
                            setSlotZgjedhur(null);
                            setMesazhi(null);
                          }}
                          className={`px-4 py-2 rounded-xl border text-sm capitalize transition ${
                            dataZgjedhur === data
                              ? "bg-forest text-white border-forest"
                              : "border-gray-200 text-gray-700 hover:bg-sage"
                          }`}
                        >
                          {formatoDaten(data)}
                        </button>
                      ))}
                    </div>

                    {dataZgjedhur && (
                      <>
                        <label className="block text-sm text-gray-600 mb-2">
                          Orët e lira
                        </label>

                        <div className="flex flex-wrap gap-2">
                          {oraretPerDaten.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => {
                                setSlotZgjedhur(slot);
                                setMesazhi(null);
                              }}
                              className={`px-5 py-3 rounded-xl border text-sm font-semibold transition ${
                                slotZgjedhur?.id === slot.id
                                  ? "bg-sage border-forest text-forest"
                                  : "border-gray-200 text-gray-700 hover:bg-sage"
                              }`}
                            >
                              {formatoOren(slot)}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* HAPI 2 - SHËRBIMET */}
              <div className="mb-8 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      slotZgjedhur
                        ? "bg-forest text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </span>

                  <h3 className="font-semibold text-gray-900">
                    Zgjidh shërbimin
                  </h3>
                </div>

                {!slotZgjedhur ? (
                  <p className="text-sm text-gray-400">
                    Zgjidh fillimisht datën dhe orarin për të vazhduar.
                  </p>
                ) : sherbimet.length === 0 ? (
                  <p className="text-sm text-red-600">
                    Ky dermatolog nuk ka shërbime të regjistruara.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sherbimet.map((s) => {
                      const zgjedhur = sherbimetZgjedhura.includes(s.id);

                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleSherbim(s.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition ${
                            zgjedhur
                              ? "border-forest bg-sage/50"
                              : "border-gray-200 hover:border-forest/40"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                                  zgjedhur
                                    ? "bg-forest text-white border-forest"
                                    : "border-gray-300"
                                }`}
                              >
                                {zgjedhur ? "✓" : ""}
                              </span>

                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {s.emri}
                                </p>

                                {s.kohezgjatja != null && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {s.kohezgjatja} minuta
                                  </p>
                                )}
                              </div>
                            </div>

                            <span className="font-semibold text-forest text-sm whitespace-nowrap">
                              {formatoCmimin(s.cmimi)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PËRMBLEDHJA */}
              {slotZgjedhur && sherbimetAktuale.length > 0 && (
                <div className="bg-cream rounded-2xl p-5 mb-6">
                  <h3 className="font-serif text-lg text-gray-900 mb-4">
                    Përmbledhja e rezervimit
                  </h3>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Data</span>
                    <span className="font-medium capitalize">
                      {formatoDaten(slotZgjedhur.data.substring(0, 10))}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-600">Ora</span>
                    <span className="font-medium">
                      {formatoOren(slotZgjedhur)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    {sherbimetAktuale.map((s) => (
                      <div
                        key={s.id}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="text-gray-600">{s.emri}</span>
                        <span>{formatoCmimin(s.cmimi)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kohëzgjatja totale</span>

                      <span className="font-semibold">
                        {kohezgjatjaTotal} minuta
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Totali
                      </span>

                      <span className="font-serif text-2xl font-bold text-forest">
                        {formatoCmimin(cmimiTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {mesazhi?.tipi === "gabim" && (
                <p className="text-sm text-red-600 mb-4">{mesazhi.teksti}</p>
              )}

              {/* BUTONAT */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={mbyllModalin}
                  disabled={duke}
                  className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Anulo
                </button>

                <button
                  onClick={rezervo}
                  disabled={
                    duke || !slotZgjedhur || sherbimetZgjedhura.length === 0
                  }
                  className="flex-1 py-3 rounded-full bg-forest text-white text-sm font-semibold hover:bg-forest-dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {duke ? "Duke rezervuar..." : "Konfirmo rezervimin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dermatologists;
