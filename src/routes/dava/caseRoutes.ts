import { Router } from "express";
import CaseController from "../../controllers/dava/CaseController";

const router = Router();

// Tüm davaları listele
router.get("/", CaseController.getAllCases);

// Yeni dava oluştur
router.post("/", CaseController.createCase);

// Belirli bir davayı getir
router.get("/:id", CaseController.getCaseById);

// Dava durumunu güncelle
router.patch("/:id/status", CaseController.updateCaseStatus);

// Davaya belge ekle
router.post("/:id/documents", CaseController.addDocumentToCase);

export default router;
