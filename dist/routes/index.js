"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
const router = (0, express_1.Router)();
// Modüllerin rotaları
router.use("/auth", authRoutes_1.default);
//router.use("/cases", caseRoutes);
//router.use("/applications", applicationRoutes);
//router.use("/violations", violationRoutes);
exports.default = router;
