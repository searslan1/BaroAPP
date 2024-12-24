"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
// Maksimum dosya boyutu (örneğin: 5 MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Desteklenen dosya türleri
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
// Multer dosya depolama ayarları
const storage = multer_1.default.memoryStorage(); // Dosya bellekte tutulur ve daha sonra S3'e yüklenir
// Dosya filtresi
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Desteklenmeyen dosya türü. Sadece PDF, JPEG ve PNG dosyaları kabul edilir."));
    }
};
// Multer yapılandırması
const fileUploadMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});
exports.uploadMiddleware = fileUploadMiddleware.single("file");
