"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const violation_1 = __importDefault(require("../../models/violation/violation"));
const s3_1 = require("../../utils/s3");
class ViolationService {
    // 1. Hak İhlali Ekleme
    async createViolation(data) {
        try {
            const newViolation = new violation_1.default(data);
            await newViolation.save();
            return newViolation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Hak ihlali eklenirken bir hata oluştu.");
        }
    }
    // 2. Hak İhlali Güncelleme
    async updateViolation(id, updateData) {
        try {
            const updatedViolation = await violation_1.default.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedViolation)
                throw new Error("Hak ihlali bulunamadı.");
            return updatedViolation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Hak ihlali güncellenirken bir hata oluştu.");
        }
    }
    // 3. Hak İhlalleri Listesi
    async getViolations(filter = {}) {
        try {
            // Filtreyi daha açık bir şekilde tanımlıyoruz
            return await violation_1.default.find(filter);
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Hak ihlalleri listelenirken bir hata oluştu.");
        }
    }
    // 4. Hak İhlali Detayları
    async getViolationById(id) {
        try {
            const violation = await violation_1.default.findById(id);
            if (!violation)
                throw new Error("Hak ihlali bulunamadı.");
            return violation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Hak ihlali detayları alınırken bir hata oluştu.");
        }
    }
    // 5. Hak İhlali Silme
    async deleteViolation(id) {
        try {
            const deletedViolation = await violation_1.default.findByIdAndDelete(id);
            if (!deletedViolation)
                throw new Error("Hak ihlali bulunamadı.");
            return { message: "Hak ihlali başarıyla silindi." };
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Hak ihlali silinirken bir hata oluştu.");
        }
    }
    // 6. Gelişme Ekleme/Güncelleme
    async updateDevelopments(id, developments) {
        try {
            const updatedViolation = await violation_1.default.findByIdAndUpdate(id, { developments }, { new: true });
            if (!updatedViolation)
                throw new Error("Hak ihlali bulunamadı.");
            return updatedViolation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Gelişmeler güncellenirken bir hata oluştu.");
        }
    }
    // 7. Dosya Yükleme
    async uploadFile(id, fileBuffer, fileName, mimeType) {
        try {
            const fileUrl = await (0, s3_1.uploadFileToS3)(fileBuffer, fileName, mimeType);
            const updatedViolation = await violation_1.default.findByIdAndUpdate(id, { $push: { files: { name: fileName, type: mimeType, date: new Date(), url: fileUrl } } }, { new: true });
            if (!updatedViolation)
                throw new Error("Hak ihlali bulunamadı.");
            return updatedViolation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Dosya yükleme sırasında bir hata oluştu.");
        }
    }
    // 7.1. Dosya Silme
    async deleteFile(id, fileName) {
        try {
            const violation = await violation_1.default.findById(id);
            if (!violation)
                throw new Error("Hak ihlali bulunamadı.");
            const file = violation.files.find((f) => f.name === fileName);
            if (!file)
                throw new Error("Dosya bulunamadı.");
            // S3'ten dosyayı sil
            await (0, s3_1.deleteFileFromS3)(fileName);
            // Dosyayı veri tabanından kaldır
            violation.files = violation.files.filter((f) => f.name !== fileName);
            await violation.save();
            return violation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Dosya silme sırasında bir hata oluştu.");
        }
    }
    // 8. Mesaj Gönderme
    async sendMessage(id, message) {
        try {
            const updatedViolation = await violation_1.default.findByIdAndUpdate(id, { $push: { messages: message } }, { new: true });
            if (!updatedViolation)
                throw new Error("Hak ihlali bulunamadı.");
            return updatedViolation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Mesaj gönderilirken bir hata oluştu.");
        }
    }
    // 9. Hak İhlali Sonuçlandırma
    async concludeViolation(id, result) {
        try {
            const updatedViolation = await violation_1.default.findByIdAndUpdate(id, { result, status: "tamamlandı" }, { new: true });
            if (!updatedViolation)
                throw new Error("Hak ihlali bulunamadı.");
            return updatedViolation;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Hak ihlali sonuçlandırılırken bir hata oluştu.");
        }
    }
    // 10. İstatistik ve Kategori İzleme
    async getStatistics() {
        try {
            const statistics = await violation_1.default.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]);
            return statistics;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "İstatistikler alınırken bir hata oluştu.");
        }
    }
    // 11. Kaynak Entegrasyonu
    async integrateSource(sourceType, sourceDetail) {
        try {
            const violations = await violation_1.default.find({ "source.type": sourceType, "source.detail": sourceDetail });
            return violations;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Kaynak entegrasyonu yapılırken bir hata oluştu.");
        }
    }
    // 12. Durum Takibi
    async getViolationsByStatus(status) {
        try {
            const violations = await violation_1.default.find({ status });
            return violations;
        }
        catch (err) {
            throw new Error(err instanceof Error ? err.message : "Hak ihlalleri durum takibi yapılırken bir hata oluştu.");
        }
    }
}
exports.default = new ViolationService();
