import { sql } from "../utils/db.ts";
import { faker } from "@faker-js/faker";
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

export async function generateUsers() {
  console.log(chalk.cyan("👤 Generating users..."));

  const users = Array.from({ length: 10 }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    address: faker.location.streetAddress(),
    password: "123456",
  }));

  for (const user of users) {
    await sql`
      INSERT INTO Users (name, email, address, password)
      VALUES (${user.name}, ${user.email}, ${user.address}, ${user.password})
      ON CONFLICT (email) DO NOTHING;
    `;
  }

  console.log(chalk.green("✅ Users inserted!"));
}

const generateConsumption = (type: string) => {
  switch (type) {
    case "Water":
      return parseFloat((Math.random() * 30 + 10).toFixed(2));
    case "Electricity":
      return parseFloat((Math.random() * 500 + 100).toFixed(2));
    case "Gas":
      return parseFloat((Math.random() * 50 + 10).toFixed(2));
    case "Internet":
      return parseFloat((Math.random() * 500 + 50).toFixed(2));
    default:
      return parseFloat((Math.random() * 100).toFixed(2));
  }
};

const generateValue = (type: string, consumption: number) => {
  switch (type) {
    case "Water":
      return parseFloat((consumption * 5).toFixed(2));
    case "Electricity":
      return parseFloat((consumption * 0.9).toFixed(2));
    case "Gas":
      return parseFloat((consumption * 4).toFixed(2));
    case "Internet":
      return parseFloat((consumption * 0.2).toFixed(2));
    default:
      return consumption;
  }
};

export async function generateAccounts() {
  console.log(chalk.cyan("💳 Generating monthly accounts..."));

  const accountsList = ["Water", "Electricity", "Gas", "Internet"];
  const users = await sql`SELECT id, address FROM Users`;

  const startYear = 2024;
  const endYear = 2025;

  for (const user of users) {
    const inserts = [];

    for (const accountType of accountsList) {
      for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
          const consumption = generateConsumption(accountType);
          const value = generateValue(accountType, consumption);
          const days = Math.floor(Math.random() * 4) + 28;

          inserts.push({
            userId: user.id,
            address: user.address,
            account: accountType,
            year,
            month,
            consumption,
            days,
            value,
            paid: false,
          });
        }
      }
    }

    // Insert batch per user
    await sql`
      INSERT INTO Accounts (
        userId, address, account, year, month,
        consumption, days, value, paid
      ) VALUES 
        ${sql(
          inserts.map((acc) => [
            acc.userId,
            acc.address,
            acc.account,
            acc.year,
            acc.month,
            acc.consumption,
            acc.days,
            acc.value,
            acc.paid,
          ])
        )}
    `;
  }

  console.log(chalk.green("✅ Monthly accounts inserted!"));
}

async function main() {
  try {
    await createTables();
    await generateUsers();
    await generateAccounts();
    console.log("🎉 Database setup completed!\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to setup database:", err);
    process.exit(1);
  }
}

main();