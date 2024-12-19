import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  completeUserRegistration,
  refreshToken,
  logoutUser,
} from "../../controllers/auth/AuthController";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRole } from "../../models/auth/user";

const router = Router();

/**
 * Baro üyesi veya avukat oluşturma (Baro yöneticisi tarafından)
 * Yetki: Sadece Admin (Baro Yöneticisi)
 */
router.post(
  "/register",
  authenticate,
  authorize([UserRole.ADMIN]),
  asyncHandler(registerUser)
);

/**
 * Kullanıcı giriş yapma (Referans numarası ile)
 */
router.post("/login", asyncHandler(loginUser));

/**
 * Eksik bilgileri doldurarak tam kayıt işlemi
 */
router.post("/complete-registration", asyncHandler(completeUserRegistration));

/**
 * Refresh Token ile Access Token yenileme
 */
router.post("/refresh-token", asyncHandler(refreshToken));

/**
 * Kullanıcı çıkışı (Logout)
 */
router.post("/logout", authenticate, asyncHandler(logoutUser));

export default router;
