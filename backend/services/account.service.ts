import sql from "mssql";
import { getConnection } from "../utils/db.ts";
import type { Account, AccountRecord } from "../models/account.types.ts";

function mapAccount(record: AccountRecord): Account {
  return {
    id: record.Id,
    userId: record.UserId,
    userEmail: record.Email,
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
      a.Id, a.UserId, u.Email, a.Address, a.Account,
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
      a.Id, a.UserId, u.Email, a.Address, a.Account,
      a.Year, a.Month, a.Consumption, a.Days, a.Value, a.Paid
    FROM Accounts a
    INNER JOIN Users u ON u.Id = a.UserId
    WHERE a.UserId = @userId
  `;

  const request = conn.request().input("userId", sql.Int, userId);

  if (typeof paid === "boolean") {
    query += " AND a.Paid = @paid";
    request.input("paid", sql.Bit, paid);
  }

  query += " ORDER BY a.Year DESC, a.Month DESC";

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
      a.Id, a.UserId, u.Email, a.Address, a.Account,
      a.Year, a.Month, a.Consumption, a.Days, a.Value, a.Paid
    FROM Accounts a
    INNER JOIN Users u ON u.Id = a.UserId
    WHERE u.Email = @email
  `;

  const request = conn.request().input("email", sql.NVarChar, email);

  if (typeof paid === "boolean") {
    query += " AND a.Paid = @paid";
    request.input("paid", sql.Bit, paid);
  }

  query += " ORDER BY a.Year DESC, a.Month DESC";

  const result = await request.query(query);
  return result.recordset.map(mapAccount);
}

export async function updateAccountPaid(id: number, paid: boolean): Promise<void> {
  const conn = await getConnection();
  await conn
    .request()
    .input("id", sql.Int, id)
    .input("paid", sql.Bit, paid)
    .query("UPDATE Accounts SET Paid = @paid WHERE Id = @id");
}

export async function addAccount(account: Account): Promise<number> {
  const conn = await getConnection();

  const result = await conn
    .request()
    .input("userId", sql.Int, account.userId)
    .input("address", sql.NVarChar, account.address)
    .input("accountType", sql.NVarChar, account.accountType)
    .input("year", sql.Int, account.year)
    .input("month", sql.Int, parseInt(account.month.split("/")[0], 10))
    .input("consumption", sql.Float, account.consumption)
    .input("days", sql.Int, account.days)
    .input("value", sql.Float, account.value)
    .input("paid", sql.Bit, account.paid ?? false)
    .query(`
      INSERT INTO Accounts
      (UserId, Address, Account, Year, Month, Consumption, Days, Value, Paid)
      VALUES
      (@userId, @address, @accountType, @year, @month, @consumption, @days, @value, @paid);
      SELECT SCOPE_IDENTITY() AS Id;
    `);

  return result.recordset[0].Id;
}
