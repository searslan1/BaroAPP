"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserHandler = exports.logoutUser = exports.refreshToken = exports.completeUserRegistration = exports.loginUser = exports.registerUser = void 0;
const AuthService_1 = require("../../services/auth/AuthService");
/**
 * Baro üyesi veya avukat oluşturma
 */
const registerUser = async (req, res, next) => {
    const { role, tcNumber, name, surname } = req.body;
    try {
        if (!role || !tcNumber || !name || !surname) {
            res.status(400).json({ error: "Tüm alanlar gereklidir." });
            return;
        }
        const temporaryPassword = await (0, AuthService_1.createUserWithPassword)(role, tcNumber, name, surname);
        res.status(201).json({
            message: "Kullanıcı başarıyla oluşturuldu.",
            data: { temporaryPassword },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
/**
 * Giriş yapma
 */
const loginUser = async (req, res, next) => {
    const { tcNumber, password } = req.body;
    try {
        if (!tcNumber || !password) {
            res.status(400).json({ error: "TC Kimlik Numarası ve Şifre gereklidir." });
            return;
        }
        const tokens = await (0, AuthService_1.loginWithPassword)(tcNumber, password);
        res.status(200).json({
            message: "Giriş başarılı.",
            data: tokens,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
/**
 * Tam kayıt işlemi
 */
const completeUserRegistration = async (req, res, next) => {
    const { tcNumber, email, phone, password } = req.body;
    try {
        if (!tcNumber || !email || !phone || !password) {
            res.status(400).json({ error: "Tüm alanlar gereklidir." });
            return;
        }
        await (0, AuthService_1.completeRegistration)(tcNumber, email, phone, password);
        res.status(200).json({ message: "Kayıt başarıyla tamamlandı." });
    }
    catch (error) {
        next(error);
    }
};
exports.completeUserRegistration = completeUserRegistration;
/**
 * Access Token yenileme
 */
const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    console.log('refreshhhhhhhhh');
    try {
        if (!refreshToken) {
            res.status(400).json({ error: "Refresh Token gereklidir." });
            return;
        }
        const accessToken = await (0, AuthService_1.refreshAccessToken)(refreshToken);
        res.status(200).json({
            message: "Access Token yenilendi.",
            data: { accessToken },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
/**
 * Kullanıcı çıkışı
 */
const logoutUser = async (req, res, next) => {
    const { userId } = req.body;
    try {
        if (!userId) {
            res.status(400).json({ error: "Kullanıcı kimliği gereklidir." });
            return;
        }
        await (0, AuthService_1.logout)(userId);
        res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutUser = logoutUser;
/**
 * Kullanıcı doğrulama kontrolcüsü
 */
const verifyUserHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Yetkisiz erişim. Kullanıcı doğrulanamadı." });
            return;
        }
        const userInfo = await (0, AuthService_1.verifyUser)(req.user.id);
        res.status(200).json({
            message: "Kullanıcı doğrulandı.",
            data: userInfo,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyUserHandler = verifyUserHandler;
