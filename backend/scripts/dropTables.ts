import { getConnection } from "../utils/db.ts";
import chalk from "chalk";

export default async function dropTables() {
  console.log(chalk.yellow("\n⚠️  Resetting database..."));
  const pool = await getConnection();
  
  const dropQueries = [
    `IF OBJECT_ID('dbo.Accounts', 'U') IS NOT NULL DROP TABLE dbo.Accounts;`,
    `IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;`,
  ];

  try {
    for (const query of dropQueries) {
      await pool.request().query(query);
    }
    console.log(chalk.green(`✅ completed successfully!`));
  } catch (err) {
    console.error(chalk.red(`\n❌ Error :`), err);
  }
}
