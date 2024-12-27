import { Schema, model, Document } from "mongoose";

// Hak ihlali verisi için arayüz
export interface IViolation extends Document {
  title: string; // Başlık
  applicant: { name: string; contact: string }; // Başvuran bilgileri
  category: string; // Kategori
  source: { type: string; detail?: string }; // Kaynak bilgisi
  status: "in_progress" | "completed"; // Durum
  applicationDate: Date; // Başvuru tarihi
  details: string; // Detaylar
  summary?: string; // Özet
  legalRepresentative?: string; // Hukuki temsilci
  reportingAgency?: string; // Bildiren kurum
  sourceDetail?: string; // Kaynak detayları
  developments: Array<{ date: Date; description: string }>; // Gelişmeler
  files: Array<{ name: string; type: string; date: Date; url: string }>; // Dosyalar
  messages: Array<{ sender: string; message: string; date: Date }>; // Mesajlar
  result?: string; // Sonuç
}

const violationSchema = new Schema<IViolation>(
  {
    title: { type: String, required: true },
    applicant: {
      name: { type: String, required: true },
      contact: { type: String, required: true },
    },
    category: { type: String, required: true },
    source: {
      type: { type: String, required: true },
      detail: { type: String },
    },
    status: {
      type: String,
      required: true,
      enum: ["in_progress", "completed"],
    },
    applicationDate: { type: Date, required: true },
    details: { type: String, required: true },
    summary: { type: String },
    legalRepresentative: { type: String },
    reportingAgency: { type: String },
    sourceDetail: { type: String },
    developments: [
      {
        date: { type: Date, required: true },
        description: { type: String, required: true },
      },
    ],
    files: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        date: { type: Date, required: true },
        url: { type: String, required: true },
      },
    ],
    messages: [
      {
        sender: { type: String, required: true },
        message: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    result: { type: String },
  },
  { timestamps: true }
);

const Violation = model<IViolation>("Violation", violationSchema);

export default Violation;
