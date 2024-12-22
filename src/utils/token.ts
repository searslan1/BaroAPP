import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config";

/**
 * Access Token oluşturma
 */
export const generateAccessToken = (user: { id: string; role: string , isActive: boolean}): string => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      isActive: user.isActive,
    },
    JWT_SECRET as string, // `undefined` olamayacağı garanti ediliyor
    { expiresIn: "1m" } // Access Token geçerlilik süresi: 15 dakika
  );
};

/**
 * Refresh Token oluşturma
 */
export const generateRefreshToken = (user: { id: string }): string => {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET as string, // `undefined` olamayacağı garanti ediliyor
    { expiresIn: "7d" } // Refresh Token geçerlilik süresi: 7 gün
  );
};
