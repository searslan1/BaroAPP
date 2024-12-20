import { Schema, model, Document } from "mongoose";

/**
 * Kategori Şeması Arayüzü
 */
export interface ICategory extends Document {
  name: string; // Kategori adı
  description?: string; // Opsiyonel: Kategori açıklaması
  isActive: boolean; // Kategori aktif mi?
}

/**
 * Kategori Şeması
 */
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * Kategori Modeli
 */
const Category = model<ICategory>("Category", categorySchema);

export default Category;
