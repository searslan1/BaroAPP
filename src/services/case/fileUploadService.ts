import mongoose from "mongoose";
import { uploadFileToS3 } from "../../utils/s3";
import CaseModel from "../../models/case/case";

/**
 * Davaya dosya yükler ve S3 bağlantısını kaydeder.
 */
export const uploadCaseDocument = async (
  caseId: string,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) => {
  // caseId'nin geçerli bir ObjectId olup olmadığını kontrol edin
  if (!mongoose.Types.ObjectId.isValid(caseId)) {
    throw { status: 400, message: "Geçersiz caseId. Lütfen doğru bir ObjectId gönderin." };
  }

  const caseData = await CaseModel.findById(caseId);
  if (!caseData) {
    throw { status: 404, message: "Dava bulunamadı." };
  }

  // Dosyayı Amazon S3'e yükle
  const s3Url = await uploadFileToS3(fileBuffer, fileName, mimeType);

  // Dosya bağlantısını davaya ekle
  caseData.documents.push({
    name: fileName,
    type: mimeType,
    pdfUrl: s3Url,
    uploadedAt: new Date(),
  });

  await caseData.save();
  return caseData;
};
