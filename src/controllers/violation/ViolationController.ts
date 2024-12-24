import { Request, Response } from "express";
import ViolationService from "../../services/violation/ViolationService";

class ViolationController {
  // 1. Hak İhlali Ekleme
  async createViolation(req: Request, res: Response) {
    try {
      const data = req.body;
      const violation = await ViolationService.createViolation(data);
      res.status(201).json(violation);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali eklenirken bir hata oluştu." });
    }
  }

  // 2. Hak İhlali Güncelleme
  async updateViolation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedViolation = await ViolationService.updateViolation(id, updateData);
      res.status(200).json(updatedViolation);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali güncellenirken bir hata oluştu." });
    }
  }

  // 3. Hak İhlalleri Listesi
  async getViolations(req: Request, res: Response) {
    try {
      const filter = req.query;
      const violations = await ViolationService.getViolations(filter);
      res.status(200).json(violations);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlalleri listelenirken bir hata oluştu." });
    }
  }

  // 4. Hak İhlali Detayları
  async getViolationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const violation = await ViolationService.getViolationById(id);
      res.status(200).json(violation);
    } catch (err) {
      res.status(404).json({ message: err instanceof Error ? err.message : "Hak ihlali bulunamadı." });
    }
  }

  // 5. Hak İhlali Silme
  async deleteViolation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ViolationService.deleteViolation(id);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali silinirken bir hata oluştu." });
    }
  }

  // 6. Gelişme Ekleme/Güncelleme
  async updateDevelopments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { developments } = req.body;
      const updatedViolation = await ViolationService.updateDevelopments(id, developments);
      res.status(200).json(updatedViolation);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Gelişmeler güncellenirken bir hata oluştu." });
    }
  }

  // 7. Dosya Yükleme
  async uploadFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const file = req.file; // Multer kullanımı
      if (!file) throw new Error("Dosya yüklenmedi.");
      
      const updatedViolation = await ViolationService.uploadFile(id, file.buffer, file.originalname, file.mimetype);
      res.status(200).json(updatedViolation);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Dosya yüklenirken bir hata oluştu." });
    }
  }

  // 7.1. Dosya Silme
  async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fileName } = req.body;
      const updatedViolation = await ViolationService.deleteFile(id, fileName);
      res.status(200).json(updatedViolation);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Dosya silinirken bir hata oluştu." });
    }
  }

  // 8. Mesaj Gönderme
  async sendMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = req.body;
      const updatedViolation = await ViolationService.sendMessage(id, message);
      res.status(200).json(updatedViolation);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Mesaj gönderilirken bir hata oluştu." });
    }
  }

  // 9. Hak İhlali Sonuçlandırma
  async concludeViolation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { result } = req.body;
      const updatedViolation = await ViolationService.concludeViolation(id, result);
      res.status(200).json(updatedViolation);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlali sonuçlandırılırken bir hata oluştu." });
    }
  }

  // 10. İstatistik ve Kategori İzleme
  async getStatistics(req: Request, res: Response) {
    try {
      const statistics = await ViolationService.getStatistics();
      res.status(200).json(statistics);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "İstatistikler alınırken bir hata oluştu." });
    }
  }

  // 11. Kaynak Entegrasyonu
  async integrateSource(req: Request, res: Response) {
    try {
      const { sourceType, sourceDetail } = req.body;
      const violations = await ViolationService.integrateSource(sourceType, sourceDetail);
      res.status(200).json(violations);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Kaynak entegrasyonu yapılırken bir hata oluştu." });
    }
  }

  // 12. Durum Takibi
  async getViolationsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const violations = await ViolationService.getViolationsByStatus(status as string);
      res.status(200).json(violations);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Hak ihlalleri durum takibi yapılırken bir hata oluştu." });
    }
  }
}

export default new ViolationController();
