"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../models/auth/user"));
const application_1 = __importDefault(require("../../models/application/application"));
class ApplicationService {
    // Başvuru Ekleme
    async createApplication(data) {
        try {
            const application = new application_1.default(data);
            await application.save();
            return application;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Başvuru ekleme sırasında hata: ${error.message}`);
        }
    }
    // Başvuru Güncelleme
    async updateApplication(applicationId, updateData) {
        try {
            const application = await application_1.default.findByIdAndUpdate(applicationId, updateData, { new: true });
            if (!application)
                throw new Error("Başvuru bulunamadı.");
            return application;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Başvuru güncelleme sırasında hata: ${error.message}`);
        }
    }
    // Başvuru Listesi
    async getApplications(filter = {}) {
        try {
            return await application_1.default.find(filter).populate("assignedLawyer");
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Başvurular alınırken hata: ${error.message}`);
        }
    }
    // Başvuru Detayları
    async getApplicationById(applicationId) {
        try {
            const application = await application_1.default.findById(applicationId).populate("assignedLawyer");
            if (!application)
                throw new Error("Başvuru bulunamadı.");
            return application;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Başvuru detayları alınırken hata: ${error.message}`);
        }
    }
    // Başvuru Silme
    async deleteApplication(applicationId) {
        try {
            const application = await application_1.default.findByIdAndDelete(applicationId);
            if (!application)
                throw new Error("Başvuru bulunamadı.");
            return application;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Başvuru silme sırasında hata: ${error.message}`);
        }
    }
    // Avukat Atama
    async assignLawyer(applicationId, lawyerId) {
        try {
            const lawyer = await user_1.default.findById(lawyerId);
            if (!lawyer || lawyer.role !== "lawyer")
                throw new Error("Geçerli bir avukat bulunamadı.");
            const application = await application_1.default.findByIdAndUpdate(applicationId, { assignedLawyer: lawyerId }, { new: true });
            if (!application)
                throw new Error("Başvuru bulunamadı.");
            return application;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            throw new Error(`Avukat atama sırasında hata: ${error.message}`);
        }
    }
}
exports.default = new ApplicationService();
