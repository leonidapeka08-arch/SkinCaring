import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axios";

const celesiPublik = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = celesiPublik ? loadStripe(celesiPublik) : null;

const pamja = {
  theme: "stripe",
  variables: {
    colorPrimary: "#355546",
    colorBackground: "#ffffff",
    colorText: "#1f2937",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "12px",
  },
};

function FormaKartes({ paguesRef }) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    paguesRef.current = async () => {
      if (!stripe || !elements) {
        return { error: "Forma e kartës nuk është gati ende." };
      }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/checkout` },
        redirect: "if_required",
      });
      if (error) return { error: error.message };
      if (paymentIntent?.status !== "succeeded") {
        return { error: "Pagesa nuk u konfirmua, provo përsëri." };
      }
      return { paymentIntentId: paymentIntent.id };
    };
    return () => {
      paguesRef.current = null;
    };
  }, [stripe, elements, paguesRef]);

  return <PaymentElement />;
}

function PagesaMeKarte({ paguesRef }) {
  const [clientSecret, setClientSecret] = useState("");
  const [gabimi, setGabimi] = useState("");

  useEffect(() => {
    if (!stripePromise) return;
    api
      .post("/payments/create-intent")
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => {
        console.error(err);
        setGabimi(
          `${err.response?.status || "Pa përgjigje"}: ${
            err.response?.data?.error || err.message
          }`,
        );
      });
  }, []);

  if (!stripePromise) {
    return (
      <p className="mt-3 text-sm text-red-600">
        Mungon VITE_STRIPE_PUBLISHABLE_KEY te file-i .env i frontend-it.
      </p>
    );
  }
  if (gabimi) return <p className="mt-3 text-sm text-red-600">{gabimi}</p>;
  if (!clientSecret) {
    return (
      <p className="mt-3 text-sm text-gray-500">Duke e përgatitur formën...</p>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-forest/15 bg-white p-4">
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance: pamja }}
      >
        <FormaKartes paguesRef={paguesRef} />
      </Elements>
    </div>
  );
}

export default PagesaMeKarte;
