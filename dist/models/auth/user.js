"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Kullanıcı rolleri
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["BARO_OFFICER"] = "baro_officer";
    UserRole["LAWYER"] = "lawyer";
})(UserRole || (exports.UserRole = UserRole = {}));
// Kullanıcı Şeması
const userSchema = new mongoose_1.Schema({
    tcNumber: {
        type: String,
        required: [true, "TC Kimlik Numarası gereklidir."],
        unique: true,
        minlength: [11, "TC Kimlik Numarası 11 haneli olmalıdır."],
        maxlength: [11, "TC Kimlik Numarası 11 haneli olmalıdır."],
        validate: {
            validator: (v) => /^[0-9]{11}$/.test(v),
            message: "Geçerli bir TC Kimlik Numarası giriniz.",
        },
    },
    name: { type: String, required: [true, "Ad gereklidir."] },
    surname: { type: String, required: [true, "Soyad gereklidir."] },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
            message: "Geçerli bir e-posta adresi giriniz.",
        },
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: (v) => /^[0-9]{10,15}$/.test(v),
            message: "Geçerli bir telefon numarası giriniz.",
        },
    },
    password: { type: String, required: [true, "Şifre gereklidir."] },
    role: {
        type: String,
        required: [true, "Kullanıcı rolü gereklidir."],
        enum: {
            values: Object.values(UserRole),
            message: "Geçersiz kullanıcı rolü.",
        },
    },
    referenceNumber: { type: String, unique: true, sparse: true },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: false },
}, {
    timestamps: true, // createdAt ve updatedAt otomatik olarak eklenir
});
// Şifre Hashleme (Pre-Save Middleware)
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password"))
            return next();
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error); // Hata tipini açıkça belirtin
    }
});
// Şifre Karşılaştırma
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return bcrypt_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error("Şifre doğrulama sırasında bir hata oluştu.");
    }
};
// Model Oluşturma
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
