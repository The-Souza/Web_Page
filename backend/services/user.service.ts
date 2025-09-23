import sql from "mssql";
import { getConnection } from "../utils/db.ts";
import type { User } from "../models/user.types.ts";

export const exists = async (email: string): Promise<boolean> => {
  const conn = await getConnection();
  const result = await conn
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT 1 FROM Users WHERE Email = @email");

  console.log("💾 exists:", email, "->", result.recordset.length > 0);
  return result.recordset.length > 0;
};

export const add = async (user: User): Promise<void> => {
  const conn = await getConnection();
  await conn
    .request()
    .input("name", sql.NVarChar, user.name ?? null)
    .input("email", sql.NVarChar, user.email)
    .input("address", sql.NVarChar, user.address ?? null)
    .input("password", sql.NVarChar, user.password).query(`
      INSERT INTO Users (Name, Email, Address, Password)
      VALUES (@name, @email, @address, @password)
    `);
  console.log("💾 add user:", user.email);
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

  console.log("💾 authenticate:", email, "->", result.recordset.length);
  return result.recordset[0] ?? null;
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

  console.log("💾 updatePassword:", email);
  return updated.recordset[0] ?? null;
};

export const getUserEmail = async (email: string): Promise<User | null> => {
  const conn = await getConnection();
  const result = await conn
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE Email = @email");

  console.log("💾 getUserEmail:", email, "->", result.recordset.length);
  return result.recordset[0] ?? null;
};
