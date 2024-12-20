# Baro Yönetim Sistemi - Authentication API

Baro Yönetim Sistemi'nde kimlik doğrulama işlemleri için kullanılan API endpoint'lerini açıklayan bir dokümandır. Bu sistem, baro yöneticileri, baro üyeleri ve avukatların kimlik doğrulama ve yetkilendirme işlemlerini kapsar.

---

## **Authentication İşlevleri**

### **1. Kullanıcı Oluşturma (Baro Yöneticisi Tarafından)**
Baro yöneticisi, yeni bir baro üyesi veya avukat oluşturur.

- **Endpoint**: `POST /auth/register`
- **Authorization**: Bearer Token (Admin yetkisi gereklidir)
- **Request Body**:
  ```json
  {
    "role": "baro_officer", // veya "lawyer"
    "tcNumber": "12345678901",
    "name": "Ahmet",
    "surname": "Kaya"
  }
Response:
json

{
  "message": "Kullanıcı başarıyla oluşturuldu.",
  "data": {
    "referenceNumber": "generated-reference-number"
  }
}
2. Kullanıcı Giriş Yapma (Referans Numarası ile)
Yeni kullanıcı, kendisine verilen TC ve referans numarasıyla giriş yapar.

Endpoint: POST /auth/login
Request Body:
json
{
  "tcNumber": "12345678901",
  "referenceNumber": "generated-reference-number"
}
Response:
json
{
  "message": "Giriş başarılı.",
  "data": {
    "accessToken": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
3. Tam Kayıt Yapma (Eksik Bilgilerle)
Kullanıcı giriş yaptıktan sonra eksik bilgilerini doldurarak tam kayıt işlemini tamamlar.

Endpoint: POST /auth/complete-registration
Request Body:
json
{
  "tcNumber": "12345678901",
  "email": "example@example.com",
  "phone": "5551234567",
  "password": "newpassword123"
}
Response:
json
{
  "message": "Kayıt başarıyla tamamlandı."
}
4. Kullanıcı Çıkışı (Logout)
Kullanıcı oturumdan çıkış yapar.

Endpoint: POST /auth/logout
Authorization: Bearer Token
Request Body:
json
{
  "userId": "USER_ID"
}
Response:
json
Kodu kopyala
{
  "message": "Başarıyla çıkış yapıldı."
}
5. Access Token Yenileme
Kullanıcı, Refresh Token kullanarak yeni bir Access Token alır.

Endpoint: POST /auth/refresh-token
Request Body:
json
{
  "refreshToken": "REFRESH_TOKEN"
}
Response:
json
{
  "message": "Access Token yenilendi.",
  "data": {
    "accessToken": "NEW_ACCESS_TOKEN"
  }
}
6. Kullanıcı Bilgilerini Doğrulama (Verify User)
Token doğrulaması yapılarak kullanıcı bilgileri alınır.

Endpoint: GET /auth/verifyUser
Authorization: Bearer Token
Response:
json
{
  "message": "Kullanıcı doğrulandı.",
  "data": {
    "id": "USER_ID",
    "name": "Ahmet",
    "surname": "Kaya",
    "role": "baro_officer"
  }
}
Hata Kodları
Kod	Açıklama
400	Eksik veya geçersiz parametre.
401	Yetkisiz erişim. Token bulunamadı veya geçersiz.
403	Bu işlem için yetkiniz yok.
500	Sunucu hatası.
Gelecekteki Geliştirmeler
OTP ile kullanıcı doğrulama.
Kullanıcı parola sıfırlama işlevi.
Çoklu dil desteği için hata mesajlarını özelleştirme.