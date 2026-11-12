export function formatoCmimin(vlera) {
  const numri = Math.round(Number(vlera) || 0);
  return `${String(numri).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Lek`;
}
