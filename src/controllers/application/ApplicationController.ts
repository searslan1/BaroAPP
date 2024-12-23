import { Request, Response } from "express";
import ApplicationService from "../../services/application/ApplicationService";

class ApplicationController {
  // Başvuru Ekleme
  async createApplication(req: Request, res: Response) {
    try {
      const data = req.body;
      const application = await ApplicationService.createApplication(data);
      res.status(201).json(application);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      res.status(400).json({ message: error.message });
    }
  }

  // Başvuru Güncelleme
  async updateApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedApplication = await ApplicationService.updateApplication(id, updateData);
      res.status(200).json(updatedApplication);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      res.status(400).json({ message: error.message });
    }
  }

  // Başvuru Listesi
  async getApplications(req: Request, res: Response) {
    try {
      const filter = req.query || {};
      const applications = await ApplicationService.getApplications(filter);
      res.status(200).json(applications);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      res.status(400).json({ message: error.message });
    }
  }

  // Başvuru Detayları
  async getApplicationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const application = await ApplicationService.getApplicationById(id);
      res.status(200).json(application);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      res.status(404).json({ message: error.message });
    }
  }

  // Başvuru Silme
  async deleteApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ApplicationService.deleteApplication(id);
      res.status(204).send(); // No content response
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      res.status(400).json({ message: error.message });
    }
  }

  // Avukat Atama
  async assignLawyer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { lawyerId } = req.body;
      const updatedApplication = await ApplicationService.assignLawyer(id, lawyerId);
      res.status(200).json(updatedApplication);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ApplicationController();
