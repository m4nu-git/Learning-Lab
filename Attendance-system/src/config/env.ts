export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET ?? "fallback_secret",
  PORT: Number(process.env.PORT) || 3000,
};