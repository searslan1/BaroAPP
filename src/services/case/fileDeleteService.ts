import { deleteFileFromS3 } from "../../utils/s3";
import CaseModel from "../../models/case/case";

/**
 * Davadan dosya siler ve S3 bağlantısını kaldırır.
 */
export const deleteCaseDocument = async (caseId: string, fileUrl: string) => {
  const caseData = await CaseModel.findById(caseId);
  if (!caseData) {
    throw { status: 404, message: "Dava bulunamadı." };
  }

  // Dosyayı dava belgelerinden bul
  const documentIndex = caseData.documents.findIndex((doc) => doc.pdfUrl === fileUrl);
  if (documentIndex === -1) {
    throw { status: 404, message: "Dosya dava belgelerinde bulunamadı." };
  }

  // S3'teki dosya anahtarını çıkar
  const fileKey = fileUrl.split(`${process.env.AWS_BUCKET_NAME}/`)[1];
  if (!fileKey) {
    throw { status: 400, message: "Geçersiz dosya bağlantısı." };
  }

  // Dosyayı S3'ten sil
  await deleteFileFromS3(fileKey);

  // Dosyayı veritabanından kaldır
  caseData.documents.splice(documentIndex, 1);
  await caseData.save();

  return caseData;
};
