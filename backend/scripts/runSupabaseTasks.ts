import chalk from "chalk";
import { generateUsers, generateAccounts } from "./seedTables.ts";
import dropTables from "./dropTables.ts";
import { createTables } from "./setupDatabase.ts";
import { runStep } from "../utils/logger.ts";
import testAccounts from "../test/testAccounts.ts";
import testRoutes from "../test/testRoutes.ts";
import { tablesExist } from "../helpers/tablesExists.ts";

async function seedDatabase() {
  const exists = await tablesExist();

  if (!exists) {
    console.log(chalk.red("\n❌ Cannot seed database: tables do not exist."));
    console.log(chalk.yellow("➡️  Run: npm run setup\n"));
    process.exit(1);
  }
  
  await generateUsers();
  await generateAccounts();
}

async function runTests() {
  const exists = await tablesExist();
  if (!exists) {
    console.log(chalk.red("\n❌ Cannot run tests: tables do not exist."));
    console.log(chalk.yellow("➡️  Run: npm run setup and npm run seed\n"));
    process.exit(1);
  }
  await testAccounts();
  await testRoutes();
}

async function dropDatabase() {
  const exists = await tablesExist();
  if (!exists) {
    console.log(chalk.yellow("\n❌ Cannot drop database: tables do not exist.\n"));
    process.exit(1);
  }
  await dropTables();
}

async function setupDatabase() {
  const exists = await tablesExist();
  if (exists) {
    console.log(chalk.yellow("\n❌ Cannot setup database: tables already exist.\n"));
    process.exit(1);
  }
  await createTables();
}

async function main() {
  const args = process.argv.slice(2);

  const validArgs = ["--seed", "--test", "--drop-db", "--setup"];
  const activeArgs = args.filter((a) => validArgs.includes(a));

  const task = activeArgs[0];

  switch (task) {
    case "--seed":
      try {
        await runStep("Seeding Database", seedDatabase);
        process.exit(0);
      } catch (err) {
        console.error("❌ Failed to seed tables:", err);
        process.exit(1);
      }
      break;

    case "--test":
      try {
        await runStep("Running Tests", runTests);
        process.exit(0);
      } catch (err) {
        console.error("❌ Tests failed:", err);
        process.exit(1);
      }
      break;

    case "--drop-db":
      try {
        await runStep("Dropping Tables", dropDatabase);
        process.exit(0);
      } catch (err) {
        console.error(chalk.red("❌ Failed to delete database:"), err);
        process.exit(1);
      }
      break;

    case "--setup":
      try {
        await runStep("Setup Database", setupDatabase);
        process.exit(0);
      } catch (err) {
        console.error("❌ Failed to setup database:", err);
        process.exit(1);
      }
      break;

    default:
      console.log(chalk.red("❌ Unknown option:", task));
      process.exit(1);
  }

  console.log(chalk.magenta("\n🎉 All tasks completed!"));
}

main();
