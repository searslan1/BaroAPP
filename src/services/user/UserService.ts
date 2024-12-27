import LawyerDetails from "../../models/auth/lawyerDetails";
import User, { IUser, UserRole } from "../../models/auth/user";
import bcrypt from "bcrypt";
import { Error } from "mongoose";

/**
 * Avukatın tam kayıt işlemi
 */
export const completeLawyerRegistration = async (
    tcNumber: string,
    email: string,
    phone: string,
    specialization: string,
    barNumber: string
  ): Promise<void> => {
    try {
      const user = await User.findOne({ tcNumber, role: UserRole.LAWYER });
  
      if (!user || user.isActive) {
        throw new Error("Avukat bulunamadı veya zaten aktif.");
      }
  
      user.email = email;
      user.phone = phone;
      user.isActive = true;
      await user.save();
  
      const lawyerDetails = new LawyerDetails({
        userId: user._id,
        specialization,
        barNumber,
        activeCases: 0,
      });
  
      await lawyerDetails.save();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Hata oluştu: ${error.message}`);
    }
  };
  
  /**
   * Baro memuru için avukatları listeleme
   */
  export const listLawyers = async (): Promise<any[]> => {
    try {
      return await User.find({ role: UserRole.LAWYER }).populate("lawyerDetails");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Hata oluştu: ${error.message}`);
    }
  };




/**
 * Belirli role sahip kullanıcıları listele
 */
export const listUsersByRole = async (role: UserRole): Promise<any[]> => {
    try {
      return await User.find({ role });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Hata oluştu: ${error.message}`);
    }
  };
  /**
   * Admin için avukat ve baro memurlarını listeleme
   */
  export const listAdminViewUsers = async (): Promise<any[]> => {
    try {
      return await User.find({ role: { $in: [UserRole.LAWYER, UserRole.BARO_OFFICER] } });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
      throw new Error(`Hata oluştu: ${error.message}`);
    }
  };
  




/**
 * Rastgele şifre üretir.
 */
function generateRandomPassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  
  /**
   * Baro üyesi veya avukatı kaydetmek için password oluşturma
   */
  export const createUserWithPassword = async (
    role: UserRole,
    tcNumber: string,
  ): Promise<string> => {
    // Rastgele şifre oluştur
    const temporaryPassword = generateRandomPassword();
  
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
  
    // Kullanıcı oluştur
    const newUser = new User({
      tcNumber,
      password: hashedPassword,
      role,
      isActive: false, // Tam kayıt yapılana kadar aktif değil
    });
  
    await newUser.save();
  
    // Düz metin şifreyi döndür
    return temporaryPassword;
  };


/**
 * Kullanıcı Rolü Değiştirme
 */
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
  try {
    // Geçerli bir rol olup olmadığını kontrol et
    if (!Object.values(UserRole).includes(newRole)) {
      throw new Error("Geçersiz kullanıcı rolü.");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    user.role = newRole;
    await user.save();
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
    throw new Error(`Kullanıcı rolü güncellenirken hata: ${error.message}`);
  }
};

/**
 * Kullanıcı Silme
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu.");
    throw new Error(`Kullanıcı silinirken hata: ${error.message}`);
  }
};
