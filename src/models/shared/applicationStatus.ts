/**
 * Başvuru Durumları
 */
export enum ApplicationStatus {
    PENDING = "pending", // Beklemede
    LAWYER_ASSIGNED = "lawyer_assigned", // Avukat Atandı
    UNDER_REVIEW = "under_review", // İnceleniyor
    CASE_OPENED = "case_opened", // Dava Açıldı
  }
  