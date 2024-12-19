import { Router } from "express";
import ViolationController from "../../controllers/hak-ihlalleri/ViolationController";

const router = Router();

// Tüm hak ihlali bildirimlerini listele
router.get("/", ViolationController.getAllViolations);

// Yeni hak ihlali bildirimi oluştur
router.post("/", ViolationController.createViolation);

// Belirli bir hak ihlalini getir
router.get("/:id", ViolationController.getViolationById);

export default router;
