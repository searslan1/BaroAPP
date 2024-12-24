import express from "express";
import ViolationController from "../../controllers/violation/ViolationController";
import  accessControl from "../../middlewares/accessControl"; // Örnek yetkilendirme middleware
import { uploadMiddleware } from "../../middlewares/fileUpload"; // Multer dosya yükleme middleware
import { UserRole } from "../../models/auth/user";

const router = express.Router();

// 1. Hak İhlali Ekleme
router.post("/", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.createViolation);

// 2. Hak İhlali Güncelleme
router.put("/:id", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.updateViolation);

// 3. Hak İhlalleri Listesi
router.get("/", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), ViolationController.getViolations);

// 4. Hak İhlali Detayları
router.get("/:id", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), ViolationController.getViolationById);

// 5. Hak İhlali Silme
router.delete("/:id", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.deleteViolation);

// 6. Gelişme Ekleme/Güncelleme
router.put("/:id/developments", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.updateDevelopments);

// 7. Dosya Yükleme
router.post(
  "/:id/files",
  accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]),
  uploadMiddleware,
  ViolationController.uploadFile
);

// 7.1. Dosya Silme
router.delete("/:id/files", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.deleteFile);

// 8. Mesaj Gönderme
router.post("/:id/messages", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), ViolationController.sendMessage);

// 9. Hak İhlali Sonuçlandırma
router.put("/:id/conclude", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.concludeViolation);

// 10. İstatistik ve Kategori İzleme
router.get("/statistics", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.getStatistics);

// 11. Kaynak Entegrasyonu
router.post("/integrate", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), ViolationController.integrateSource);

// 12. Durum Takibi
router.get("/status/:status", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), ViolationController.getViolationsByStatus);

export default router;
