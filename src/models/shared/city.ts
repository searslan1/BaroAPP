import { Schema, model, Document } from "mongoose";

/**
 * Şehir Şeması Arayüzü
 */
export interface ICity extends Document {
  name: string; // Şehir adı
  region?: string; // Opsiyonel: Bölge (ör. Marmara, Ege)
}

/**
 * Şehir Şeması
 */
const citySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, unique: true },
    region: { type: String }, // Opsiyonel
  },
  { timestamps: true }
);

/**
 * Şehir Modeli
 */
const City = model<ICity>("City", citySchema);

export default City;
