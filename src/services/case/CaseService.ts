import Case, { ICase } from "../../models/case/case";

class CaseService {
  // 1. Dava Ekleme
  async createCase(data: Partial<ICase>) {
    try {
      const newCase = new Case(data);
      await newCase.save();
      return newCase;
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Dava ekleme sırasında hata: ${error.message}`);
      }
  }

  // 2. Dava Güncelleme
  async updateCase(caseId: string, updateData: Partial<ICase>) {
    try {
      const existingCase = await Case.findById(caseId);
      if (!existingCase) throw new Error("Dava bulunamadı.");

   

      const updatedCase = await Case.findByIdAndUpdate(caseId, updateData, { new: true });
      return updatedCase;
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Dava güncelleme sırasında hata: ${error.message}`);
      }
  }

  // 3. Tüm Davaları Listeleme (Baro Görevlisi)
  async getAllCases() {
    try {
      return await Case.find().populate("lawyer");
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Davalar alınırken hata: ${error.message}`);
      }
  }
  // 4. Avukat için Davaları Listeleme
  async getCasesForLawyer(lawyerId: string) {
    try {
      return await Case.find({ lawyer: lawyerId }).populate("lawyer");
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Avukat davaları alınırken hata: ${error.message}`);
      }
  }

  // 5. Dava Detayları
  async getCaseById(caseId: string) {
    try {
      const existingCase = await Case.findById(caseId).populate("lawyer");
      if (!existingCase) throw new Error("Dava bulunamadı.");

    

      return existingCase;
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Dava detayları alınırken hata: ${error.message}`);
      }
  }

  // 6. Dava Silme
  async deleteCase(caseId: string) {
    try {
      const existingCase = await Case.findById(caseId);
      if (!existingCase) throw new Error("Dava bulunamadı.");

   

      await Case.findByIdAndDelete(caseId);
      return { message: "Dava başarıyla silindi." };
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Dava silme sırasında hata: ${error.message}`);
      }
  }

  // 7. Duruşma Ekleme/Güncelleme
  async updateHearings(caseId: string, hearings: Array<{ date: Date; time: string; description: string }>) {
    try {
      const existingCase = await Case.findById(caseId);
      if (!existingCase) throw new Error("Dava bulunamadı.");

      const updatedCase = await Case.findByIdAndUpdate(caseId, { hearings }, { new: true });
      return updatedCase;
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Duruşmalar güncellenirken hata: ${error.message}`);
      }
  }

  // 8. Mesaj Gönderme
  async sendMessage(caseId: string, message: { sender: string; message: string; date: Date }) {
    try {
      const existingCase = await Case.findById(caseId);
      if (!existingCase) throw new Error("Dava bulunamadı.");

      const updatedCase = await Case.findByIdAndUpdate(
        caseId,
        { $push: { messages: message } },
        { new: true }
      );
      return updatedCase;
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Mesaj gönderimi sırasında hata: ${error.message}`);
      }
  }

  // 9. Tarihçe Güncelleme
  async updateHistory(caseId: string, history: Array<{ date: Date; action: string; description: string }>) {
    try {
      const existingCase = await Case.findById(caseId);
      if (!existingCase) throw new Error("Dava bulunamadı.");

    

      const updatedCase = await Case.findByIdAndUpdate(caseId, { history }, { new: true });
      return updatedCase;
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Tarihçe güncellenirken hata: ${error.message}`);
      }
  }

  // 10. Hak İhlali İlişkilendirme
  async associateRightsViolation(caseId: string, rightsViolation: { category: string; description: string }) {
    try {
      const existingCase = await Case.findById(caseId);
      if (!existingCase) throw new Error("Dava bulunamadı.");


      const updatedCase = await Case.findByIdAndUpdate(caseId, { rightsViolation }, { new: true });
      return updatedCase;
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
        throw new Error(`Hak ihlali ilişkilendirme sırasında hata: ${error.message}`);
      }
  }
}

export default new CaseService();
