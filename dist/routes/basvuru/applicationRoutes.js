"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApplicationController_1 = __importDefault(require("../../controllers/basvuru/ApplicationController"));
const router = (0, express_1.Router)();
// Tüm başvuruları listele
router.get("/", ApplicationController_1.default.getAllApplications);
// Yeni başvuru oluştur
router.post("/", ApplicationController_1.default.createApplication);
// Belirli bir başvurunun durumunu güncelle
router.patch("/:id/status", ApplicationController_1.default.updateApplicationStatus);
exports.default = router;
