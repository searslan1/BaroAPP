import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Maksimum dosya boyutu (örneğin: 5 MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Desteklenen dosya türleri
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

// Multer dosya depolama ayarları
const storage = multer.memoryStorage(); // Dosya bellekte tutulur ve daha sonra S3'e yüklenir

// Dosya filtresi
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Desteklenmeyen dosya türü. Sadece PDF, JPEG ve PNG dosyaları kabul edilir."));
  }
};

// Multer yapılandırması
const fileUploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const uploadMiddleware = fileUploadMiddleware.single("file");
