import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import SelfieUpload from "../components/SelfieUpload";
import ProduktetSection from "../components/ProduktetSection";
import Dermatologet from "../components/Dermatologet";
import api from "../api/axios";
import { njoftoShportenUNdryshua } from "../utils/cartEvents";

function Home() {
  const [produktetKryesore, setProduktetKryesore] = useState([]);
  const [mesazhi, setMesazhi] = useState("");

  useEffect(() => {
    api
      .get("/products/bestsellers?limiti=3")
      .then((res) => setProduktetKryesore(res.data || []))
      .catch(() => {});
  }, []);

  const shkoTeAnaliza = () => {
    document.getElementById("analiza")?.scrollIntoView({ behavior: "smooth" });
  };

  const shkoTeProduktet = () => {
    document
      .getElementById("produktet")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const shtoNeShporte = async (productId) => {
    try {
      await api.post("/cart/add", { productId, sasia: 1 });
      njoftoShportenUNdryshua();
      setMesazhi("U shtua në shportë ✓");
    } catch (err) {
      console.error(err);
      setMesazhi("Duhet të jesh i kyçur për të shtuar në shportë");
    } finally {
      setTimeout(() => setMesazhi(""), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-cream relative">
      <Hero onFillo={shkoTeAnaliza} onShopNaviko={shkoTeProduktet} />

      {mesazhi && (
        <div className="fixed top-24 right-6 bg-forest text-cream px-5 py-3 rounded-full shadow-lg z-50 text-sm">
          {mesazhi}
        </div>
      )}

      <SelfieUpload onFillo={shkoTeAnaliza} />
      <ProduktetSection
        produktet={produktetKryesore}
        onShtoNeShporte={shtoNeShporte}
      />
      <Dermatologet />
    </div>
  );
}

export default Home;
