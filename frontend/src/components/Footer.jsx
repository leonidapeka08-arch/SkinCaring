import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MailIcon,
  PhoneIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  CloseIcon,
} from "./shared/Icons";
import {
  klasaFooter,
  klasaGridFooter,
  klasaLogoFooter,
  klasaSloganFooter,
  klasaTitulliKolones,
  klasaIkonaKontakt,
  klasaLinkuKontaktit,
  klasaIkonaSocial,
  klasaFooterFund,
  klasaButoniModal,
  klasaModalFonu,
  klasaModalKutia,
  klasaModalMbyll,
  klasaModalTitulli,
  klasaModalParagraf,
  klasaModalParagrafFundit,
  klasaButoniKuptova,
} from "./shared/classNames";

function Footer() {
  const [modalAktiv, setModalAktiv] = useState(null);

  return (
    <footer className={klasaFooter}>
      <div className="max-w-6xl mx-auto">
        <div className={klasaGridFooter}>
          <div className="flex flex-col items-start">
            <Link to="/" className={klasaLogoFooter}>
              skincaring<span className="text-sage">.</span>
            </Link>
            <p className={klasaSloganFooter}>
              Skincare with clarity. Care with heart. Kujdes i personalizuar për
              lëkurën tënde.
            </p>
          </div>

          <div className="flex flex-col md:items-center">
            <div className="flex flex-col items-start">
              <p className={klasaTitulliKolones}>Na Kontaktoni</p>
              <div className="flex flex-col space-y-2.5">
                <a
                  href="mailto:info@skincaring.al"
                  className={klasaLinkuKontaktit}
                >
                  <MailIcon className={klasaIkonaKontakt} />
                  <span>info@skincaring.al</span>
                </a>
                <a href="tel:+355555555655" className={klasaLinkuKontaktit}>
                  <PhoneIcon className={klasaIkonaKontakt} />
                  <span>+355 55 555 5655</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <div className="flex flex-col items-start md:items-end">
              <p className={klasaTitulliKolones}>Na Ndiqni</p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className={klasaIkonaSocial}
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className={klasaIkonaSocial}
                >
                  <TikTokIcon />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className={klasaIkonaSocial}
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={klasaFooterFund}>
          <p>© 2026 Skincaring. Të gjitha të drejtat të rezervuara.</p>
          <div className="flex gap-6">
            <button
              onClick={() => setModalAktiv("privatesia")}
              className={klasaButoniModal}
            >
              Politika e Privatësisë
            </button>
            <button
              onClick={() => setModalAktiv("kushtet")}
              className={klasaButoniModal}
            >
              Kushtet e Përdorimit
            </button>
          </div>
        </div>
      </div>

      {modalAktiv && (
        <div className={klasaModalFonu}>
          <div className={klasaModalKutia}>
            <button
              onClick={() => setModalAktiv(null)}
              className={klasaModalMbyll}
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>

            {modalAktiv === "privatesia" ? (
              <div>
                <h3 className={klasaModalTitulli}>Politika e Privatësisë</h3>
                <p className={klasaModalParagraf}>
                  Në <strong>Skincaring</strong>, privatësia juaj është
                  përparësia jonë kryesore. Të gjitha të dhënat e ngarkuara
                  (përfshirë fotot e fytyrës për skanim) përdoren ekskluzivisht
                  për analizën e lëkurës dhe nuk ndahen kurrë me palë të treta.
                </p>
                <p className={klasaModalParagrafFundit}>
                  Informacionet tuaja të kontaktit përdoren vetëm për
                  konfirmimin e takimeve me dermatologët dhe njoftimet rreth
                  porositjeve tuaja.
                </p>
              </div>
            ) : (
              <div>
                <h3 className={klasaModalTitulli}>Kushtet e Përdorimit</h3>
                <p className={klasaModalParagraf}>
                  Mirësevini në <strong>Skincaring</strong>. Duke përdorur
                  platformën tonë, ju pranoni se analizat AI dhe konsultat me
                  dermatologët janë udhëzuese për kujdesin e përditshëm.
                </p>
                <p className={klasaModalParagrafFundit}>
                  Rezervimet e takimeve janë private. Çdo anulim duhet të bëhet
                  të paktën 24 orë përpara orarit të caktuar.
                </p>
              </div>
            )}

            <button
              onClick={() => setModalAktiv(null)}
              className={klasaButoniKuptova}
            >
              Kuptova
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
