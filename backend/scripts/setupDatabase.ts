import { sql } from "../utils/db.ts";
import chalk from "chalk";

export async function createTables() {
  console.log(chalk.cyan("\n🚀 Creating tables..."));

  await sql`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      address TEXT,
      password TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS Accounts (
      id SERIAL PRIMARY KEY,
      userId INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
      address TEXT,
      account TEXT NOT NULL,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      consumption FLOAT,
      days INTEGER,
      value FLOAT,
      paid BOOLEAN DEFAULT false
    );
  `;

  console.log(chalk.green("✅ Tables created!"));
}
