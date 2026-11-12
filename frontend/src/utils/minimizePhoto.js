export function minimizePhoto(file, maksimumi = 1024, cilesia = 0.85) {
  return new Promise((zgjidh, refuzo) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const shkalla = Math.min(1, maksimumi / Math.max(img.width, img.height));
      const gjeresia = Math.round(img.width * shkalla);
      const lartesia = Math.round(img.height * shkalla);

      const canvas = document.createElement("canvas");
      canvas.width = gjeresia;
      canvas.height = lartesia;
      canvas.getContext("2d").drawImage(img, 0, 0, gjeresia, lartesia);

      canvas.toBlob(
        (blob) => {
          if (!blob) return refuzo(new Error("Fotoja nuk u përpunua"));
          zgjidh(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        cilesia,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      refuzo(new Error("Fotoja nuk u lexua"));
    };

    img.src = url;
  });
}
