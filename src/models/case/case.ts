import { Schema, model, Document, Types } from "mongoose";

export interface ICase extends Document {
  caseNumber: string; // Dava numarası
  title: string; // Dava adı
  summary: string; // Dava özeti
  applicant: { name: string; email: string; phone: string }; // Başvuran bilgisi
  opponent: { name: string; lawyer?: string }; // Karşı taraf bilgisi
  lawyer: string; // Atanan avukatın User modelindeki ID'si
  status: string; // Durum (aktif, beklemede, tamamlandı)
  startDate: Date; // Başlangıç tarihi
  endDate?: Date; // Kapanış tarihi (opsiyonel)
  category: string; // Kategori
  hearings: Array<{ date: Date; time: string; description: string }>; // Duruşma tarihleri
  documents: Array<{
      pdfUrl: string; name: string; type: string; date: Date 
}>; // Belgeler
  messages: Array<{ sender: string; message: string; date: Date }>; // Mesajlar
  history: Array<{ date: Date; action: string; description: string }>; // Geçmiş işlemler
  result?: string; // Dava sonucu (opsiyonel)
  closingNotes?: string; // Kapanış notları (opsiyonel)
}

const caseSchema = new Schema<ICase>(
  {
    caseNumber: { type: String, required: true, unique: true }, // Unik dava numarası
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
    lawyer: { type: String, required: true },
   // lawyer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User modeline referans
    status: {
      type: String,
      required: true,
      enum: ["aktif", "beklemede", "tamamlandı"],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    category: { type: String, required: true }, // Ceza, Medeni, İş vb.
    hearings: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    documents: [
      {
        name: { type: String, required: false },
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
  { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);

const Case = model<ICase>("Case", caseSchema);

export default Case;
