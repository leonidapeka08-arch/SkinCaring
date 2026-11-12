const cloudinary = require("cloudinary").v2;
const faceScanRepository = require("../repositories/faceScan.repository");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

async function uploadFaceScan(userId, file) {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;

  const uploadResult = await cloudinary.uploader.upload(dataURI, {
    folder: "skincaring/face-scans",
  });

  const analizaPlaceholder = {
    status: "pritje_analize",
    shenim: "Analiza AI do shtohet më vonë",
  };

  return await faceScanRepository.createFaceScan({
    userId,
    imageUrl: uploadResult.secure_url,
    aiAnaliza: JSON.stringify(analizaPlaceholder),
  });
}

async function getMyFaceScans(userId) {
  const scans = await faceScanRepository.getFaceScans(userId);

  return scans.map((s) => ({
    id: s.id,
    imageUrl: s.imageUrl,
    analiza: s.aiAnaliza ? JSON.parse(s.aiAnaliza) : null,
    data: s.data,
  }));
}

module.exports = {
  uploadFaceScan,
  getMyFaceScans,
};
