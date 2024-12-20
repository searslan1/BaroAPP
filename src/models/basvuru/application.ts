import { Schema, model, Document, Types } from "mongoose";
import { ApplicationStatus } from "../shared/applicationStatus";
import { ICategory } from "../shared/category";
import { ICity } from "../shared/city";
import { IDocument } from "../shared/document";

/**
 * Başvuru Şeması Arayüzü
 */
export interface IApplication extends Document {
  tcNumber: string; // Vatandaşın TC No
  name: string; // Adı
  surname: string; // Soyadı
  phone: string; // Telefon
  email: string; // E-posta
  address: string; // Adres
  category: Types.ObjectId | ICategory; // Olay Kategorisi
  title: string; // Olay Başlığı
  details: string; // Olay Detayları
  documents?: Types.ObjectId[] | IDocument[]; // Opsiyonel dökümanlar
  status: ApplicationStatus; // Başvuru durumu
  assignedLawyer?: Types.ObjectId; // Atanmış avukatın ID'si (User Modeline referans)
  city?: Types.ObjectId | ICity; // Opsiyonel: Şehir
}

/**
 * Başvuru Şeması
 */
const applicationSchema = new Schema<IApplication>(
  {
    tcNumber: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
      match: /^[0-9]{11}$/,
    },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10,15}$/,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    address: { type: String, required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },
    documents: [{ type: Types.ObjectId, ref: "Document" }],
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
    assignedLawyer: { type: Types.ObjectId, ref: "User" },
    city: { type: Types.ObjectId, ref: "City" },
  },
  { timestamps: true }
);

/**
 * Başvuru Modeli
 */
const Application = model<IApplication>("Application", applicationSchema);

export default Application;
