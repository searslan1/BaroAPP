import multer from "multer";

// Bellek depolama yapılandırması
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimum dosya boyutu: 5MB
});
