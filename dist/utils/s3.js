"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromS3 = exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// S3 istemcisi oluşturma
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
/**
 * Dosyayı Amazon S3'e yükler ve bağlantıyı döndürür.
 */
const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
    });
    await s3Client.send(command);
    // Yüklenen dosyanın URL'sini döndürün
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};
exports.uploadFileToS3 = uploadFileToS3;
/**
 * Amazon S3'teki dosyayı siler.
 */
const deleteFileFromS3 = async (fileKey) => {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    });
    await s3Client.send(command);
};
exports.deleteFileFromS3 = deleteFileFromS3;
