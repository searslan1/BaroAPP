import User, { IUser, UserRole } from "../../models/auth/user";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

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
  const user = await User.findOne({ tcNumber, referenceNumber });

  if (!user || user.isActive) {
    throw new Error("Geçersiz referans numarası veya kullanıcı zaten aktif.");
  }

  // Token oluşturma
  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  // Refresh Token kaydetme
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
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

  // Şifre hashleme
  const hashedPassword = await bcrypt.hash(password, 10);

  user.email = email;
  user.phone = phone;
  user.password = hashedPassword;
  user.isActive = true;
  user.referenceNumber = undefined; // Referans numarası artık gereksiz
  await user.save();
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