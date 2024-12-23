import { Schema, model, Document, Types } from "mongoose";

export interface ILawyerDetails extends Document {
  userId: Types.ObjectId; // User modeliyle ilişkilendirme
  specialization: string; // Uzmanlık alanı
  barNumber: string; // Baro numarası
  activeCases: number; // Aktif dava sayısı
}

const lawyerDetailsSchema = new Schema<ILawyerDetails>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    barNumber: { type: String, required: true },
    activeCases: { type: Number, default: 0 },
  },
  { timestamps: true } // createdAt ve updatedAt ekler
);

const LawyerDetails = model<ILawyerDetails>("LawyerDetails", lawyerDetailsSchema);

export default LawyerDetails;
