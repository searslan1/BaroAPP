"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_URI = exports.PORT = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET;
if (!exports.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
exports.PORT = process.env.PORT || 5000;
exports.DB_URI = process.env.DB_URI;
console.log("DB_URI:", process.env.DB_URI);
