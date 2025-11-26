import { sql } from "../utils/db.ts";
import chalk from "chalk";

export default async function dropTables() {
  console.log(chalk.yellow("\n⚠️  Deleting database..."));

  try {
    await sql`DROP TABLE IF EXISTS Accounts CASCADE;`;
    await sql`DROP TABLE IF EXISTS Users CASCADE;`;

    console.log(chalk.green(`✅ completed successfully!`));
  } catch (err) {
    console.error(chalk.red(`\n❌ Error :`), err);
  }
}