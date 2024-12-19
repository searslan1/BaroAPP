"use strict";
/// <reference path="./types/express/index.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_config_1 = __importDefault(require("./config/db.config"));
const env_config_1 = require("./config/env.config");
const routes_1 = __importDefault(require("./routes")); // Tüm rotaların toplandığı index.ts
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use(errorHandler_1.errorHandler);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // CORS yapılandırması
app.use((0, helmet_1.default)()); // Temel güvenlik başlıkları
// Veritabanı Bağlantısı
(0, db_config_1.default)();
// Rotaların Yüklenmesi
app.use("/api", routes_1.default); // Tüm API rotaları "/api" altına yönlendirilir
// Sağlık Kontrolü (Basit bir rota)
app.get("/", (req, res) => {
    res.status(200).send("Baro Yönetim Sistemi API Çalışıyor!");
});
// Hata Yakalama Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || "Sunucu Hatası" });
});
// Sunucu Başlatma
app.listen(env_config_1.PORT, () => {
    console.log(`Server is running on port ${env_config_1.PORT}`);
});
exports.default = app;
