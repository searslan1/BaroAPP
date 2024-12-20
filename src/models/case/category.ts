import { Schema, model, Document } from "mongoose";

/**
 * Kategori Modeli Arayüzü
 */
export interface ICategory extends Document {
  name: string; // Kategori adı
  description?: string; // Açıklama
  averageResolutionTime?: number; // Ortalama çözüm süresi (gün)
}

/**
 * Kategori Şeması
 */
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    averageResolutionTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CategoryModel = model<ICategory>("Category", categorySchema);

export default CategoryModel;
