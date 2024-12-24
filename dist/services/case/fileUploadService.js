"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCaseDocument = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const s3_1 = require("../../utils/s3");
const case_1 = __importDefault(require("../../models/case/case"));
/**
 * Davaya dosya yükler ve S3 bağlantısını kaydeder.
 */
const uploadCaseDocument = async (caseId, fileBuffer, fileName, mimeType) => {
    // caseId'nin geçerli bir ObjectId olup olmadığını kontrol edin
    if (!mongoose_1.default.Types.ObjectId.isValid(caseId)) {
        throw { status: 400, message: "Geçersiz caseId. Lütfen doğru bir ObjectId gönderin." };
    }
    const caseData = await case_1.default.findById(caseId);
    if (!caseData) {
        throw { status: 404, message: "Dava bulunamadı." };
    }
    // Dosyayı Amazon S3'e yükle
    const s3Url = await (0, s3_1.uploadFileToS3)(fileBuffer, fileName, mimeType);
    // Dosya bağlantısını davaya ekle
    caseData.documents.push({
        name: fileName,
        type: mimeType,
        date: new Date(), // date yerine uploadedAt yerine modelde belirttiğiniz tarihi ekledim
        pdfUrl: s3Url, // pdfUrl yerine genel url ismini kullandım
    });
    await caseData.save();
    return caseData;
};
exports.uploadCaseDocument = uploadCaseDocument;
