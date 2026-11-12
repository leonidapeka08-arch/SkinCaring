import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { njoftoShportenUNdryshua } from "../utils/cartEvents";
import { fotoProduktit } from "../utils/fotoProduktit";
import { formatoCmimin } from "../utils/formatoCmimin";

const TARIFA_TRANSPORTIT = 500;

function Cart() {
  const [artikujt, setArtikujt] = useState([]);
  const [totali, setTotali] = useState(0);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const navigate = useNavigate();

  const ngarkoShporten = () => {
    api
      .get("/cart")
      .then((res) => {
        setArtikujt(res.data.items || []);
        setTotali(res.data.totali || 0);
        setDukeNgarkuar(false);
      })
      .catch((err) => {
        console.error(err);
        setDukeNgarkuar(false);
      });
  };

  useEffect(() => {
    ngarkoShporten();
  }, []);

  const ndryshoSasine = async (itemId, sasiaRe) => {
    if (sasiaRe < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { sasia: sasiaRe });
      ngarkoShporten();
      njoftoShportenUNdryshua();
    } catch (err) {
      console.error(err);
    }
  };

  const hiqNgaShporta = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      ngarkoShporten();
      njoftoShportenUNdryshua();
    } catch (err) {
      console.error(err);
    }
  };

  if (dukeNgarkuar) {
    return (
      <div className="min-h-screen bg-cream">
        <p className="text-center mt-20 text-gray-500">
          Duke ngarkuar shportën...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <p className="text-xs tracking-[0.2em] text-forest font-semibold mb-3 sm:mb-4">
          YOUR BAG
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-8 sm:mb-10">
          Shporta ime
        </h1>

        {artikujt.length === 0 ? (
          <div className="text-center py-16 sm:py-20 px-4 bg-white rounded-3xl border border-forest/10">
            <p className="text-gray-500 mb-5">Shporta është bosh.</p>
            <button
              onClick={() => navigate("/shop")}
              className="px-7 py-3 bg-forest text-cream rounded-full font-medium hover:bg-forest-dark transition"
            >
              Shko te Shopi
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {artikujt.map((item) => {
                const foto =
                  item.product?.images?.[0]?.url ||
                  fotoProduktit(item.product?.emri || "produkt", 160, 160);

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-forest/10"
                  >
                    <img
                      src={foto}
                      alt={item.product?.emri}
                      className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl object-cover"
                    />

                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base sm:text-lg leading-snug text-gray-900">
                          {item.product?.emri}
                        </p>
                        <p className="text-forest font-medium mt-1">
                          {formatoCmimin(item.product?.cmimi)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              ndryshoSasine(item.id, item.sasia - 1)
                            }
                            className="w-8 h-8 rounded-full border border-forest/20 hover:bg-sage transition"
                          >
                            −
                          </button>
                          <span className="w-6 text-center">{item.sasia}</span>
                          <button
                            onClick={() =>
                              ndryshoSasine(item.id, item.sasia + 1)
                            }
                            className="w-8 h-8 rounded-full border border-forest/20 hover:bg-sage transition"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => hiqNgaShporta(item.id)}
                          className="text-sm text-gray-400 hover:text-red-500 transition"
                        >
                          Hiq
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 sm:mt-10 bg-white p-5 sm:p-7 rounded-3xl border border-forest/10">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Nëntotali</span>
                <span>{formatoCmimin(totali)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Transporti</span>
                <span>{formatoCmimin(TARIFA_TRANSPORTIT)}</span>
              </div>
              <div className="flex justify-between items-center font-serif text-lg sm:text-xl border-t border-gray-100 pt-4 mb-5">
                <span className="text-gray-900">Totali</span>
                <span className="text-forest">
                  {formatoCmimin(Number(totali || 0) + TARIFA_TRANSPORTIT)}
                </span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-forest text-cream rounded-full font-medium hover:bg-forest-dark transition"
              >
                Vazhdo te Pagesa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
