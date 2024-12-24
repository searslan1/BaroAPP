"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// .env dosyasını yükle
dotenv_1.default.config();
// CORS kökenlerini .env'den al
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
// CORS seçenekleri
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            // Köken izinliyse devam et
            callback(null, true);
        }
        else {
            // Köken izinli değilse hata döndür
            callback(new Error("CORS: Erişime izin verilmedi."));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // İzin verilen HTTP metotları
    allowedHeaders: ["Content-Type", "Authorization"], // İzin verilen başlıklar
    credentials: true, // Çerez paylaşımı
};
const corsMiddleware = (0, cors_1.default)(corsOptions);
exports.default = corsMiddleware;
