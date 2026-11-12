import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { dëgjoShportenUNdryshua } from "../utils/cartEvents";
import { BagIcon, HamburgerIcon, CloseIcon } from "./shared/Icons";
import {
  klasaNavFaqjaKryesore,
  klasaNavFaqeTjera,
  klasaLogoNav,
  klasaLinkBaze,
  klasaLinkAktivBardhe,
  klasaLinkBardhe,
  klasaLinkAktivForest,
  klasaLinkGri,
  klasaButoniNavBaze,
  klasaButoniNavBardhe,
  klasaButoniNavForest,
  klasaBadgeBaze,
  klasaBadgeBardhe,
  klasaBadgeForest,
  klasaDropdownTitulli,
  klasaDropdownTekst,
  klasaButoniDropdown,
  klasaDilBaze,
  klasaDilBardhe,
  klasaDilGri,
} from "./shared/classNames";

// ---- stilet e menusë dhe dropdown-it (përdoren vetëm këtu) ----
const klasaKarta =
  "absolute right-0 mt-3 z-50 rounded-3xl border border-forest/10 bg-cream/95 shadow-2xl shadow-forest/20 backdrop-blur-xl";

const klasaAnimBaze =
  "origin-top-right transition duration-200 ease-out motion-reduce:transition-none";
const klasaAnimHapur = "opacity-100 scale-100 translate-y-0";
const klasaAnimMbyllur =
  "pointer-events-none opacity-0 scale-95 -translate-y-1";

const klasaIkonaAnim =
  "absolute inset-0 h-5 w-5 transition duration-300 ease-out motion-reduce:transition-none";

// rreshtat e menusë hyjnë një nga një
const klasaRreshtiAnim =
  "transition duration-300 ease-out motion-reduce:transition-none";
const klasaRreshtiHapur = "opacity-100 translate-y-0";
const klasaRreshtiMbyllur = "opacity-0 translate-y-2";

const klasaLinkMenu =
  "group flex items-center justify-between rounded-xl px-4 py-2.5 text-[15px] font-medium transition duration-200 hover:bg-sage";
const klasaLinkMenuAktiv = "bg-sage text-forest";
const klasaLinkMenuJoaktiv = "text-gray-800";
const klasaShigjeta =
  "-translate-x-2 text-forest opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100";
const klasaPikaAktive = "h-2 w-2 rounded-full bg-forest";
const klasaDilMenu =
  "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[13px] font-medium text-gray-500 transition duration-200 hover:bg-sage hover:text-forest";

const lidhjet = [
  { rruga: "/quiz", emri: "Quiz" },
  { rruga: "/shop", emri: "Shop" },
  { rruga: "/dermatologists", emri: "Dermatologë" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [numriArtikujve, setNumriArtikujve] = useState(0);
  const [dropdownHapur, setDropdownHapur] = useState(false);
  const [menuHapur, setMenuHapur] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const eshteFaqjaKryesore = location.pathname === "/";

  const merrNumrin = () => {
    if (!localStorage.getItem("token")) {
      setNumriArtikujve(0);
      return;
    }
    api
      .get("/cart/count")
      .then((res) => setNumriArtikujve(res.data.numriArtikujve || 0))
      .catch(() => setNumriArtikujve(0));
  };

  useEffect(() => {
    merrNumrin();
  }, [location.pathname]);

  useEffect(() => {
    return dëgjoShportenUNdryshua(merrNumrin);
  }, []);

  // mbyll menunë kur ndryshon faqja
  useEffect(() => {
    setMenuHapur(false);
    setDropdownHapur(false);
  }, [location.pathname]);

  useEffect(() => {
    const mbyllNeseJashte = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownHapur(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuHapur(false);
      }
    };
    document.addEventListener("mousedown", mbyllNeseJashte);
    return () => document.removeEventListener("mousedown", mbyllNeseJashte);
  }, []);

  const dilLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuHapur(false);
    navigate("/login");
  };

  const shkoTeShporta = () => {
    setDropdownHapur(false);
    navigate("/cart");
  };

  const linkStil = (rruga) => {
    const aktiv = location.pathname === rruga;
    const ngjyra = eshteFaqjaKryesore
      ? aktiv
        ? klasaLinkAktivBardhe
        : klasaLinkBardhe
      : aktiv
        ? klasaLinkAktivForest
        : klasaLinkGri;
    return `${klasaLinkBaze} ${ngjyra}`;
  };

  const butoniRrumbullaketStil = `${klasaButoniNavBaze} ${
    eshteFaqjaKryesore ? klasaButoniNavBardhe : klasaButoniNavForest
  }`;

  // vonesa e rreshtit në menu: vetëm kur hapet
  const vonesa = (i) => ({
    transitionDelay: menuHapur ? `${80 + i * 60}ms` : "0ms",
  });

  return (
    <nav
      className={eshteFaqjaKryesore ? klasaNavFaqjaKryesore : klasaNavFaqeTjera}
    >
      <Link
        to="/"
        className={`${klasaLogoNav} ${
          eshteFaqjaKryesore ? "text-white" : "text-forest"
        }`}
      >
        skincaring.
      </Link>

      <div className="flex gap-1 items-center">
        {/* Linket e desktop-it */}
        <div className="hidden md:flex items-center gap-1">
          {lidhjet.map((l) => (
            <Link key={l.rruga} to={l.rruga} className={linkStil(l.rruga)}>
              {l.emri}
            </Link>
          ))}
        </div>

        {/* Shporta */}
        <div className="relative ml-3" ref={dropdownRef}>
          <button
            onClick={() => {
              setDropdownHapur((p) => !p);
              setMenuHapur(false);
            }}
            aria-label="Shporta"
            className={butoniRrumbullaketStil}
          >
            <BagIcon />
            {numriArtikujve > 0 && (
              <span
                className={`${klasaBadgeBaze} ${
                  eshteFaqjaKryesore ? klasaBadgeBardhe : klasaBadgeForest
                }`}
              >
                {numriArtikujve}
              </span>
            )}
          </button>

          <div
            aria-hidden={!dropdownHapur}
            className={`${klasaKarta} w-72 p-5 ${klasaAnimBaze} ${
              dropdownHapur ? klasaAnimHapur : klasaAnimMbyllur
            }`}
          >
            <p className={klasaDropdownTitulli}>Shporta ime</p>
            <p className={klasaDropdownTekst}>
              {numriArtikujve === 0
                ? "Shporta është bosh"
                : `${numriArtikujve} ${numriArtikujve === 1 ? "artikull" : "artikuj"} në shportë`}
            </p>
            <button onClick={shkoTeShporta} className={klasaButoniDropdown}>
              Shiko shportën e plotë
            </button>
          </div>
        </div>

        {/* Dil - desktop */}
        <button
          onClick={dilLogin}
          className={`${klasaDilBaze} ${
            eshteFaqjaKryesore ? klasaDilBardhe : klasaDilGri
          }`}
        >
          Dil
        </button>

        {/* Menuja hamburger - vetëm në ekran të vogël */}
        <div className="relative ml-2 md:hidden" ref={menuRef}>
          <button
            onClick={() => {
              setMenuHapur((p) => !p);
              setDropdownHapur(false);
            }}
            aria-label="Menuja"
            aria-expanded={menuHapur}
            className={butoniRrumbullaketStil}
          >
            <span className="relative block h-5 w-5">
              <HamburgerIcon
                className={`${klasaIkonaAnim} ${
                  menuHapur
                    ? "rotate-90 scale-50 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <CloseIcon
                className={`${klasaIkonaAnim} ${
                  menuHapur
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-50 opacity-0"
                }`}
              />
            </span>
          </button>

          <div
            aria-hidden={!menuHapur}
            className={`${klasaKarta} w-64 p-3 ${klasaAnimBaze} ${
              menuHapur ? klasaAnimHapur : klasaAnimMbyllur
            }`}
          >
            {lidhjet.map((l, i) => {
              const aktiv = location.pathname === l.rruga;
              return (
                <div
                  key={l.rruga}
                  style={vonesa(i)}
                  className={`${klasaRreshtiAnim} ${
                    menuHapur ? klasaRreshtiHapur : klasaRreshtiMbyllur
                  }`}
                >
                  <Link
                    to={l.rruga}
                    onClick={() => setMenuHapur(false)}
                    className={`${klasaLinkMenu} ${
                      aktiv ? klasaLinkMenuAktiv : klasaLinkMenuJoaktiv
                    }`}
                  >
                    <span>{l.emri}</span>
                    {aktiv ? (
                      <span className={klasaPikaAktive} />
                    ) : (
                      <span className={klasaShigjeta}>→</span>
                    )}
                  </Link>
                </div>
              );
            })}

            <div
              style={vonesa(lidhjet.length)}
              className={`${klasaRreshtiAnim} ${
                menuHapur ? klasaRreshtiHapur : klasaRreshtiMbyllur
              }`}
            >
              <div className="mx-4 my-2 border-t border-forest/10" />
              <button onClick={dilLogin} className={klasaDilMenu}>
                <span>Dil nga llogaria</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
