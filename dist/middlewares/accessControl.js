"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessControl = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            // Token kontrolü
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                console.log("Token eksik veya geçersiz.");
                res.status(401).json({ message: "Token eksik veya geçersiz." });
                return;
            }
            const token = authHeader.split(" ")[1];
            console.log("Gelen Token:", token); // Gelen token'ı loglayın
            // Token çözümleme
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log("Token doğrulama hatası:", err.message); // Token doğrulama hatası
                    res.status(401).json({ message: "Token doğrulama başarısız." });
                    return;
                }
                console.log("Çözümlenen Token:", decoded); // Token'dan çözümlenen veriler
                // Kullanıcı rolü ve ID doğrulama
                const user = decoded;
                if (!allowedRoles.includes(user.role)) {
                    console.log("Yetkisiz rol:", user.role); // Kullanıcının rolünü loglayın
                    res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok." });
                    return;
                }
                // Kullanıcı bilgilerini request'e ekle
                req.user = {
                    id: user.id,
                    role: user.role,
                };
                console.log("Kullanıcı erişim izni verildi:", req.user); // Kullanıcıya erişim izni verildiğini loglayın
                next();
            });
        }
        catch (error) {
            console.log("Middleware hata:", error); // Middleware içinde oluşan hataları loglayın
            res.status(500).json({ message: "Erişim kontrolü sırasında bir hata oluştu." });
        }
    };
};
exports.default = accessControl;
