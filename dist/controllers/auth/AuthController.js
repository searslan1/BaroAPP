"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = exports.refreshHandler = exports.completeRegistrationHandler = exports.login = exports.createUser = void 0;
const AuthService_1 = require("../../services/auth/AuthService");
/**
 * Baro üyesi veya avukat oluşturma (Referans numarası ile)
 */
const createUser = async (req, res, next) => {
    const { role, tcNumber, name, surname } = req.body;
    try {
        if (!role || !tcNumber || !name || !surname) {
            res.status(400).json({ message: "Tüm alanlar gereklidir." });
            return;
        }
        const referenceNumber = await (0, AuthService_1.createUserWithReference)(role, tcNumber, name, surname);
        res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu.", referenceNumber });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
/**
 * TC ve Referans Numarası ile giriş yapma
 */
const login = async (req, res, next) => {
    const { tcNumber, referenceNumber } = req.body;
    try {
        if (!tcNumber || !referenceNumber) {
            res.status(400).json({ message: "TC ve Referans Numarası gereklidir." });
            return;
        }
        const tokens = await (0, AuthService_1.loginWithReference)(tcNumber, referenceNumber);
        res.status(200).json({ message: "Giriş başarılı.", ...tokens });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
/**
 * Eksik bilgileri doldurup tam kayıt yapma
 */
const completeRegistrationHandler = async (req, res, next) => {
    const { tcNumber, email, phone, password } = req.body;
    try {
        if (!tcNumber || !email || !phone || !password) {
            res.status(400).json({ message: "Tüm alanlar gereklidir." });
            return;
        }
        await (0, AuthService_1.completeRegistration)(tcNumber, email, phone, password);
        res.status(200).json({ message: "Kayıt başarıyla tamamlandı." });
    }
    catch (error) {
        next(error);
    }
};
exports.completeRegistrationHandler = completeRegistrationHandler;
/**
 * Refresh Token ile Access Token yenileme
 */
const refreshHandler = async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh Token gereklidir." });
            return;
        }
        const accessToken = await (0, AuthService_1.refreshAccessToken)(refreshToken);
        res.status(200).json({ message: "Access Token yenilendi.", accessToken });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshHandler = refreshHandler;
/**
 * Kullanıcı çıkışı (Logout)
 */
const logoutHandler = async (req, res, next) => {
    const { userId } = req.body;
    try {
        if (!userId) {
            res.status(400).json({ message: "Kullanıcı kimliği gereklidir." });
            return;
        }
        await (0, AuthService_1.logout)(userId);
        res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutHandler = logoutHandler;
