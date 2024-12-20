import { Request, Response, NextFunction } from "express";
import {
  createUserWithReference,
  loginWithReference,
  completeRegistration,
  refreshAccessToken,
  logout,
  verifyUser as verifyUserService

} from "../../services/auth/AuthService";

/**
 * Baro üyesi veya avukat oluşturma
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { role, tcNumber, name, surname } = req.body;

  try {
    if (!role || !tcNumber || !name || !surname) {
      res.status(400).json({ error: "Tüm alanlar gereklidir." });
      return;
    }

    const referenceNumber = await createUserWithReference(role, tcNumber, name, surname);
    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu.",
      data: { referenceNumber },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Giriş yapma
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { tcNumber, referenceNumber } = req.body;
console.log(referenceNumber);
  try {
    if (!tcNumber || !referenceNumber) {
      res.status(400).json({ error: "TC ve Referans Numarası gereklidir." });
      return;
    }

    const tokens = await loginWithReference(tcNumber, referenceNumber);
    res.status(200).json({
      message: "Giriş başarılı.",
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tam kayıt işlemi
 */
export const completeUserRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tcNumber, email, phone, password } = req.body;

  try {
    if (!tcNumber || !email || !phone || !password) {
      res.status(400).json({ error: "Tüm alanlar gereklidir." });
      return;
    }

    await completeRegistration(tcNumber, email, phone, password);
    res.status(200).json({ message: "Kayıt başarıyla tamamlandı." });
  } catch (error) {
    next(error);
  }
};

/**
 * Access Token yenileme
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      res.status(400).json({ error: "Refresh Token gereklidir." });
      return;
    }

    const accessToken = await refreshAccessToken(refreshToken);
    res.status(200).json({
      message: "Access Token yenilendi.",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcı çıkışı
 */
export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.body;

  try {
    if (!userId) {
      res.status(400).json({ error: "Kullanıcı kimliği gereklidir." });
      return;
    }

    await logout(userId);
    res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
  } catch (error) {
    next(error);
  }
};
/**
 * Kullanıcı doğrulama kontrolcüsü
 */
export const verifyUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Yetkisiz erişim. Kullanıcı doğrulanamadı." });
      return;
    }

    const userInfo = await verifyUserService(req.user.id);
    res.status(200).json({
      message: "Kullanıcı doğrulandı.",
      data: userInfo,
    });
  } catch (error) {
    next(error);
  }
};