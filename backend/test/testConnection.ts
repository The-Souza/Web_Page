import { getConnection } from "../utils/db.ts";

export default async function testConnection() {
  try {
    const conn = await getConnection();
    conn.close();
  } catch (error) {
    return error;
  }
}
