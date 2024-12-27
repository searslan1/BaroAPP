import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  loginUser,
  refreshToken,
  logoutUser,
  verifyUserHandler
} from "../../controllers/auth/AuthController";
import { authenticate, authorize } from "../../middlewares/authMiddleware";
import { UserRole } from "../../models/auth/user";

const router = Router();


/**
 * Kullanıcı giriş yapma (Referans numarası ile)
 */
router.post("/login", asyncHandler(loginUser));

/**
 * Eksik bilgileri doldurarak tam kayıt işlemi
 */

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
