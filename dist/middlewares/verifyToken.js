"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        if (!token) {
            res.status(401).json({ message: "Yetkilendirme tokeni eksik." });
            return;
        }
        const secretKey = process.env.JWT_SECRET || "your-secret-key"; // .env dosyasındaki secret key
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        // Kullanıcı bilgilerini isteğe ekleyin
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token geçersiz veya süresi dolmuş." });
    }
};
exports.default = verifyToken;
