"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationService_1 = __importDefault(require("../../services/application/ApplicationService"));
class ApplicationController {
    // Başvuru Ekleme
    async createApplication(req, res) {
        try {
            const data = req.body;
            const application = await ApplicationService_1.default.createApplication(data);
            res.status(201).json(application);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            res.status(400).json({ message: error.message });
        }
    }
    // Başvuru Güncelleme
    async updateApplication(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedApplication = await ApplicationService_1.default.updateApplication(id, updateData);
            res.status(200).json(updatedApplication);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            res.status(400).json({ message: error.message });
        }
    }
    // Başvuru Listesi
    async getApplications(req, res) {
        try {
            const filter = req.query || {};
            const applications = await ApplicationService_1.default.getApplications(filter);
            res.status(200).json(applications);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            res.status(400).json({ message: error.message });
        }
    }
    // Başvuru Detayları
    async getApplicationById(req, res) {
        try {
            const { id } = req.params;
            const application = await ApplicationService_1.default.getApplicationById(id);
            res.status(200).json(application);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            res.status(404).json({ message: error.message });
        }
    }
    // Başvuru Silme
    async deleteApplication(req, res) {
        try {
            const { id } = req.params;
            await ApplicationService_1.default.deleteApplication(id);
            res.status(204).send(); // No content response
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            res.status(400).json({ message: error.message });
        }
    }
    // Avukat Atama
    async assignLawyer(req, res) {
        try {
            const { id } = req.params;
            const { lawyerId } = req.body;
            const updatedApplication = await ApplicationService_1.default.assignLawyer(id, lawyerId);
            res.status(200).json(updatedApplication);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
            res.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ApplicationController();
