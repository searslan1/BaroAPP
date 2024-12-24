import { Request, Response, NextFunction } from "express";
import { deleteCaseDocument } from "../../services/case/fileDeleteService";

/**
 * Davadan dosya silme kontrolcüsü
 */
export const deleteFileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { caseId, fileUrl } = req.body;

    if (!caseId || !fileUrl) {
      return res.status(400).json({ message: "Gerekli bilgiler eksik." });
    }

    const updatedCase = await deleteCaseDocument(caseId, fileUrl);

    res.status(200).json({
      message: "Dosya başarıyla silindi.",
      data: updatedCase,
    });
  } catch (error) {
    next(error instanceof Error ? error : new Error("Bilinmeyen bir hata oluştu."));
  }
};
