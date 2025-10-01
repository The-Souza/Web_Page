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
    paid: record.Paid,
  };
}

export async function getAllAccounts(): Promise<Account[]> {
  const conn = await getConnection();
  const result = await conn.query(`
    SELECT 
      a.Id, a.UserId, u.Email as UserEmail, a.Address, a.Account,
      a.Year, a.Month, a.Consumption, a.Days, a.Value, a.Paid
    FROM Accounts a
    INNER JOIN Users u ON u.Id = a.UserId
    ORDER BY a.Year DESC, a.Month DESC
  `);
  return result.recordset.map(mapAccount);
}

export async function getAccountsByUserId(
  userId: number,
  paid?: boolean
): Promise<Account[]> {
  const conn = await getConnection();

  let query = `
    SELECT 
      a.Id, a.UserId, u.Email as UserEmail, a.Address, a.Account,
      a.Year, a.Month, a.Consumption, a.Days, a.Value, a.Paid
    FROM Accounts a
    INNER JOIN Users u ON u.Id = a.UserId
    WHERE a.UserId = @userId
  `;

  const request = conn.request().input("userId", sql.Int, userId);

  if (typeof paid === "boolean") {
    query += ` AND a.Paid = @paid`;
    request.input("paid", sql.Bit, paid);
  }

  query += ` ORDER BY a.Year DESC, a.Month DESC`;

  const result = await request.query(query);
  return result.recordset.map(mapAccount);
}

export async function getAccountsByUserEmail(
  email: string,
  paid?: boolean
): Promise<Account[]> {
  const conn = await getConnection();

  let query = `
    SELECT 
      a.Id, a.UserId, u.Email as UserEmail, a.Address, a.Account,
      a.Year, a.Month, a.Consumption, a.Days, a.Value, a.Paid
    FROM Accounts a
    INNER JOIN Users u ON u.Id = a.UserId
    WHERE u.Email = @email
  `;

  const request = conn.request().input("email", sql.NVarChar, email);

  if (typeof paid === "boolean") {
    query += ` AND a.Paid = @paid`;
    request.input("paid", sql.Bit, paid);
  }

  query += ` ORDER BY a.Year DESC, a.Month DESC`;

  const result = await request.query(query);
  return result.recordset.map(mapAccount);
}

export async function updateAccountPaid(
  id: number,
  paid: boolean
): Promise<void> {
  const conn = await getConnection();
  await conn
    .request()
    .input("id", sql.Int, id)
    .input("paid", sql.Bit, paid)
    .query(`UPDATE Accounts SET Paid = @paid WHERE Id = @id`);
}
