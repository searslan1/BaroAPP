import { Request, Response, NextFunction } from "express";
import {
  completeLawyerRegistration,
  listLawyers,
  listUsersByRole,
  listAdminViewUsers,
  createUserWithPassword,
  updateUserRole,
  deleteUser,
} from "../../services/user/UserService";
import { UserRole } from "../../models/auth/user";

/**
 * Kullanıcı Kontrolcüsü
 */
class UserController {
  // Avukatın tam kayıt işlemi
  async completeLawyerRegistration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tcNumber, email, phone, specialization, barNumber } = req.body;
      await completeLawyerRegistration(tcNumber, email, phone, specialization, barNumber);
      res.status(200).json({ message: "Avukat tam kayıt işlemi başarılı." });
    } catch (error) {
      next(error); // Hataları `next` ile merkezi hata yönetimine ilet
    }
  }

  // Baro memuru için avukatları listeleme
  async listLawyers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lawyers = await listLawyers();
      res.status(200).json(lawyers);
    } catch (error) {
      next(error);
    }
  }

  // Belirli role sahip kullanıcıları listeleme
  async listUsersByRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = req.query;
      if (!role) {
        res.status(400).json({ message: "Rol bilgisi gerekli." });
        return;
      }
      const users = await listUsersByRole(role as UserRole);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // Admin için avukat ve baro memurlarını listeleme
  async listAdminViewUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await listAdminViewUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // Kullanıcı kaydı ve şifre oluşturma
  async createUserWithPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("sssssssssssssssssssssssss",req.body);

    try {
      const { role, tcNumber } = req.body;
      if (!role || !tcNumber) {
        res.status(400).json({ message: "Rol ve TC Kimlik Numarası gerekli." });
        return;
      }

      const password = await createUserWithPassword(role as UserRole, tcNumber);
      res.status(201).json({ message: "Kullanıcı oluşturuldu.", password });
    } catch (error) {
      next(error);
    }
  }

  // Kullanıcı Rolü Değiştirme
  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, newRole } = req.body; // Kullanıcı ID ve yeni rol JSON formatında bekleniyor

      if (!id || !newRole) {
        res.status(400).json({ message: "Kullanıcı ID ve yeni rol bilgisi gerekli." });
        return;
      }

      await updateUserRole(id, newRole);
      res.status(200).json({ message: "Kullanıcı rolü başarıyla güncellendi." });
    } catch (error) {
      next(error); // Merkezi hata yönetimine ilet
    }
  }

  // Kullanıcı Silme
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.body; // Kullanıcı ID'si JSON formatında bekleniyor

      if (!id) {
        res.status(400).json({ message: "Kullanıcı ID bilgisi gerekli." });
        return;
      }

      await deleteUser(id);
      res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
    } catch (error) {
      next(error); // Merkezi hata yönetimine ilet
    }
  }
}

export default new UserController();
