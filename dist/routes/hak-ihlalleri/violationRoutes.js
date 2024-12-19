"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ViolationController_1 = __importDefault(require("../../controllers/hak-ihlalleri/ViolationController"));
const router = (0, express_1.Router)();
// Tüm hak ihlali bildirimlerini listele
router.get("/", ViolationController_1.default.getAllViolations);
// Yeni hak ihlali bildirimi oluştur
router.post("/", ViolationController_1.default.createViolation);
// Belirli bir hak ihlalini getir
router.get("/:id", ViolationController_1.default.getViolationById);
exports.default = router;
