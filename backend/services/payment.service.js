const Stripe = require("stripe");
const prisma = require("../lib/prisma");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const VALUTA = (process.env.STRIPE_CURRENCY || "all").toLowerCase();
const TARIFA_TRANSPORTIT = 500;

async function llogaritTotalin(userId) {
  const artikujt = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (artikujt.length === 0) throw new Error("Shporta është bosh");

  const nentotali = artikujt.reduce(
    (shuma, a) => shuma + a.product.cmimi * a.sasia,
    0,
  );
  return Math.round(nentotali + TARIFA_TRANSPORTIT);
}

async function krijoPagesen(userId) {
  const totali = await llogaritTotalin(userId);

  const intent = await stripe.paymentIntents.create({
    amount: totali * 100,
    currency: VALUTA,
    automatic_payment_methods: { enabled: true },
    metadata: { userId },
  });

  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    totali,
  };
}

async function verifikoPagesen(userId, paymentIntentId) {
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (intent.status !== "succeeded") {
    throw new Error("Pagesa nuk është kryer");
  }
  if (intent.metadata.userId !== userId) {
    throw new Error("Kjo pagesë nuk i përket këtij përdoruesi");
  }
  if (intent.metadata.perdorur === "po") {
    throw new Error("Kjo pagesë është përdorur tashmë");
  }

  const totali = await llogaritTotalin(userId);
  if (intent.amount !== totali * 100 || intent.currency !== VALUTA) {
    throw new Error("Shuma e paguar nuk përputhet me porosinë");
  }

  return intent;
}

async function shenoSiPerdorur(paymentIntentId) {
  await stripe.paymentIntents.update(paymentIntentId, {
    metadata: { perdorur: "po" },
  });
}

module.exports = {
  TARIFA_TRANSPORTIT,
  llogaritTotalin,
  krijoPagesen,
  verifikoPagesen,
  shenoSiPerdorur,
};
