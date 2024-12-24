"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const case_1 = __importDefault(require("../../models/case/case"));
class CaseService {
    // 1. Dava Ekleme
    async createCase(data) {
        try {
            const newCase = new case_1.default(data);
            await newCase.save();
            return newCase;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Dava ekleme sırasında hata: ${error.message}`);
        }
    }
    // 2. Dava Güncelleme
    async updateCase(caseId, updateData) {
        try {
            const existingCase = await case_1.default.findById(caseId);
            if (!existingCase)
                throw new Error("Dava bulunamadı.");
            const updatedCase = await case_1.default.findByIdAndUpdate(caseId, updateData, { new: true });
            return updatedCase;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Dava güncelleme sırasında hata: ${error.message}`);
        }
    }
    // 3. Tüm Davaları Listeleme (Baro Görevlisi)
    async getAllCases() {
        try {
            return await case_1.default.find().populate("lawyer");
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Davalar alınırken hata: ${error.message}`);
        }
    }
    // 4. Avukat için Davaları Listeleme
    async getCasesForLawyer(lawyerId) {
        try {
            return await case_1.default.find({ lawyer: lawyerId }).populate("lawyer");
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Avukat davaları alınırken hata: ${error.message}`);
        }
    }
    // 5. Dava Detayları
    async getCaseById(caseId) {
        try {
            const existingCase = await case_1.default.findById(caseId).populate("lawyer");
            if (!existingCase)
                throw new Error("Dava bulunamadı.");
            return existingCase;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Dava detayları alınırken hata: ${error.message}`);
        }
    }
    // 6. Dava Silme
    async deleteCase(caseId) {
        try {
            const existingCase = await case_1.default.findById(caseId);
            if (!existingCase)
                throw new Error("Dava bulunamadı.");
            await case_1.default.findByIdAndDelete(caseId);
            return { message: "Dava başarıyla silindi." };
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Dava silme sırasında hata: ${error.message}`);
        }
    }
    // 7. Duruşma Ekleme/Güncelleme
    async updateHearings(caseId, hearings) {
        try {
            const existingCase = await case_1.default.findById(caseId);
            if (!existingCase)
                throw new Error("Dava bulunamadı.");
            const updatedCase = await case_1.default.findByIdAndUpdate(caseId, { hearings }, { new: true });
            return updatedCase;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Duruşmalar güncellenirken hata: ${error.message}`);
        }
    }
    // 8. Mesaj Gönderme
    async sendMessage(caseId, message) {
        try {
            const existingCase = await case_1.default.findById(caseId);
            if (!existingCase)
                throw new Error("Dava bulunamadı.");
            const updatedCase = await case_1.default.findByIdAndUpdate(caseId, { $push: { messages: message } }, { new: true });
            return updatedCase;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Mesaj gönderimi sırasında hata: ${error.message}`);
        }
    }
    // 9. Tarihçe Güncelleme
    async updateHistory(caseId, history) {
        try {
            const existingCase = await case_1.default.findById(caseId);
            if (!existingCase)
                throw new Error("Dava bulunamadı.");
            const updatedCase = await case_1.default.findByIdAndUpdate(caseId, { history }, { new: true });
            return updatedCase;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Tarihçe güncellenirken hata: ${error.message}`);
        }
    }
    // 10. Hak İhlali İlişkilendirme
    async associateRightsViolation(caseId, rightsViolation) {
        try {
            const existingCase = await case_1.default.findById(caseId);
            if (!existingCase)
                throw new Error("Dava bulunamadı.");
            const updatedCase = await case_1.default.findByIdAndUpdate(caseId, { rightsViolation }, { new: true });
            return updatedCase;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Hak ihlali ilişkilendirme sırasında hata: ${error.message}`);
        }
    }
}
exports.default = new CaseService();
