import { Schema, model, Document } from "mongoose";

// Kullanıcı rolleri
export enum UserRole {
  ADMIN = "admin", // Baro Yöneticisi
  MEMBER = "member", // Baro Üyesi
  LAWYER = "lawyer", // Avukat
}

// Kullanıcı şeması arayüzü
export interface IUser extends Document {
  tcNumber: string; // TC Kimlik Numarası
  name: string; // Adı
  surname: string; // Soyadı
  email?: string; // E-posta (opsiyonel)
  phone?: string; // Telefon Numarası (opsiyonel)
  password: string; // Şifre
  role: UserRole; // Kullanıcı Rolü
  referenceNumber?: string; // İlk giriş için referans numarası
  isActive: boolean; // Hesap aktif mi?
  createdAt: Date; // Oluşturulma tarihi
  updatedAt: Date; // Güncellenme tarihi
}

// Kullanıcı Şeması
const userSchema = new Schema<IUser>(
  {
    tcNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 11,
      maxlength: 11,
    },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
    },
    referenceNumber: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik olarak eklenecek
  }
);

// Model Oluşturma
const User = model<IUser>("User", userSchema);

export default User;
