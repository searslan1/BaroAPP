import User from "../../models/auth/user";
import Application, { IApplication } from "../../models/application/application";

class ApplicationService {
  // Başvuru Ekleme
  async createApplication(data: Partial<IApplication>) {
    try {
      const application = new Application(data);
      await application.save();
      return application;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Başvuru ekleme sırasında hata: ${error.message}`);
    }
  }

  // Başvuru Güncelleme
  async updateApplication(applicationId: string, updateData: Partial<IApplication>) {
    try {
      const application = await Application.findByIdAndUpdate(applicationId, updateData, { new: true });
      if (!application) throw new Error("Başvuru bulunamadı.");
      return application;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Başvuru güncelleme sırasında hata: ${error.message}`);
    }
  }

  // Başvuru Listesi
  async getApplications(filter: any = {}) {
    try {
      return await Application.find(filter).populate("assignedLawyer");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Başvurular alınırken hata: ${error.message}`);
    }
  }

  // Başvuru Detayları
  async getApplicationById(applicationId: string) {
    try {
      const application = await Application.findById(applicationId).populate("assignedLawyer");
      if (!application) throw new Error("Başvuru bulunamadı.");
      return application;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Başvuru detayları alınırken hata: ${error.message}`);
    }
  }

  // Başvuru Silme
  async deleteApplication(applicationId: string) {
    try {
      const application = await Application.findByIdAndDelete(applicationId);
      if (!application) throw new Error("Başvuru bulunamadı.");
      return application;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Başvuru silme sırasında hata: ${error.message}`);
    }
  }

  // Avukat Atama
  async assignLawyer(applicationId: string, lawyerId: string) {
    try {
      const lawyer = await User.findById(lawyerId);
      if (!lawyer || lawyer.role !== "lawyer") throw new Error("Geçerli bir avukat bulunamadı.");
      const application = await Application.findByIdAndUpdate(
        applicationId,
        { assignedLawyer: lawyerId },
        { new: true }
      );
      if (!application) throw new Error("Başvuru bulunamadı.");
      return application;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Avukat atama sırasında hata: ${error.message}`);
    }
  }
}

export default new ApplicationService();
