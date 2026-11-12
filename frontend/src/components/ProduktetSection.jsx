import { useNavigate } from "react-router-dom";
import { fotoProduktit } from "../utils/fotoProduktit";
import { formatoCmimin } from "../utils/formatoCmimin";
import { PlusIcon } from "./shared/Icons";
import {
  klasaSeksioniProduktet,
  klasaKryeProduktet,
  klasaEyebrow,
  klasaTitulli5xl,
  klasaParagrafAnash,
  klasaGridProduktet3,
  klasaKornizaProduktHome,
  klasaFotoProduktHome,
  klasaBadgeProdukt,
  klasaButoniIkonaRrumbullaket,
  klasaEmriProdukt,
  klasaCmimiHome,
  klasaButoniPrimar,
} from "./shared/classNames";

function ProduktetSection({ produktet, onShtoNeShporte }) {
  const navigate = useNavigate();
  if (!produktet.length) return null;

  return (
    <section id="produktet" className={klasaSeksioniProduktet}>
      <div className="max-w-6xl mx-auto">
        <div className={klasaKryeProduktet}>
          <div>
            <p className={`mb-4 ${klasaEyebrow}`}>PRODUKTET THEMELORE</p>
            <h2 className={klasaTitulli5xl}>
              E butë me lëkurën.
              <br />
              Rezultate perfekte.
            </h2>
          </div>
          <p className={klasaParagrafAnash}>
            Formula të rishikuara nga dermatologë, për lëkurë të qetë, elastike
            dhe të ndritshme.
          </p>
        </div>

        <div className={klasaGridProduktet3}>
          {produktet.map((p) => (
            <div
              key={p.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div className={klasaKornizaProduktHome}>
                <img
                  src={fotoProduktit(p.emri, 500, 600)}
                  alt={p.emri}
                  className={klasaFotoProduktHome}
                />
                <span className={klasaBadgeProdukt}>{p.etiketa}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShtoNeShporte(p.id);
                  }}
                  className={`absolute bottom-4 right-4 ${klasaButoniIkonaRrumbullaket}`}
                  title="Shto në shportë"
                >
                  <PlusIcon />
                </button>
              </div>
              <div className="py-5">
                <h3 className={klasaEmriProdukt}>{p.emri}</h3>
                <p className={klasaCmimiHome}>{formatoCmimin(p.cmimi)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/shop")}
            className={klasaButoniPrimar}
          >
            Shiko të gjitha produktet
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProduktetSection;
