import Application, { IApplication } from "../../models/application/application";
import { ApplicationStatus } from "../../models/shared/applicationStatus";
import User from "../../models/auth/user";
import mongoose, { FilterQuery } from "mongoose";

/**
 * Yeni başvuru oluşturma
 */
export const createApplication = async (data: Partial<IApplication>): Promise<IApplication> => {
  // Verilerin doğruluğunu kontrol edebilirsiniz (ör. kategori ve şehir kontrolü)
  if (!data.tcNumber || !data.name || !data.surname) {
    throw new Error("Gerekli başvuru alanları eksik.");
  }

  const application = new Application(data);
  return await application.save();
};

/**
 * Tüm başvuruları listeleme (Opsiyonel filtreleme ve sıralama)
 */
export const getApplications = async (
    filters: FilterQuery<IApplication> = {},
    sort: { [key: string]: 1 | -1 } = { createdAt: -1 }
  ): Promise<IApplication[]> => {
    return await Application.find(filters).sort(sort).populate("category city assignedLawyer documents");
  };

/**
 * Tek bir başvuru bilgilerini getirme
 */
export const getApplicationById = async (applicationId: string): Promise<IApplication | null> => {
  const objectId = new mongoose.Types.ObjectId(applicationId); // String'i ObjectId'ye çevir
  return await Application.findById(objectId).populate("category city assignedLawyer documents");
};

/**
 * Başvuruya avukat atama
 */
export const assignLawyer = async (applicationId: string, lawyerId: string): Promise<IApplication | null> => {
    // String ID'leri ObjectId'ye dönüştür
    const appId = new mongoose.Types.ObjectId(applicationId);
    const lawId = new mongoose.Types.ObjectId(lawyerId);
  
    const lawyer = await User.findById(lawId);
  
    if (!lawyer || lawyer.role !== "lawyer") {
      throw new Error("Geçersiz veya yetkisiz avukat ID'si.");
    }
  
    return await Application.findByIdAndUpdate(
      appId,
      { assignedLawyer: lawId, status: ApplicationStatus.LAWYER_ASSIGNED },
      { new: true }
    );
  };

/**
 * Başvuru durumunu güncelleme
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
): Promise<IApplication | null> => {
  if (!Object.values(ApplicationStatus).includes(status)) {
    throw new Error("Geçersiz başvuru durumu.");
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new Error("Başvuru bulunamadı.");
  }

  application.status = status;
  return await application.save();
};

/**
 * Başvuruya döküman ekleme
 */
export const addDocumentToApplication = async (
    applicationId: string,
    documentId: string
  ): Promise<IApplication | null> => {
    const appId = new mongoose.Types.ObjectId(applicationId); // ObjectId dönüştür
    const docId = new mongoose.Types.ObjectId(documentId);
  
    return await Application.findByIdAndUpdate(
      appId,
      { $push: { documents: docId } },
      { new: true }
    ).populate("documents");
  };

/**
 * Başvuru silme
 */
export const deleteApplication = async (applicationId: string): Promise<IApplication | null> => {
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new Error("Başvuru bulunamadı.");
  }

  return await Application.findByIdAndDelete(applicationId);
};
