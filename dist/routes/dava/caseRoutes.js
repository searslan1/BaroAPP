"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CaseController_1 = __importDefault(require("../../controllers/dava/CaseController"));
const router = (0, express_1.Router)();
// Tüm davaları listele
router.get("/", CaseController_1.default.getAllCases);
// Yeni dava oluştur
router.post("/", CaseController_1.default.createCase);
// Belirli bir davayı getir
router.get("/:id", CaseController_1.default.getCaseById);
// Dava durumunu güncelle
router.patch("/:id/status", CaseController_1.default.updateCaseStatus);
// Davaya belge ekle
router.post("/:id/documents", CaseController_1.default.addDocumentToCase);
exports.default = router;
