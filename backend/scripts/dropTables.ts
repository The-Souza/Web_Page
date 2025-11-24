import { sql } from "../utils/db.ts";
import chalk from "chalk";

export default async function dropTables() {
  console.log(chalk.yellow("\n⚠️  Resetting database..."));

  try {
    await sql`DROP TABLE IF EXISTS Accounts CASCADE;`;
    await sql`DROP TABLE IF EXISTS Users CASCADE;`;

    console.log(chalk.green(`✅ completed successfully!`));
  } catch (err) {
    console.error(chalk.red(`\n❌ Error :`), err);
  }
}

async function main() {
  try {
    await dropTables();
    console.log(chalk.green("🎉 Database reset completed!"));
    process.exit(0);
  } catch (err) {
    console.error(chalk.red("❌ Failed to reset database:"), err);
    process.exit(1);
  }
}

main();