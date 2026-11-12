import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SkinResults from "../components/SkinResults";
import { PlusIcon } from "../components/shared/Icons";
import {
  klasaFaqja,
  klasaKonteinerAnaliza,
  klasaEyebrow,
  klasaTitulli4xl,
  klasaParagrafi,
  klasaKutiaSage3,
  klasaZonaNgarkimit,
  klasaFotoPreview,
  klasaIkonaPlus,
  klasaTitulliNgarkim,
  klasaTekstNgarkim2,
  klasaLabelButoni,
  klasaLabelButoniOutline,
  klasaButoniAnalizo,
  klasaButoniForest,
  klasaButoniPrapa,
  klasaGabimi,
} from "../components/shared/classNames";

// klasa vetëm për kamerën (përdoret vetëm këtu)
const klasaVideo =
  "mx-auto mb-5 aspect-[4/3] w-full rounded-2xl bg-black object-cover scale-x-[-1]";

function SkinAnalysis() {
  const [foto, setFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [kameraAktive, setKameraAktive] = useState(false);
  const [gabimiKamera, setGabimiKamera] = useState("");
  const [gabimiAnalize, setGabimiAnalize] = useState(null);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(false);
  const [rezultati, setRezultati] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

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
        "Nuk u hap kamera. Lejoje nga ikona e bravës pranë adresës, ose zgjidh një foto nga galeria.",
      );
    }
  };

  const vendosFoton = (file) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRezultati(null);
    setGabimiAnalize(null);
    setGabimiKamera("");
  };

  const zgjidhFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    vendosFoton(file);
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

  const dergoFoton = async () => {
    if (!foto) return;
    setDukeNgarkuar(true);
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
      setDukeNgarkuar(false);
    }
  };

  return (
    <div className={klasaFaqja}>
      <div className={klasaKonteinerAnaliza}>
        <p className={`mb-4 ${klasaEyebrow}`}>YOUR SKIN, DECODED</p>
        <h1 className={`mb-4 ${klasaTitulli4xl}`}>Një skanim i shpejtë.</h1>
        <p className={klasaParagrafi}>
          Ngarko një foto ose bëje direkt me kamerën — fytyra drejt kamerës,
          dritë natyrale, pa makeup dhe pa filter.
        </p>

        <div className={klasaKutiaSage3}>
          <div className={klasaZonaNgarkimit}>
            {kameraAktive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  disablePictureInPicture
                  disableRemotePlayback
                  className={klasaVideo}
                />
                <div className="flex justify-center gap-3">
                  <button onClick={bejFoton} className={klasaButoniForest}>
                    Bëj foton
                  </button>
                  <button onClick={mbyllKamera} className={klasaButoniPrapa}>
                    Anulo
                  </button>
                </div>
              </>
            ) : (
              <>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Selfie"
                    className={klasaFotoPreview}
                  />
                ) : (
                  <div className={klasaIkonaPlus}>
                    <PlusIcon className="w-6 h-6" />
                  </div>
                )}

                <h3 className={klasaTitulliNgarkim}>Ngarko ose bëj një foto</h3>
                <p className={klasaTekstNgarkim2}>
                  Foto jote mbetet private dhe përdoret vetëm për këtë analizë.
                </p>

                {gabimiKamera && (
                  <div className={klasaGabimi}>{gabimiKamera}</div>
                )}

                {gabimiAnalize && (
                  <div className={`${klasaGabimi} text-left`}>
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

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <label className={klasaLabelButoni}>
                    Zgjidh nga galeria
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={zgjidhFoto}
                    />
                  </label>
                  <button
                    onClick={hapKamera}
                    className={klasaLabelButoniOutline}
                  >
                    Hap kamerën
                  </button>
                </div>

                {foto && (
                  <button
                    onClick={dergoFoton}
                    disabled={dukeNgarkuar}
                    className={klasaButoniAnalizo}
                  >
                    {dukeNgarkuar
                      ? "Duke analizuar... (disa sekonda)"
                      : "Analizo foton"}
                  </button>
                )}
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-20">
        <SkinResults rezultati={rezultati} />
      </div>
    </div>
  );
}

export default SkinAnalysis;
