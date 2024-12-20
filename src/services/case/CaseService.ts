import CaseModel, { ICase, CaseStatus, ICaseDocument } from "../../models/case/case";
import HearingModel, { IHearing } from "../../models/case/hearing";
import mongoose, { FilterQuery } from "mongoose";

/**
 * Yeni dava oluşturma
 */
export const createCase = async (data: Partial<ICase>): Promise<ICase> => {
    if (!data.caseNumber || !data.title || !data.plaintiff || !data.category || !data.assignedLawyer) {
      throw { status: 400, message: "Gerekli dava bilgileri eksik." };
    }
  
    const caseData = new CaseModel(data);
    return await caseData.save();
  };
  

/**
 * Tüm davaları listeleme
 */
export const getCases = async (
  filters: FilterQuery<ICase> = {},
  sort: { [key: string]: 1 | -1 } = { createdAt: -1 }
): Promise<ICase[]> => {
  return await CaseModel.find(filters)
    .sort(sort)
    .populate("category")
    .populate("assignedLawyer");
};

/**
 * Dava detaylarını getirme
 */
export const getCaseById = async (caseId: string): Promise<ICase | null> => {
  const objectId = new mongoose.Types.ObjectId(caseId);
  return await CaseModel.findById(objectId)
    .populate("category")
    .populate("assignedLawyer")
    .populate("hearings");
};

/**
 * Dava durumu güncelleme
 */
export const updateCaseStatus = async (caseId: string, status: CaseStatus): Promise<ICase | null> => {
    if (!Object.values(CaseStatus).includes(status)) {
      throw { status: 400, message: "Geçersiz dava durumu." };
    }
  
    const caseData = await CaseModel.findById(caseId);
    if (!caseData) {
      throw { status: 404, message: "Dava bulunamadı." };
    }
  
    caseData.status = status;
  
    // Dava kapandığında süre hesaplama
    if (status === CaseStatus.CLOSED) {
      const closingDate = new Date();
      caseData.statistics = {
        ...caseData.statistics,
        durationInDays: Math.ceil(
          (closingDate.getTime() - caseData.openingDate.getTime()) / (1000 * 3600 * 24)
        ),
      };
    }
  
    return await caseData.save();
  };
  

/**
 * Davaya belge ekleme
 */
export const addDocumentToCase = async (
    caseId: string,
    document: { name: string; type: string; pdfUrl: string }
  ): Promise<ICase | null> => {
    const caseData = await CaseModel.findById(caseId);
    if (!caseData) {
      throw { status: 404, message: "Dava bulunamadı." };
    }
  
    caseData.documents.push({ ...document, uploadedAt: new Date() });
    return await caseData.save();
  };

/**
 * Davaya ait tüm belgeleri listeleme
 */
export const getCaseDocuments = async (caseId: string): Promise<ICaseDocument[] | null> => {
  const caseData = await CaseModel.findById(caseId);
  if (!caseData) {
    throw new Error("Dava bulunamadı.");
  }

  return caseData.documents;
};

/**
 * Yeni duruşma ekleme
 */
export const addHearing = async (caseId: string, hearingData: Partial<IHearing>): Promise<IHearing> => {
    if (!hearingData.date || !hearingData.status) {
      throw { status: 400, message: "Gerekli duruşma bilgileri eksik." };
    }
  
    const hearing = new HearingModel({ ...hearingData, caseId });
    return await hearing.save();
  };

/**
 * Davaya ait duruşmaları listeleme
 */
export const getHearings = async (caseId: string): Promise<IHearing[]> => {
  return await HearingModel.find({ caseId }).sort({ date: 1 });
};
