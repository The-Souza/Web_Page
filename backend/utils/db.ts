import sql from "mssql";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  server: process.env.DB_SERVER!,
  port: Number(process.env.DB_PORT!) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
  },
};

export async function getConnection(): Promise<sql.ConnectionPool> {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("❌ Error connecting to SQL Server:", err);
    throw err;
  }
}
