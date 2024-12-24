import { Router } from "express";
import { uploadFileHandler } from "../../controllers/case/FileUploadController";
import { authenticate, authorize } from "../../middlewares/authMiddleware";
import { upload } from "../../middlewares/multer";
import { UserRole } from "../../models/auth/user";
import { deleteFileHandler } from "../../controllers/case/FileDeleteController";

const router = Router();

/**
 * Davaya dosya yükleme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.post(
  "/upload",

  upload.single("file") // Tek dosya yükleme
  
);
/**
 * Davadan dosya silme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.delete(
    "/delete"
  );


export default router;
