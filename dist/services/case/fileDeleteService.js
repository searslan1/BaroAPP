"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCaseDocument = void 0;
const s3_1 = require("../../utils/s3");
const case_1 = __importDefault(require("../../models/case/case"));
/**
 * Davadan dosya siler ve S3 bağlantısını kaldırır.
 */
const deleteCaseDocument = async (caseId, fileUrl) => {
    const caseData = await case_1.default.findById(caseId);
    if (!caseData) {
        throw new Error("Dava bulunamadı.");
    }
    // Dosyayı dava belgelerinden bul
    const documentIndex = caseData.documents.findIndex((doc) => doc.pdfUrl === fileUrl);
    if (documentIndex === -1) {
        throw new Error("Dosya dava belgelerinde bulunamadı.");
    }
    // S3'teki dosya anahtarını çıkar
    let fileKey;
    try {
        fileKey = new URL(fileUrl).pathname.split(`${process.env.AWS_BUCKET_NAME}/`)[1];
    }
    catch {
        throw new Error("Geçersiz dosya bağlantısı.");
    }
    if (!fileKey) {
        throw new Error("Geçersiz dosya bağlantısı.");
    }
    // Dosyayı S3'ten sil
    await (0, s3_1.deleteFileFromS3)(fileKey);
    // Dosyayı veritabanından kaldır
    caseData.documents.splice(documentIndex, 1);
    await caseData.save();
    return caseData;
};
exports.deleteCaseDocument = deleteCaseDocument;
