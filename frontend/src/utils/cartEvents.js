export function njoftoShportenUNdryshua() {
  window.dispatchEvent(new Event("shportaNdryshoi"));
}

export function dëgjoShportenUNdryshua(callback) {
  window.addEventListener("shportaNdryshoi", callback);
  return () => window.removeEventListener("shportaNdryshoi", callback);
}
