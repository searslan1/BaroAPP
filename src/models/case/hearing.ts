import { Schema, model, Document, Types } from "mongoose";

/**
 * Duruşma Modeli Arayüzü
 */
export interface IHearing extends Document {
  caseId: Types.ObjectId;
  date: Date;
  description?: string;
  status: string; // Ör. yapılacak, tamamlandı
}

/**
 * Duruşma Şeması
 */
const hearingSchema = new Schema<IHearing>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    date: { type: Date, required: true },
    description: { type: String },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const HearingModel = model<IHearing>("Hearing", hearingSchema);

export default HearingModel;
