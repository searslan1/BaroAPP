"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lawyerDetailsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    barNumber: { type: String, required: true },
    activeCases: { type: Number, default: 0 },
}, { timestamps: true } // createdAt ve updatedAt ekler
);
const LawyerDetails = (0, mongoose_1.model)("LawyerDetails", lawyerDetailsSchema);
exports.default = LawyerDetails;
