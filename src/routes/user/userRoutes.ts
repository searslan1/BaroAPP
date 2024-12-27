import { Router } from "express";
import asyncHandler from "express-async-handler";
import UserController from "../../controllers/user/UserController";
import { authenticate, authorize } from "../../middlewares/authMiddleware";
import { UserRole } from "../../models/auth/user";
import accessControl from "../../middlewares/accessControl";

const router = Router();

/**
 * Avukatın tam kayıt işlemi
 * Yetki: Giriş yapılmış olmalı
 */
router.post(
  "/lawyers/complete-registration",
  accessControl([UserRole.ADMIN]),
  asyncHandler(UserController.completeLawyerRegistration)
);

/**
 * Baro memuru için avukatları listeleme
 * Yetki: Giriş yapılmış olmalı
 */
router.get(
  "/lawyers",
  accessControl([UserRole.BARO_OFFICER, UserRole.ADMIN]),
  asyncHandler(UserController.listLawyers)
);

/**
 * Belirli role sahip kullanıcıları listeleme
 * Yetki: Admin
 */
router.get(
  "/users",
  accessControl([UserRole.ADMIN]),
  asyncHandler(UserController.listUsersByRole)
);

/**
 * Admin için avukat ve baro memurlarını listeleme
 * Yetki: Admin
 */
router.get(
  "/admin-view-users",
  accessControl([UserRole.ADMIN]),
  asyncHandler(UserController.listAdminViewUsers)
);

/**
 * Kullanıcı kaydı ve şifre oluşturma (Baro yöneticisi tarafından)
 * Yetki: Sadece Admin (Baro Yöneticisi)
 */
router.post(
  "/",
  accessControl([UserRole.ADMIN]),
  asyncHandler(UserController.createUserWithPassword)
);

/**
 * Kullanıcı güncelleme
 * Yetki: Sadece Admin
 */
router.put(
  "/users/:id",
  accessControl([UserRole.ADMIN]),
  asyncHandler(UserController.updateUserRole)
);

/**
 * Kullanıcı silme
 * Yetki: Sadece Admin
 */
router.delete(
  "/users/:id",
  accessControl([UserRole.ADMIN]),
  asyncHandler(UserController.deleteUser)
);

export default router;
