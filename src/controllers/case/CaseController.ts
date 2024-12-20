import { Request, Response, NextFunction } from "express";
import {
  createCase,
  getCases,
  getCaseById,
  updateCaseStatus,
  addDocumentToCase,
  getCaseDocuments,
  addHearing,
  getHearings,
} from "../../services/case/CaseService";
import { CaseStatus } from "../../models/case/case";

/**
 * Yeni dava oluşturma
 */
export const createCaseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { caseNumber, title, plaintiff, category, assignedLawyer } = req.body;
  
      // Girdi doğrulama
      if (!caseNumber || !title || !plaintiff || !category || !assignedLawyer) {
        res.status(400).json({ message: "Gerekli dava bilgileri eksik." });
        return;
      }
  
      const caseData = await createCase(req.body);
  
      res.status(201).json({
        message: "Dava başarıyla oluşturuldu.",
        data: caseData,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Tüm davaları listeleme
 */
export const getCasesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query;
  
      // Filtre doğrulama
      if (filters.status && !Object.values(CaseStatus).includes(filters.status as CaseStatus)) {
        res.status(400).json({ message: "Geçersiz dava durumu filtresi." });
        return;
      }
  
      const cases = await getCases(filters);
  
      res.status(200).json({
        message: "Davalar başarıyla listelendi.",
        data: cases,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Tek bir dava bilgilerini getirme
 */
export const getCaseByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { caseId } = req.params;
  
      if (!caseId) {
        res.status(400).json({ message: "Dava ID'si eksik." });
        return;
      }
  
      const caseData = await getCaseById(caseId);
  
      if (!caseData) {
        res.status(404).json({ message: "Dava bulunamadı.", data: null });
        return;
      }
  
      res.status(200).json({
        message: "Dava başarıyla getirildi.",
        data: caseData,
      });
    } catch (error) {
      next(error);
    }
  };
  

/**
 * Dava durumu güncelleme
 */
export const updateCaseStatusHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { caseId, status } = req.body;
  
      if (!caseId || !status) {
        res.status(400).json({ message: "Gerekli bilgiler eksik." });
        return;
      }
  
      if (!Object.values(CaseStatus).includes(status)) {
        res.status(400).json({ message: "Geçersiz dava durumu." });
        return;
      }
  
      const updatedCase = await updateCaseStatus(caseId, status);
  
      res.status(200).json({
        message: "Dava durumu başarıyla güncellendi.",
        data: updatedCase,
      });
    } catch (error) {
      next(error);
    }
  };
  

/**
 * Davaya belge ekleme
 */
export const addDocumentToCaseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { caseId, document } = req.body;
  
      if (!caseId || !document || !document.name || !document.type || !document.pdfUrl) {
        res.status(400).json({ message: "Gerekli belge bilgileri eksik." });
        return;
      }
  
      const updatedCase = await addDocumentToCase(caseId, document);
  
      res.status(200).json({
        message: "Belge başarıyla eklendi.",
        data: updatedCase,
      });
    } catch (error) {
      next(error);
    }
  };
  

/**
 * Davaya ait belgeleri listeleme
 */
export const getCaseDocumentsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { caseId } = req.params;
    const documents = await getCaseDocuments(caseId);

    res.status(200).json({
      message: "Belgeler başarıyla listelendi.",
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Yeni duruşma ekleme
 */
export const addHearingHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { caseId, hearingData } = req.body;
  
      if (!caseId || !hearingData || !hearingData.date || !hearingData.status) {
        res.status(400).json({ message: "Gerekli duruşma bilgileri eksik." });
        return;
      }
  
      const hearing = await addHearing(caseId, hearingData);
  
      res.status(201).json({
        message: "Duruşma başarıyla eklendi.",
        data: hearing,
      });
    } catch (error) {
      next(error);
    }
  };
  

/**
 * Davaya ait duruşmaları listeleme
 */
export const getHearingsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { caseId } = req.params;
    const hearings = await getHearings(caseId);

    res.status(200).json({
      message: "Duruşmalar başarıyla listelendi.",
      data: hearings,
    });
  } catch (error) {
    next(error);
  }
};
