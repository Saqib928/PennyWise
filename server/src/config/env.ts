export const ENV = {
  PORT: process.env.PORT || "5000",
  MONGO_URL: process.env.MONGO_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  CLIENT_URL: process.env.CLIENT_URL!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
};
