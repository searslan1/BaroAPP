import { Router } from "express";
import { uploadFileHandler } from "../../controllers/case/FileUploadController";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
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
  authenticate,
  authorize([UserRole.ADMIN, UserRole.LAWYER]),
  upload.single("file"), // Tek dosya yükleme
  uploadFileHandler
);
/**
 * Davadan dosya silme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.delete(
    "/delete",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.LAWYER]),
    deleteFileHandler
  );
  router.post("/uploadd", upload.single("file"), uploadFileHandler);


export default router;
