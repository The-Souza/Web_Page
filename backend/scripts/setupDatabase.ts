import sql from "mssql";
import { faker } from "@faker-js/faker";
import chalk from "chalk";

export async function createTables(conn: sql.ConnectionPool) {
  console.log(chalk.cyan("\n🚀 Creating tables..."));

  await conn.query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
    CREATE TABLE Users (
      Id INT IDENTITY(1,1) PRIMARY KEY,
      Name NVARCHAR(100),
      Email NVARCHAR(100) UNIQUE,
      Address NVARCHAR(200),
      Password NVARCHAR(100)
    );

    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Accounts' and xtype='U')
    CREATE TABLE Accounts (
      Id INT IDENTITY(1,1) PRIMARY KEY,
      UserId INT FOREIGN KEY REFERENCES Users(Id),
      Address NVARCHAR(200),
      Account NVARCHAR(50),
      Year INT,
      Month INT,
      Consumption FLOAT,
      Days INT,
      Value FLOAT
    );
  `);

  console.log(chalk.green("✅ Tables created!"));
}

export async function generateUsers(conn: sql.ConnectionPool) {
  console.log(chalk.cyan("👤 Generating users..."));

  const users = [];
  for (let i = 1; i <= 10; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      address: faker.location.streetAddress(),
      password: "123456",
    });
  }

  for (const user of users) {
    await conn
      .request()
      .input("name", user.name)
      .input("email", user.email)
      .input("address", user.address)
      .input("password", user.password).query(`
        INSERT INTO Users (Name, Email, Address, Password)
        VALUES (@name, @email, @address, @password)
      `);
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

export async function generateAccounts(conn: sql.ConnectionPool) {
  console.log(chalk.cyan("💳 Generating monthly accounts..."));

  const accountsList = ["Water", "Electricity", "Gas", "Internet"];
  const usersResult = await conn.query(`SELECT Id, Address FROM Users`);
  const users = usersResult.recordset;

  const startYear = 2024;
  const endYear = 2025;

  for (const user of users) {
    for (const accountType of accountsList) {
      for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
          if (year === 2025 && month > 8) break;

          const consumption = generateConsumption(accountType);
          const value = generateValue(accountType, consumption);
          const days = Math.floor(Math.random() * 4) + 28;

          await conn
            .request()
            .input("userId", user.Id)
            .input("address", user.Address)
            .input("account", accountType)
            .input("year", year)
            .input("month", month)
            .input("consumption", consumption)
            .input("days", days)
            .input("value", value).query(`
              INSERT INTO Accounts (UserId, Address, Account, Year, Month, Consumption, Days, Value)
              VALUES (@userId, @address, @account, @year, @month, @consumption, @days, @value)
            `);
        }
      }
    }
  }

  console.log(chalk.green("✅ Monthly accounts inserted!"));
}
