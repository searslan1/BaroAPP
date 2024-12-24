import { Request, Response } from "express";
import CaseService from "../../services/case/CaseService";

class CaseController {
  // 1. Dava Ekleme
  async createCase(req: Request, res: Response) {
    try {
      const data = req.body;
      const newCase = await CaseService.createCase(data);
      res.status(201).json(newCase);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 2. Dava Güncelleme
  async updateCase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedCase = await CaseService.updateCase(id, updateData);
      res.status(200).json(updatedCase);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 3. Tüm Davaları Listeleme
  async getAllCases(req: Request, res: Response) {
    try {
      const cases = await CaseService.getAllCases();
      res.status(200).json(cases);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

// 4. Avukat için Davaları Listeleme
async getCasesForLawyer(req: Request, res: Response) {
    try {
      const lawyerId = req.user!.id; // Middleware’den gelen avukat ID'si
      const cases = await CaseService.getCasesForLawyer(lawyerId);
      res.status(200).json(cases);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 5. Dava Detayları
  async getCaseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const caseDetails = await CaseService.getCaseById(id);
      res.status(200).json(caseDetails);
    } catch (error) {
      res.status(404).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 6. Dava Silme
  async deleteCase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await CaseService.deleteCase(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 7. Duruşma Ekleme/Güncelleme
  async updateHearings(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { hearings } = req.body;
      const updatedCase = await CaseService.updateHearings(id, hearings);
      res.status(200).json(updatedCase);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 8. Mesaj Gönderme
  async sendMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = req.body;
      const updatedCase = await CaseService.sendMessage(id, message);
      res.status(200).json(updatedCase);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 9. Tarihçe Güncelleme
  async updateHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { history } = req.body;
      const updatedCase = await CaseService.updateHistory(id, history);
      res.status(200).json(updatedCase);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }

  // 10. Hak İhlali İlişkilendirme
  async associateRightsViolation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rightsViolation } = req.body;
      const updatedCase = await CaseService.associateRightsViolation(id, rightsViolation);
      res.status(200).json(updatedCase);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu." });
    }
  }
}

export default new CaseController();
