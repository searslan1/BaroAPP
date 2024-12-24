import Violation, { IViolation } from "../../models/violation/violation";
import { uploadFileToS3, deleteFileFromS3 } from "../../utils/s3";

class ViolationService {
  // 1. Hak İhlali Ekleme
  async createViolation(data: Partial<IViolation>) {
    try {
      const newViolation = new Violation(data);
      await newViolation.save();
      return newViolation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Hak ihlali eklenirken bir hata oluştu.");
    }
  }

  // 2. Hak İhlali Güncelleme
  async updateViolation(id: string, updateData: Partial<IViolation>) {
    try {
      const updatedViolation = await Violation.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedViolation) throw new Error("Hak ihlali bulunamadı.");
      return updatedViolation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Hak ihlali güncellenirken bir hata oluştu.");
    }
  }

  // 3. Hak İhlalleri Listesi
  async getViolations(filter: Record<string, any> = {}) {
    try {
      // Filtreyi daha açık bir şekilde tanımlıyoruz
      return await Violation.find(filter);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Hak ihlalleri listelenirken bir hata oluştu.");
    }
  }

  // 4. Hak İhlali Detayları
  async getViolationById(id: string) {
    try {
      const violation = await Violation.findById(id);
      if (!violation) throw new Error("Hak ihlali bulunamadı.");
      return violation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Hak ihlali detayları alınırken bir hata oluştu.");
    }
  }

  // 5. Hak İhlali Silme
  async deleteViolation(id: string) {
    try {
      const deletedViolation = await Violation.findByIdAndDelete(id);
      if (!deletedViolation) throw new Error("Hak ihlali bulunamadı.");
      return { message: "Hak ihlali başarıyla silindi." };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Hak ihlali silinirken bir hata oluştu.");
    }
  }

  // 6. Gelişme Ekleme/Güncelleme
  async updateDevelopments(id: string, developments: Array<{ date: Date; description: string }>) {
    try {
      const updatedViolation = await Violation.findByIdAndUpdate(
        id,
        { developments },
        { new: true }
      );
      if (!updatedViolation) throw new Error("Hak ihlali bulunamadı.");
      return updatedViolation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Gelişmeler güncellenirken bir hata oluştu.");
    }
  }

  // 7. Dosya Yükleme
  async uploadFile(id: string, fileBuffer: Buffer, fileName: string, mimeType: string) {
    try {
      const fileUrl = await uploadFileToS3(fileBuffer, fileName, mimeType);

      const updatedViolation = await Violation.findByIdAndUpdate(
        id,
        { $push: { files: { name: fileName, type: mimeType, date: new Date(), url: fileUrl } } },
        { new: true }
      );

      if (!updatedViolation) throw new Error("Hak ihlali bulunamadı.");
      return updatedViolation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Dosya yükleme sırasında bir hata oluştu.");
    }
  } 
   // 7.1. Dosya Silme
  async deleteFile(id: string, fileName: string) {
    try {
      const violation = await Violation.findById(id);
      if (!violation) throw new Error("Hak ihlali bulunamadı.");

      const file = violation.files.find((f) => f.name === fileName);
      if (!file) throw new Error("Dosya bulunamadı.");

      // S3'ten dosyayı sil
      await deleteFileFromS3(fileName);

      // Dosyayı veri tabanından kaldır
      violation.files = violation.files.filter((f) => f.name !== fileName);
      await violation.save();

      return violation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Dosya silme sırasında bir hata oluştu.");
    }
  }


  // 8. Mesaj Gönderme
  async sendMessage(id: string, message: { sender: string; message: string; date: Date }) {
    try {
      const updatedViolation = await Violation.findByIdAndUpdate(
        id,
        { $push: { messages: message } },
        { new: true }
      );
      if (!updatedViolation) throw new Error("Hak ihlali bulunamadı.");
      return updatedViolation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Mesaj gönderilirken bir hata oluştu.");
    }
  }

  // 9. Hak İhlali Sonuçlandırma
  async concludeViolation(id: string, result: string) {
    try {
      const updatedViolation = await Violation.findByIdAndUpdate(
        id,
        { result, status: "tamamlandı" },
        { new: true }
      );
      if (!updatedViolation) throw new Error("Hak ihlali bulunamadı.");
      return updatedViolation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Hak ihlali sonuçlandırılırken bir hata oluştu.");
    }
  }

  // 10. İstatistik ve Kategori İzleme
  async getStatistics() {
    try {
      const statistics = await Violation.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      return statistics;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "İstatistikler alınırken bir hata oluştu.");
    }
  }

  // 11. Kaynak Entegrasyonu
  async integrateSource(sourceType: string, sourceDetail: string) {
    try {
      const violations = await Violation.find({ "source.type": sourceType, "source.detail": sourceDetail });
      return violations;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Kaynak entegrasyonu yapılırken bir hata oluştu.");
    }
  }

  // 12. Durum Takibi
  async getViolationsByStatus(status: string) {
    try {
      const violations = await Violation.find({ status });
      return violations;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Hak ihlalleri durum takibi yapılırken bir hata oluştu.");
    }
  }
}

export default new ViolationService();
