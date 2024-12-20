import { Schema, model, Document, Types } from "mongoose";

/**
 * Dava Durumları
 */
export enum CaseStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
  WON = "won",
  LOST = "lost",
}

/**
 * Dava Belgeleri
 */
export interface ICaseDocument {
  name: string;
  type: string; // Ör. dilekçe, tutanak
  pdfUrl: string; // AWS S3 gibi bir sistemde saklanan belge URL'si
  uploadedAt: Date;
}

/**
 * Dava Modeli Arayüzü
 */
export interface ICase extends Document {
  caseNumber: string; // Dava numarası
  title: string; // Dava başlığı
  summary: string; // Dava özeti
  plaintiff: { name: string; email: string; phone: string }; // Başvuran bilgileri
  defendant?: string; // Karşı taraf bilgileri
  category: Types.ObjectId; // Kategori referansı
  status: CaseStatus; // Dava durumu
  assignedLawyer: Types.ObjectId; // Atanan avukat referansı
  openingDate: Date; // Açılış tarihi
  hearings: Types.ObjectId[]; // Duruşma referansları
  documents: ICaseDocument[]; // Dava belgeleri
  statistics: {
    durationInDays?: number; // Dava süresi (gün)
    categoryAverage?: number; // Kategori bazlı çözüm süresi (gün)
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dava Şeması
 */
const caseSchema = new Schema<ICase>(
  {
    caseNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    plaintiff: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    defendant: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    status: {
      type: String,
      enum: Object.values(CaseStatus),
      default: CaseStatus.OPEN,
    },
    assignedLawyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    openingDate: { type: Date, required: true },
    hearings: [{ type: Schema.Types.ObjectId, ref: "Hearing" }],
    documents: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        pdfUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    statistics: {
      durationInDays: { type: Number },
      categoryAverage: { type: Number },
    },
  },
  { timestamps: true }
);

const CaseModel = model<ICase>("Case", caseSchema);

export default CaseModel;
