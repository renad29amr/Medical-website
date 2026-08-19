import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: Number(process.env.PORT ?? 5000),
    mongoUri: process.env.MONGODB_URI ?? "",
    geminiApiKey: process.env.GEMINI_API_KEY ?? "",
    //   jwtSecret: process.env.JWT_SECRET ?? "",
    //   jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    //   clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
    //   adminEmail: process.env.ADMIN_EMAIL ?? "",
    //   adminPassword: process.env.ADMIN_PASSWORD ?? "",
    //   adminName: process.env.ADMIN_NAME ?? "System Admin"
};

if (!env.mongoUri) throw new Error("MONGODB_URI is required");
if (!env.geminiApiKey) throw new Error("GEMINI_API_KEY is required");

// if (!env.jwtSecret) throw new Error("JWT_SECRET is required");