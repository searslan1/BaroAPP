import { Schema, model, Document, Types } from "mongoose";

export interface IViolation extends Document {
  title: string; // Vaka başlığı
  applicant: { name: string; contact: string }; // Başvuran bilgileri (ad ve iletişim)
  category: string; // Kategori (ör: "Kadına Karşı Şiddet", "İfade Özgürlüğü")
  source: { type: string; detail?: string }; // Kaynak bilgisi (ör: medya, STK)
  status: string; // Durum (işlemde, tamamlandı)
  applicationDate: Date; // Başvuru tarihi
  details: string; // Vaka detayları
  summary: string; // Olay özeti
  legalRepresentative?: string; // Hukuki temsilci
  reportingAgency?: string; // Olayı bildiren kurum
  sourceDetail?: string; // Kaynağın detay bilgisi (ör: URL, medya adı)
  developments: Array<{ date: Date; description: string }>; // Gelişmeler
  files: Array<{ name: string; type: string; date: Date }>; // Dosyalar
  messages: Array<{ sender: string; message: string; date: Date }>; // Mesajlar
  result?: string; // Sonuç (opsiyonel)
}

const violationSchema = new Schema<IViolation>(
  {
    title: { type: String, required: true }, // Vaka başlığı
    applicant: {
      name: { type: String, required: true }, // Başvuranın adı
      contact: { type: String, required: true }, // İletişim bilgisi
    },
    category: { type: String, required: true }, // Kategori
    source: {
      type: { type: String, required: true }, // Kaynak türü (ör: medya, STK)
      detail: { type: String }, // Kaynak detayları (opsiyonel)
    },
    status: {
      type: String,
      required: true,
      enum: ["işlemde", "tamamlandı"], // Durum seçenekleri
    },
    applicationDate: { type: Date, required: true }, // Başvuru tarihi
    details: { type: String, required: true }, // Detaylar
    summary: { type: String }, // Özet
    legalRepresentative: { type: String }, // Hukuki temsilci
    reportingAgency: { type: String }, // Bildiren kurum
    sourceDetail: { type: String }, // Kaynağın detay bilgisi
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
        url: { type: String, required: true }, // Dosyanın S3 bağlantısı

      },
    ],
    messages: [
      {
        sender: { type: String, required: true },
        message: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    result: { type: String }, // Sonuç
  },
  { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);

const Violation = model<IViolation>("Violation", violationSchema);

export default Violation;
