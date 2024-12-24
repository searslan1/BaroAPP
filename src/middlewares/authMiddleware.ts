import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../models/auth/user";
import { JWT_SECRET } from "../config/env.config";

// Request arayüzüne kullanıcı ekleme
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole };
    }
  }
}

/**
 * JWT doğrulama middleware'i
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Yetkisiz erişim. Token bulunamadı." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string; role: UserRole };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ error: "Geçersiz kullanıcı." });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next(); // Token doğrulama başarılı, bir sonraki middleware'e geç
  } catch (error) {
    res.status(403).json({ error: "Token doğrulama başarısız." });
  }
};
/**
 * Role bazlı yetkilendirme middleware'i
 */
export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Yetkisiz erişim. Kullanıcı doğrulanmadı." });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
      return;
    }

    next(); // Yetkilendirme başarılı, bir sonraki middleware'e geç
  };
};

interface UserRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
const authMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Yetkilendirme token'ı eksik." });
    }

    const secretKey = process.env.JWT_SECRET || "defaultSecretKey"; // JWT Secret Key
    const decoded = jwt.verify(token, secretKey) as { id: string; role: UserRole };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // Başarılı doğrulama, sonraki middleware'e geç
  } catch (error) {
    res.status(401).json({ message: "Yetkilendirme başarısız." });
  }
};

export default authMiddleware;