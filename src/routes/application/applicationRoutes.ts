import { Router } from "express";
import ApplicationController from "../../controllers/application/ApplicationController";

const router = Router();

router.post("/", ApplicationController.createApplication); // Başvuru Ekleme
router.put("/:id", ApplicationController.updateApplication); // Başvuru Güncelleme
router.get("/", ApplicationController.getApplications); // Başvuru Listesi
router.get("/:id", ApplicationController.getApplicationById); // Başvuru Detayları
router.delete("/:id", ApplicationController.deleteApplication); // Başvuru Silme
router.put("/:id/assign-lawyer", ApplicationController.assignLawyer); // Avukat Atama

export default router;
