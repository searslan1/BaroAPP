
import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/db.config";
import { PORT } from "./config/env.config";
import routes from "./routes"; // Tüm rotaların toplandığı index.ts
import corsMiddleware from "./middlewares/cors.middleware";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(errorHandler);

// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(helmet()); // Temel güvenlik başlıkları

// Veritabanı Bağlantısı
connectDB();

// Rotaların Yüklenmesi
app.use("/api", routes); // Tüm API rotaları "/api" altına yönlendirilir

// Sağlık Kontrolü (Basit bir rota)
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Baro Yönetim Sistemi API Çalışıyor!");
});

// Hata Yakalama Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Sunucu Hatası" });
});

// Sunucu Başlatma
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
