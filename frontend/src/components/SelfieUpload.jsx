import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SkinResults from "./SkinResults";
import { CameraIcon } from "./shared/Icons";
import { minimizePhoto } from "../utils/minimizePhoto";
import {
  klasaSeksioniSelfie,
  klasaGridSelfie,
  klasaEyebrow,
  klasaTitulli5xl,
  klasaParagrafSelfie,
  klasaLinkQuiz,
  klasaKutiaSage,
  klasaZonaSelfie,
  klasaFotoSelfie,
  klasaTitulliFoto,
  klasaNenFoto,
  klasaIkonaPlusMadhe,
  klasaTitulliNgarko,
  klasaParagrafNgarko,
  klasaRreshtiButonave,
  klasaButoniPrimar,
  klasaButoniPrapa,
  klasaGabimi,
} from "./shared/classNames";

const klasaVideo =
  "mx-auto aspect-[4/3] w-full max-w-md rounded-[1.25rem] bg-black object-cover scale-x-[-1]";

function SelfieUpload() {
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [kameraAktive, setKameraAktive] = useState(false);
  const [gabimiKamera, setGabimiKamera] = useState("");
  const [gabimiAnalize, setGabimiAnalize] = useState(null);
  const [dukeAnalizuar, setDukeAnalizuar] = useState(false);
  const [rezultati, setRezultati] = useState(null);

  useEffect(() => {
    if (kameraAktive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [kameraAktive]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const mbyllKamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setKameraAktive(false);
  };

  const hapKamera = async () => {
    setGabimiKamera("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setKameraAktive(true);
    } catch (err) {
      console.error(err);
      setGabimiKamera(
        "Nuk u hap kamera. Lejoje nga ikona e bravës pranë adresës, ose zgjidh një foto.",
      );
    }
  };

  const vendosFoton = async (file) => {
    if (!file) return;
    try {
      const fotoERe = await minimizePhoto(file);
      if (preview) URL.revokeObjectURL(preview);
      setFoto(fotoERe);
      setPreview(URL.createObjectURL(fotoERe));
      setRezultati(null);
      setGabimiAnalize(null);
      setGabimiKamera("");
    } catch (err) {
      console.error(err);
      setGabimiKamera("Fotoja nuk u lexua. Provo një foto JPG ose PNG.");
    }
  };

  const bejFoton = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        vendosFoton(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
        mbyllKamera();
      },
      "image/jpeg",
      0.9,
    );
  };

  const ribejFoton = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFoto(null);
    setPreview(null);
    setRezultati(null);
    setGabimiAnalize(null);
    hapKamera();
  };

  const vazhdoMeAnalizen = async () => {
    if (!foto) return;
    setDukeAnalizuar(true);
    setGabimiAnalize(null);
    try {
      const formData = new FormData();
      formData.append("foto", foto);
      const res = await api.post("/face-scan/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRezultati(res.data);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        alert("Duhet të jesh i kyçur për të vazhduar me analizën.");
        navigate("/login");
      } else {
        setGabimiAnalize({
          mesazhi:
            err.response?.data?.error ||
            "Diçka shkoi keq gjatë analizës, provo përsëri.",
          keshilla: err.response?.data?.keshilla || [],
        });
      }
    } finally {
      setDukeAnalizuar(false);
    }
  };

  return (
    <section id="analiza" className={klasaSeksioniSelfie}>
      <div className={klasaGridSelfie}>
        <div>
          <p className={`mb-4 ${klasaEyebrow}`}>LËKURA JOTE, E ZBULUAR</p>
          <h1 className={`mb-6 ${klasaTitulli5xl}`}>
            Një vështrim më i afërt.
            <br />
            Një rutinë më efikase.
          </h1>
          <p className={klasaParagrafSelfie}>
            Fillo me një skanim të shpejtë me foto, ose bëj kuizin tonë të
            udhëhequr. Do të të ndihmojmë të kuptosh tipin e lëkurës tënde,
            shqetësimet kryesore, dhe cilat përbërës i takojnë rutinës tënde.
          </p>
          <button onClick={() => navigate("/quiz")} className={klasaLinkQuiz}>
            Preferon kuiz? Bëje këtu →
          </button>
        </div>

        <div className={klasaKutiaSage}>
          <div className={klasaZonaSelfie}>
            {kameraAktive ? (
              <div className="w-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nofullscreen nodownload noremoteplayback"
                  className={klasaVideo}
                />
                <div className={klasaRreshtiButonave}>
                  <button onClick={bejFoton} className={klasaButoniPrimar}>
                    Bëj foton
                  </button>
                  <button onClick={mbyllKamera} className={klasaButoniPrapa}>
                    Anulo
                  </button>
                </div>
              </div>
            ) : preview ? (
              <div className="w-full">
                <img
                  src={preview}
                  alt="Fotoja jote e ngarkuar"
                  className={klasaFotoSelfie}
                />
                <p className={klasaTitulliFoto}>Fotoja jote është gati</p>
                <p className={klasaNenFoto}>
                  Kontrollo që fytyra duket qartë, pastaj vazhdo me analizën.
                </p>

                {gabimiAnalize && (
                  <div className={`mt-4 text-left ${klasaGabimi}`}>
                    <p className="font-medium">{gabimiAnalize.mesazhi}</p>
                    {gabimiAnalize.keshilla.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {gabimiAnalize.keshilla.map((k, i) => (
                          <li key={i}>{k}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div className={klasaRreshtiButonave}>
                  <button
                    onClick={vazhdoMeAnalizen}
                    disabled={dukeAnalizuar}
                    className={`${klasaButoniPrimar} disabled:opacity-50`}
                  >
                    {dukeAnalizuar ? "Duke analizuar..." : "Vazhdo me analizën"}
                  </button>
                  <button
                    onClick={ribejFoton}
                    disabled={dukeAnalizuar}
                    className={klasaButoniPrapa}
                  >
                    Ribëj foton
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <div className={klasaIkonaPlusMadhe}>
                  <CameraIcon className="w-7 h-7" />
                </div>
                <h3 className={klasaTitulliNgarko}>
                  Ngarko një selfie të qartë
                </h3>
                <p className={klasaParagrafNgarko}>
                  Dritë natyrale, pa makeup, pa filter, fytyra drejt kamerës.
                  Fotoja jote përdoret vetëm për këtë analizë.
                </p>

                {gabimiKamera && (
                  <div className={`mt-4 ${klasaGabimi}`}>{gabimiKamera}</div>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    vendosFoton(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <div className={klasaRreshtiButonave}>
                  <button onClick={hapKamera} className={klasaButoniPrimar}>
                    Hap kamerën
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className={klasaButoniPrapa}
                  >
                    Zgjidh një foto
                  </button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>

      <SkinResults rezultati={rezultati} />
    </section>
  );
}

export default SelfieUpload;
