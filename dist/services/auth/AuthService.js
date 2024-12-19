"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshAccessToken = exports.completeRegistration = exports.loginWithReference = exports.createUserWithReference = void 0;
const user_1 = __importDefault(require("../../models/auth/user"));
const token_1 = require("../../utils/token");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
/**
 * Baro üyesi veya avukatı kaydetmek için referans numarası oluşturma
 */
const createUserWithReference = async (role, tcNumber, name, surname) => {
    const referenceNumber = (0, uuid_1.v4)(); // Benzersiz referans numarası
    const newUser = new user_1.default({
        tcNumber,
        name,
        surname,
        password: "temp_password", // Geçici şifre
        role,
        referenceNumber,
        isActive: false, // Tam kayıt yapılana kadar aktif değil
    });
    await newUser.save();
    return referenceNumber; // Baro yöneticisine referans numarası döndürülür
};
exports.createUserWithReference = createUserWithReference;
/**
 * TC Kimlik Numarası ve Referans Numarası ile giriş yapma
 */
const loginWithReference = async (tcNumber, referenceNumber) => {
    const user = await user_1.default.findOne({ tcNumber, referenceNumber });
    if (!user || user.isActive) {
        throw new Error("Geçersiz referans numarası veya kullanıcı zaten aktif.");
    }
    // Token oluşturma
    const accessToken = (0, token_1.generateAccessToken)({ id: user.id, role: user.role });
    const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id });
    // Refresh Token kaydetme
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
};
exports.loginWithReference = loginWithReference;
/**
 * Tam kayıt işlemi
 */
const completeRegistration = async (tcNumber, email, phone, password) => {
    const user = await user_1.default.findOne({ tcNumber });
    if (!user || user.isActive) {
        throw new Error("Kullanıcı bulunamadı veya zaten aktif.");
    }
    // Şifre hashleme
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    user.email = email;
    user.phone = phone;
    user.password = hashedPassword;
    user.isActive = true;
    user.referenceNumber = undefined; // Referans numarası artık gereksiz
    await user.save();
};
exports.completeRegistration = completeRegistration;
/**
 * Access Token yenileme
 */
const refreshAccessToken = async (refreshToken) => {
    const user = await user_1.default.findOne({ refreshToken });
    if (!user) {
        throw new Error("Geçersiz Refresh Token.");
    }
    return (0, token_1.generateAccessToken)({ id: user.id, role: user.role });
};
exports.refreshAccessToken = refreshAccessToken;
/**
 * Kullanıcı çıkışı (Logout)
 */
const logout = async (userId) => {
    const user = await user_1.default.findById(userId);
    if (!user) {
        throw new Error("Kullanıcı bulunamadı.");
    }
    user.refreshToken = undefined; // Refresh Token'ı kaldır
    await user.save();
};
exports.logout = logout;
