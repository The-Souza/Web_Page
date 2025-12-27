import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🚫 só carrega .env fora da Vercel
if (!process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  dotenv.config({
    path: path.resolve(__dirname, "../.env"),
  });
}

// validação (vale para ambos)
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not defined");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
}
