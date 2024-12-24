"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ViolationService_1 = __importDefault(require("../../services/violation/ViolationService"));
class ViolationController {
    // 1. Hak İhlali Ekleme
    async createViolation(req, res) {
        try {
            const data = req.body;
            const violation = await ViolationService_1.default.createViolation(data);
            res.status(201).json(violation);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali eklenirken bir hata oluştu." });
        }
    }
    // 2. Hak İhlali Güncelleme
    async updateViolation(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedViolation = await ViolationService_1.default.updateViolation(id, updateData);
            res.status(200).json(updatedViolation);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali güncellenirken bir hata oluştu." });
        }
    }
    // 3. Hak İhlalleri Listesi
    async getViolations(req, res) {
        try {
            const filter = req.query;
            const violations = await ViolationService_1.default.getViolations(filter);
            res.status(200).json(violations);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlalleri listelenirken bir hata oluştu." });
        }
    }
    // 4. Hak İhlali Detayları
    async getViolationById(req, res) {
        try {
            const { id } = req.params;
            const violation = await ViolationService_1.default.getViolationById(id);
            res.status(200).json(violation);
        }
        catch (err) {
            res.status(404).json({ message: err instanceof Error ? err.message : "Hak ihlali bulunamadı." });
        }
    }
    // 5. Hak İhlali Silme
    async deleteViolation(req, res) {
        try {
            const { id } = req.params;
            const result = await ViolationService_1.default.deleteViolation(id);
            res.status(200).json(result);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali silinirken bir hata oluştu." });
        }
    }
    // 6. Gelişme Ekleme/Güncelleme
    async updateDevelopments(req, res) {
        try {
            const { id } = req.params;
            const { developments } = req.body;
            const updatedViolation = await ViolationService_1.default.updateDevelopments(id, developments);
            res.status(200).json(updatedViolation);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Gelişmeler güncellenirken bir hata oluştu." });
        }
    }
    // 7. Dosya Yükleme
    async uploadFile(req, res) {
        try {
            const { id } = req.params;
            const file = req.file; // Multer kullanımı
            if (!file)
                throw new Error("Dosya yüklenmedi.");
            const updatedViolation = await ViolationService_1.default.uploadFile(id, file.buffer, file.originalname, file.mimetype);
            res.status(200).json(updatedViolation);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Dosya yüklenirken bir hata oluştu." });
        }
    }
    // 7.1. Dosya Silme
    async deleteFile(req, res) {
        try {
            const { id } = req.params;
            const { fileName } = req.body;
            const updatedViolation = await ViolationService_1.default.deleteFile(id, fileName);
            res.status(200).json(updatedViolation);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Dosya silinirken bir hata oluştu." });
        }
    }
    // 8. Mesaj Gönderme
    async sendMessage(req, res) {
        try {
            const { id } = req.params;
            const message = req.body;
            const updatedViolation = await ViolationService_1.default.sendMessage(id, message);
            res.status(200).json(updatedViolation);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Mesaj gönderilirken bir hata oluştu." });
        }
    }
    // 9. Hak İhlali Sonuçlandırma
    async concludeViolation(req, res) {
        try {
            const { id } = req.params;
            const { result } = req.body;
            const updatedViolation = await ViolationService_1.default.concludeViolation(id, result);
            res.status(200).json(updatedViolation);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali sonuçlandırılırken bir hata oluştu." });
        }
    }
    // 10. İstatistik ve Kategori İzleme
    async getStatistics(req, res) {
        try {
            const statistics = await ViolationService_1.default.getStatistics();
            res.status(200).json(statistics);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "İstatistikler alınırken bir hata oluştu." });
        }
    }
    // 11. Kaynak Entegrasyonu
    async integrateSource(req, res) {
        try {
            const { sourceType, sourceDetail } = req.body;
            const violations = await ViolationService_1.default.integrateSource(sourceType, sourceDetail);
            res.status(200).json(violations);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Kaynak entegrasyonu yapılırken bir hata oluştu." });
        }
    }
    // 12. Durum Takibi
    async getViolationsByStatus(req, res) {
        try {
            const { status } = req.query;
            const violations = await ViolationService_1.default.getViolationsByStatus(status);
            res.status(200).json(violations);
        }
        catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlalleri durum takibi yapılırken bir hata oluştu." });
        }
    }
}
exports.default = new ViolationController();
