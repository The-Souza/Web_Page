import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// resolve __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// tenta detectar se está na pasta dist (build)
let envPath: string;

const distEnvPath = path.resolve(__dirname, "../../.env"); // caso esteja em backend/dist/utils
const devEnvPath = path.resolve(__dirname, "../.env"); // caso esteja em backend/utils

if (fs.existsSync(distEnvPath)) {
  envPath = distEnvPath;
} else if (fs.existsSync(devEnvPath)) {
  envPath = devEnvPath;
} else {
  throw new Error("Não foi possível encontrar o arquivo .env");
}

// carrega variáveis de ambiente
dotenv.config({ path: envPath });

// validação mínima
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not defined in .env");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in .env");
}

export { envPath };
