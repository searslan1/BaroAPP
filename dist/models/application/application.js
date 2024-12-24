"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    applicantName: { type: String, required: true },
    contactDetails: {
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    eventTitle: { type: String, required: true },
    eventCategory: {
        type: String,
        required: true,
        enum: [
            "isHukuku",
            "egitimHakki",
            "ifadeOzgurlugu",
            "kadinaKarsiSiddet",
            "cocukHaklari",
            "insanHaklari",
            "cezaHukuku",
            "sosyalGuvenlik",
            "trafikKazasi",
            "bosanmaDavasi",
            "mirasHukuku",
            "tuketiciHaklari"
        ],
    },
    status: {
        type: String,
        default: "beklemede",
        required: true,
        enum: ["işlemde", "beklemede", "tamamlandı"],
    },
    date: { type: Date, required: true },
    assignedLawyer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    documents: [
        {
            name: { type: String, required: true },
            type: { type: String, required: true },
            date: { type: Date, required: true },
            url: { type: String }, // Opsiyonel URL
        },
    ],
    messages: [
        {
            sender: { type: String, required: true },
            message: { type: String, required: true },
            date: { type: Date, required: true },
        },
    ],
    history: [
        {
            date: { type: Date, required: true },
            action: { type: String, required: true },
            description: { type: String, required: true },
        },
    ],
    priority: {
        type: String,
        required: true,
        default: "orta",
        enum: ["yüksek", "orta", "düşük"],
    },
    relatedCases: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Case" }], // Opsiyonel ilişkili davalar
}, { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);
const Application = (0, mongoose_1.model)("Application", applicationSchema);
exports.default = Application;
