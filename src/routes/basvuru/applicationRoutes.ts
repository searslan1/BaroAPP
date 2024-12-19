import { Router } from "express";
import ApplicationController from "../../controllers/basvuru/ApplicationController";

const router = Router();

// Tüm başvuruları listele
router.get("/", ApplicationController.getAllApplications);

// Yeni başvuru oluştur
router.post("/", ApplicationController.createApplication);

// Belirli bir başvurunun durumunu güncelle
router.patch("/:id/status", ApplicationController.updateApplicationStatus);

export default router;
