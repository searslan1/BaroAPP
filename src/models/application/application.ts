import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  applicantName: string; // Başvuran adı
  contactDetails: {
    email: string;
    phone: string;
    address: string;
  }; // İletişim bilgileri
  eventTitle: string; // Etkinlik/olay başlığı
  eventCategory: string; // Etkinlik kategorisi (ör: isHukuku, egitimHakki)
  status: string; // Durum (işlemde, beklemede, tamamlandı)
  date: Date; // Başvuru tarihi
  assignedLawyer?: Types.ObjectId; // Atanmış avukat (opsiyonel)
  description?: string; // Başvuru açıklaması (opsiyonel)
  documents: Array<{ name: string; type: string; date: Date; url?: string }>; // Belgeler (Opsiyonel URL ile)
  messages: Array<{ sender: string; message: string; date: Date }>; // Mesajlar
  history: Array<{ date: Date; action: string; description: string }>; // Geçmiş işlemler
  priority: string; // Öncelik durumu (ör: yüksek, orta, düşük)
  relatedCases?: Types.ObjectId[]; // İlişkili davalar (opsiyonel)
}

const applicationSchema = new Schema<IApplication>(
  {
    applicantName: { type: String, required: true },
    contactDetails: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    eventTitle: { type: String, required: true },
    eventCategory: {
      type: String,
      required: true,
      enum: [
        "isHukuku",
        "egitimHakki",
        "ifadeOzgurlugu",
        "kadinaKarsiSiddet",
        "cocukHaklari",
      ], // Örnek kategoriler
    },
    status: {
      type: String,
      default: "beklemede",
      required: true,
      enum: ["işlemde", "beklemede", "tamamlandı"],
    },
    date: { type: Date, required: true },
    assignedLawyer: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    documents: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        date: { type: Date, required: true },
        url: { type: String }, // Opsiyonel URL
      },
    ],
    messages: [
      {
        sender: { type: String, required: true },
        message: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    history: [
      {
        date: { type: Date, required: true },
        action: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    priority: {
      type: String,
      required: true,
      default: "orta",
      enum: ["yüksek", "orta", "düşük"],
    },
    relatedCases: [{ type: Schema.Types.ObjectId, ref: "Case" }], // Opsiyonel ilişkili davalar
  },
  { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);

const Application = model<IApplication>("Application", applicationSchema);

export default Application;
