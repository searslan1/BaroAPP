import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  createApplicationHandler,
  getApplicationsHandler,
  getApplicationByIdHandler,
  assignLawyerHandler,
  updateApplicationStatusHandler,
  addDocumentToApplicationHandler,
  deleteApplicationHandler,
} from "../../controllers/application/ApplicationController";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRole } from "../../models/auth/user";

const router = Router();

/**
 * Yeni başvuru oluşturma
 * Genel erişime açık (kimlik doğrulama yok)
 */
router.post("/create", asyncHandler(createApplicationHandler));

/**
 * Tüm başvuruları listeleme
 * Erişim: Baro Yöneticisi ve Baro Üyesi
 */
router.get(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.BARO_OFFICER]),
  asyncHandler(getApplicationsHandler)
);

/**
 * Tek bir başvuru bilgilerini getirme
 * Erişim: Baro Yöneticisi, Baro Üyesi ve Atanmış Avukat
 */
router.get(
  "/:applicationId",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.BARO_OFFICER, UserRole.LAWYER]),
  asyncHandler(getApplicationByIdHandler)
);

/**
 * Başvuruya avukat atama
 * Erişim: Baro Yöneticisi
 */
router.post(
  "/assign-lawyer",
  authenticate,
  authorize([UserRole.ADMIN]),
  asyncHandler(assignLawyerHandler)
);

/**
 * Başvuru durumunu güncelleme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.patch(
  "/update-status",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.LAWYER]),
  asyncHandler(updateApplicationStatusHandler)
);

/**
 * Başvuruya döküman ekleme
 * Erişim: Baro Yöneticisi ve Baro Üyesi
 */
router.post(
  "/add-document",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.BARO_OFFICER]),
  asyncHandler(addDocumentToApplicationHandler)
);

/**
 * Başvuru silme
 * Erişim: Baro Yöneticisi
 */
router.delete(
  "/:applicationId",
  authenticate,
  authorize([UserRole.ADMIN]),
  asyncHandler(deleteApplicationHandler)
);

export default router;
