import User, { IUser, UserRole } from "../../models/auth/user";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Error } from "mongoose";



/**
 * TC Kimlik Numarası ve Referans Numarası ile giriş yapma
 */
export const loginWithPassword = async (
  tcNumber: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    // Kullanıcıyı TC Kimlik Numarası ile bul
    const user = await User.findOne({ tcNumber });

    if (!user) {
      throw { status: 404, message: "Kullanıcı bulunamadı. TC Kimlik Numarası yanlış." };
    }

    // Şifre doğrulama
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw { status: 401, message: "Hatalı şifre." };
    }

    // Kullanıcı aktif değilse tam kayıt işlemine yönlendirme

    // Token oluşturma
    const accessToken = generateAccessToken({ id: user.id, role: user.role, isActive: user.isActive });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Refresh Token'ı veritabanına kaydet
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error && "message" in error) {
      throw error; // Önceden belirlenmiş hata fırlat
    }

    // Fallback durumunda türü açıkça belirtin
    throw { status: 500, message: (error as Error).message || "Beklenmeyen bir hata oluştu." };
}

};


/**
 * Tam kayıt işlemi
 */
export const completeRegistration = async (
  tcNumber: string,
  email: string,
  phone: string,
  password: string
): Promise<void> => {
  const user = await User.findOne({ tcNumber });

  if (!user || user.isActive) {
    throw new Error("Kullanıcı bulunamadı veya zaten aktif.");
  }

  user.email = email;
  user.phone = phone;
  user.password = password; // Şifre düz metin olarak atanır
  user.isActive = true;
  await user.save(); // `pre("save")` middleware'i şifreyi hashler
};

/**
 * Access Token yenileme
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  const user = await User.findOne({ refreshToken });

  if (!user) {
    throw new Error("Geçersiz Refresh Token.");
  }

  return generateAccessToken({ id: user.id, role: user.role, isActive: user.isActive });
};
/**
 * Kullanıcı çıkışı (Logout)
 */
export const logout = async (userId: string): Promise<void> => {
    const user = await User.findById(userId);
  
    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }
  
    user.refreshToken = undefined; // Refresh Token'ı kaldır
    await user.save();
  };
  /**
 * Kullanıcıyı doğrula ve bilgilerini döndür
 */
export const verifyUser = async (userId: string) => {
  const user = await User.findById(userId).select("name surname role email");

  if (!user) {
    throw new Error("Kullanıcı bulunamadı.");
  }

  return {
    id: user.id,
    name: user.name,
    surname: user.surname,
    role: user.role,
    email: user.email,
  };
};
//ilk uygulama çalıştırıldığında yönetici oluşturmak için yazılmış geçici bir fonksiyon
export const seedBaroAdmin = async () => {
  const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
  if (!existingAdmin) {
    const admin = new User({
      tcNumber: "11111111111",
      name: "Baro",
      surname: "Yönetici",
      email: "admin@baro.com",
      password: "admin123",
      role: UserRole.ADMIN,
      isActive: true,
    });
    await admin.save();
    console.log("Baro yöneticisi başarıyla oluşturuldu.");
  } else {
    console.log("Baro yöneticisi zaten mevcut.");
  }
};

seedBaroAdmin();


