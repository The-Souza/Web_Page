import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// resolve __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/utils/env.ts → volta dois níveis → backend/.env
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

// validação mínima
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in backend/.env");
}

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not defined in backend/.env");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in backend/.env");
}
