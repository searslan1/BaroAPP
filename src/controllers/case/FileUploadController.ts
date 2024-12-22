import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { uploadCaseDocument } from "../../services/case/fileUploadService";

/**
 * Davaya dosya yükleme kontrolcüsü
 */
export const uploadFileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { caseId } = req.body;

    // caseId'nin geçerli bir ObjectId olup olmadığını kontrol edin
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      res.status(400).json({ message: "Geçersiz caseId. Lütfen doğru bir ObjectId gönderin." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Dosya yüklenmedi." });
      return;
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const updatedCase = await uploadCaseDocument(caseId, fileBuffer, fileName, mimeType);

    res.status(200).json({
      message: "Dosya başarıyla yüklendi.",
      data: updatedCase,
    });
  } catch (error) {
    next(error);
  }
};
