import { getConnection } from "../utils/db.ts";
import dropTables from "../scripts/dropTables.ts";
import {
  createTables,
  generateUsers,
  generateAccounts,
} from "../scripts/setupDatabase.ts";
import chalk from "chalk";
import sql from "mssql"

async function runStep(title: string, fn: () => Promise<void>) {
  console.log(
    chalk.cyan(
      `\n========================================\n${title}\n========================================`
    )
  );
  try {
    await fn();
    console.log(chalk.green(`\n✅ ${title} completed successfully!`));
  } catch (err) {
    console.error(chalk.red(`\n❌ Error in ${title}:`), err);
    throw err;
  }
}

async function populateDatabase(conn: sql.ConnectionPool) {
  await createTables(conn);
  await generateUsers(conn);
  await generateAccounts(conn);
}

async function handleSetup(conn: sql.ConnectionPool) {
  const result = await conn.query(
    "SELECT COUNT(*) as count FROM sysobjects WHERE name='Users'"
  );
  const exists = result.recordset[0].count > 0;

  if (!exists) {
    await runStep("Creating tables", async () => populateDatabase(conn));
    console.log(chalk.green("\n🎉 Database created and populated successfully!"));
  } else {
    console.log(chalk.blue("\nℹ️  Database already exists, skipping creation."));
  }
}

async function handleReset(conn: sql.ConnectionPool) {
  await runStep("Resetting Database", async () => {
    await dropTables();
  });

  await runStep("Creating tables", async () => populateDatabase(conn));
  console.log(chalk.green("\n🎉 Database successfully recreated and populated!"));
}

async function handleTests() {
  await runStep("Testing account services", async () => {
    const { default: testAccounts } = await import("./testAccounts.ts");
    await testAccounts();
  });

  await runStep("Testing HTTP routes", async () => {
    const { default: testRoutes } = await import("./testRoutes.ts");
    await testRoutes();
  });

  console.log(chalk.magenta("\n🎉 All tests were run!"));
}

async function main() {
  const conn: sql.ConnectionPool = await getConnection();

  const isSetup = process.argv.includes("--setup");
  const isReset = process.argv.includes("--force");
  const isTest = !isSetup && !isReset;

  try {
    await runStep("Testing connection to SQL Server", async () => {
      await conn.connect();
    });

    if (isSetup) await handleSetup(conn);
    if (isReset) await handleReset(conn);
    if (isTest) await handleTests();
  } catch (err) {
    console.error(chalk.red("\n❌ General error:"), err);
  } finally {
    conn.close();
  }
}

main();
