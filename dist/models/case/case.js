"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const caseSchema = new mongoose_1.Schema({
    caseNumber: { type: String, required: true, unique: true }, // Unik dava numarası
    title: { type: String, required: true },
    summary: { type: String, required: true },
    applicant: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    opponent: {
        name: { type: String, required: true },
        lawyer: { type: String },
    },
    lawyer: { type: String, required: true },
    // lawyer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User modeline referans
    status: {
        type: String,
        required: true,
        enum: ["aktif", "beklemede", "tamamlandı"],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    category: { type: String, required: true }, // Ceza, Medeni, İş vb.
    hearings: [
        {
            date: { type: Date, required: true },
            time: { type: String, required: true },
            description: { type: String, required: true },
        },
    ],
    documents: [
        {
            name: { type: String, required: false },
            type: { type: String, required: true },
            date: { type: Date, required: true },
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
    result: { type: String },
    closingNotes: { type: String },
}, { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);
const Case = (0, mongoose_1.model)("Case", caseSchema);
exports.default = Case;
