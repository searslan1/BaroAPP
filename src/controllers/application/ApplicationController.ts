import { Request, Response, NextFunction } from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  assignLawyer,
  updateApplicationStatus,
  addDocumentToApplication,
  deleteApplication,
} from "../../services/application/ApplicationService";
import { ApplicationStatus } from "../../models/shared/applicationStatus";

/**
 * Yeni başvuru oluşturma
 */
export const createApplicationHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tcNumber, name, surname, phone, email, address, category, title, details } = req.body;

    if (!tcNumber || !name || !surname || !phone || !email || !address || !category || !title || !details) {
      res.status(400).json({
        error: "Gerekli alanlar eksik.",
        missingFields: [
          !tcNumber && "tcNumber",
          !name && "name",
          !surname && "surname",
          !phone && "phone",
          !email && "email",
          !address && "address",
          !category && "category",
          !title && "title",
          !details && "details",
        ].filter(Boolean),
      });
      return;
    }

    const application = await createApplication(req.body);

    res.status(201).json({
      message: "Başvuru başarıyla oluşturuldu.",
      data: application,
    });
  } catch (error) {
    if (error instanceof Error) {
      next({ status: 500, message: error.message });
    } else {
      next({ status: 500, message: "Bilinmeyen bir hata oluştu." });
    }
  }
};

/**
 * Tüm başvuruları listeleme
 */
export const getApplicationsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const applications = await getApplications(filters);
    res.status(200).json({
      message: "Başvurular başarıyla listelendi.",
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tek bir başvuru bilgilerini getirme
 */
export const getApplicationByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId } = req.params;
    const application = await getApplicationById(applicationId);
    if (!application) {
    res.status(404).json({ error: "Başvuru bulunamadı." });
    }
    res.status(200).json({
      message: "Başvuru başarıyla getirildi.",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Başvuruya avukat atama
 */
export const assignLawyerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId, lawyerId } = req.body;
    const updatedApplication = await assignLawyer(applicationId, lawyerId);
    if (!updatedApplication) {
      res.status(404).json({ error: "Başvuru bulunamadı." });
    }
      res.status(200).json({
      message: "Avukat başarıyla atandı.",
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Başvuru durumunu güncelleme
 */
export const updateApplicationStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId, status } = req.body;

    if (!Object.values(ApplicationStatus).includes(status)) {
      res.status(400).json({ error: "Geçersiz başvuru durumu." });
      return;
    }

    const updatedApplication = await updateApplicationStatus(applicationId, status);

    if (!updatedApplication) {
      res.status(404).json({ error: "Başvuru bulunamadı." });
      return;
    }

    res.status(200).json({
      message: "Başvuru durumu başarıyla güncellendi.",
      data: updatedApplication,
    });
  } catch (error) {
    if (error instanceof Error) {
      next({ status: 500, message: error.message });
    } else {
      next({ status: 500, message: "Bilinmeyen bir hata oluştu." });
    }
  }
};


/**
 * Başvuruya döküman ekleme
 */
export const addDocumentToApplicationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId, documentId } = req.body;
    const updatedApplication = await addDocumentToApplication(applicationId, documentId);
    if (!updatedApplication) {
       res.status(404).json({ error: "Başvuru bulunamadı." });
    }
     res.status(200).json({
      message: "Döküman başarıyla eklendi.",
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Başvuru silme
 */
export const deleteApplicationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId } = req.params;
    const deletedApplication = await deleteApplication(applicationId);
    if (!deletedApplication) {
       res.status(404).json({ error: "Başvuru bulunamadı." });
    }
     res.status(200).json({
      message: "Başvuru başarıyla silindi.",
    });
  } catch (error) {
    next(error);
  }
};
