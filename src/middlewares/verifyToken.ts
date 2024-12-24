import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/auth/user"; // UserRole enum'u doğru bir şekilde içe aktarılmalı

interface UserRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

const verifyToken = (req: UserRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
      res.status(401).json({ message: "Yetkilendirme tokeni eksik." });
      return;
    }

    const secretKey = process.env.JWT_SECRET || "your-secret-key"; // .env dosyasındaki secret key
    const decoded = jwt.verify(token, secretKey) as { id: string; role: UserRole };

    // Kullanıcı bilgilerini isteğe ekleyin
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token geçersiz veya süresi dolmuş." });
  }
};

export default verifyToken;
