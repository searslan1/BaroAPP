import { Router } from "express";
import CaseController from "../../controllers/case/CaseController";
import accessControl from "../../middlewares/accessControl"; // Kullanıcı rolüne göre kontrol
import { UserRole } from "../../models/auth/user";

const router = Router();

// Baro Görevlileri için Tüm Davalar
router.get("/", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), CaseController.getAllCases);

// Avukatlar için Davalar
router.get("/lawyer", accessControl([UserRole.LAWYER ]), CaseController.getCasesForLawyer);

// Dava Ekleme
router.post("/", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), CaseController.createCase);

// Dava Güncelleme
router.put("/:id", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), CaseController.updateCase);

// Dava Detayları
router.get("/:id", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), CaseController.getCaseById);

// Dava Silme
router.delete("/:id", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), CaseController.deleteCase);

// Duruşma Güncelleme
router.put("/:id/hearings", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), CaseController.updateHearings);

// Mesaj Gönderme
router.post("/:id/messages", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), CaseController.sendMessage);

// Tarihçe Güncelleme
router.put("/:id/history", accessControl([UserRole.BARO_OFFICER, UserRole.LAWYER, UserRole.ADMIN]), CaseController.updateHistory);

// Hak İhlali İlişkilendirme
router.put("/:id/rights-violation", accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]), CaseController.associateRightsViolation);

export default router;
