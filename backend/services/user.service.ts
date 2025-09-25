import sql from "mssql";
import { getConnection } from "../utils/db.ts";
import type { User, UserRecord } from "../models/user.types.ts";
import { omitFields } from "../helpers/omitFields.ts";

export function mapRecordToUserRaw(record: UserRecord): User | null {
  if (!record) return null;

  return {
    id: record.Id ?? record.id,
    name: record.Name ?? record.name,
    email: record.Email ?? record.email,
    address: record.Address ?? record.address,
    password: record.Password ?? record.password,
  };
}

export function mapRecordToUserSafe(
  record: UserRecord | User | null
): Omit<User, "password" | "address"> | null {
  const rawUser = mapRecordToUserRaw(record as UserRecord);
  if (!rawUser) return null;
  return omitFields(rawUser, ["password", "address"]);
}

export const exists = async (email: string): Promise<boolean> => {
  const conn = await getConnection();
  const result = await conn
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT 1 FROM Users WHERE Email = @email");

  return result.recordset.length > 0;
};

export const add = async (user: User): Promise<void> => {
  const conn = await getConnection();
  await conn
    .request()
    .input("name", sql.NVarChar, user.name ?? null)
    .input("email", sql.NVarChar, user.email)
    .input("address", sql.NVarChar, user.address ?? null)
    .input("password", sql.NVarChar, user.password ?? null).query(`
      INSERT INTO Users (Name, Email, Address, Password)
      VALUES (@name, @email, @address, @password)
    `);
};

export const authenticate = async (
  email: string,
  password: string
): Promise<User | null> => {
  const conn = await getConnection();
  const result = await conn
    .request()
    .input("email", sql.NVarChar, email)
    .input("password", sql.NVarChar, password)
    .query("SELECT * FROM Users WHERE Email = @email AND Password = @password");

  return mapRecordToUserRaw(result.recordset[0]) ?? null;
};

export const updatePassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  const conn = await getConnection();
  await conn
    .request()
    .input("email", sql.NVarChar, email)
    .input("password", sql.NVarChar, password)
    .query("UPDATE Users SET Password = @password WHERE Email = @email");

  const updated = await conn
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE Email = @email");

  return mapRecordToUserRaw(updated.recordset[0]) ?? null;
};

export const getUserEmail = async (email: string): Promise<User | null> => {
  const conn = await getConnection();
  const result = await conn
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE Email = @email");

  return mapRecordToUserRaw(result.recordset[0]) ?? null;
};
