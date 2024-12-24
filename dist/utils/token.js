"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
/**
 * Access Token oluşturma
 */
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role,
        isActive: user.isActive,
    }, env_config_1.JWT_SECRET, // `undefined` olamayacağı garanti ediliyor
    { expiresIn: "10000000m" } // Access Token geçerlilik süresi: 15 dakika
    //****Refresh yapısı kurulana kadar uygulama accessToken üzerinde çalışacak. Güvenlik açığı olduğu için yakın zamanda çözülmeli****
    );
};
exports.generateAccessToken = generateAccessToken;
/**
 * Refresh Token oluşturma
 */
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, env_config_1.JWT_SECRET, // `undefined` olamayacağı garanti ediliyor
    { expiresIn: "7d" } // Refresh Token geçerlilik süresi: 7 gün
    );
};
exports.generateRefreshToken = generateRefreshToken;
