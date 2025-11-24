import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export async function getConnection() {
  try {
    await sql`SELECT NOW()`;
    console.log("✅ Connected to Supabase PostgreSQL!");
  } catch (err) {
    console.error("❌ Failed to connect to Supabase:", err);
    throw err;
  }
}
