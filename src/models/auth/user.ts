import { Schema, model, Document, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

// Kullanıcı rolleri
export enum UserRole {
  ADMIN = "admin", // Baro Yöneticisi
  BARO_OFFICER = "baro_officer", // Baro Üyesi
  LAWYER = "lawyer", // Avukat
}

// Kullanıcı Şeması Arayüzü
export interface IUser extends Document {
  tcNumber: string; // TC Kimlik Numarası
  name: string; // Adı
  surname: string; // Soyadı
  email?: string; // E-posta (opsiyonel)
  phone?: string; // Telefon (opsiyonel)
  password: string; // Şifre (hashlenmiş)
  role: UserRole; // Kullanıcı Rolü
  refreshToken?: string; // Sürekli oturum için Refresh Token
  isActive: boolean; // Hesap aktif mi?
  createdAt: Date; // Oluşturulma tarihi
  updatedAt: Date; // Güncellenme tarihi
  comparePassword(candidatePassword: string): Promise<boolean>; // Şifre karşılaştırma metodu
}

// Kullanıcı Şeması
const userSchema = new Schema<IUser>(
  {
    tcNumber: {
      type: String,
      required: [true, "TC Kimlik Numarası gereklidir."],
      unique: true,
      minlength: [11, "TC Kimlik Numarası 11 haneli olmalıdır."],
      maxlength: [11, "TC Kimlik Numarası 11 haneli olmalıdır."],
      validate: {
        validator: (v: string) => /^[0-9]{11}$/.test(v),
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
        validator: (v: string) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
        message: "Geçerli bir e-posta adresi giriniz.",
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => /^[0-9]{10,15}$/.test(v),
        message: "Geçerli bir telefon numarası giriniz.",
      },
    },
    password: {
      type: String,
      validate: {
        validator: function (v: string) {
          // Şifre yalnızca kullanıcı aktif olduğunda zorunludur
          return this.isActive ? !!v : true;
        },
        message: "Şifre gereklidir.",
      },
    },    role: {
      type: String,
      required: [true, "Kullanıcı rolü gereklidir."],
      enum: {
        values: Object.values(UserRole),
        message: "Geçersiz kullanıcı rolü.",
      },
    },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik olarak eklenir
  }
);

// Şifre Hashleme (Pre-Save Middleware)
userSchema.pre("save", async function (next: (err?: CallbackError) => void) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError); // Hata tipini açıkça belirtin
  }
});

// Şifre Karşılaştırma
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Şifre doğrulama sırasında bir hata oluştu.");
  }
};

// Model Oluşturma
const User = model<IUser>("User", userSchema);

export default User;
