"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/auth/user"));
const env_config_1 = require("../config/env.config");
/**
 * JWT doğrulama middleware'i
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Yetkisiz erişim. Token bulunamadı." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.JWT_SECRET);
        const user = await user_1.default.findById(decoded.id);
        if (!user) {
            res.status(401).json({ error: "Geçersiz kullanıcı." });
            return;
        }
        req.user = {
            id: user.id,
            role: user.role,
        };
        next(); // Token doğrulama başarılı, bir sonraki middleware'e geç
    }
    catch (error) {
        res.status(403).json({ error: "Token doğrulama başarısız." });
    }
};
exports.authenticate = authenticate;
/**
 * Role bazlı yetkilendirme middleware'i
 */
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: "Yetkisiz erişim. Kullanıcı doğrulanmadı." });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
            return;
        }
        next(); // Yetkilendirme başarılı, bir sonraki middleware'e geç
    };
};
exports.authorize = authorize;
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: "Yetkilendirme token'ı eksik." });
        }
        const secretKey = process.env.JWT_SECRET || "defaultSecretKey"; // JWT Secret Key
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next(); // Başarılı doğrulama, sonraki middleware'e geç
    }
    catch (error) {
        res.status(401).json({ message: "Yetkilendirme başarısız." });
    }
};
exports.default = authMiddleware;
