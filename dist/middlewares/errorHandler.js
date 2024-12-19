"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Sunucu Hatası",
    });
};
exports.errorHandler = errorHandler;
