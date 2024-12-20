README: Application Management API
Genel Bakış
Application Management API, vatandaş başvurularını ve başvuru sürecindeki tüm aşamaları yönetmek için geliştirilmiştir. Bu API, başvuruların oluşturulmasından durum güncellemelerine, avukat atamadan döküman eklemeye kadar birçok işlevi destekler.

Bu doküman, API'nin işlevlerini, endpoint'lerini, gerekli parametrelerini ve örnek kullanımlarını açıklamaktadır.

Başvuru Süreci
Başvuru Oluşturma:

Vatandaş tarafından başlatılır.
Başvuruda TC numarası, ad, soyad, iletişim bilgileri, kategori, başlık ve detaylar gibi bilgiler sağlanır.
Başvuruları Listeleme ve Görüntüleme:

Baro yöneticileri ve üyeleri tüm başvuruları listeleyebilir.
Avukatlar yalnızca kendilerine atanmış başvuruları görebilir.
Avukat Atama:

Baro yöneticisi, başvuruya avukat atar ve başvuru durumu güncellenir.
Durum Güncelleme:

Atanmış avukat, başvuru durumunu güncelleyebilir.
Döküman Ekleme:

Baro yöneticisi veya üyeleri, başvuruya döküman ekleyebilir.
Başvuru Silme:

Baro yöneticisi bir başvuruyu silebilir.
Endpoint Listesi

1. Yeni Başvuru Oluşturma
   Endpoint: POST /api/application/create
   Authorization: Genel erişim (Authentication gerekmez)
   Body:

json
Kodu kopyala
{
"tcNumber": "12345678901",
"name": "Ali",
"surname": "Veli",
"phone": "5551234567",
"email": "ali.veli@example.com",
"address": "Adres bilgisi",
"category": "CATEGORY_ID",
"title": "Olay Başlığı",
"details": "Olay detayları"
}
Response:

json
Kodu kopyala
{
"message": "Başvuru başarıyla oluşturuldu.",
"data": {
"id": "APPLICATION_ID",
"status": "pending",
"createdAt": "2023-12-01T12:00:00.000Z",
"updatedAt": "2023-12-01T12:00:00.000Z"
}
} 2. Tüm Başvuruları Listeleme
Endpoint: GET /api/application
Authorization: Admin ve Baro Üyesi
Query Params (Opsiyonel):

json
Kodu kopyala
{
"status": "pending"
}
Response:

json
Kodu kopyala
{
"message": "Başvurular başarıyla listelendi.",
"data": [
{
"id": "APPLICATION_ID",
"tcNumber": "12345678901",
"title": "Olay Başlığı",
"status": "pending",
"createdAt": "2023-12-01T12:00:00.000Z"
}
]
} 3. Tek Bir Başvuruyu Görüntüleme
Endpoint: GET /api/application/:applicationId
Authorization: Admin, Baro Üyesi ve Avukat
Response:

json
Kodu kopyala
{
"message": "Başvuru başarıyla getirildi.",
"data": {
"id": "APPLICATION_ID",
"tcNumber": "12345678901",
"name": "Ali",
"surname": "Veli",
"status": "pending",
"category": "CATEGORY_ID",
"documents": [],
"assignedLawyer": null
}
} 4. Avukat Atama
Endpoint: POST /api/application/assign-lawyer
Authorization: Admin
Body:

json
Kodu kopyala
{
"applicationId": "APPLICATION_ID",
"lawyerId": "LAWYER_ID"
}
Response:

json
Kodu kopyala
{
"message": "Avukat başarıyla atandı.",
"data": {
"id": "APPLICATION_ID",
"status": "lawyer_assigned",
"assignedLawyer": "LAWYER_ID"
}
} 5. Durum Güncelleme
Endpoint: PATCH /api/application/update-status
Authorization: Admin ve Atanmış Avukat
Body:

json
Kodu kopyala
{
"applicationId": "APPLICATION_ID",
"status": "under_review"
}
Response:

json
Kodu kopyala
{
"message": "Başvuru durumu başarıyla güncellendi.",
"data": {
"id": "APPLICATION_ID",
"status": "under_review"
}
} 6. Döküman Ekleme
Endpoint: POST /api/application/add-document
Authorization: Admin ve Baro Üyesi
Body:

json
Kodu kopyala
{
"applicationId": "APPLICATION_ID",
"documentId": "DOCUMENT_ID"
}
Response:

json
Kodu kopyala
{
"message": "Döküman başarıyla eklendi.",
"data": {
"id": "APPLICATION_ID",
"documents": ["DOCUMENT_ID"]
}
} 7. Başvuru Silme
Endpoint: DELETE /api/application/:applicationId
Authorization: Admin
Response:

json
Kodu kopyala
{
"message": "Başvuru başarıyla silindi."
}
Hata Mesajları
400 Bad Request: Eksik veya geçersiz veri gönderimi.
401 Unauthorized: Kullanıcı kimliği doğrulanmadı.
403 Forbidden: Kullanıcının yetkisi yok.
404 Not Found: Aranan kaynak bulunamadı.
500 Internal Server Error: Sunucu tarafında beklenmeyen bir hata oluştu.
Öneriler
JWT Token: Tüm korumalı endpoint'lerde Bearer Token kullanımı gereklidir.
Rate Limiting: Özellikle create endpoint'inde kötüye kullanımı önlemek için rate-limiting önerilir.
Filter ve Sort: Listeleme endpoint'lerinde dinamik sorgu için filtreleme ve sıralama seçeneklerini etkin kullanın.
