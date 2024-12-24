"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const violationSchema = new mongoose_1.Schema({
    title: { type: String, required: true }, // Vaka başlığı
    applicant: {
        name: { type: String, required: true }, // Başvuranın adı
        contact: { type: String, required: true }, // İletişim bilgisi
    },
    category: { type: String, required: true }, // Kategori
    source: {
        type: { type: String, required: true }, // Kaynak türü (ör: medya, STK)
        detail: { type: String }, // Kaynak detayları (opsiyonel)
    },
    status: {
        type: String,
        required: true,
        enum: ["işlemde", "tamamlandı"], // Durum seçenekleri
    },
    applicationDate: { type: Date, required: true }, // Başvuru tarihi
    details: { type: String, required: true }, // Detaylar
    summary: { type: String }, // Özet
    legalRepresentative: { type: String }, // Hukuki temsilci
    reportingAgency: { type: String }, // Bildiren kurum
    sourceDetail: { type: String }, // Kaynağın detay bilgisi
    developments: [
        {
            date: { type: Date, required: true },
            description: { type: String, required: true },
        },
    ],
    files: [
        {
            name: { type: String, required: true },
            type: { type: String, required: true },
            date: { type: Date, required: true },
            url: { type: String, required: true }, // Dosyanın S3 bağlantısı
        },
    ],
    messages: [
        {
            sender: { type: String, required: true },
            message: { type: String, required: true },
            date: { type: Date, required: true },
        },
    ],
    result: { type: String }, // Sonuç
}, { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);
const Violation = (0, mongoose_1.model)("Violation", violationSchema);
exports.default = Violation;
