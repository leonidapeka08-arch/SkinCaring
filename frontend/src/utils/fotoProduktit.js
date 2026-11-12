const FOTOT = {
  cleanser: "1741896135490-4062a3b21abf",
  serum: "1760860992928-221d73c4c0cc",
  toner: "1770717984643-2a1545902579",
  cream: "1552046122-03184de85e08",
  mask: "1552046122-03184de85e08",
  spf: "1640269974484-bdde0af439ef",
  default: "1741896135490-4062a3b21abf",
};

function gjejKategorine(emri = "") {
  const e = emri.toLowerCase();
  if (e.includes("cleanser") || e.includes("wash") || e.includes("micellar"))
    return "cleanser";
  if (e.includes("toner")) return "toner";
  if (e.includes("mask") || e.includes("clay")) return "mask";
  if (e.includes("spf") || e.includes("sun")) return "spf";
  if (e.includes("cream") || e.includes("moistur")) return "cream";
  if (e.includes("serum") || e.includes("acid") || e.includes("exfoliant"))
    return "serum";
  return "default";
}

export function fotoProduktit(
  emriProduktit = "Produkt",
  gjeresia = 400,
  lartesia = 300,
) {
  const kategoria = gjejKategorine(emriProduktit);
  const id = FOTOT[kategoria];
  return `https://images.unsplash.com/photo-${id}?w=${gjeresia}&h=${lartesia}&fit=crop&q=80&auto=format`;
}
