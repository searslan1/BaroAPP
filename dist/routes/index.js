"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
const caseRoutes_1 = __importDefault(require("./case/caseRoutes"));
const applicationRoutes_1 = __importDefault(require("./application/applicationRoutes"));
const violationRoutes_1 = __importDefault(require("./violation/violationRoutes"));
const fileRoutes_1 = __importDefault(require("./case/fileRoutes"));
const router = (0, express_1.Router)();
// Modüllerin rotaları
router.use("/auth", authRoutes_1.default);
router.use("/cases", caseRoutes_1.default);
router.use("/cases", fileRoutes_1.default);
router.use("/applications", applicationRoutes_1.default);
router.use("/violations", violationRoutes_1.default);
exports.default = router;
