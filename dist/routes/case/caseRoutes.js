"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CaseController_1 = __importDefault(require("../../controllers/case/CaseController"));
const accessControl_1 = __importDefault(require("../../middlewares/accessControl")); // Kullanıcı rolüne göre kontrol
const user_1 = require("../../models/auth/user");
const router = (0, express_1.Router)();
// Baro Görevlileri için Tüm Davalar
router.get("/", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), CaseController_1.default.getAllCases);
// Avukatlar için Davalar
router.get("/lawyer", (0, accessControl_1.default)([user_1.UserRole.LAWYER]), CaseController_1.default.getCasesForLawyer);
// Dava Ekleme
router.post("/", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN, user_1.UserRole.LAWYER]), CaseController_1.default.createCase);
// Dava Güncelleme
router.put("/:id", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), CaseController_1.default.updateCase);
// Dava Detayları
router.get("/:id", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), CaseController_1.default.getCaseById);
// Dava Silme
router.delete("/:id", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), CaseController_1.default.deleteCase);
// Duruşma Güncelleme
router.put("/:id/hearings", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), CaseController_1.default.updateHearings);
// Mesaj Gönderme
router.post("/:id/messages", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), CaseController_1.default.sendMessage);
// Tarihçe Güncelleme
router.put("/:id/history", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), CaseController_1.default.updateHistory);
// Hak İhlali İlişkilendirme
router.put("/:id/rights-violation", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), CaseController_1.default.associateRightsViolation);
exports.default = router;
