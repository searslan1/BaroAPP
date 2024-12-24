"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CaseService_1 = __importDefault(require("../../services/case/CaseService"));
class CaseController {
    // 1. Dava Ekleme
    async createCase(req, res) {
        try {
            const data = req.body;
            const newCase = await CaseService_1.default.createCase(data);
            res.status(201).json(newCase);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 2. Dava Güncelleme
    async updateCase(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedCase = await CaseService_1.default.updateCase(id, updateData);
            res.status(200).json(updatedCase);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 3. Tüm Davaları Listeleme
    async getAllCases(req, res) {
        try {
            const cases = await CaseService_1.default.getAllCases();
            res.status(200).json(cases);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 4. Avukat için Davaları Listeleme
    async getCasesForLawyer(req, res) {
        try {
            const lawyerId = req.user.id; // Middleware’den gelen avukat ID'si
            const cases = await CaseService_1.default.getCasesForLawyer(lawyerId);
            res.status(200).json(cases);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 5. Dava Detayları
    async getCaseById(req, res) {
        try {
            const { id } = req.params;
            const caseDetails = await CaseService_1.default.getCaseById(id);
            res.status(200).json(caseDetails);
        }
        catch (error) {
            res.status(404).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 6. Dava Silme
    async deleteCase(req, res) {
        try {
            const { id } = req.params;
            await CaseService_1.default.deleteCase(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 7. Duruşma Ekleme/Güncelleme
    async updateHearings(req, res) {
        try {
            const { id } = req.params;
            const { hearings } = req.body;
            const updatedCase = await CaseService_1.default.updateHearings(id, hearings);
            res.status(200).json(updatedCase);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 8. Mesaj Gönderme
    async sendMessage(req, res) {
        try {
            const { id } = req.params;
            const message = req.body;
            const updatedCase = await CaseService_1.default.sendMessage(id, message);
            res.status(200).json(updatedCase);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 9. Tarihçe Güncelleme
    async updateHistory(req, res) {
        try {
            const { id } = req.params;
            const { history } = req.body;
            const updatedCase = await CaseService_1.default.updateHistory(id, history);
            res.status(200).json(updatedCase);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
    // 10. Hak İhlali İlişkilendirme
    async associateRightsViolation(req, res) {
        try {
            const { id } = req.params;
            const { rightsViolation } = req.body;
            const updatedCase = await CaseService_1.default.associateRightsViolation(id, rightsViolation);
            res.status(200).json(updatedCase);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
        }
    }
}
exports.default = new CaseController();
