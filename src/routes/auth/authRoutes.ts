import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  completeUserRegistration,
  refreshToken,
  logoutUser,
  verifyUserHandler
} from "../../controllers/auth/AuthController";
import { authenticate, authorize } from "../../middlewares/authMiddleware";
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
router.post("/refresh", asyncHandler(refreshToken));

/**
 * Kullanıcı çıkışı (Logout)
 */
router.post("/logout", authenticate, asyncHandler(logoutUser));

/**
 * Kullanıcı doğrulama (Profil bilgileri döndürme)
 * Yetki: Giriş yapılmış olmalı
 */
router.get("/verify-user", authenticate, asyncHandler(verifyUserHandler));

export default router;
