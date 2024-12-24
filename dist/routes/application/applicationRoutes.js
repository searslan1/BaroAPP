"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApplicationController_1 = __importDefault(require("../../controllers/application/ApplicationController"));
const router = (0, express_1.Router)();
router.post("/", ApplicationController_1.default.createApplication); // Başvuru Ekleme
router.put("/:id", ApplicationController_1.default.updateApplication); // Başvuru Güncelleme
router.get("/", ApplicationController_1.default.getApplications); // Başvuru Listesi
router.get("/:id", ApplicationController_1.default.getApplicationById); // Başvuru Detayları
router.delete("/:id", ApplicationController_1.default.deleteApplication); // Başvuru Silme
router.put("/:id/assign-lawyer", ApplicationController_1.default.assignLawyer); // Avukat Atama
exports.default = router;
