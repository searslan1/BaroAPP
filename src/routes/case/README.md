README: Dava Yönetim Modülü
Genel Bakış
Dava Yönetim Modülü, baro yöneticileri, avukatlar ve baro üyeleri tarafından davaların oluşturulması, yönetilmesi ve izlenmesi süreçlerini kolaylaştırır. Bu modül, dava bilgilerini, belgelerini ve duruşma takvimlerini yönetir. Aynı zamanda istatistiksel analiz ve raporlamalar için uygun altyapıyı sağlar.

Modül Özellikleri
Dava Yönetimi:
Dava oluşturma, listeleme, detayları görüntüleme ve durum güncelleme.
Belge Yönetimi:
Davalara belge ekleme ve belgeleri listeleme.
Duruşma Takvimi:
Yeni duruşma ekleme ve davaya ait duruşmaları listeleme.
İstatistiksel Veriler:
Dava süresi ve kategori bazlı analizler için yapılandırılmış veriler.
Veri Modelleri

1. Dava Modeli
   models/case.ts

typescript
Kodu kopyala
export interface ICase {
caseNumber: string; // Dava numarası (benzersiz)
title: string; // Dava başlığı
summary: string; // Dava özeti
plaintiff: { name: string; email: string; phone: string }; // Başvuran bilgileri
defendant?: string; // Karşı taraf bilgileri
category: Types.ObjectId; // Kategori referansı
status: CaseStatus; // Dava durumu
assignedLawyer: Types.ObjectId; // Atanmış avukat
openingDate: Date; // Açılış tarihi
hearings: Types.ObjectId[]; // Duruşma referansları
documents: ICaseDocument[]; // Belgeler
statistics: { durationInDays?: number; categoryAverage?: number }; // İstatistiksel veriler
createdAt: Date; // Oluşturulma tarihi
updatedAt: Date; // Güncellenme tarihi
} 2. Duruşma Modeli
models/hearing.ts

typescript
Kodu kopyala
export interface IHearing {
caseId: Types.ObjectId; // Dava referansı
date: Date; // Duruşma tarihi
description?: string; // Açıklama
status: string; // Örneğin "tamamlandı", "ertelendi"
} 3. Kategori Modeli
models/category.ts

typescript
Kodu kopyala
export interface ICategory {
name: string; // Kategori adı
description?: string; // Açıklama
averageResolutionTime?: number; // Ortalama çözüm süresi (gün)
}
API Endpoint’leri

1. Yeni Dava Oluşturma
   Endpoint: POST /cases/create
   Yetkilendirme: Baro Yöneticisi ve Avukat
   Request Body:
   json
   Kodu kopyala
   {
   "caseNumber": "CASE123",
   "title": "Bir Dava Başlığı",
   "summary": "Kısa bir özet",
   "plaintiff": {
   "name": "Ali Veli",
   "email": "ali.veli@example.com",
   "phone": "5551234567"
   },
   "category": "CATEGORY_ID",
   "assignedLawyer": "LAWYER_ID",
   "openingDate": "2023-12-18T10:00:00Z"
   }
   Response:
   json
   Kodu kopyala
   {
   "message": "Dava başarıyla oluşturuldu.",
   "data": {
   "caseNumber": "CASE123",
   "title": "Bir Dava Başlığı",
   "summary": "Kısa bir özet",
   ...
   }
   }
2. Tüm Davaları Listeleme
   Endpoint: GET /cases
   Yetkilendirme: Baro Yöneticisi ve Baro Üyesi
   Query Params (Opsiyonel):
   json
   Kodu kopyala
   {
   "status": "open"
   }
   Response:
   json
   Kodu kopyala
   {
   "message": "Davalar başarıyla listelendi.",
   "data": [
   {
   "caseNumber": "CASE123",
   "title": "Bir Dava Başlığı",
   "status": "open",
   ...
   }
   ]
   }
3. Tek Bir Davayı Getirme
   Endpoint: GET /cases/:caseId
   Yetkilendirme: Baro Yöneticisi, Baro Üyesi ve Atanmış Avukat
   Response:
   json
   Kodu kopyala
   {
   "message": "Dava başarıyla getirildi.",
   "data": {
   "caseNumber": "CASE123",
   "title": "Bir Dava Başlığı",
   "status": "open",
   ...
   }
   }
4. Dava Durumunu Güncelleme
   Endpoint: PATCH /cases/update-status
   Yetkilendirme: Baro Yöneticisi ve Atanmış Avukat
   Request Body:
   json
   Kodu kopyala
   {
   "caseId": "CASE_ID",
   "status": "closed"
   }
   Response:
   json
   Kodu kopyala
   {
   "message": "Dava durumu başarıyla güncellendi.",
   "data": {
   "caseNumber": "CASE123",
   "status": "closed",
   ...
   }
   }
5. Davaya Belge Ekleme
   Endpoint: POST /cases/add-document
   Yetkilendirme: Baro Yöneticisi ve Atanmış Avukat
   Request Body:
   json
   Kodu kopyala
   {
   "caseId": "CASE_ID",
   "document": {
   "name": "Belge Adı",
   "type": "dilekçe",
   "pdfUrl": "https://s3.amazonaws.com/bucket/belge.pdf"
   }
   }
   Response:
   json
   Kodu kopyala
   {
   "message": "Belge başarıyla eklendi.",
   "data": {
   ...
   }
   }
6. Davaya Ait Belgeleri Listeleme
   Endpoint: GET /cases/:caseId/documents
   Yetkilendirme: Baro Yöneticisi, Baro Üyesi ve Atanmış Avukat
   Response:
   json
   Kodu kopyala
   {
   "message": "Belgeler başarıyla listelendi.",
   "data": [
   {
   "name": "Belge Adı",
   "type": "dilekçe",
   "pdfUrl": "https://s3.amazonaws.com/bucket/belge.pdf",
   ...
   }
   ]
   }
7. Yeni Duruşma Ekleme
   Endpoint: POST /cases/add-hearing
   Yetkilendirme: Atanmış Avukat
   Request Body:
   json
   Kodu kopyala
   {
   "caseId": "CASE_ID",
   "hearingData": {
   "date": "2023-12-20T09:00:00Z",
   "description": "Duruşma açıklaması",
   "status": "planlandı"
   }
   }
   Response:
   json
   Kodu kopyala
   {
   "message": "Duruşma başarıyla eklendi.",
   "data": {
   ...
   }
   }
   Notlar
   Yetkilendirme:
   Rotalarda authenticate ve authorize middleware'leri ile kullanıcı rolleri kontrol edilmektedir.
   Belge Depolama:
   Belgeler, AWS S3 gibi bir depolama hizmetine yüklenmelidir.
   İstatistiksel Veriler:
   durationInDays ve categoryAverage alanları analiz ve raporlama için kullanılabilir.
