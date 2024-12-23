import { Schema, model, Document, Types } from "mongoose";

export interface IRightsViolation extends Document {
  title: string; // Vaka başlığı
  applicantName: string; // Başvuran kişi adı
  applicantContact: string; // Başvuran iletişim bilgisi
  category: string; // Kategori (ör: kadinaKarsiSiddet)
  source: string; // Kaynak (ör: bireyselBasvuru, stk)
  sourceDetails?: string; // Kaynak detayı (opsiyonel)
  status: string; // Durum (ör: işlemde, tamamlandı)
  applicationDate: Date; // Başvuru tarihi
  details: string; // Detaylar
  summary: string; // Olay özeti
  legalRepresentative?: string; // Hukuki temsilci (opsiyonel)
  reportingAgency?: string; // Olay bildiren kurum (opsiyonel)
  developments: Array<{ date: Date; description: string }>; // Gelişmeler
  result?: string; // Sonuç (opsiyonel)
  files: Array<{ name: string; type: string; date: Date }>; // Dosyalar
  messages: Array<{ sender: string; message: string; date: Date }>; // Mesajlar
}

const rightsViolationSchema = new Schema<IRightsViolation>(
  {
    title: { type: String, required: true },
    applicantName: { type: String, required: true },
    applicantContact: { type: String, required: true },
    category: { type: String, required: true },
    source: { type: String, required: true },
    sourceDetails: { type: String },
    status: { type: String, required: true, enum: ["İşlemde", "Tamamlandı", "Beklemede"] },
    applicationDate: { type: Date, required: true },
    details: { type: String, required: true },
    summary: { type: String, required: true },
    legalRepresentative: { type: String },
    reportingAgency: { type: String },
    developments: [
      {
        date: { type: Date, required: true },
        description: { type: String, required: true },
      },
    ],
    result: { type: String },
    files: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    messages: [
      {
        sender: { type: String, required: true },
        message: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);

const RightsViolation = model<IRightsViolation>("RightsViolation", rightsViolationSchema);

export default RightsViolation;
