import chalk from "chalk";
import { generateUsers, generateAccounts } from "../scripts/setupDatabase.ts";

async function runStep(title: string, fn: () => Promise<void>) {
  console.log(`\n========================================\n${title}\n========================================`);
  try {
    await fn();
    console.log(chalk.green(`\n✅ ${title} completed successfully!\n`));
  } catch (err) {
    console.error(chalk.red(`\n❌ Error in ${title}:`), err);
    throw err;
  }
}

// 🔹 Seed usando Supabase (não precisa mais de connection pool)
async function seedDatabase() {
  await generateUsers();
  await generateAccounts();
}

// 🔹 Testes (continua igual)
async function runTests() {
  const { default: testAccounts } = await import("./testAccounts.ts");
  await testAccounts();

  const { default: testRoutes } = await import("./testRoutes.ts");
  await testRoutes();
}

async function main() {
  const isSeed = process.argv.includes("--seed");
  const isTest = process.argv.includes("--test") || (!isSeed);

  if (isSeed) {
    await runStep("Seeding database", seedDatabase);
  }

  if (isTest) {
    await runStep("Running tests", runTests);
  }

  console.log(chalk.magenta("\n🎉 All tasks completed!"));
}

main();
