import User, { IUser, UserRole } from "../../models/auth/user";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Error } from "mongoose";

/**
 * Baro üyesi veya avukatı kaydetmek için referans numarası oluşturma
 */
export const createUserWithReference = async (
  role: UserRole,
  tcNumber: string,
  name: string,
  surname: string
): Promise<string> => {
  const referenceNumber = uuidv4(); // Benzersiz referans numarası
  const newUser = new User({
    tcNumber,
    name,
    surname,
    password: "temp_password", // Geçici şifre
    role,
    referenceNumber,
    isActive: false, // Tam kayıt yapılana kadar aktif değil
  });

  await newUser.save();
  return referenceNumber; // Baro yöneticisine referans numarası döndürülür
};

/**
 * TC Kimlik Numarası ve Referans Numarası ile giriş yapma
 */
export const loginWithReference = async (
  tcNumber: string,
  referenceNumber: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findOne({ tcNumber, referenceNumber });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı. TC Kimlik Numarası veya Referans Numarası yanlış.");
    }

    if (user.isActive) {
      throw new Error(
        "Bu kullanıcı zaten aktif durumda. Lütfen giriş yapmak için şifrenizi kullanın."
      );
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Beklenmeyen bir hata oluştu.");
    } else {
      throw new Error("Beklenmeyen bir hata oluştu.");
    }
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
  user.referenceNumber = undefined; // Referans numarası artık gereksiz
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

  return generateAccessToken({ id: user.id, role: user.role });
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
const seedBaroAdmin = async () => {
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
