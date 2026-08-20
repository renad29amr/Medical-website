import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI ?? "",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  jwtSecret: process.env.JWT_SECRET ?? process.env.JWT_SECRET_KEY ?? "",
  adminSetupKey: process.env.ADMIN_SETUP_KEY ?? "",
};

if (!env.mongoUri) throw new Error("MONGODB_URI is required");
