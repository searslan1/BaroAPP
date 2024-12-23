import { Schema, model, Document, Types } from "mongoose";

export interface ICase extends Document {
  caseNumber: string; // Dava numarası
  title: string; // Dava adı
  summary: string; // Dava özeti
  applicant: { name: string; email: string; phone: string }; // Başvuran bilgisi
  opponent: { name: string; lawyer?: string }; // Karşı taraf bilgisi (opsiyonel avukat)
  lawyer: Types.ObjectId; // İlgili avukatın User modelindeki ID'si
  status: string; // Durum (aktif, beklemede, tamamlandı)
  startDate: Date; // Başlangıç tarihi
  endDate?: Date; // Kapanış tarihi (opsiyonel)
  category: string; // Dava kategorisi (ör. ceza, medeni)
  hearings: Array<{ date: Date; time: string; description: string }>; // Duruşmalar
  documents: Array<{ name: string; type: string; date: Date }>; // Belgeler
  rightsViolation?: { category: string; description: string }; // Hak ihlaliyle ilişki (opsiyonel)
  messages: Array<{ sender: string; message: string; date: Date }>; // Mesajlar
  history: Array<{ date: Date; action: string; description: string }>; // Geçmiş işlemler
  result?: string; // Sonuç (opsiyonel)
  closingNotes?: string; // Kapanış açıklaması (opsiyonel)
}

const caseSchema = new Schema<ICase>(
  {
    caseNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    applicant: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    opponent: {
      name: { type: String, required: true },
      lawyer: { type: String },
    },
    lawyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      required: true,
      enum: ["aktif", "beklemede", "tamamlandı"],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    category: { type: String, required: true },
    hearings: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    documents: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    rightsViolation: {
      category: { type: String },
      description: { type: String },
    },
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
    result: { type: String },
    closingNotes: { type: String },
  },
  { timestamps: true }
);

const Case = model<ICase>("Case", caseSchema);

export default Case;
