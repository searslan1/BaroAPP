import { deleteFileFromS3 } from "../../utils/s3";
import CaseModel from "../../models/case/case";

/**
 * Davadan dosya siler ve S3 bağlantısını kaldırır.
 */
export const deleteCaseDocument = async (caseId: string, fileUrl: string) => {
  const caseData = await CaseModel.findById(caseId);
  if (!caseData) {
    throw new Error("Dava bulunamadı.");
  }

  // Dosyayı dava belgelerinden bul
  const documentIndex = caseData.documents.findIndex((doc) => doc.pdfUrl === fileUrl);
  if (documentIndex === -1) {
    throw new Error("Dosya dava belgelerinde bulunamadı.");
  }

  // S3'teki dosya anahtarını çıkar
  let fileKey;
  try {
    fileKey = new URL(fileUrl).pathname.split(`${process.env.AWS_BUCKET_NAME}/`)[1];
  } catch {
    throw new Error("Geçersiz dosya bağlantısı.");
  }

  if (!fileKey) {
    throw new Error("Geçersiz dosya bağlantısı.");
  }

  // Dosyayı S3'ten sil
  await deleteFileFromS3(fileKey);

  // Dosyayı veritabanından kaldır
  caseData.documents.splice(documentIndex, 1);
  await caseData.save();

  return caseData;
};
