"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../../middlewares/multer");
const router = (0, express_1.Router)();
/**
 * Davaya dosya yükleme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.post("/upload", multer_1.upload.single("file") // Tek dosya yükleme
);
/**
 * Davadan dosya silme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.delete("/delete");
exports.default = router;
