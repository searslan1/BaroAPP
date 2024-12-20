import { Schema, model, Document, Types } from "mongoose";

/**
 * Döküman Şeması Arayüzü
 */
export interface IDocument extends Document {
  url: string; // Döküman URL'si
  type: string; // Döküman türü (ör. "pdf", "image")
  size: number; // Döküman boyutu (byte cinsinden)
  uploadedAt: Date; // Yüklenme zamanı
  relatedApplication: Types.ObjectId; // İlgili başvuru ID'si
}

/**
 * Döküman Şeması
 */
const documentSchema = new Schema<IDocument>(
  {
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    relatedApplication: { type: Schema.Types.ObjectId, ref: "Application", required: true },
},
  { timestamps: true }
);

/**
 * Döküman Modeli
 */
const DocumentModel = model<IDocument>("Document", documentSchema);

export default DocumentModel;
