import {
  klasaHeroSeksion,
  klasaHeroFotoKonteiner,
  klasaHeroFoto,
  klasaHeroGradientAnash,
  klasaHeroGradientPoshte,
  klasaHeroPermbajtja,
  klasaHeroTeksti,
  klasaHeroEyebrow,
  klasaHeroTitulli,
  klasaHeroTitulliPjesa2,
  klasaHeroParagraf,
  klasaHeroButonat,
  klasaHeroButoniKryesor,
  klasaHeroButoniDyte,
} from "./shared/classNames";

const heroImage =
  "https://images.unsplash.com/photo-1593351799227-75df2026356b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function Hero({ onFillo, onShopNaviko }) {
  return (
    <section className={klasaHeroSeksion}>
      <div className={klasaHeroFotoKonteiner}>
        <img
          src={heroImage}
          alt="Grua me lëkurë të freskët dhe të shëndetshme"
          className={klasaHeroFoto}
        />
        <div className={klasaHeroGradientAnash} />
        <div className={klasaHeroGradientPoshte} />
      </div>
      <div className={klasaHeroPermbajtja}>
        <div className={klasaHeroTeksti}>
          <p className={klasaHeroEyebrow}>Skincare, made personal</p>
          <h1 className={klasaHeroTitulli}>
            Know your skin.
            <br />
            <span className={klasaHeroTitulliPjesa2}>Love your ritual.</span>
          </h1>
          <p className={klasaHeroParagraf}>
            Njohuri të thelluara për lëkurën, formula të menduara me kujdes dhe
            ekspertizë profesionale — gjithçka që ju nevojitet për kujdesin ndaj
            lëkurës, e harmonizuar në një vend të vetëm.
          </p>
          <div className={klasaHeroButonat}>
            <button onClick={onFillo} className={klasaHeroButoniKryesor}>
              Zbulo lëkurën tënde <ArrowIcon />
            </button>
            <button onClick={onShopNaviko} className={klasaHeroButoniDyte}>
              Shiko produktet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
