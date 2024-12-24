"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fileUploadService_1 = require("../../services/case/fileUploadService");
/**
 * Davaya dosya yükleme kontrolcüsü
 */
const uploadFileHandler = async (req, res, next) => {
    try {
        const { caseId } = req.body;
        // `caseId` kontrolü
        if (!mongoose_1.default.Types.ObjectId.isValid(caseId)) {
            return res.status(400).json({ message: "Geçersiz caseId. Lütfen doğru bir ObjectId gönderin." });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Dosya yüklenmedi." });
        }
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const mimeType = req.file.mimetype;
        // Dosyayı yükleme ve kaydetme
        const updatedCase = await (0, fileUploadService_1.uploadCaseDocument)(caseId, fileBuffer, fileName, mimeType);
        res.status(200).json({
            message: "Dosya başarıyla yüklendi.",
            data: updatedCase,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFileHandler = uploadFileHandler;
