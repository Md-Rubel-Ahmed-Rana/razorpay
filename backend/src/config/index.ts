import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envConfig = {
  app: {
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
    env: process.env.NODE_ENV as "development" | "production",
    name: process.env.APP_NAME || "Express Modular App",
  },

  cors_origins: process.env.CORS_ORIGINS
    ? (process.env.CORS_ORIGINS as string).split(", ")
    : [],
  database: {
    mongodb_url: process.env.MONGODB_URL as string,
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET!,
  },
};
