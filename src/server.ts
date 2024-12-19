import express, { Request, Response } from "express";
import connectDB from "./config/db.config";
import { PORT } from "./config/env.config";



const app = express();

// Middleware
app.use(express.json());

// Veritabanı Bağlantısı
connectDB();

// Basit bir rota
app.get("/", (req: Request, res: Response) => {
  res.send("Baro Yönetim Sistemi API Çalışıyor!");
});

// Sunucu Başlatma
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;
