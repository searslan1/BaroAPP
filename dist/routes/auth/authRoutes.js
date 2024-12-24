"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AuthController_1 = require("../../controllers/auth/AuthController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const user_1 = require("../../models/auth/user");
const router = (0, express_1.Router)();
/**
 * Baro üyesi veya avukat oluşturma (Baro yöneticisi tarafından)
 * Yetki: Sadece Admin (Baro Yöneticisi)
 */
router.post("/register", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([user_1.UserRole.ADMIN]), (0, express_async_handler_1.default)(AuthController_1.registerUser));
/**
 * Kullanıcı giriş yapma (Referans numarası ile)
 */
router.post("/login", (0, express_async_handler_1.default)(AuthController_1.loginUser));
/**
 * Eksik bilgileri doldurarak tam kayıt işlemi
 */
router.post("/complete-registration", (0, express_async_handler_1.default)(AuthController_1.completeUserRegistration));
/**
 * Refresh Token ile Access Token yenileme
 */
router.post("/refresh", (0, express_async_handler_1.default)(AuthController_1.refreshToken));
/**
 * Kullanıcı çıkışı (Logout)
 */
router.post("/logout", authMiddleware_1.authenticate, (0, express_async_handler_1.default)(AuthController_1.logoutUser));
/**
 * Kullanıcı doğrulama (Profil bilgileri döndürme)
 * Yetki: Giriş yapılmış olmalı
 */
router.get("/verify-user", authMiddleware_1.authenticate, (0, express_async_handler_1.default)(AuthController_1.verifyUserHandler));
exports.default = router;
