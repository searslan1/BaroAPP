import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  createCaseHandler,
  getCasesHandler,
  getCaseByIdHandler,
  updateCaseStatusHandler,
  addDocumentToCaseHandler,
  getCaseDocumentsHandler,
  addHearingHandler,
  getHearingsHandler,
} from "../../controllers/case/CaseController";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRole } from "../../models/auth/user";

const router = Router();

/**
 * Yeni dava oluşturma
 * Erişim: Baro Yöneticisi ve Avukat
 */
router.post(
  "/create",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.LAWYER]),
  asyncHandler(createCaseHandler)
);

/**
 * Tüm davaları listeleme
 * Erişim: Baro Yöneticisi ve Baro Üyesi
 */
router.get(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.BARO_OFFICER]),
  asyncHandler(getCasesHandler)
);

/**
 * Tek bir dava bilgilerini getirme
 * Erişim: Baro Yöneticisi, Baro Üyesi ve Atanmış Avukat
 */
router.get(
  "/:caseId",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.BARO_OFFICER, UserRole.LAWYER]),
  asyncHandler(getCaseByIdHandler)
);

/**
 * Dava durumu güncelleme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.patch(
  "/update-status",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.LAWYER]),
  asyncHandler(updateCaseStatusHandler)
);

/**
 * Davaya belge ekleme
 * Erişim: Baro Yöneticisi ve Atanmış Avukat
 */
router.post(
  "/add-document",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.LAWYER]),
  asyncHandler(addDocumentToCaseHandler)
);

/**
 * Davaya ait belgeleri listeleme
 * Erişim: Baro Yöneticisi, Baro Üyesi ve Atanmış Avukat
 */
router.get(
  "/:caseId/documents",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.BARO_OFFICER, UserRole.LAWYER]),
  asyncHandler(getCaseDocumentsHandler)
);

/**
 * Yeni duruşma ekleme
 * Erişim: Atanmış Avukat
 */
router.post(
  "/add-hearing",
  authenticate,
  authorize([UserRole.LAWYER]),
  asyncHandler(addHearingHandler)
);

/**
 * Davaya ait duruşmaları listeleme
 * Erişim: Baro Yöneticisi, Baro Üyesi ve Atanmış Avukat
 */
router.get(
  "/:caseId/hearings",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.BARO_OFFICER, UserRole.LAWYER]),
  asyncHandler(getHearingsHandler)
);

export default router;
