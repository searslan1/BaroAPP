"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
/**
 * Rol bazlı yetkilendirme middleware'i
 * @param roles Yetki verilmiş roller
 */
const authorize = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Yetkisiz erişim." });
                return;
            }
            if (!roles.includes(req.user.role)) {
                res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: "Yetkilendirme kontrolü sırasında hata oluştu." });
        }
    };
};
exports.authorize = authorize;
