"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileHandler = void 0;
const fileDeleteService_1 = require("../../services/case/fileDeleteService");
/**
 * Davadan dosya silme kontrolcüsü
 */
const deleteFileHandler = async (req, res, next) => {
    try {
        const { caseId, fileUrl } = req.body;
        if (!caseId || !fileUrl) {
            return res.status(400).json({ message: "Gerekli bilgiler eksik." });
        }
        const updatedCase = await (0, fileDeleteService_1.deleteCaseDocument)(caseId, fileUrl);
        res.status(200).json({
            message: "Dosya başarıyla silindi.",
            data: updatedCase,
        });
    }
    catch (error) {
        next(error instanceof Error ? error : new Error("Bilinmeyen bir hata oluştu."));
    }
};
exports.deleteFileHandler = deleteFileHandler;
