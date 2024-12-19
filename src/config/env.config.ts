import dotenv from "dotenv";

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET ;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
export const PORT = process.env.PORT || 5000;
export const DB_URI = process.env.DB_URI as string;
console.log("DB_URI:", process.env.DB_URI);
