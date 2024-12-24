import cors from "cors";
import dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

// CORS kökenlerini .env'den al
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

// CORS seçenekleri
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Köken izinliyse devam et
      callback(null, true);
    } else {
      // Köken izinli değilse hata döndür
      callback(new Error("CORS: Erişime izin verilmedi."));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // İzin verilen HTTP metotları
  allowedHeaders: ["Content-Type", "Authorization"], // İzin verilen başlıklar
  credentials: true, // Çerez paylaşımı
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
