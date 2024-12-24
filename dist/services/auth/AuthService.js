"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBaroAdmin = exports.verifyUser = exports.logout = exports.refreshAccessToken = exports.completeRegistration = exports.loginWithPassword = exports.createUserWithPassword = void 0;
const user_1 = __importStar(require("../../models/auth/user"));
const token_1 = require("../../utils/token");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
/**
 * Rastgele şifre üretir.
 */
function generateRandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    let password = "";
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
/**
 * Baro üyesi veya avukatı kaydetmek için password oluşturma
 */
const createUserWithPassword = async (role, tcNumber, name, surname) => {
    // Rastgele şifre oluştur
    const temporaryPassword = generateRandomPassword();
    // Şifreyi hashle
    const hashedPassword = await bcrypt_1.default.hash(temporaryPassword, 10);
    // Kullanıcı oluştur
    const newUser = new user_1.default({
        tcNumber,
        name,
        surname,
        password: hashedPassword,
        role,
        isActive: false, // Tam kayıt yapılana kadar aktif değil
    });
    await newUser.save();
    // Düz metin şifreyi döndür
    return temporaryPassword;
};
exports.createUserWithPassword = createUserWithPassword;
/**
 * TC Kimlik Numarası ve Referans Numarası ile giriş yapma
 */
const loginWithPassword = async (tcNumber, password) => {
    try {
        // Kullanıcıyı TC Kimlik Numarası ile bul
        const user = await user_1.default.findOne({ tcNumber });
        if (!user) {
            throw { status: 404, message: "Kullanıcı bulunamadı. TC Kimlik Numarası yanlış." };
        }
        // Şifre doğrulama
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw { status: 401, message: "Hatalı şifre." };
        }
        // Kullanıcı aktif değilse tam kayıt işlemine yönlendirme
        // Token oluşturma
        const accessToken = (0, token_1.generateAccessToken)({ id: user.id, role: user.role, isActive: user.isActive });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id });
        // Refresh Token'ı veritabanına kaydet
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    }
    catch (error) {
        if (error instanceof mongoose_1.Error && "status" in error && "message" in error) {
            throw error; // Önceden belirlenmiş hata fırlat
        }
        // Fallback durumunda türü açıkça belirtin
        throw { status: 500, message: error.message || "Beklenmeyen bir hata oluştu." };
    }
};
exports.loginWithPassword = loginWithPassword;
/**
 * Tam kayıt işlemi
 */
const completeRegistration = async (tcNumber, email, phone, password) => {
    const user = await user_1.default.findOne({ tcNumber });
    if (!user || user.isActive) {
        throw new mongoose_1.Error("Kullanıcı bulunamadı veya zaten aktif.");
    }
    user.email = email;
    user.phone = phone;
    user.password = password; // Şifre düz metin olarak atanır
    user.isActive = true;
    await user.save(); // `pre("save")` middleware'i şifreyi hashler
};
exports.completeRegistration = completeRegistration;
/**
 * Access Token yenileme
 */
const refreshAccessToken = async (refreshToken) => {
    const user = await user_1.default.findOne({ refreshToken });
    if (!user) {
        throw new mongoose_1.Error("Geçersiz Refresh Token.");
    }
    return (0, token_1.generateAccessToken)({ id: user.id, role: user.role, isActive: user.isActive });
};
exports.refreshAccessToken = refreshAccessToken;
/**
 * Kullanıcı çıkışı (Logout)
 */
const logout = async (userId) => {
    const user = await user_1.default.findById(userId);
    if (!user) {
        throw new mongoose_1.Error("Kullanıcı bulunamadı.");
    }
    user.refreshToken = undefined; // Refresh Token'ı kaldır
    await user.save();
};
exports.logout = logout;
/**
* Kullanıcıyı doğrula ve bilgilerini döndür
*/
const verifyUser = async (userId) => {
    const user = await user_1.default.findById(userId).select("name surname role email");
    if (!user) {
        throw new mongoose_1.Error("Kullanıcı bulunamadı.");
    }
    return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
    };
};
exports.verifyUser = verifyUser;
//ilk uygulama çalıştırıldığında yönetici oluşturmak için yazılmış geçici bir fonksiyon
const seedBaroAdmin = async () => {
    const existingAdmin = await user_1.default.findOne({ role: user_1.UserRole.ADMIN });
    if (!existingAdmin) {
        const admin = new user_1.default({
            tcNumber: "11111111111",
            name: "Baro",
            surname: "Yönetici",
            email: "admin@baro.com",
            password: "admin123",
            role: user_1.UserRole.ADMIN,
            isActive: true,
        });
        await admin.save();
        console.log("Baro yöneticisi başarıyla oluşturuldu.");
    }
    else {
        console.log("Baro yöneticisi zaten mevcut.");
    }
};
exports.seedBaroAdmin = seedBaroAdmin;
(0, exports.seedBaroAdmin)();
