import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  klasaFaqjaAuth,
  klasaLogoAuth,
  klasaKartaAuth,
  klasaTitulliAuth,
  klasaNentitulliAuth,
  klasaGabimi,
  klasaInputKrem,
  klasaButoniPlote,
  klasaTekstFundit,
  klasaLinkSubliniuar,
} from "../components/shared/classNames";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gabimi, setGabimi] = useState("");
  const [dukeDerguar, setDukeDerguar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGabimi("");
    setDukeDerguar(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setGabimi(err.response?.data?.error || "Gabim gjatë login");
    } finally {
      setDukeDerguar(false);
    }
  };

  return (
    <div className={klasaFaqjaAuth}>
      <div className="w-full max-w-sm">
        <Link to="/quiz" className={klasaLogoAuth}>
          SkinCaring.
        </Link>
        <div className={klasaKartaAuth}>
          <h1 className={klasaTitulliAuth}>Mirë se erdhe</h1>
          <p className={klasaNentitulliAuth}>Kyçu te llogaria jote</p>

          {gabimi && <div className={klasaGabimi}>{gabimi}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={klasaInputKrem}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={klasaInputKrem}
            />
            <button
              type="submit"
              disabled={dukeDerguar}
              className={klasaButoniPlote}
            >
              {dukeDerguar ? "Duke u kyçur..." : "Kyçu"}
            </button>
          </form>

          <p className={klasaTekstFundit}>
            S'ke llogari?{" "}
            <Link to="/register" className={klasaLinkSubliniuar}>
              Regjistrohu
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
