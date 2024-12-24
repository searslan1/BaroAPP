"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ViolationController_1 = __importDefault(require("../../controllers/violation/ViolationController"));
const accessControl_1 = __importDefault(require("../../middlewares/accessControl")); // Örnek yetkilendirme middleware
const fileUpload_1 = require("../../middlewares/fileUpload"); // Multer dosya yükleme middleware
const user_1 = require("../../models/auth/user");
const router = express_1.default.Router();
// 1. Hak İhlali Ekleme
router.post("/", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.createViolation);
// 2. Hak İhlali Güncelleme
router.put("/:id", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.updateViolation);
// 3. Hak İhlalleri Listesi
router.get("/", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), ViolationController_1.default.getViolations);
// 4. Hak İhlali Detayları
router.get("/:id", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), ViolationController_1.default.getViolationById);
// 5. Hak İhlali Silme
router.delete("/:id", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.deleteViolation);
// 6. Gelişme Ekleme/Güncelleme
router.put("/:id/developments", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.updateDevelopments);
// 7. Dosya Yükleme
router.post("/:id/files", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), fileUpload_1.uploadMiddleware, ViolationController_1.default.uploadFile);
// 7.1. Dosya Silme
router.delete("/:id/files", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.deleteFile);
// 8. Mesaj Gönderme
router.post("/:id/messages", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), ViolationController_1.default.sendMessage);
// 9. Hak İhlali Sonuçlandırma
router.put("/:id/conclude", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.concludeViolation);
// 10. İstatistik ve Kategori İzleme
router.get("/statistics", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.getStatistics);
// 11. Kaynak Entegrasyonu
router.post("/integrate", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.ADMIN]), ViolationController_1.default.integrateSource);
// 12. Durum Takibi
router.get("/status/:status", (0, accessControl_1.default)([user_1.UserRole.BARO_OFFICER, user_1.UserRole.LAWYER, user_1.UserRole.ADMIN]), ViolationController_1.default.getViolationsByStatus);
exports.default = router;
