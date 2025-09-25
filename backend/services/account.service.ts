import sql from "mssql";
import { getConnection } from "../utils/db.ts";
import type { Account, AccountRecord } from "../models/account.types.ts";

function mapAccount(record: AccountRecord): Account {
  return {
    id: record.Id,
    userId: record.UserId,
    userEmail: record.UserEmail,
    address: record.Address,
    accountType: record.Account,
    year: record.Year,
    month: `${record.Month.toString().padStart(2, "0")}/${record.Year}`,
    consumption: record.Consumption,
    days: record.Days,
    value: record.Value,
  };
}

export async function getAllAccounts(): Promise<Account[]> {
  try {
    const conn = await getConnection();
    const result = await conn.query(`
      SELECT 
        a.Id, a.UserId, u.Email as UserEmail, a.Address, a.Account,
        a.Year, a.Month, a.Consumption, a.Days, a.Value
      FROM Accounts a
      INNER JOIN Users u ON u.Id = a.UserId
      ORDER BY a.Year DESC, a.Month DESC
    `);
    return result.recordset.map(mapAccount);
  } catch (err) {
    console.error("❌ Error in getAllAccounts:", err);
    throw err;
  }
}

export async function getAccountsByUserId(userId: number): Promise<Account[]> {
  try {
    const conn = await getConnection();
    const result = await conn
      .request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT 
          a.Id, a.UserId, u.Email as UserEmail, a.Address, a.Account,
          a.Year, a.Month, a.Consumption, a.Days, a.Value
        FROM Accounts a
        INNER JOIN Users u ON u.Id = a.UserId
        WHERE a.UserId = @userId
        ORDER BY a.Year DESC, a.Month DESC
      `);
    return result.recordset.map(mapAccount);
  } catch (err) {
    console.error("❌ Error in getAccountsByUserId:", err);
    throw err;
  }
}

export async function getAccountsByUserEmail(email: string): Promise<Account[]> {
  try {
    const conn = await getConnection();
    const result = await conn
      .request()
      .input("email", sql.NVarChar, email)
      .query(`
        SELECT 
          a.Id, a.UserId, u.Email as UserEmail, a.Address, a.Account,
          a.Year, a.Month, a.Consumption, a.Days, a.Value
        FROM Accounts a
        INNER JOIN Users u ON u.Id = a.UserId
        WHERE u.Email = @email
        ORDER BY a.Year DESC, a.Month DESC
      `);
    return result.recordset.map(mapAccount);
  } catch (err) {
    console.error("❌ Error in getAccountsByUserEmail:", err);
    throw err;
  }
}
