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
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Yetkisiz erişim. Token bulunamadı." });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.JWT_SECRET);
        const user = await user_1.default.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: "Geçersiz kullanıcı." });
            return;
        }
        req.user = {
            id: user.id,
            role: user.role,
        };
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Token doğrulama başarısız." });
    }
};
exports.authenticate = authenticate;
/**
 * Rol bazlı yetkilendirme middleware'i
 * @param roles Yetki verilmiş roller
 */
const authorize = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Yetkisiz erişim." });
                return;
            }
            if (!roles.includes(req.user.role)) {
                res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: "Yetkilendirme kontrolü sırasında hata oluştu." });
        }
    };
};
exports.authorize = authorize;
