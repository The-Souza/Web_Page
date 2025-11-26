import { sql } from "../utils/db.ts";

export async function tablesExist() {
  const result = await sql`
    SELECT table_name 
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('users', 'accounts');
  `;

  return result.length === 2;
}
